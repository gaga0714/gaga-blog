<script setup>
import { onMounted, onUnmounted, ref } from 'vue'

const enabled = ref(false)
const container = ref(null)
const cursor = ref(null)

/* ---------- 星屑 + 涟漪 ---------- */
const COLORS = ['#c45a5a', '#e8a87c', '#f0c5a0', '#d97070']
const MAX_PARTICLES = 24
const EMIT_INTERVAL = 55

let lastEmit = 0
let lastX = 0
let lastY = 0
let pool = 0

const rand = (a, b) => a + Math.random() * (b - a)

const spawnSparkle = (x, y) => {
  if (!container.value || pool >= MAX_PARTICLES) return
  pool++
  const el = document.createElement('span')
  el.className = 'sparkle'
  const size = rand(4, 9)
  const dx = rand(-22, 22)
  const dy = rand(-30, -6)
  const rot = rand(-160, 160)
  const color = COLORS[Math.floor(Math.random() * COLORS.length)]
  const life = rand(600, 950)
  el.style.setProperty('--s', `${size}px`)
  el.style.setProperty('--dx', `${dx}px`)
  el.style.setProperty('--dy', `${dy}px`)
  el.style.setProperty('--rot', `${rot}deg`)
  el.style.setProperty('--c', color)
  el.style.setProperty('--life', `${life}ms`)
  el.style.left = `${x}px`
  el.style.top = `${y}px`
  container.value.appendChild(el)
  setTimeout(() => {
    el.remove()
    pool--
  }, life)
}

const spawnRipple = (x, y) => {
  if (!container.value) return
  const el = document.createElement('span')
  el.className = 'ripple'
  el.style.left = `${x}px`
  el.style.top = `${y}px`
  container.value.appendChild(el)
  setTimeout(() => el.remove(), 700)
}

/* ---------- 自定义鼠标 ---------- */
const moveCursor = (x, y) => {
  if (!cursor.value) return
  cursor.value.style.transform = `translate3d(${x}px, ${y}px, 0)`
}

const onMove = (e) => {
  moveCursor(e.clientX, e.clientY)
  const now = performance.now()
  if (now - lastEmit < EMIT_INTERVAL) return
  const dist = Math.hypot(e.clientX - lastX, e.clientY - lastY)
  if (dist < 7) return
  lastEmit = now
  lastX = e.clientX
  lastY = e.clientY
  spawnSparkle(e.clientX, e.clientY)
}

const onOver = (e) => {
  if (!cursor.value) return
  const t = e.target
  const interactive =
    t &&
    t.closest &&
    t.closest(
      'a, button, .VPButton, .VPFeature, [role="button"], summary, label, .VPNavBarMenuLink, .VPLink'
    )
  cursor.value.classList.toggle('is-hover', !!interactive)
}

const onDown = () => cursor.value?.classList.add('is-down')
const onUp = () => cursor.value?.classList.remove('is-down')
const onLeave = () => cursor.value?.classList.add('is-out')
const onEnter = () => cursor.value?.classList.remove('is-out')
const onClick = (e) => spawnRipple(e.clientX, e.clientY)

onMounted(() => {
  if (typeof window === 'undefined') return
  const fine = window.matchMedia('(pointer: fine)').matches
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  if (!fine || reduced) return
  enabled.value = true
  document.documentElement.classList.add('has-custom-cursor')

  window.addEventListener('mousemove', onMove, { passive: true })
  window.addEventListener('mouseover', onOver, { passive: true })
  window.addEventListener('mousedown', onDown, { passive: true })
  window.addEventListener('mouseup', onUp, { passive: true })
  window.addEventListener('click', onClick, { passive: true })
  document.addEventListener('mouseleave', onLeave)
  document.addEventListener('mouseenter', onEnter)
})

onUnmounted(() => {
  if (typeof window === 'undefined') return
  document.documentElement.classList.remove('has-custom-cursor')
  window.removeEventListener('mousemove', onMove)
  window.removeEventListener('mouseover', onOver)
  window.removeEventListener('mousedown', onDown)
  window.removeEventListener('mouseup', onUp)
  window.removeEventListener('click', onClick)
  document.removeEventListener('mouseleave', onLeave)
  document.removeEventListener('mouseenter', onEnter)
})
</script>

<template>
  <template v-if="enabled">
    <!-- 自定义鼠标:可爱小鸭(嘴喙在左上,作为光标 hot spot) -->
    <div ref="cursor" class="cursor" aria-hidden="true">
      <svg class="arrow" viewBox="0 0 44 40" width="44" height="40">
        <defs>
          <linearGradient id="duck-body" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stop-color="#ffe27a" />
            <stop offset="100%" stop-color="#ffc94a" />
          </linearGradient>
          <linearGradient id="duck-beak" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stop-color="#ff9a3c" />
            <stop offset="100%" stop-color="#ff7a1f" />
          </linearGradient>
        </defs>

        <!-- 身体 -->
        <ellipse cx="27" cy="29" rx="13" ry="9.5" fill="url(#duck-body)" />

        <!-- 翅膀曲线 -->
        <path
          d="M21 28 Q27 24 34 29"
          stroke="#e0962a" stroke-width="1.3" fill="none"
          stroke-linecap="round" opacity="0.75"
        />

        <!-- 头 -->
        <circle cx="17" cy="15" r="11" fill="url(#duck-body)" />

        <!-- 嘴喙(指向左上) -->
        <path d="M1 2 L13 8 L8 13 Z" fill="url(#duck-beak)" />

        <!-- 一只大眼 + 双高光 -->
        <circle cx="18" cy="14" r="3.6" fill="#1c1c1c" />
        <circle cx="19.3" cy="12.6" r="1.25" fill="#fff" />
        <circle cx="17" cy="15.7" r="0.55" fill="#fff" />
      </svg>
      <span class="ring"></span>
    </div>

    <!-- 星屑/涟漪容器 -->
    <div ref="container" class="mouse-fx" aria-hidden="true"></div>
  </template>
