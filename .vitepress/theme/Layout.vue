<script setup>
import { computed } from 'vue'
import DefaultTheme from 'vitepress/theme'
import { useData } from 'vitepress'
import SiteHeader from './components/SiteHeader.vue'
import SiteFooter from './components/SiteFooter.vue'
import HomePage from './components/HomePage.vue'
import KnowledgeHome from './components/KnowledgeHome.vue'
import DiaryList from './components/DiaryList.vue'
import DiaryArticle from './components/DiaryArticle.vue'
import PasswordProtect from './components/PasswordProtect.vue'
import AmbientBackground from './components/AmbientBackground.vue'

const { page, frontmatter } = useData()
const DefaultLayout = DefaultTheme.Layout
const relativePath = computed(() => page.value.relativePath || '')
const isHome = computed(() => relativePath.value === 'index.md')
const isKnowledgeHome = computed(() => relativePath.value === 'damn/index.md')
const isDiaryList = computed(() => relativePath.value === 'diary/index.md')
const isDiaryArticle = computed(() => relativePath.value.startsWith('diary/') && !isDiaryList.value)
const isProtectedPage = computed(() => relativePath.value.startsWith('todo/') && relativePath.value !== 'todo/index.md')
</script>

<template>
  <div class="gaga-site">
    <AmbientBackground />
    <a class="gm-skip" href="#main-content">跳转到正文</a>
    <SiteHeader />
    <HomePage v-if="isHome" id="main-content" />
    <KnowledgeHome v-else-if="isKnowledgeHome" id="main-content" />
    <DiaryList v-else-if="isDiaryList" id="main-content" />
    <DiaryArticle v-else-if="isDiaryArticle" id="main-content" :key="relativePath" />
    <div v-else id="main-content" class="gm-knowledge" :class="frontmatter.pageClass">
      <PasswordProtect v-if="isProtectedPage" :key="relativePath">
        <DefaultLayout />
      </PasswordProtect>
      <DefaultLayout v-else />
    </div>
    <SiteFooter />
  </div>
</template>
