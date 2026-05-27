import { h, nextTick } from 'vue'
import DefaultTheme from 'vitepress/theme'
import PasswordProtect from './components/PasswordProtect.vue'
import DiaryList from './components/DiaryList.vue'
import Layout from './Layout.vue'
import { useCopyCodeFix } from './composables/copyCode.js'
import './custom.css'

export default {
  extends: DefaultTheme,
  Layout,
  enhanceApp({ app, router }) {
    app.component('PasswordProtect', PasswordProtect)
    app.component('DiaryList', DiaryList)
    useCopyCodeFix()

    if (typeof document !== 'undefined' && document.startViewTransition) {
      let vtPending = false

      router.onBeforeRouteChange = (to) => {
        // 如果已经有 data-transition（HomeScrollNavigator 在处理），跳过
        if (document.documentElement.dataset.transition) return

        vtPending = true
        return new Promise((resolve) => {
          const transition = document.startViewTransition(async () => {
            resolve()
            // 等路由真正完成
            await new Promise(r => {
              const stop = router.onAfterRouteChange
              router.onAfterRouteChange = (href) => {
                router.onAfterRouteChange = stop
                nextTick(r)
              }
            })
          })
          transition.finished.then(() => { vtPending = false })
        })
      }
    }
  }
}

