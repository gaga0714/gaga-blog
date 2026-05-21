<script setup>
import { onMounted, onUnmounted, ref } from 'vue'

const progress = ref(0)
const container = ref(null)
let rafId = 0
let lastSpawn = 0
let pool = 0
let lastScrollY = 0

const MAX_STARS = 80
const SPAWN_INTERVAL = 45 // ms
const COLORS = ['#c45a5a', '#e8a87c', '#f0c5a0', '#d97070']

const rand = (a, b) => a + Math.random() * (b - a)

const isDocPage = () =>
  !!document.querySelector('.VPDoc') &&
  !document.querySelector('.VPHome')

const spawnStar = () => {
  if (!container.value || pool >= MAX_STARS) return
  pool++
  const el = document.createElement('span')
  el.className = 'scroll-star'
  const size = rand(5, 11)
  const x = rand(2, 98) // % of viewport width
  const y = rand(4, 96) // % of viewport height
  const rot = rand(-45, 45)
  const drift = rand(-18, 18)
  const color = COLORS[Math.floor(Math.random() * COLORS.length)]
  const life = rand(900, 1500)
  el.style.setProperty('--s', `${size}px`)
  el.style.setProperty('--x', `${x}vw`)
  el.style.setProperty('--y', `${y}vh`)
  el.style.setProperty('--rot', `${rot}deg`)
  el.style.setProperty('--drift', `${drift}px`)
  el.style.setProperty('--c', color)
  el.style.setProperty('--life', `${life}ms`)
  container.value.appendChild(el)
  setTimeout(() => {
    el.remove()
    pool--
  }, life)
}

const updateProgress = () => {
  const h = document.documentElement
  const max = h.scrollHeight - h.clientHeight
  progress.value = max > 0 ? (h.scrollTop / max) * 100 : 0
}

const onScroll = () => {
  if (rafId) return
  rafId = requestAnimationFrame(() => {
    updateProgress()
    const now = performance.now()
    const dy = Math.abs(window.scrollY - lastScrollY)
    if (isDocPage() && dy > 2 && now - lastSpawn > SPAWN_INTERVAL) {
      lastSpawn = now
      // 一次撒一簇,密度更高
      const batch = dy > 60 ? 6 : dy > 30 ? 4 : dy > 10 ? 3 : 2
      for (let i = 0; i < batch; i++) spawnStar()
    }
    lastScrollY = window.scrollY
    rafId = 0
  })
}

onMounted(() => {
  if (typeof window === 'undefined') return
  lastScrollY = window.scrollY
  updateProgress()
  window.addEventListener('scroll', onScroll, { passive: true })
  window.addEventListener('resize', updateProgress, { passive: true })
})

onUnmounted(() => {
  if (typeof window === 'undefined') return
  window.removeEventListener('scroll', onScroll)
  window.removeEventListener('resize', updateProgress)
})
</script>

<template>
  <div class="scroll-progress" :style="{ '--p': progress + '%' }" aria-hidden="true">
    <span class="scroll-progress-bar"></span>
  </div>
  <div ref="container" class="scroll-stars" aria-hidden="true"></div>
</template>

<style>
.scroll-progress {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  height: 3px;
  z-index: 10001;
  pointer-events: none;
  background: transparent;
}
.scroll-progress-bar {
  display: block;
  height: 100%;
  width: var(--p, 0%);
  background: linear-gradient(90deg, #c45a5a 0%, #e8a87c 50%, #f0c5a0 100%);
  box-shadow: 0 0 10px rgba(232, 168, 124, 0.6),
    0 0 20px rgba(196, 90, 90, 0.3);
  border-radius: 0 2px 2px 0;
  transition: width 0.08s linear;
}

/* ---------- 滚动时撒落的星星 ---------- */
.scroll-stars {
  position: fixed;
  inset: 0;
  pointer-events: none;
  z-index: 9998;
  overflow: hidden;
}
.scroll-star {
  position: absolute;
  left: var(--x);
  top: var(--y);
  width: var(--s);
  height: var(--s);
  margin: calc(var(--s) / -2) 0 0 calc(var(--s) / -2);
  background:
    radial-gradient(circle, var(--c) 0%, var(--c) 18%, transparent 60%),
    conic-gradient(
      from 0deg,
      transparent 0deg,
      var(--c) 45deg,
      transparent 90deg,
      var(--c) 135deg,
      transparent 180deg,
      var(--c) 225deg,
      transparent 270deg,
      var(--c) 315deg,
      transparent 360deg
    );
  -webkit-mask: radial-gradient(circle, #000 0%, #000 8%, transparent 60%),
    conic-gradient(
      from 0deg,
      transparent 0deg,
      #000 45deg,
      transparent 90deg,
      #000 135deg,
      transparent 180deg,
      #000 225deg,
      transparent 270deg,
      #000 315deg,
      transparent 360deg
    );
  mask: radial-gradient(circle, #000 0%, #000 8%, transparent 60%),
    conic-gradient(
      from 0deg,
      transparent 0deg,
      #000 45deg,
      transparent 90deg,
      #000 135deg,
      transparent 180deg,
      #000 225deg,
      transparent 270deg,
      #000 315deg,
      transparent 360deg
    );
  filter: drop-shadow(0 0 3px var(--c));
  opacity: 0;
  mix-blend-mode: screen;
  animation: star-twinkle var(--life) cubic-bezier(0.22, 1, 0.36, 1) forwards;
}

@keyframes star-twinkle {
  0% {
    transform: translate(0, 0) scale(0.2) rotate(0deg);
    opacity: 0;
  }
  25% {
    opacity: 0.55;
    transform: translate(calc(var(--drift) * 0.2), -4px) scale(1)
      rotate(calc(var(--rot) * 0.4));
  }
  60% {
    opacity: 0.45;
    transform: translate(calc(var(--drift) * 0.6), -10px) scale(1.05)
      rotate(calc(var(--rot) * 0.8));
  }
  100% {
    opacity: 0;
    transform: translate(var(--drift), -18px) scale(0.4) rotate(var(--rot));
  }
}

.dark .scroll-star {
  mix-blend-mode: screen;
}

@media (prefers-reduced-motion: reduce) {
  .scroll-star {
    display: none;
  }
  .scroll-progress-bar {
    transition: none;
  }
}
</style>
