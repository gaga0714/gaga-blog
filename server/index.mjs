import 'dotenv/config'
import express from 'express'
import cors from 'cors'
import multer from 'multer'
import matter from 'gray-matter'
import fs from 'node:fs'
import path from 'node:path'
import crypto from 'node:crypto'
import { signToken, requireAuth } from './auth.mjs'
import { ensureSync, commitAndPush, repoFile, repoPath } from './git.mjs'

const PORT = Number(process.env.PORT || 3001)
const PASSWORD = process.env.BLOG_PASSWORD

if (!PASSWORD) {
  console.error('[fatal] BLOG_PASSWORD not set')
  process.exit(1)
}
if (!repoPath) {
  console.error('[fatal] REPO_PATH not set')
  process.exit(1)
}

const app = express()
app.use(cors())
app.use(express.json({ limit: '2mb' }))

// 简单串行锁:防止并发 git 操作互相踩
let busy = Promise.resolve()
function serialize(fn) {
  const next = busy.then(fn, fn)
  busy = next.catch(() => {})
  return next
}

function safeSlug(slug) {
  return /^[a-z0-9][a-z0-9-]{0,80}$/i.test(slug)
}

function articlePath(slug) {
  return repoFile('diary', `${slug}.md`)
}

function genSlug() {
  const d = new Date().toISOString().slice(0, 10)
  const rand = crypto.randomBytes(2).toString('hex')
  return `${d}-${rand}`
}

function nowIso() {
  return new Date().toISOString()
}

// ---------- 路由 ----------

app.post('/api/login', (req, res) => {
  const { password } = req.body || {}
  if (password !== PASSWORD) {
    return res.status(401).json({ error: 'wrong password' })
  }
  res.json({ token: signToken({ role: 'author' }) })
})

app.get('/api/me', requireAuth, (req, res) => {
  res.json({ ok: true, user: req.user })
})

// 新建
app.post('/api/articles', requireAuth, async (req, res) => {
  try {
    const { title, content } = req.body || {}
    if (!title || typeof title !== 'string') {
      return res.status(400).json({ error: 'title required' })
    }
    if (typeof content !== 'string') {
      return res.status(400).json({ error: 'content required' })
    }
    const result = await serialize(async () => {
      await ensureSync()
      let slug = genSlug()
      // 概率极小但防一下
      while (fs.existsSync(articlePath(slug))) slug = genSlug()
      const now = nowIso()
      const fm = matter.stringify(content, { title, created: now, updated: now })
      fs.writeFileSync(articlePath(slug), fm, 'utf8')
      await commitAndPush(`post: ${title}`)
      return { slug, title, created: now, updated: now }
    })
    res.json(result)
  } catch (e) {
    console.error('[create] error:', e)
    res.status(500).json({ error: e.message || 'create failed' })
  }
})

// 取单篇(给编辑器加载用)
app.get('/api/articles/:slug', requireAuth, (req, res) => {
  const { slug } = req.params
  if (!safeSlug(slug)) return res.status(400).json({ error: 'bad slug' })
  const p = articlePath(slug)
  if (!fs.existsSync(p)) return res.status(404).json({ error: 'not found' })
  const raw = fs.readFileSync(p, 'utf8')
  const { data, content } = matter(raw)
  res.json({ slug, title: data.title || slug, content, created: data.created, updated: data.updated })
})

// 更新
app.put('/api/articles/:slug', requireAuth, async (req, res) => {
  try {
    const { slug } = req.params
    if (!safeSlug(slug)) return res.status(400).json({ error: 'bad slug' })
    const { title, content } = req.body || {}
    if (!title || typeof title !== 'string') return res.status(400).json({ error: 'title required' })
    if (typeof content !== 'string') return res.status(400).json({ error: 'content required' })

    const result = await serialize(async () => {
      await ensureSync()
      const p = articlePath(slug)
      if (!fs.existsSync(p)) throw new Error('article not found')
      const raw = fs.readFileSync(p, 'utf8')
      const { data } = matter(raw)
      const updated = nowIso()
      const fm = matter.stringify(content, {
        ...data,
        title,
        created: data.created || updated,
        updated
      })
      fs.writeFileSync(p, fm, 'utf8')
      await commitAndPush(`edit: ${title}`)
      return { slug, title, updated }
    })
    res.json(result)
  } catch (e) {
    console.error('[update] error:', e)
    res.status(500).json({ error: e.message || 'update failed' })
  }
})

// 删除
app.delete('/api/articles/:slug', requireAuth, async (req, res) => {
  try {
    const { slug } = req.params
    if (!safeSlug(slug)) return res.status(400).json({ error: 'bad slug' })
    const result = await serialize(async () => {
      await ensureSync()
      const p = articlePath(slug)
      if (!fs.existsSync(p)) throw new Error('article not found')
      fs.unlinkSync(p)
      await commitAndPush(`delete: ${slug}`)
      return { slug, deleted: true }
    })
    res.json(result)
  } catch (e) {
    console.error('[delete] error:', e)
    res.status(500).json({ error: e.message || 'delete failed' })
  }
})

// 图片上传
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 8 * 1024 * 1024 }
})

app.post('/api/upload', requireAuth, upload.single('image'), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ error: 'no file' })
    const ext = (path.extname(req.file.originalname) || '.png').toLowerCase()
    if (!/^\.(png|jpe?g|gif|webp|svg)$/.test(ext)) {
      return res.status(400).json({ error: 'unsupported file type' })
    }
    const year = new Date().getFullYear()
    const name = `${crypto.randomBytes(8).toString('hex')}${ext}`
    const relDir = path.join('public', 'diary-images', String(year))
    const absDir = repoFile(relDir)
    fs.mkdirSync(absDir, { recursive: true })
    const absFile = path.join(absDir, name)
    fs.writeFileSync(absFile, req.file.buffer)
    // 立即 commit + push,让图片随后续文章引用时已经能访问
    await serialize(async () => {
      await commitAndPush(`upload: ${name}`)
    })
    res.json({ url: `/diary-images/${year}/${name}` })
  } catch (e) {
    console.error('[upload] error:', e)
    res.status(500).json({ error: e.message || 'upload failed' })
  }
})

app.get('/api/health', (req, res) => res.json({ ok: true }))

app.listen(PORT, () => {
  console.log(`[gaga-blog-server] listening on :${PORT}, repo=${repoPath}`)
})
