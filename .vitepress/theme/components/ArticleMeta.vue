<script setup>
import { computed } from 'vue'

const props = defineProps({ article: { type: Object, required: true } })
const date = computed(() => String(props.article.date || props.article.created || '').slice(0, 10))
const tags = computed(() => {
  const values = Array.isArray(props.article.tags) ? props.article.tags : props.article.tags ? [props.article.tags] : []
  return values.map(tag => String(tag).trim()).filter(Boolean).join(' / ') || '—'
})
</script>

<template>
  <div class="gm-meta">
    <time v-if="date" :datetime="date">{{ date }}</time>
    <span v-else aria-label="日期未填写">—</span>
    <span class="gm-tag-label">TAG：</span>
    <span class="gm-tag-values" :title="tags">{{ tags }}</span>
  </div>
</template>
