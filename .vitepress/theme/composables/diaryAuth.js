import { ref } from 'vue'

const KEY = 'diary-token'

function readToken() {
  if (typeof window === 'undefined') return ''
  return sessionStorage.getItem(KEY) || ''
}

const token = ref(readToken())

export function useDiaryAuth() {
  function isLoggedIn() {
    return !!token.value
  }
  function setToken(t) {
    token.value = t
    if (typeof window !== 'undefined') {
      if (t) sessionStorage.setItem(KEY, t)
      else sessionStorage.removeItem(KEY)
    }
  }
  async function login(password) {
    const r = await fetch('/api/login', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ password })
    })
    if (!r.ok) {
      const j = await r.json().catch(() => ({}))
      throw new Error(j.error || `login failed (${r.status})`)
    }
    const j = await r.json()
    setToken(j.token)
    return j.token
  }
  function logout() {
    setToken('')
  }
  function authHeaders() {
    return token.value ? { authorization: `Bearer ${token.value}` } : {}
  }
  async function authedFetch(url, init = {}) {
    const headers = { ...(init.headers || {}), ...authHeaders() }
    const r = await fetch(url, { ...init, headers })
    if (r.status === 401) {
      setToken('')
    }
    return r
  }
  return { token, isLoggedIn, login, logout, authHeaders, authedFetch }
}
