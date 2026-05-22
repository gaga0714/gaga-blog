<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { useRouter, withBase } from 'vitepress'
import { useDiaryAuth } from '../composables/diaryAuth.js'

const PAGE_SIZE = 10

const router = useRouter()
const { isLoggedIn, logout, authedFetch } = useDiaryAuth()

const articles = ref([])
const loading = ref(true)
const error = ref('')
const page = ref(1)

function readPageFromUrl() {
  if (typeof window === 'undefined') return 1
  const p = new URLSearchParams(window.location.search).get('page')
  const n = Number(p)
  return Number.isFinite(n) && n >= 1 ? Math.floor(n) : 1
}

function writePageToUrl(n) {
  if (typeof window === 'undefined') return
  const url = new URL(window.location.href)
  if (n === 1) url.searchParams.delete('page')
  else url.searchParams.set('page', String(n))
  window.history.replaceState(null, '', url.toString())
}

const total = computed(() => articles.value.length)
const totalPages = computed(() => Math.max(1, Math.ceil(total.value / PAGE_SIZE)))

const visible = computed(() => {
  const start = (page.value - 1) * PAGE_SIZE
  return articles.value.slice(start, start + PAGE_SIZE)
})

const pagesToShow = computed(() => {
  const t = totalPages.value
  const c = page.value
  const set = new Set([1, t, c, c - 1, c + 1])
  const arr = [...set].filter(n => n >= 1 && n <= t).sort((a, b) => a - b)
  const result = []
  let prev = 0
  for (const n of arr) {
    if (n - prev > 1) result.push('…')
    result.push(n)
    prev = n
  }
  return result
})

function goPage(n) {
  if (n < 1 || n > totalPages.value) return
  page.value = n
  writePageToUrl(n)
  if (typeof window !== 'undefined') window.scrollTo({ top: 0, behavior: 'smooth' })
}

function relTime(iso) {
  if (!iso) return ''
  const t = new Date(iso).getTime()
  const diff = Date.now() - t
  const sec = Math.floor(diff / 1000)
  if (sec < 60) return '刚刚'
  const min = Math.floor(sec / 60)
  if (min < 60) return `${min} 分钟前`
  const hr = Math.floor(min / 60)
  if (hr < 24) return `${hr} 小时前`
  const day = Math.floor(hr / 24)
  if (day < 30) return `${day} 天前`
  const mon = Math.floor(day / 30)
  if (mon < 12) return `${mon} 个月前`
  return `${Math.floor(mon / 12)} 年前`
}

