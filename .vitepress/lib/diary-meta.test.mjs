import test from 'node:test'
import assert from 'node:assert/strict'
import fs from 'node:fs'
import os from 'node:os'
import path from 'node:path'
import {
  formatDiaryDate,
  isDiaryArticlePath,
  normalizeTags,
  parseDiaryArticle,
  parseTimestamp,
  readDiaryArticles
} from './diary-meta.mjs'

const parse = (raw, filename = '文件名.md') => parseDiaryArticle(raw, { filePath: `/diary/${filename}` })

test('tags 支持数组和兼容 tag 字段，不拆开包含空格的标签', () => {
  assert.deepEqual(normalizeTags({ tags: ['Vue 3', '前端', '前端', '', null, 1] }), ['Vue 3', '前端'])
  assert.deepEqual(normalizeTags({ tag: 'JavaScript, 前端，Vue 3' }), ['JavaScript', '前端', 'Vue 3'])
  assert.deepEqual(normalizeTags({ tags: [], tag: '旧标签' }), [])
  assert.deepEqual(normalizeTags(), [])
})

test('北京时间在 UTC 日期边界及无时区输入下保持一致', () => {
  assert.equal(formatDiaryDate('2026-10-09T16:30:00Z'), '2026-10-10')
  assert.equal(formatDiaryDate('2026-10-10T01:00:00+09:00'), '2026-10-10')
  assert.equal(parseTimestamp('2026-10-10 00:30:00'), '2026-10-09T16:30:00.000Z')
  assert.equal(parseTimestamp('2026-10-10'), '2026-10-09T16:00:00.000Z')
  assert.equal(formatDiaryDate('not-a-date'), '')
  assert.equal(parseTimestamp(null), null)
})

test('缺少或无效的文章时间只读文件属性回退', () => {
  const result = parseDiaryArticle('---\ncreated: invalid\nupdated: invalid\n---\n# 文章', {
    filePath: '/diary/文章.md',
    stat: { birthtime: new Date('2026-10-01T00:00:00Z'), mtime: new Date('2026-10-09T17:00:00Z') }
  })
  assert.equal(result.created, '2026-10-01T00:00:00.000Z')
  assert.equal(result.updated, '2026-10-09T17:00:00.000Z')
  assert.equal(result.date, '2026-10-01')
})

test('标题优先元数据、正文 H1、文件名，忽略代码块内的伪标题', () => {
  assert.equal(parse('---\ntitle: 已指定标题\n---\n# 正文标题').title, '已指定标题')
  assert.equal(parse('```md\n# 示例标题\n```\n\n# 正文 `标题`').title, '正文 标题')
  assert.equal(parse('## 二级标题\n\n正文').title, '文件名')
})

test('只有正文开头与页面标题相同的 H1 标记为重复标题', () => {
  assert.equal(parse('\n<!-- 编辑备注 -->\n\n# 正文标题\n\n正文\n\n# 第二个一级标题').hasLeadingTitle, true)
  assert.equal(parse('引言\n\n# 后面的一级标题').hasLeadingTitle, false)
  assert.equal(parse('---\ntitle: 页面标题\n---\n# 正文另一个标题').hasLeadingTitle, false)
  assert.equal(parse('> # 引用标题\n\n正文').hasLeadingTitle, false)
  assert.equal(parse('标题\n====\n\n正文').hasLeadingTitle, true)
})

test('摘要只提取可读正文，移除标题、图片、链接地址和代码围栏', () => {
  const result = parse('# 标题\n\n正文 **加粗** 和 [链接](https://example.com/secret)，使用 `code`。\n\n![配图](./private.png)\n\n```js\nconst secret = true\n```\n\n## 小标题\n\n后续文字。')
  assert.equal(result.excerpt, '正文 加粗 和 链接，使用 code。 后续文字。')
  assert.ok(!result.excerpt.includes('example.com'))
  assert.ok(!result.excerpt.includes('private.png'))
  assert.ok(!result.excerpt.includes('secret'))
})

test('一句话概括来自 summary，合并空白且保留独立的正文摘录', () => {
  const article = parse('---\nsummary: >-\n  整理 Vue 3 的响应式机制，\n  解释依赖追踪如何工作。\n---\n# 标题\n\n这段文字属于正文的开头。')
  assert.equal(article.summary, '整理 Vue 3 的响应式机制， 解释依赖追踪如何工作。')
  assert.equal(article.excerpt, '这段文字属于正文的开头。')
  assert.ok(!article.excerpt.includes('依赖追踪'))
})

test('缺少或无效 summary 时保持为空，不将旧描述或自动摘录当作概括', () => {
  assert.equal(parse('# 标题\n\n正文').summary, '')
  assert.equal(parse('---\nsummary: "  "\ndescription: 旧描述\nexcerpt: 旧摘录\n---\n# 标题\n\n正文').summary, '')
  assert.equal(parse('---\nsummary: [不是, 字符串]\n---\n# 标题').summary, '')
})

test('加密文章不输出摘要，也不从受保护正文推断公开标题', () => {
  const raw = '---\nsummary: 私密的一句话概括\n---\n<PasswordProtect>\n\n# 私密标题\n\n私密内容\n\n</PasswordProtect>'
  const article = parse(raw)
  assert.equal(article.encrypted, true)
  assert.equal(article.summary, '')
  assert.equal(article.excerpt, '')
  assert.equal(article.title, '文件名')
  assert.equal(article.hasLeadingTitle, false)
  assert.ok(!JSON.stringify(article).includes('私密'))
})

test('文章链接编码文件名，保持站点 base 由客户端统一添加', () => {
  const article = parse('# 文章', '中文 #问答?.md')
  assert.equal(article.slug, '中文 #问答?')
  assert.equal(article.url, '/diary/%E4%B8%AD%E6%96%87%20%23%E9%97%AE%E7%AD%94%3F.html')
  assert.equal(isDiaryArticlePath('diary/文章.md'), true)
  assert.equal(isDiaryArticlePath('diary/index.md'), false)
  assert.equal(isDiaryArticlePath('diary/edit.md'), false)
  assert.equal(isDiaryArticlePath('diary/nested/index.md'), false)
})

test('目录读取按日期降序，同日期按 slug 排序，不改写文件', t => {
  const directory = fs.mkdtempSync(path.join(os.tmpdir(), 'gaga-diary-meta-'))
  t.after(() => fs.rmSync(directory, { recursive: true, force: true }))
  const sources = {
    'b.md': '---\ncreated: 2026-10-09T12:00:00Z\n---\n# B\n\n正文',
    'a.md': '---\ncreated: 2026-10-09T12:00:00Z\n---\n# A\n\n正文',
    'latest.md': '---\ncreated: 2026-10-10T12:00:00Z\nsummary: 最新文章的一句话概括。\n---\n# 最新\n\n正文',
    'index.md': '# 列表',
    'edit.md': '# 编辑'
  }
  for (const [name, source] of Object.entries(sources)) fs.writeFileSync(path.join(directory, name), source)
  const articles = readDiaryArticles(directory)
  assert.deepEqual(articles.map(article => article.slug), ['latest', 'a', 'b'])
  assert.equal(articles[0].created, '2026-10-10T12:00:00.000Z')
  assert.equal(articles[0].updated, articles[0].created)
  assert.equal(articles[0].date, '2026-10-10')
  assert.equal(articles[0].summary, '最新文章的一句话概括。')
  assert.ok(!('hasLeadingTitle' in articles[0]))
  for (const [name, source] of Object.entries(sources)) assert.equal(fs.readFileSync(path.join(directory, name), 'utf8'), source)
})
