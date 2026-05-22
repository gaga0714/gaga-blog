<script setup>
import { computed } from 'vue'
import { useData, useRouter, withBase } from 'vitepress'
import { useDiaryAuth } from '../composables/diaryAuth.js'

const { page } = useData()
const router = useRouter()
const { isLoggedIn, authedFetch } = useDiaryAuth()

const slug = computed(() => {
  const r = page.value.relativePath || ''
  const m = r.match(/^diary\/(.+)\.md$/)
  if (!m) return ''
  const s = m[1]
  if (s === 'index' || s === 'edit') return ''
  return s
})

function goEdit() {
  if (!slug.value) return
  if (typeof window === 'undefined') return
  window.location.href = withBase(`/diary/edit.html?slug=${encodeURIComponent(slug.value)}`)
}

async function doDelete() {
  if (!slug.value) return
  const title = page.value.title || slug.value
  if (!confirm(`确认删除「${title}」?\n删除后会 git push,等 CI 重新部署。`)) return
  try {
    const r = await authedFetch(`/api/articles/${encodeURIComponent(slug.value)}`, { method: 'DELETE' })
    if (!r.ok) {
      const j = await r.json().catch(() => ({}))
      throw new Error(j.error || `delete failed (${r.status})`)
    }
    alert('已提交删除,等 CI 重新部署后会生效。')
    router.go(withBase('/diary/'))
  } catch (e) {
    alert(`删除失败: ${e.message}`)
  }
}
</script>

<template>
  <div v-if="slug && isLoggedIn()" class="diary-actions">
    <button class="act-btn" @click="goEdit">编辑</button>
    <button class="act-btn danger" @click="doDelete">删除</button>
  </div>
</template>

<style scoped>
.diary-actions {
  display: flex;
  gap: 8px;
  margin: 8px 0 16px;
}
.act-btn {
  padding: 4px 12px;
  font-size: 12px;
  border: 1px solid var(--vp-c-divider);
  background: transparent;
  border-radius: 6px;
  color: var(--vp-c-text-2);
  cursor: pointer;
  transition: all 0.15s ease;
}
.act-btn:hover {
  border-color: var(--vp-c-brand-1);
  color: var(--vp-c-brand-1);
}
.act-btn.danger:hover {
  border-color: #c45a5a;
  color: #c45a5a;
}
</style>