</template>

<style>
/* 隐藏原生光标(输入框保留以便文本编辑) */
html.has-custom-cursor,
html.has-custom-cursor * {
  cursor: none !important;
}
html.has-custom-cursor input,
html.has-custom-cursor textarea,
html.has-custom-cursor [contenteditable='true'] {
  cursor: text !important;
}

/* ---------- 鼠标本体 ---------- */
.cursor {
  position: fixed;
  top: 0;
  left: 0;
  width: 0;
  height: 0;
  pointer-events: none;
  z-index: 10000;
  will-change: transform;
  transition: opacity 0.2s;
}
.cursor.is-out {
  opacity: 0;
}

.cursor .arrow {
  position: absolute;
  /* 嘴尖在 SVG (1,2),稍微补一下让它落在元素 (0,0) = 鼠标位置 */
  top: -2px;
  left: -1px;
  filter: drop-shadow(0 4px 8px rgba(232, 152, 30, 0.5));
  transition: transform 0.22s cubic-bezier(0.22, 1, 0.36, 1),
    opacity 0.22s ease;
  transform-origin: top left; /* 缩放/旋转都绕嘴尖发生 */
}

.cursor .ring {
  position: absolute;
  width: 44px;
  height: 44px;
  left: -22px;
  top: -22px;
  border-radius: 50%;
  border: 1.8px solid var(--vp-c-brand-1, #c45a5a);
  background: var(--vp-c-brand-soft, rgba(196, 90, 90, 0.14));
  opacity: 0;
  transform: scale(0);
  transition: transform 0.28s cubic-bezier(0.22, 1, 0.36, 1),
    opacity 0.22s ease;
}

.cursor .ring::after {
  content: '';
  position: absolute;
  inset: -3px;
  border-radius: 50%;
  border: 1.5px solid var(--vp-c-brand-1, #c45a5a);
  opacity: 0;
}

/* 悬停:鸭子从嘴尖缩走,圆环放大,带脉冲 */
.cursor.is-hover .arrow {
  opacity: 0;
  transform: scale(0.35) rotate(-12deg);
}
.cursor.is-hover .ring {
  opacity: 1;
  transform: scale(1);
}
.cursor.is-hover .ring::after {
  animation: cursor-pulse 1.3s ease-out infinite;
}

/* 按下:小鸭子朝嘴尖方向"啄"一下 */
.cursor.is-down .arrow {
  transform: scale(0.9) rotate(-12deg);
}
.cursor.is-down .ring {
  transform: scale(0.78);
  background: var(--vp-c-brand-1, #c45a5a);
}

@keyframes cursor-pulse {
  0% {
    transform: scale(0.85);
    opacity: 0.7;
  }
  100% {
    transform: scale(1.7);
    opacity: 0;
  }
}

/* ---------- 星屑 + 涟漪(原样保留) ---------- */
.mouse-fx {
  position: fixed;
  inset: 0;
  pointer-events: none;
  z-index: 9999;
  overflow: hidden;
}
.mouse-fx .sparkle {
  position: absolute;
  width: var(--s);
  height: var(--s);
  margin: calc(var(--s) / -2) 0 0 calc(var(--s) / -2);
  background: radial-gradient(circle, var(--c) 0%, var(--c) 30%, transparent 70%);
  border-radius: 50%;
  filter: blur(0.4px) drop-shadow(0 0 4px var(--c));
  opacity: 0;
  animation: sparkle-fly var(--life) cubic-bezier(0.22, 1, 0.36, 1) forwards;
}
@keyframes sparkle-fly {
  0% {
    transform: translate(0, 0) scale(0) rotate(0deg);
    opacity: 0;
  }
  15% {
    opacity: 1;
    transform: translate(calc(var(--dx) * 0.18), calc(var(--dy) * 0.18))
      scale(1) rotate(calc(var(--rot) * 0.18));
  }
  100% {
    transform: translate(var(--dx), var(--dy)) scale(0.2) rotate(var(--rot));
    opacity: 0;
  }
}

.mouse-fx .ripple {
  position: absolute;
  width: 14px;
  height: 14px;
  margin: -7px 0 0 -7px;
  border-radius: 50%;
  border: 2px solid var(--vp-c-brand-1, #c45a5a);
  opacity: 0.85;
  animation: ripple-out 0.7s cubic-bezier(0.22, 1, 0.36, 1) forwards;
}
@keyframes ripple-out {
  0% {
    transform: scale(0.3);
    opacity: 0.9;
  }
  60% {
    opacity: 0.5;
  }
  100% {
    transform: scale(4.5);
    opacity: 0;
  }
}
</style>
