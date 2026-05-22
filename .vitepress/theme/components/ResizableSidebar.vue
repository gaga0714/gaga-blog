<script setup>
import { ref, onMounted, onUnmounted, nextTick, watch } from 'vue'
import { useRoute } from 'vitepress'

const MIN_WIDTH = 200
const MAX_WIDTH = 480

const visible = ref(false)
const handleLeft = ref(272)
const route = useRoute()

let isDragging = false
let startX = 0
let startWidth = 0

function getSidebar() {
  return document.querySelector('.VPSidebar')
}

function checkSidebar() {
  const sidebar = getSidebar()
  visible.value = !!sidebar && window.innerWidth > 960
  if (visible.value) {
    updateHandlePosition()
  }
}

function updateHandlePosition() {
  const sidebar = getSidebar()
  if (sidebar) {
    handleLeft.value = sidebar.getBoundingClientRect().right
  }
}

function setWidth(width) {
  const clamped = Math.max(MIN_WIDTH, Math.min(MAX_WIDTH, width))
  document.documentElement.style.setProperty('--vp-sidebar-width', `${clamped}px`)
  localStorage.setItem('sidebar-width', String(clamped))
  nextTick(updateHandlePosition)
}

function onMouseDown(e) {
  const sidebar = getSidebar()
  if (!sidebar) return
  isDragging = true
  startX = e.clientX
  startWidth = sidebar.getBoundingClientRect().width
  document.body.style.cursor = 'col-resize'
  document.body.style.userSelect = 'none'
  e.preventDefault()
}

function onMouseMove(e) {
  if (!isDragging) return
  const delta = e.clientX - startX
  const newWidth = startWidth + delta
  const clamped = Math.max(MIN_WIDTH, Math.min(MAX_WIDTH, newWidth))
  document.documentElement.style.setProperty('--vp-sidebar-width', `${clamped}px`)
  localStorage.setItem('sidebar-width', String(clamped))
  const sidebar = getSidebar()
  if (sidebar) {
    handleLeft.value = sidebar.getBoundingClientRect().right
  }
}

function onMouseUp() {
  if (!isDragging) return
  isDragging = false
  document.body.style.cursor = ''
  document.body.style.userSelect = ''
  updateHandlePosition()
}

function onResize() {
  checkSidebar()
}

onMounted(() => {
  const saved = localStorage.getItem('sidebar-width')
  if (saved) {
    setWidth(Number(saved))
  }
  nextTick(() => {
    checkSidebar()
  })
  document.addEventListener('mousemove', onMouseMove)
  document.addEventListener('mouseup', onMouseUp)
  window.addEventListener('resize', onResize)
})

onUnmounted(() => {
  document.removeEventListener('mousemove', onMouseMove)
  document.removeEventListener('mouseup', onMouseUp)
  window.removeEventListener('resize', onResize)
})

watch(() => route.path, () => {
  nextTick(checkSidebar)
})
</script>

<template>
  <div
    v-if="visible"
    class="sidebar-resize-handle"
    :style="{ left: handleLeft + 'px' }"
    @mousedown="onMouseDown"
  />
</template>

<style scoped>
.sidebar-resize-handle {
  position: fixed;
  top: var(--vp-nav-height, 64px);
  width: 6px;
  height: calc(100vh - var(--vp-nav-height, 64px));
  cursor: col-resize;
  z-index: 100;
  transform: translateX(-50%);
  transition: background-color 0.2s ease;
}

.sidebar-resize-handle:hover,
.sidebar-resize-handle:active {
  background-color: var(--vp-c-brand-soft);
}
</style>
