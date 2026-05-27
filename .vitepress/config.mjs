import path from 'node:path'
import fs from 'node:fs'
import { fileURLToPath } from 'node:url'
import { defineConfig } from 'vitepress'
import matter from 'gray-matter'
import { set_sidebar } from '../utils/auto_sidebar.mjs'

console.log('[VitePress] 正在加载配置…')
const __dirname = path.dirname(fileURLToPath(import.meta.url))
const ROOT = path.join(__dirname, '..')
const DIARY_DIR = path.join(ROOT, 'diary')

function formatDateTime(date) {
  const d = new Date(date)
  return d.toLocaleString('zh-CN', { year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit' })
}

function isDiarySkipped(name) {
  return name === 'index.md' || name === 'edit.md'
}

function readDiaryMeta(copyCoverImages = false) {
  const out = []
  let files
  try { files = fs.readdirSync(DIARY_DIR) } catch { return out }
  const coversDir = path.join(ROOT, 'public', 'covers')
  if (copyCoverImages) {
    fs.mkdirSync(coversDir, { recursive: true })
  }
  for (const name of files) {
    if (!name.endsWith('.md') || isDiarySkipped(name)) continue
    const abs = path.join(DIARY_DIR, name)
    let raw
    try { raw = fs.readFileSync(abs, 'utf8') } catch { continue }
    const { data, content } = matter(raw)
    const slug = name.replace(/\.md$/, '')
    const encrypted = content.includes('<PasswordProtect')
    const text = content.replace(/^#.*$/gm, '').replace(/!\[[^\]]*\]\([^)]+\)/g, '').replace(/\s+/g, ' ').trim()
    const excerpt = encrypted ? '' : text.slice(0, 120)
    const coverMatch = content.match(/!\[[^\]]*\]\(([^)]+)\)/)
    let cover = coverMatch ? coverMatch[1] : ''

    if (cover && copyCoverImages) {
      let sourcePath = ''
      if (cover.startsWith('../assets/')) {
        sourcePath = path.join(ROOT, 'assets', cover.replace('../assets/', ''))
      } else if (cover.startsWith('./assets/')) {
        sourcePath = path.join(ROOT, 'assets', cover.replace('./assets/', ''))
      } else if (cover.startsWith('/assets/')) {
        sourcePath = path.join(ROOT, 'assets', cover.replace('/assets/', ''))
      }

      if (sourcePath && fs.existsSync(sourcePath)) {
        const filename = path.basename(sourcePath)
        const destPath = path.join(coversDir, filename)
        try {
          fs.copyFileSync(sourcePath, destPath)
          cover = `/covers/${filename}`
        } catch (e) {
          console.warn(`[diary-list] Failed to copy cover: ${sourcePath}`)
          cover = ''
        }
      } else {
        cover = ''
      }
    } else if (cover) {
      if (cover.startsWith('../assets/')) cover = cover.replace('../assets/', '/assets/')
      else if (cover.startsWith('./assets/')) cover = cover.replace('./assets/', '/assets/')
    }

    let created = data.created || null
    let updated = data.updated || data.created || null
    if (!created || !updated) {
      try {
        const stat = fs.statSync(abs)
        if (!created) created = stat.birthtime.toISOString()
        if (!updated) updated = stat.mtime.toISOString()
      } catch {}
    }
    out.push({
      slug,
      title: data.title || slug,
      created,
      updated,
      excerpt,
      cover,
      encrypted
    })
  }
  out.sort((a, b) => {
    const ta = a.created ? new Date(a.created).getTime() : 0
    const tb = b.created ? new Date(b.created).getTime() : 0
    return tb - ta
  })
  return out
}

function diaryListPlugin() {
  return {
    name: 'diary-list',
    buildStart() {
      const data = readDiaryMeta(true)
      const publicDir = path.join(ROOT, 'public')
      fs.mkdirSync(publicDir, { recursive: true })
      fs.writeFileSync(path.join(publicDir, 'diary-articles.json'), JSON.stringify(data), 'utf8')
    },
    configureServer(server) {
      const write = () => {
        const data = readDiaryMeta(true)
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
  },
  vite: {
    plugins: [diaryListPlugin()],
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
    const title = fm.title || pageData.title || "gaga's blog"
    const slug = r.replace(/\.md$/, '').replace(/index$/, '')
    const canonicalUrl = `http://gaga0714.top/${slug}`

    let description = fm.description || ''
    if (!description && r.startsWith('diary/') && r !== 'diary/index.md') {
      const abs = path.join(ROOT, r)
      try {
        const raw = fs.readFileSync(abs, 'utf8')
        const { content } = matter(raw)
        const text = content.replace(/^#.*$/gm, '').replace(/!\[[^\]]*\]\([^)]+\)/g, '').replace(/<[^>]+>/g, '').replace(/\s+/g, ' ').trim()
        description = text.slice(0, 150)
      } catch {}
    }
    if (!description) description = `${title} - gaga的技术博客`

    const head = fm.head || []
    head.push(
      ['meta', { property: 'og:title', content: title }],
      ['meta', { property: 'og:description', content: description }],
      ['meta', { property: 'og:url', content: canonicalUrl }],
      ['meta', { name: 'description', content: description }],
      ['link', { rel: 'canonical', href: canonicalUrl }]
    )
    if (fm.created) {
      head.push(['meta', { property: 'article:published_time', content: new Date(fm.created).toISOString() }])
    }
    if (fm.updated) {
      head.push(['meta', { property: 'article:modified_time', content: new Date(fm.updated).toISOString() }])
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
      if (fm.created) jsonLd.datePublished = new Date(fm.created).toISOString()
      if (fm.updated) jsonLd.dateModified = new Date(fm.updated).toISOString()
      head.push(['script', { type: 'application/ld+json' }, JSON.stringify(jsonLd)])
    }

    pageData.frontmatter = { ...fm, head }

    if (r.startsWith('diary/')) {
      if (fm.created) pageData.diaryFileCreated = formatDateTime(fm.created)
      if (fm.updated) pageData.diaryFileUpdated = formatDateTime(fm.updated)
      if (!fm.created || !fm.updated) {
        try {
          const stat = fs.statSync(path.join(ROOT, r))
          if (!fm.created) pageData.diaryFileCreated = formatDateTime(stat.birthtime)
          if (!fm.updated) pageData.diaryFileUpdated = formatDateTime(stat.mtime)
        } catch (_) {}
      }
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
        {text:'后端',link:'/damn/backend/'}
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
      "/inter_code/": set_sidebar("/inter_code"),
      "/todo/": set_sidebar("/todo"),
      "/algorithm/":set_sidebar("/algorithm"),
    },


    socialLinks: [
      { icon: 'github', link: 'https://github.com/gaga0714' }
    ]
  }
})
