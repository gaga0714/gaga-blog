import DefaultTheme from 'vitepress/theme'
import PasswordProtect from './components/PasswordProtect.vue'
import DiaryList from './components/DiaryList.vue'
import Layout from './Layout.vue'
import { useCopyCodeFix } from './composables/copyCode.js'
import './custom.css'
import './knowledge.css'
import './search.css'

export default {
  extends: DefaultTheme,
  Layout,
  enhanceApp({ app, router }) {
    app.component('PasswordProtect', PasswordProtect)
    app.component('DiaryList', DiaryList)
    useCopyCodeFix()
    if (typeof window !== 'undefined') {
      router.onAfterRouteChange = () => window.dispatchEvent(new Event('gaga:route-change'))
    }
  }
}
