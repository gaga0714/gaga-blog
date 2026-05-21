<script setup>
import DefaultTheme from 'vitepress/theme'
import DiaryPageFooter from './components/DiaryPageFooter.vue'
import BackToTop from './components/BackToTop.vue'
import MouseEffect from './components/MouseEffect.vue'
import ScrollFx from './components/ScrollFx.vue'

const Layout = DefaultTheme.Layout

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
    </template>
    <template #layout-bottom>
      <BackToTop />
      <MouseEffect />
      <ScrollFx />
    </template>
  </Layout>
</template>

