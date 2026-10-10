<script setup>
import { computed, nextTick, onBeforeUnmount, onMounted, ref } from 'vue'
import { data as articles } from '../data/diary.data.js'
import ArticleCard from './ArticleCard.vue'
import DiaryPagination from './DiaryPagination.vue'
import './diary-pagination.css'

const PAGE_SIZE = 10
const page = ref(1)
const listElement = ref(null)
const totalPages = computed(() => Math.max(1, Math.ceil(articles.length / PAGE_SIZE)))
const visibleArticles = computed(() => articles.slice((page.value - 1) * PAGE_SIZE, page.value * PAGE_SIZE))
const firstArticle = computed(() => articles.length ? (page.value - 1) * PAGE_SIZE + 1 : 0)
const lastArticle = computed(() => Math.min(page.value * PAGE_SIZE, articles.length))
let highlightTimer
let restoreFrame

function clampPage(value) {
  const number = Number(value)
  return Number.isFinite(number) ? Math.min(totalPages.value, Math.max(1, Math.floor(number))) : 1
}

function readPageFromUrl() {
  return clampPage(new URLSearchParams(window.location.search).get('page'))
}

function writePageToUrl(number, replace = false) {
  const url = new URL(window.location.href)
  if (number === 1) url.searchParams.delete('page')
  else url.searchParams.set('page', String(number))
  if (url.href === window.location.href) return
  if (replace) window.history.replaceState(window.history.state, '', url)
  else {
    window.history.replaceState({ ...window.history.state, scrollPosition: window.scrollY }, '')
    window.history.pushState({}, '', url)
  }
}

function navigatePage(number, event) {
  if (event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return
  event.preventDefault()
  const nextPage = clampPage(number)
  if (nextPage === page.value) return
  page.value = nextPage
  writePageToUrl(nextPage)
  window.scrollTo({ top: 0, behavior: 'instant' })
}

function syncPageFromUrl() {
  page.value = readPageFromUrl()
}

async function restoreArticlePosition() {
  let slug
  try {
    slug = window.sessionStorage.getItem('diary_scroll_to')
    window.sessionStorage.removeItem('diary_scroll_to')
  } catch {
    return
  }
  if (!slug) return
  const articleIndex = articles.findIndex(article => article.slug === slug)
  if (articleIndex < 0) return
  page.value = Math.floor(articleIndex / PAGE_SIZE) + 1
  writePageToUrl(page.value, true)
  await nextTick()
  restoreFrame = window.requestAnimationFrame(() => {
    const card = [...(listElement.value?.querySelectorAll('[data-slug]') || [])].find(element => element.dataset.slug === slug)
    if (!card) return
    card.scrollIntoView({ block: 'center', behavior: 'instant' })
    card.classList.add('gm-return-target')
    highlightTimer = window.setTimeout(() => card.classList.remove('gm-return-target'), 2000)
  })
}

onMounted(() => {
  syncPageFromUrl()
  writePageToUrl(page.value, true)
  window.addEventListener('popstate', syncPageFromUrl)
  window.addEventListener('gaga:route-change', syncPageFromUrl)
  restoreArticlePosition()
})

onBeforeUnmount(() => {
  window.removeEventListener('popstate', syncPageFromUrl)
  window.removeEventListener('gaga:route-change', syncPageFromUrl)
  window.clearTimeout(highlightTimer)
  window.cancelAnimationFrame(restoreFrame)
})
</script>

<template>
  <main class="gm-list" aria-labelledby="gm-list-title">
    <h1 id="gm-list-title">胡言乱语</h1>
    <div v-if="articles.length" class="gm-list-tools">
      <p class="gm-list-summary"><span>共 <strong>{{ articles.length }}</strong> 篇文章</span><span class="gm-list-range">第 {{ firstArticle }}–{{ lastArticle }} 篇</span></p>
      <DiaryPagination v-if="totalPages > 1" :page="page" :total-pages="totalPages" compact @navigate="navigatePage" />
    </div>
    <div v-if="articles.length" ref="listElement" class="gm-posts">
      <ArticleCard v-for="article in visibleArticles" :key="article.slug" :article="article" />
    </div>
    <p v-else class="gm-empty">这里还没有文章。</p>

    <DiaryPagination v-if="totalPages > 1" :page="page" :total-pages="totalPages" @navigate="navigatePage" />
  </main>
</template>
