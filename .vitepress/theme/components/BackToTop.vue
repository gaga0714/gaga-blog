<script setup>
import { onMounted, onUnmounted, ref } from 'vue'

const show = ref(false)

const onScroll = () => {
  show.value = window.scrollY > 320
}

const toTop = () => {
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

onMounted(() => {
  window.addEventListener('scroll', onScroll, { passive: true })
  onScroll()
})
onUnmounted(() => {
  if (typeof window !== 'undefined') {
    window.removeEventListener('scroll', onScroll)
  }
})
</script>

<template>
  <button
    class="back-to-top"
    :class="{ show }"
    aria-label="回到顶部"
    title="回到顶部"
    @click="toTop"
  >
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round">
      <polyline points="6 15 12 9 18 15" />
    </svg>
  </button>
</template>
