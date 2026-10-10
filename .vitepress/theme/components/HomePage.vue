<script setup>
import { ref, watch } from 'vue'
import { withBase } from 'vitepress'
import { data as articles } from '../data/diary.data.js'
import { categories } from '../data/navigation.js'
import { useDepth } from '../composables/useDepth.js'
import ArticleCard from './ArticleCard.vue'
import DepthSurface from './DepthSurface.vue'
import SiteIcon from './SiteIcon.vue'

const mascot = ref(null)
const { coordinates, reducedMotion } = useDepth()
function resetMascot() {
  const element = mascot.value
  if (!element) return
  element.classList.remove('is-mascot-tracking')
  for (const key of ['x', 'y', 'z', 'lift']) element.style.removeProperty(`--gm-mascot-${key}`)
}
function moveMascot(event) {
  if (window.innerWidth <= 700) return
  const point = coordinates(event, mascot.value)
  if (!point) return
  const style = mascot.value.style
  style.setProperty('--gm-mascot-x', `${-point.y * 9}deg`)
  style.setProperty('--gm-mascot-y', `${point.x * 12}deg`)
  style.setProperty('--gm-mascot-z', '2deg')
  style.setProperty('--gm-mascot-lift', '-5px')
  mascot.value.classList.add('is-mascot-tracking')
}
watch(reducedMotion, resetMascot)
</script>

<template>
  <main class="gm-home">
    <div class="gm-home-heading">
      <h1><span>朝乾夕惕，</span><wbr><span>功不唐捐</span></h1>
      <a ref="mascot" class="gm-mascot-zone" href="https://github.com/gaga0714" target="_blank" rel="noopener noreferrer" aria-label="访问 gaga 的 GitHub（在新标签页打开）" title="gaga 的 GitHub" @pointermove="moveMascot" @pointerleave="resetMascot" @pointercancel="resetMascot">
        <figure class="gm-mascot"><img class="gm-mascot-image" :src="withBase('/public_avatar.png')" width="1340" height="1342" alt="闭着眼睛坐着睡觉的卡比兽" draggable="false" /></figure>
      </a>
    </div>
    <section class="gm-home-navigation" aria-labelledby="home-categories-title">
      <div class="gm-section-heading"><h2 id="home-categories-title">栏目导航</h2></div>
      <div class="gm-categories">
        <DepthSurface v-for="category in categories" :key="category.href" surface-class="gm-category" level="category">
          <span class="gm-category-icon"><SiteIcon :name="category.icon" /></span>
          <strong>{{ category.title }}</strong>
          <span class="gm-category-caption">{{ category.caption }}</span>
          <SiteIcon class="gm-category-arrow" name="arrow-up-right" />
          <template #actions><a class="gm-category-link" :href="withBase(category.href)" :aria-label="`${category.title}：${category.caption}`"></a></template>
        </DepthSurface>
      </div>
    </section>
    <section class="gm-recent" aria-labelledby="recent-articles-title">
      <div class="gm-section-heading"><h2 id="recent-articles-title">最近文章</h2><a class="gm-text-link" :href="withBase('/diary/')">全部文章 <SiteIcon name="arrow-right" /></a></div>
      <ArticleCard v-for="article in articles.slice(0, 2)" :key="article.slug" :article="article" compact />
      <p v-if="!articles.length" class="gm-empty">还没有文章。</p>
    </section>
  </main>
</template>
