import { defineConfig } from 'vitepress'
import { set_sidebar } from '../utils/auto_sidebar.mjs'

// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: "gaga's blog",
  description: "A VitePress Site",
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
        {text:'Network', link:'/damn/network/'}
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
      "/damn/network/": set_sidebar("/damn/network"),
      "/diary/": set_sidebar("/diary"),
      "/todo/": set_sidebar("/todo"),
      "/algorithm/":set_sidebar("/algorithm"),
    },


    socialLinks: [
      { icon: 'github', link: 'https://github.com/vuejs/vitepress' }
    ]
  }
})
