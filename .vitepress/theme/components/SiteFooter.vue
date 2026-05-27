<template>
  <footer class="site-footer">
    <div class="footer-content">
      <p class="footer-icp">
        <a href="https://beian.miit.gov.cn/" target="_blank" rel="noopener noreferrer">闽ICP备2025102618号</a></p>
      <p class="footer-copy">© 2026 gaga's blog Powered by <a href="https://github.com/vuejs/vitepress" target="_blank" rel="noopener noreferrer">VitePress</a></p>
    </div>
  </footer>
</template>

<style scoped>
.site-footer {
  border-top: 1px solid var(--vp-c-divider);
  padding: 24px 24px 32px;
  text-align: center;
  font-size: 13px;
  color: var(--vp-c-text-3);
  line-height: 1.8;
}

.site-footer a {
  color: var(--vp-c-text-3);
  text-decoration: none;
  transition: color 0.25s;
}

.site-footer a:hover {
  color: var(--vp-c-brand-1);
}

.footer-divider {
  margin: 0 8px;
  opacity: 0.5;
}

.footer-copy {
  margin-top: 4px;
  opacity: 0.75;
}
</style>
