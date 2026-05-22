#!/usr/bin/env node
// 一次性脚本:给 diary/*.md 补 frontmatter(title / created / updated)
// title  : 取第一行 # 标题,没有则用文件名
// created: git log 中文件首次提交时间
// updated: git log 中最近一次提交时间
// 已有 frontmatter 的文件跳过

import fs from 'node:fs'
import path from 'node:path'
import { execSync } from 'node:child_process'
import matter from 'gray-matter'
import { fileURLToPath } from 'node:url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const ROOT = path.resolve(__dirname, '..')
const DIARY_DIR = path.join(ROOT, 'diary')
const SKIP = new Set(['index.md', 'edit.md'])

function gitTime(file, first = false) {
  const rel = path.relative(ROOT, file)
  try {
    if (first) {
      const out = execSync(
        `git log --diff-filter=A --follow --format=%cI -- "${rel}"`,
        { cwd: ROOT, encoding: 'utf8' }
      ).trim().split('\n').filter(Boolean)
      return out[out.length - 1] || null
    }
    const out = execSync(
      `git log -1 --follow --format=%cI -- "${rel}"`,
      { cwd: ROOT, encoding: 'utf8' }
    ).trim()
    return out || null
  } catch {
    return null
  }
}

function deriveTitle(content, fileName) {
  const m = content.match(/^\s*#\s+(.+)$/m)
  if (m) return m[1].trim()
  return fileName.replace(/\.md$/, '')
}

function fsTime(file) {
  try {
    const st = fs.statSync(file)
    return { created: st.birthtime.toISOString(), updated: st.mtime.toISOString() }
  } catch {
    const now = new Date().toISOString()
    return { created: now, updated: now }
  }
}

const files = fs.readdirSync(DIARY_DIR)
  .filter(f => f.endsWith('.md') && !SKIP.has(f))

let touched = 0
let skipped = 0

for (const name of files) {
  const abs = path.join(DIARY_DIR, name)
  const raw = fs.readFileSync(abs, 'utf8')
  const parsed = matter(raw)
  const data = parsed.data || {}

  if (data.title && data.created && data.updated) {
    skipped++
    continue
  }

  const title = data.title || deriveTitle(parsed.content, name)
  let created = data.created || gitTime(abs, true)
  let updated = data.updated || gitTime(abs, false)

  if (!created || !updated) {
    const fst = fsTime(abs)
    created = created || fst.created
    updated = updated || fst.updated
  }

  const out = matter.stringify(parsed.content, {
    ...data,
    title,
    created,
    updated
  })
  fs.writeFileSync(abs, out, 'utf8')
  console.log(`✓ ${name}  →  ${title}  (updated: ${updated})`)
  touched++
}

console.log(`\nDone. touched=${touched}, skipped=${skipped}, total=${files.length}`)
