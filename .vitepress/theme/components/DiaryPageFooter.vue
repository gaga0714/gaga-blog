<script setup>
import { useData, useRouter, withBase } from 'vitepress'
import { computed } from 'vue'

const { page } = useData()
const router = useRouter()

const isDiaryArticle = computed(() => {
  const r = page.value.relativePath || ''
  return r.startsWith('diary/') && r !== 'diary/index.md'
})

function goBack() {
  if (typeof window === 'undefined') return
  const slug = page.value.relativePath?.match(/^diary\/(.+)\.md$/)?.[1]
  if (!slug) {
    router.go(withBase('/diary/'))
    return
  }
  // 保存当前文章 slug 到 sessionStorage，列表页会读取并滚动到对应位置
  sessionStorage.setItem('diary_scroll_to', slug)
  router.go(withBase('/diary/'))
}
</script>

<template>
  <div v-if="isDiaryArticle" class="diary-back-btn-wrapper">
    <button class="diary-back-btn" @click="goBack">
      <span class="arrow">←</span>
      <span>返回列表</span>
    </button>
  </div>
  <div v-if="page.diaryFileCreated || page.diaryFileUpdated" class="diary-page-meta">
    <span v-if="page.diaryFileCreated" class="diary-time-left">创建时间：{{ page.diaryFileCreated }}</span>
    <span v-if="page.diaryFileUpdated" class="diary-time-right">最后编辑：{{ page.diaryFileUpdated }}</span>
  </div>
</template>

<style scoped>
.diary-back-btn-wrapper {
  margin-bottom: 16px;
}

.diary-back-btn {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 6px 14px;
  font-size: 13px;
  border: 1px solid var(--vp-c-divider);
  background: transparent;
  border-radius: 8px;
  color: var(--vp-c-text-2);
  cursor: pointer;
  transition: all 0.2s ease;
}

.diary-back-btn:hover {
  border-color: var(--vp-c-brand-1);
  color: var(--vp-c-brand-1);
  transform: translateX(-2px);
}

.diary-back-btn .arrow {
  font-size: 16px;
  transition: transform 0.2s ease;
}

.diary-back-btn:hover .arrow {
  transform: translateX(-3px);
}

.diary-page-meta {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1em;
  color: var(--vp-c-text-2);
  font-size: 0.875em;
}

.diary-time-left {
  margin-right: auto;
}

.diary-time-right {
  margin-left: auto;
}
</style>
