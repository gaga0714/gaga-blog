<script setup>
import { ref, onMounted, onUnmounted, nextTick, watch } from 'vue'
import { useRoute } from 'vitepress'

const visible = ref(false)
const collapsed = ref(false)
const buttonLeft = ref(272)
const route = useRoute()

function getSidebar() {
  return document.querySelector('.VPSidebar')
}

function applyCollapsedClass() {
  if (collapsed.value) {
    document.documentElement.classList.add('sidebar-collapsed')
  } else {
    document.documentElement.classList.remove('sidebar-collapsed')
  }
}

function checkSidebar() {
  const sidebar = getSidebar()
  visible.value = !!sidebar && window.innerWidth > 960
  if (visible.value) {
    nextTick(updateButtonPosition)
  }
}

function updateButtonPosition() {
  if (collapsed.value) {
    buttonLeft.value = 0
    return
  }
  const sidebar = getSidebar()
  if (sidebar) {
    buttonLeft.value = sidebar.getBoundingClientRect().right
  }
}

function toggle() {
  collapsed.value = !collapsed.value
  localStorage.setItem('sidebar-collapsed', String(collapsed.value))
  applyCollapsedClass()
  updateButtonPosition()
  // 动画结束后再校准一次（resize handle 等位置也依赖这个）
  setTimeout(updateButtonPosition, 280)
}

function onResize() {
  checkSidebar()
}

onMounted(() => {
  const saved = localStorage.getItem('sidebar-collapsed')
  collapsed.value = saved === 'true'
  applyCollapsedClass()
  nextTick(checkSidebar)
  window.addEventListener('resize', onResize)
})

onUnmounted(() => {
  window.removeEventListener('resize', onResize)
})

watch(() => route.path, () => {
  nextTick(checkSidebar)
})
</script>

<template>
  <button
    v-if="visible"
    class="sidebar-toggle-btn"
    :class="{ 'is-collapsed': collapsed }"
    :style="{ left: buttonLeft + 'px' }"
    :title="collapsed ? '展开侧边栏' : '收起侧边栏'"
    :aria-label="collapsed ? '展开侧边栏' : '收起侧边栏'"
    @click="toggle"
  >
    <svg viewBox="0 0 24 24" width="14" height="14" aria-hidden="true">
      <path
        d="M15 6l-6 6 6 6"
        fill="none"
        stroke="currentColor"
        stroke-width="2.2"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
    </svg>
  </button>
</template>

<style scoped>
.sidebar-toggle-btn {
  position: fixed;
  top: calc(var(--vp-nav-height, 64px) + 14px);
  width: 22px;
  height: 22px;
  padding: 0;
  border-radius: 50%;
  background: var(--vp-c-bg);
  border: 1px solid var(--vp-c-divider);
  color: var(--vp-c-text-2);
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  z-index: 101;
  transform: translateX(-50%);
  transition: left 0.25s ease, background-color 0.2s ease, color 0.2s ease,
    border-color 0.2s ease, box-shadow 0.2s ease;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.08);
}

.sidebar-toggle-btn:hover {
  background: var(--vp-c-brand-soft);
  color: var(--vp-c-brand-1);
  border-color: var(--vp-c-brand-1);
}

.sidebar-toggle-btn.is-collapsed {
  /* 收起时贴着屏幕左边,留 6px 视觉缓冲 */
  transform: translateX(6px);
}

.sidebar-toggle-btn svg {
  transition: transform 0.25s ease;
}

.sidebar-toggle-btn.is-collapsed svg {
  transform: rotate(180deg);
}
</style>
