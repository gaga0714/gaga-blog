<script setup>
import { useData } from 'vitepress'

const { page } = useData()
</script>

<template>
  <div v-if="page.diaryFileCreated || page.diaryFileUpdated" class="diary-page-meta">
    <span v-if="page.diaryFileCreated" class="diary-time-left">创建时间：{{ page.diaryFileCreated }}</span>
    <span v-if="page.diaryFileUpdated" class="diary-time-right">最后编辑：{{ page.diaryFileUpdated }}</span>
  </div>
</template>

<style scoped>
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
