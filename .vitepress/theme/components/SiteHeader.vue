<script setup>
import { computed, ref, watch } from 'vue'
import { useData, withBase } from 'vitepress'
import { VPNavBarSearch } from 'vitepress/theme'
import SiteIcon from './SiteIcon.vue'
import { categories } from '../data/navigation.js'
import { useDepth } from '../composables/useDepth.js'

const { isDark, page } = useData()
const zone = ref(null)
const { coordinates, reducedMotion } = useDepth()
const navigation = [{ title: '首页', href: '/' }, ...categories]
const current = computed(() => '/' + (page.value.relativePath || '').replace(/index\.md$/, '').replace(/\.md$/, '.html'))
function active(href) { return href === '/' ? current.value === '/' : current.value.startsWith(href) }
function reset() {
  const element = zone.value
  if (!element) return
  element.classList.remove('is-header-tracking')
  for (const key of ['x', 'y', 'lift', 'shadow-x']) element.style.removeProperty(`--gm-header-${key}`)
  for (const key of ['--gm-light-x', '--gm-light-y', '--gm-logo-y']) element.style.removeProperty(key)
}
function move(event) {
  const point = coordinates(event, zone.value)
  if (!point) return
  const style = zone.value.style
  style.setProperty('--gm-header-x', `${(-point.y * 1.8).toFixed(2)}deg`)
  style.setProperty('--gm-header-y', `${(point.x * 1.5).toFixed(2)}deg`)
  style.setProperty('--gm-header-lift', '-2px')
  style.setProperty('--gm-header-shadow-x', `${(-point.x * 5).toFixed(2)}px`)
  style.setProperty('--gm-light-x', `${(point.x + 1) * 50}%`)
  style.setProperty('--gm-light-y', `${(point.y + 1) * 50}%`)
  style.setProperty('--gm-logo-y', `${-6 + point.x * 5}deg`)
  zone.value.classList.add('is-header-tracking')
}
watch(reducedMotion, reset)
</script>

<template>
  <div ref="zone" class="gm-header-zone" @pointermove="move" @pointerleave="reset" @pointercancel="reset">
    <header class="gm-header">
      <div class="gm-header-surface" aria-hidden="true"></div>
      <a class="gm-brand" :href="withBase('/')" aria-label="gaga's blog 首页">
        <span class="gm-brand-key" aria-hidden="true"><span>g</span></span>
        <span class="gm-brand-name">gaga's blog</span>
      </a>
      <nav class="gm-nav" aria-label="博客栏目">
        <a v-for="item in navigation" :key="item.href" :href="withBase(item.href)" :aria-current="active(item.href) ? 'page' : undefined">{{ item.title }}</a>
      </nav>
      <div class="gm-theme-area">
        <div class="gm-search"><VPNavBarSearch /></div>
        <button class="gm-theme" type="button" :aria-label="isDark ? '切换为浅色主题' : '切换为深色主题'" :title="isDark ? '切换为浅色主题' : '切换为深色主题'" @click="isDark = !isDark">
          <span class="gm-theme-face"><SiteIcon :name="isDark ? 'sun' : 'moon'" /></span>
        </button>
      </div>
    </header>
  </div>
</template>
