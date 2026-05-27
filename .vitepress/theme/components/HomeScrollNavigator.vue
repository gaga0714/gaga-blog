<script setup>
import { onMounted, onUnmounted, watch, nextTick } from 'vue'
import { useData, useRouter, withBase } from 'vitepress'

const { frontmatter } = useData()
const router = useRouter()

const THRESHOLD_RATIO = 1
const COOLDOWN = 1200
const MOBILE_BREAKPOINT = 768

let accumulated = 0
let locked = false

function isHome() {
  return frontmatter.value?.layout === 'home'
}

function isDiary() {
  if (typeof window === 'undefined') return false
  return window.location.pathname.replace(/\/$/, '') === withBase('/diary').replace(/\/$/, '')
}

function isMobile() {
  return typeof window !== 'undefined' && window.innerWidth <= MOBILE_BREAKPOINT
}

function blockScroll(e) {
  e.preventDefault()
}

async function navigate(path, dir) {
  if (locked) return
  locked = true
  accumulated = 0

  window.addEventListener('wheel', blockScroll, { passive: false })
  window.addEventListener('touchmove', blockScroll, { passive: false })

  const target = withBase(path)

  if (document.startViewTransition) {
    document.documentElement.dataset.transition = dir
    // 锁定页面滚动，防止快照捕获到中间位置
    const html = document.documentElement
    html.style.overflow = 'hidden'
    window.scrollTo(0, 0)

    const transition = document.startViewTransition(async () => {
      await router.go(target)
      await nextTick()
      window.scrollTo(0, 0)
    })
    try {
      await transition.finished
    } finally {
      window.scrollTo(0, 0)
      html.style.overflow = ''
      delete document.documentElement.dataset.transition
      window.removeEventListener('wheel', blockScroll)
      window.removeEventListener('touchmove', blockScroll)
      setTimeout(() => { locked = false }, COOLDOWN)
    }
  } else {
    window.scrollTo(0, 0)
    await router.go(target)
    await nextTick()
    window.scrollTo(0, 0)
    window.removeEventListener('wheel', blockScroll)
    window.removeEventListener('touchmove', blockScroll)
    setTimeout(() => { locked = false }, COOLDOWN)
  }
}

function onWheel(e) {
  if (isMobile() || locked) return

  if (isHome() && e.deltaY > 0) {
    accumulated += e.deltaY
    if (accumulated >= window.innerHeight * THRESHOLD_RATIO) {
      navigate('/diary/', 'slide-up')
    }
  } else if (isDiary() && e.deltaY < 0) {
    const atTop = window.scrollY <= 0
    if (!atTop) {
      accumulated = 0
      return
    }
    accumulated += Math.abs(e.deltaY)
    if (accumulated >= window.innerHeight * THRESHOLD_RATIO * 0.5) {
      navigate('/', 'slide-down')
    }
  } else {
    accumulated = 0
  }
}

onMounted(() => {
  if (typeof window === 'undefined') return
  window.addEventListener('wheel', onWheel, { passive: true })
})

onUnmounted(() => {
  if (typeof window === 'undefined') return
  window.removeEventListener('wheel', onWheel)
})

watch(() => frontmatter.value?.layout, () => {
  accumulated = 0
})
</script>

<template>
  <div aria-hidden="true" />
</template>
