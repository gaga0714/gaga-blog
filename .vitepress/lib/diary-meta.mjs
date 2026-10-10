import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import matter from 'gray-matter'
import MarkdownIt from 'markdown-it'

export const DIARY_DIRECTORY = fileURLToPath(new URL('../../diary/', import.meta.url))

const markdown = new MarkdownIt({ html: true })
const dateFormatter = new Intl.DateTimeFormat('en-CA', {
  timeZone: 'Asia/Shanghai', year: 'numeric', month: '2-digit', day: '2-digit'
})

export function isDiaryArticlePath(relativePath) {
  return /^diary\/[^/]+\.md$/.test(relativePath) && !/^diary\/(?:index|edit)\.md$/.test(relativePath)
}

export function parseTimestamp(value) {
  if (value === null || value === undefined || value === '') return null
  if (!(value instanceof Date) && typeof value !== 'string' && typeof value !== 'number') return null
  let input = value
  if (typeof input === 'string') {
    input = input.trim()
    if (!input) return null
    // 未指定时区的文章时间按北京时间理解，构建机器的时区不会改变显示日期。
    if (/^\d{4}-\d{2}-\d{2}$/.test(input)) input += 'T00:00:00+08:00'
    else if (/^\d{4}-\d{2}-\d{2}[T ]\d{2}:\d{2}(?::\d{2}(?:\.\d+)?)?$/.test(input)) input = input.replace(' ', 'T') + '+08:00'
  }
  const date = new Date(input)
  return Number.isFinite(date.getTime()) ? date.toISOString() : null
}

export function formatDiaryDate(value) {
  const timestamp = parseTimestamp(value)
  if (!timestamp) return ''
  const parts = Object.fromEntries(dateFormatter.formatToParts(new Date(timestamp)).map(part => [part.type, part.value]))
  return `${parts.year}-${parts.month}-${parts.day}`
}

export function normalizeTags(frontmatter = {}) {
  const values = frontmatter.tags ?? frontmatter.tag ?? []
  const tags = (Array.isArray(values) ? values : [values])
    .filter(value => typeof value === 'string')
    .flatMap(value => value.split(/[,，]/))
    .map(value => value.trim())
    .filter(Boolean)
  return [...new Set(tags)]
}

function inlineText(children = []) {
  return children.map(token => {
    if (token.type === 'text' || token.type === 'code_inline') return token.content
    if (token.type === 'softbreak' || token.type === 'hardbreak') return ' '
    return ''
  }).join('')
}

function plainText(value) {
  return value.replace(/\s+/g, ' ').trim()
}

function headingText(tokens, index) {
  return index >= 0 ? plainText(inlineText(tokens[index + 1]?.children)) : ''
}

function isOnlyComment(token) {
  return token.type === 'html_block' && !token.content.replace(/<!--[\s\S]*?-->/g, '').trim()
}

export function parseDiaryArticle(raw, { filePath, stat } = {}) {
  if (!filePath) throw new TypeError('parseDiaryArticle requires a filePath')
  const { data, content } = matter(raw)
  const slug = path.basename(filePath, '.md')
  const encrypted = /<PasswordProtect(?:\s|\/?>)/i.test(content)
  const tokens = markdown.parse(content, {})
  const firstHeading = tokens.findIndex(token => token.type === 'heading_open' && token.tag === 'h1' && token.level === 0)
  const bodyTitle = headingText(tokens, firstHeading)
  const explicitTitle = typeof data.title === 'string' ? data.title.trim() : ''
  const title = explicitTitle || (!encrypted && bodyTitle) || slug
  const firstVisible = tokens.findIndex(token => token.level === 0 && !token.hidden && !isOnlyComment(token))
  const hasLeadingTitle = firstVisible >= 0 && firstVisible === firstHeading && bodyTitle === plainText(title)
  const summary = !encrypted && typeof data.summary === 'string' ? plainText(data.summary) : ''
  const excerpt = encrypted ? '' : plainText(tokens
    .filter((token, index) => token.type === 'inline' && tokens[index - 1]?.type !== 'heading_open')
    .map(token => inlineText(token.children))
    .join(' ')).slice(0, 120)
  const recordedCreated = parseTimestamp(data.created)
  const created = recordedCreated || parseTimestamp(stat?.birthtime) || parseTimestamp(stat?.mtime)
  const updated = parseTimestamp(data.updated) || recordedCreated || parseTimestamp(stat?.mtime) || created

  return {
    slug,
    url: `/diary/${encodeURIComponent(slug)}.html`,
    title,
    created,
    updated,
    date: formatDiaryDate(created),
    tags: normalizeTags(data),
    summary,
    excerpt,
    encrypted,
    hasLeadingTitle
  }
}

export function readDiaryArticle(filePath) {
  return parseDiaryArticle(fs.readFileSync(filePath, 'utf8'), { filePath, stat: fs.statSync(filePath) })
}

export function readDiaryArticles(directory = DIARY_DIRECTORY) {
  const entries = fs.readdirSync(directory, { withFileTypes: true })
  return entries
    .filter(entry => entry.isFile() && isDiaryArticlePath(`diary/${entry.name}`))
    .map(entry => {
      const { hasLeadingTitle, ...article } = readDiaryArticle(path.join(directory, entry.name))
      return article
    })
    .sort((a, b) => {
      const byDate = (Date.parse(b.created) || 0) - (Date.parse(a.created) || 0)
      return byDate || (a.slug < b.slug ? -1 : a.slug > b.slug ? 1 : 0)
    })
}
