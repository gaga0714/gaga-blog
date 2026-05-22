<script setup>
import DefaultTheme from 'vitepress/theme'
import { useData } from 'vitepress'
import { watchEffect } from 'vue'
import DiaryPageFooter from './components/DiaryPageFooter.vue'
import DiaryActions from './components/DiaryActions.vue'
import BackToTop from './components/BackToTop.vue'
import MouseEffect from './components/MouseEffect.vue'
import ScrollFx from './components/ScrollFx.vue'
import ResizableSidebar from './components/ResizableSidebar.vue'
import SidebarToggle from './components/SidebarToggle.vue'

const Layout = DefaultTheme.Layout
const { frontmatter } = useData()

// 非首页给 body 加一个标记类,用于挂载背景图
if (typeof document !== 'undefined') {
  watchEffect(() => {
    const isHome = frontmatter.value?.layout === 'home'
    document.body.classList.toggle('page-non-home', !isHome)
    document.body.classList.toggle('page-home', isHome)
  })
}

// 检查认证状态并拦截访问
if (typeof window !== 'undefined') {
  const checkAuth = () => {
    const path = window.location.pathname
    // 如果访问 todo 子页面但未认证，重定向到 todo 首页
    if (path.includes('/todo/') && path !== '/todo/' && !sessionStorage.getItem('todo_authenticated')) {
      window.location.href = '/todo/'
    }
  }
  
  const originalPushState = history.pushState
  const originalReplaceState = history.replaceState
  
  history.pushState = function(...args) {
    originalPushState.apply(history, args)
    setTimeout(checkAuth, 0)
  }
  
  history.replaceState = function(...args) {
    originalReplaceState.apply(history, args)
    setTimeout(checkAuth, 0)
  }
  
  // 初始检查
  setTimeout(checkAuth, 0)
}
</script>

<template>
  <Layout>
    <template #doc-before>
      <DiaryPageFooter />
      <DiaryActions />
    </template>
    <template #layout-bottom>
      <BackToTop />
      <MouseEffect />
      <ScrollFx />
      <ResizableSidebar />
      <SidebarToggle />
    </template>
  </Layout>
</template>

