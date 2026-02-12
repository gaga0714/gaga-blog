import path from 'node:path'
import fs from 'node:fs'
import { fileURLToPath } from 'node:url'
import { defineConfig } from 'vitepress'
import { set_sidebar } from '../utils/auto_sidebar.mjs'

console.log('[VitePress] 正在加载配置…')
const __dirname = path.dirname(fileURLToPath(import.meta.url))
const ROOT = path.join(__dirname, '..')

function formatDateTime(date) {
  const d = new Date(date)
  return d.toLocaleString('zh-CN', { year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit' })
}

// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: "gaga's blog",
  description: "A VitePress Site",
  transformPageData(pageData) {
    if (!pageData.relativePath || !pageData.relativePath.startsWith('diary/')) return pageData
    const fullPath = path.join(ROOT, pageData.relativePath)
    try {
      const stat = fs.statSync(fullPath)
      pageData.diaryFileCreated = formatDateTime(stat.birthtime)
      pageData.diaryFileUpdated = formatDateTime(stat.mtime)
    } catch (_) {}
    return pageData
  },
  themeConfig: {
    // https://vitepress.dev/reference/default-theme-config
    search: {
      provider: 'local',
      options: {
            translations: {
              button: {
                buttonText: '搜索文档',
                buttonAriaLabel: '搜索文档'
              },
              modal: {
                noResultsText: '无法找到相关结果',
                resetButtonTitle: '清除查询条件',
                footer: {
                  selectText: '选择',
                  navigateText: '切换'
                }
              }
        }
      }
    },
    nav: [
      { text: '鸭棚子', link: '/' },
      { text: '八股', items:[
        {text:'HTML', link:'/damn/html/'},
        {text:'CSS', link:'/damn/css/'},
        {text:'JavaScript', link:'/damn/javascript/'},
        {text:'Vue3', link:'/damn/vue3/'},
        {text:'React', link:'/damn/react/'},
        {text:'Network', link:'/damn/network/'},
        {text:'工程化',link:'/damn/engineering/'},
        {text:'TypeScript',link:'/damn/ts/'},
        {text:'后端',link:'/damn/backend/'}
      ] },
      { text: '算法', link: '/algorithm/' },
      { text: '面经', link: '/frontend_interview' },
      { text: '胡言乱语', link: '/diary/' },
      { text: '人生是旷野', link: '/todo/' },
    ],

    sidebar: {
      "/damn/html/": set_sidebar("/damn/html"),
      "/damn/css/": set_sidebar("/damn/css"),
      "/damn/javascript/": set_sidebar("/damn/javascript"),
      "/damn/vue3/": set_sidebar("/damn/vue3"),
      "/damn/react/": set_sidebar("/damn/react"),
      "/damn/backend/": set_sidebar("/damn/backend"),
      "/damn/network/": set_sidebar("/damn/network"),
      "/damn/engineering/": set_sidebar("/damn/engineering"),
      "/damn/ts": set_sidebar("/damn/ts"),
      "/diary/": set_sidebar("/diary"),
      "/todo/": set_sidebar("/todo"),
      "/algorithm/":set_sidebar("/algorithm"),
    },


    socialLinks: [
      { icon: 'github', link: 'https://github.com/vuejs/vitepress' }
    ]
  }
})