function absTime(iso) {
  if (!iso) return ''
  const d = new Date(iso)
  const pad = n => String(n).padStart(2, '0')
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())} ${pad(d.getHours())}:${pad(d.getMinutes())}`
}

function articleUrl(slug) {
  return withBase(`/diary/${slug}.html`)
}

async function loadList() {
  loading.value = true
  error.value = ''
  try {
    const r = await fetch(withBase('/diary-articles.json'))
    if (!r.ok) throw new Error(`load failed (${r.status})`)
    articles.value = await r.json()
  } catch (e) {
    error.value = e.message || 'load failed'
    articles.value = []
  } finally {
    loading.value = false
  }
}

function goNew() {
  router.go(withBase('/diary/edit'))
}

function goEdit(slug, ev) {
  if (ev) ev.stopPropagation()
  router.go(withBase(`/diary/edit?slug=${encodeURIComponent(slug)}`))
}

async function doDelete(slug, ev) {
  if (ev) ev.stopPropagation()
  if (!confirm(`确认删除「${articles.value.find(a => a.slug === slug)?.title || slug}」?\n删除后会 git push,等 CI 重新部署。`)) return
  try {
    const r = await authedFetch(`/api/articles/${encodeURIComponent(slug)}`, { method: 'DELETE' })
    if (!r.ok) {
      const j = await r.json().catch(() => ({}))
      throw new Error(j.error || `delete failed (${r.status})`)
    }
    alert('已提交删除,等 CI 重新部署后列表才会刷新。')
  } catch (e) {
    alert(`删除失败: ${e.message}`)
  }
}

onMounted(() => {
  page.value = readPageFromUrl()
  loadList()
})

watch(() => totalPages.value, t => {
  if (page.value > t) goPage(t)
})
</script>

<template>
  <div class="diary-page">
    <header class="diary-header">
      <div class="title-block">
        <h1>胡言乱语</h1>
        <p class="sub">{{ loading ? '加载中…' : `共 ${total} 条` }}</p>
      </div>
      <div class="actions">
        <button v-if="isLoggedIn()" class="btn btn-primary" @click="goNew">+ 发布新随记</button>
        <button v-if="isLoggedIn()" class="btn btn-ghost" @click="logout()">退出登录</button>
        <button v-else class="btn btn-ghost" @click="goNew">写一篇</button>
      </div>
    </header>

    <div v-if="error" class="empty error">{{ error }}</div>

    <div v-else-if="!loading && total === 0" class="empty">还没有随记,点右上角写一篇吧。</div>

    <ul v-else class="list">
      <li v-for="a in visible" :key="a.slug" class="card" @click="router.go(articleUrl(a.slug))">
        <div class="cover">
          <img v-if="a.cover" :src="withBase(a.cover)" :alt="a.title" loading="lazy" />
          <div v-else class="cover-placeholder">📝</div>
        </div>
        <div class="body">
          <h3 class="card-title">{{ a.title }}</h3>
          <div class="meta">
            <span :title="absTime(a.updated)">{{ relTime(a.updated) }}</span>
            <span class="dot">·</span>
            <span class="abs">{{ absTime(a.updated) }}</span>
          </div>
          <p class="excerpt">{{ a.excerpt }}</p>
        </div>
        <div v-if="isLoggedIn()" class="card-actions" @click.stop>
          <button class="icon-btn" title="编辑" @click="goEdit(a.slug, $event)">编辑</button>
          <button class="icon-btn danger" title="删除" @click="doDelete(a.slug, $event)">删除</button>
        </div>
      </li>
    </ul>

    <nav v-if="totalPages > 1" class="pager">
      <button class="page-btn" :disabled="page === 1" @click="goPage(page - 1)">‹</button>
      <template v-for="(p, i) in pagesToShow" :key="i">
        <span v-if="p === '…'" class="page-ellipsis">…</span>
        <button
          v-else
          class="page-btn"
          :class="{ active: p === page }"
          @click="goPage(p)"
        >{{ p }}</button>
      </template>
      <button class="page-btn" :disabled="page === totalPages" @click="goPage(page + 1)">›</button>
    </nav>
  </div>
</template>

<style scoped>
.diary-page {
  max-width: 880px;
  margin: 0 auto;
  padding: 32px 24px 96px;
}

.diary-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  gap: 16px;
  margin-bottom: 24px;
  padding-bottom: 16px;
  border-bottom: 1px solid var(--vp-c-divider);
}
.title-block h1 {
  margin: 0;
  font-size: 28px;
  font-weight: 700;
  letter-spacing: 0.5px;
}
.title-block .sub {
  margin: 4px 0 0;
  color: var(--vp-c-text-2);
  font-size: 13px;
}
.actions {
  display: flex;
  gap: 8px;
}
.btn {
  padding: 6px 14px;
  font-size: 13px;
  border-radius: 999px;
  border: 1px solid var(--vp-c-divider);
  background: transparent;
  color: var(--vp-c-text-1);
  cursor: pointer;
  transition: all 0.2s ease;
}
.btn:hover {
  border-color: var(--vp-c-brand-1);
  color: var(--vp-c-brand-1);
}
.btn-primary {
  background: var(--vp-c-brand-1);
  border-color: var(--vp-c-brand-1);
  color: #fff;
}
.btn-primary:hover {
  background: var(--vp-c-brand-dark);
  border-color: var(--vp-c-brand-dark);
  color: #fff;
}

.empty {
  text-align: center;
  padding: 80px 20px;
  color: var(--vp-c-text-2);
  font-size: 14px;
}
.empty.error {
  color: var(--vp-c-danger-1, #c45a5a);
}

.list {
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 12px;
}
.card {
  display: grid;
  grid-template-columns: 120px 1fr auto;
  gap: 16px;
  padding: 14px;
  border: 1px solid var(--vp-c-divider);
  border-radius: 12px;
  background: var(--vp-c-bg-soft);
  cursor: pointer;
  transition: all 0.2s ease;
}
.card:hover {
  border-color: var(--vp-c-brand-1);
  transform: translateY(-1px);
  box-shadow: 0 4px 18px rgba(0, 0, 0, 0.06);
}

.cover {
  width: 120px;
  height: 120px;
  border-radius: 8px;
  overflow: hidden;
  background: linear-gradient(135deg, rgba(196, 90, 90, 0.18), rgba(232, 168, 124, 0.18));
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}
.cover img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}
.cover-placeholder {
  font-size: 36px;
  opacity: 0.5;
}

.body {
  min-width: 0;
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 6px;
}
.card-title {
  margin: 0;
  font-size: 17px;
  font-weight: 600;
  line-height: 1.4;
  color: var(--vp-c-text-1);
  overflow: hidden;
  display: -webkit-box;
  -webkit-line-clamp: 1;
  -webkit-box-orient: vertical;
}
.meta {
  font-size: 12px;
  color: var(--vp-c-text-3);
  display: flex;
  align-items: center;
  gap: 6px;
}
.meta .dot { opacity: 0.5; }
.meta .abs { font-variant-numeric: tabular-nums; }
.excerpt {
  margin: 0;
  font-size: 13px;
  color: var(--vp-c-text-2);
  line-height: 1.55;
  overflow: hidden;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
}

.card-actions {
  display: flex;
  flex-direction: column;
  gap: 6px;
  align-self: center;
}
.icon-btn {
  font-size: 12px;
  padding: 4px 10px;
  border: 1px solid var(--vp-c-divider);
  background: transparent;
  border-radius: 4px;
  cursor: pointer;
  color: var(--vp-c-text-2);
  transition: all 0.15s ease;
}
.icon-btn:hover {
  border-color: var(--vp-c-brand-1);
  color: var(--vp-c-brand-1);
}
.icon-btn.danger:hover {
  border-color: #c45a5a;
  color: #c45a5a;
}

.pager {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 4px;
  margin-top: 32px;
}
.page-btn {
  min-width: 32px;
  height: 32px;
  padding: 0 8px;
  border: 1px solid var(--vp-c-divider);
  background: transparent;
  border-radius: 6px;
  font-size: 13px;
  color: var(--vp-c-text-2);
  cursor: pointer;
  transition: all 0.15s ease;
}
.page-btn:hover:not(:disabled):not(.active) {
  border-color: var(--vp-c-brand-1);
  color: var(--vp-c-brand-1);
}
.page-btn.active {
  background: var(--vp-c-brand-1);
  border-color: var(--vp-c-brand-1);
  color: #fff;
}
.page-btn:disabled {
  opacity: 0.4;
  cursor: not-allowed;
}
.page-ellipsis {
  color: var(--vp-c-text-3);
  padding: 0 4px;
}

@media (max-width: 600px) {
  .card {
    grid-template-columns: 88px 1fr;
  }
  .cover { width: 88px; height: 88px; }
  .card-actions { grid-column: 1 / -1; flex-direction: row; }
  .actions { flex-wrap: wrap; }
}
</style>
