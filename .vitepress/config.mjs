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

function readDiaryMeta() {
  const out = []
  let files
  try { files = fs.readdirSync(DIARY_DIR) } catch { return out }
  for (const name of files) {
    if (!name.endsWith('.md') || isDiarySkipped(name)) continue
    const abs = path.join(DIARY_DIR, name)
    let raw
    try { raw = fs.readFileSync(abs, 'utf8') } catch { continue }
    const { data, content } = matter(raw)
    const slug = name.replace(/\.md$/, '')
    const text = content.replace(/^#.*$/gm, '').replace(/!\[[^\]]*\]\([^)]+\)/g, '').replace(/\s+/g, ' ').trim()
    const excerpt = text.slice(0, 120)
    const coverMatch = content.match(/!\[[^\]]*\]\(([^)]+)\)/)
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
      cover: coverMatch ? coverMatch[1] : ''
    })
  }
  out.sort((a, b) => {
    const ta = a.updated ? new Date(a.updated).getTime() : 0
    const tb = b.updated ? new Date(b.updated).getTime() : 0
    return tb - ta
  })
  return out
}

function diaryListPlugin() {
  return {
    name: 'diary-list',
    buildStart() {
      const data = readDiaryMeta()
      const publicDir = path.join(ROOT, 'public')
      fs.mkdirSync(publicDir, { recursive: true })
      fs.writeFileSync(path.join(publicDir, 'diary-articles.json'), JSON.stringify(data), 'utf8')
    },
    configureServer(server) {
      const write = () => {
        const data = readDiaryMeta()
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
  description: "A VitePress Site",
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
    if (r.startsWith('diary/')) {
      const fm = pageData.frontmatter || {}
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
