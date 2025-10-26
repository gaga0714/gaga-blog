import { h } from 'vue'
import DefaultTheme from 'vitepress/theme'
import PasswordProtect from './components/PasswordProtect.vue'
import Layout from './Layout.vue'
import './custom.css'

export default {
  extends: DefaultTheme,
  Layout,
  enhanceApp({ app }) {
    // 注册全局组件
    app.component('PasswordProtect', PasswordProtect)
  }
}

