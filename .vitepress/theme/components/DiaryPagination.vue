<script setup>
import { computed } from 'vue'
import { withBase } from 'vitepress'
import SiteIcon from './SiteIcon.vue'

const props = defineProps({
  page: { type: Number, required: true },
  totalPages: { type: Number, required: true },
  compact: { type: Boolean, default: false }
})
const emit = defineEmits(['navigate'])
const pages = computed(() => {
  if (props.totalPages <= 9) return Array.from({ length: props.totalPages }, (_, index) => index + 1)
  const candidates = [1, props.totalPages, props.page - 2, props.page - 1, props.page, props.page + 1, props.page + 2]
  const numbers = [...new Set(candidates)].filter(number => number >= 1 && number <= props.totalPages).sort((a, b) => a - b)
  return numbers.flatMap((number, index) => index && number - numbers[index - 1] > 1 ? [`ellipsis-${number}`, number] : [number])
})

function pageHref(number) {
  return `${withBase('/diary/')}${number > 1 ? `?page=${number}` : ''}`
}
</script>

<template>
  <nav class="gm-diary-pagination vp-raw" :class="{ 'is-compact': compact }" :aria-label="compact ? '顶部文章分页' : '底部文章分页'">
    <a v-if="page > 1" :href="pageHref(page - 1)" class="gm-diary-step gm-diary-previous" rel="prev" @click="emit('navigate', page - 1, $event)"><SiteIcon name="chevron-left" /><span>上一页</span></a>
    <span v-else class="gm-diary-step gm-diary-previous" aria-disabled="true"><SiteIcon name="chevron-left" /><span>上一页</span></span>

    <span v-if="compact" class="gm-diary-page-position" aria-live="polite" aria-atomic="true">第 <strong>{{ page }}</strong> / {{ totalPages }} 页</span>
    <div v-else class="gm-diary-page-numbers">
      <template v-for="item in pages" :key="item">
        <span v-if="typeof item !== 'number'" class="gm-diary-page-ellipsis" aria-hidden="true">…</span>
        <a v-else :href="pageHref(item)" class="gm-diary-page-number" :aria-label="`第 ${item} 页`" :aria-current="item === page ? 'page' : undefined" @click="emit('navigate', item, $event)">{{ item }}</a>
      </template>
    </div>

    <a v-if="page < totalPages" :href="pageHref(page + 1)" class="gm-diary-step gm-diary-next" rel="next" @click="emit('navigate', page + 1, $event)"><span>下一页</span><SiteIcon name="chevron-right" /></a>
    <span v-else class="gm-diary-step gm-diary-next" aria-disabled="true"><span>下一页</span><SiteIcon name="chevron-right" /></span>
  </nav>
</template>
