import path from 'node:path'
import fs from 'node:fs'
import { fileURLToPath } from 'node:url'
import { defineConfig } from 'vitepress'
import { isDiaryArticlePath, parseTimestamp, readDiaryArticle, readDiaryArticles } from './lib/diary-meta.mjs'
import { set_sidebar } from '../utils/auto_sidebar.mjs'
import cjkFriendly from 'markdown-it-cjk-friendly'
import { articleTemplatePlugin } from '../scripts/article-template.mjs'

console.log('[VitePress] 正在加载配置…')
const __dirname = path.dirname(fileURLToPath(import.meta.url))
const ROOT = path.join(__dirname, '..')
const DIARY_DIR = path.join(ROOT, 'diary')

function formatDateTime(date) {
  const timestamp = parseTimestamp(date)
  return timestamp ? new Date(timestamp).toLocaleString('zh-CN', { timeZone: 'Asia/Shanghai', year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit' }) : ''
}

function diaryListPlugin() {
  return {
    name: 'diary-list',
    buildStart() {
      const data = readDiaryArticles(DIARY_DIR)
      const publicDir = path.join(ROOT, 'public')
      fs.mkdirSync(publicDir, { recursive: true })
      fs.writeFileSync(path.join(publicDir, 'diary-articles.json'), JSON.stringify(data), 'utf8')
    },
    configureServer(server) {
      const write = () => {
        const data = readDiaryArticles(DIARY_DIR)
        const publicDir = path.join(ROOT, 'public')
        fs.mkdirSync(publicDir, { recursive: true })
        fs.writeFileSync(path.join(publicDir, 'diary-articles.json'), JSON.stringify(data), 'utf8')
      }
      write()
      server.watcher.add(path.join(DIARY_DIR, '*.md'))
      server.watcher.on('add', p => { if (p.startsWith(DIARY_DIR)) write() })
      server.watcher.on('change', p => { if (p.startsWith(DIARY_DIR)) write() })
      server.watcher.on('unlink', p => { if (p.startsWith(DIARY_DIR)) write() })
    }
  }
}

// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: "gaga's blog",
  description: "gaga的个人技术博客，分享前端、后端、算法等技术文章，记录学习与成长",
  head: [
    ['link', { rel: 'icon', type: 'image/png', href: '/public_avatar.png' }],
    ['meta', { name: 'keywords', content: '前端开发,Vue,React,JavaScript,算法,后端开发,技术博客,gaga' }],
    ['meta', { name: 'author', content: 'gaga' }],
    ['meta', { property: 'og:type', content: 'website' }],
    ['meta', { property: 'og:site_name', content: "gaga's blog" }],
    ['meta', { property: 'og:image', content: 'http://gaga0714.top/public_avatar.png' }],
    ['meta', { name: 'twitter:card', content: 'summary_large_image' }],
    ['meta', { name: 'twitter:image', content: 'http://gaga0714.top/public_avatar.png' }]
  ],
  sitemap: {
    hostname: 'http://gaga0714.top'
  },
  ignoreDeadLinks: true,
  markdown: {
    lineNumbers: true,
    config: (md) => {
      md.use(cjkFriendly)
    },
  },
  vite: {
    plugins: [articleTemplatePlugin({ root: ROOT }), diaryListPlugin()],
    server: {
      proxy: {
        '/api': {
          target: process.env.API_PROXY_TARGET || 'http://gaga0714.top',
          changeOrigin: true
        }
      }
    }
  },
  transformPageData(pageData) {
    const r = pageData.relativePath
    if (!r) return pageData

    const fm = pageData.frontmatter || {}
    const articleMeta = isDiaryArticlePath(r) ? readDiaryArticle(path.join(ROOT, r)) : null
    if (articleMeta) pageData.articleMeta = articleMeta
    const title = articleMeta?.title || fm.title || pageData.title || "gaga's blog"
    const slug = r.replace(/\.md$/, '').replace(/index$/, '')
    const canonicalUrl = `http://gaga0714.top/${slug}`

    let description = fm.description || articleMeta?.excerpt || ''
    if (!description) description = `${title} - gaga的技术博客`

    const head = [...(fm.head || [])]
    head.push(
      ['meta', { property: 'og:title', content: title }],
      ['meta', { property: 'og:description', content: description }],
      ['meta', { property: 'og:url', content: canonicalUrl }],
      ['meta', { name: 'description', content: description }],
      ['link', { rel: 'canonical', href: canonicalUrl }]
    )
    const created = articleMeta?.created || parseTimestamp(fm.created)
    const updated = articleMeta?.updated || parseTimestamp(fm.updated)
    if (created) {
      head.push(['meta', { property: 'article:published_time', content: created }])
    }
    if (updated) {
      head.push(['meta', { property: 'article:modified_time', content: updated }])
    }

    // JSON-LD 结构化数据（仅文章页面）
    if (r !== 'index.md' && fm.layout !== 'home') {
      const jsonLd = {
        '@context': 'https://schema.org',
        '@type': 'Article',
        headline: title,
        description: description,
        url: canonicalUrl,
        author: { '@type': 'Person', name: 'gaga', url: 'http://gaga0714.top' },
        publisher: {
          '@type': 'Organization',
          name: "gaga's blog",
          logo: { '@type': 'ImageObject', url: 'http://gaga0714.top/public_avatar.png' }
        }
      }
      if (created) jsonLd.datePublished = created
      if (updated) jsonLd.dateModified = updated
      head.push(['script', { type: 'application/ld+json' }, JSON.stringify(jsonLd)])
    }

    pageData.frontmatter = { ...fm, head, navbar: false }
    if (articleMeta?.encrypted) delete pageData.frontmatter.summary

    if (articleMeta) {
      pageData.diaryFileCreated = formatDateTime(articleMeta.created)
      pageData.diaryFileUpdated = formatDateTime(articleMeta.updated)
      return pageData
    }
    if (r.startsWith('inter_code/')) {
      try {
        const stat = fs.statSync(path.join(ROOT, r))
        pageData.diaryFileCreated = formatDateTime(stat.birthtime)
        pageData.diaryFileUpdated = formatDateTime(stat.mtime)
      } catch (_) {}
    }
    return pageData
  },
  themeConfig: {
    sidebarMenuLabel: '文章目录',
    outlineTitle: '本页目录',
    docFooter: { prev: '上一篇', next: '下一篇' },
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
                displayDetails: '显示详细结果',
                backButtonTitle: '关闭搜索',
                noResultsText: '无法找到相关结果',
                resetButtonTitle: '清除查询条件',
                footer: {
                  selectText: '选择',
                  navigateText: '切换',
                  closeText: '关闭'
                }
              }
        }
      }
    },
    nav: [
      { text: '鸭棚子', link: '/' },
      { text: '胡言乱语', link: '/diary/' },
      { text: '八股', items:[
        {text:'HTML', link:'/damn/html/'},
        {text:'CSS', link:'/damn/css/'},
        {text:'JavaScript', link:'/damn/javascript/'},
        {text:'Vue3', link:'/damn/vue3/'},
        {text:'React', link:'/damn/react/'},
        {text:'Network', link:'/damn/network/'},
        {text:'工程化',link:'/damn/engineering/'},
        {text:'TypeScript',link:'/damn/ts/'},
        {text:'后端',link:'/damn/backend/'},
        {text:'Agent',link:'/damn/agent/'}
      ] },
      { text: '手撕', link: '/inter_code/'},
      { text: '算法', link: '/algorithm/' },
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
      "/damn/agent/": set_sidebar("/damn/agent"),
      "/inter_code/": set_sidebar("/inter_code"),
      "/todo/": set_sidebar("/todo"),
      "/algorithm/":set_sidebar("/algorithm"),
    },


    socialLinks: [
      { icon: 'github', link: 'https://github.com/gaga0714' }
    ]
  }
})
