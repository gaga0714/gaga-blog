<script setup>
import { computed } from 'vue'
import { useData, withBase } from 'vitepress'
import ArticleMeta from './ArticleMeta.vue'
import SiteIcon from './SiteIcon.vue'

const { page, frontmatter } = useData()
const article = computed(() => page.value.articleMeta || { title: page.value.title })
const listHref = withBase('/diary/')
const summary = computed(() => {
  const value = article.value.summary || frontmatter.value.description || frontmatter.value.excerpt
  return typeof value === 'string' && !article.value.encrypted ? value : ''
})

function rememberArticle(event) {
  if (event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return
  const slug = article.value.slug || page.value.relativePath?.replace(/^diary\//, '').replace(/\.md$/, '')
  if (!slug) return
  try {
    window.sessionStorage.setItem('diary_scroll_to', slug)
  } catch {
    // Storage can be unavailable in private or restricted browser sessions.
  }
}
</script>

<template>
  <main class="gm-detail" aria-labelledby="gm-article-title">
    <a :href="listHref" class="gm-back" @click="rememberArticle"><SiteIcon name="arrow-left" /><span>返回列表</span></a>
    <article class="gm-article">
      <header class="gm-article-heading">
        <ArticleMeta :article="article" />
        <h1 id="gm-article-title" class="gm-detail-title">{{ article.title }}</h1>
        <p v-if="summary" class="gm-summary">{{ summary }}</p>
      </header>
      <Content class="vp-doc gm-prose" :class="{ 'gm-has-leading-title': article.hasLeadingTitle }" />
    </article>
  </main>
</template>

<style>
.gm-detail .gm-prose.gm-has-leading-title > div > h1:first-child {
  display: none;
}
</style>
