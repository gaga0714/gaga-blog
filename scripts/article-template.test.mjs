import test from 'node:test'
import assert from 'node:assert/strict'
import fs from 'node:fs'
import os from 'node:os'
import path from 'node:path'
import { EventEmitter } from 'node:events'
import { spawn } from 'node:child_process'
import { fileURLToPath } from 'node:url'
import matter from 'gray-matter'
import {
  articleTemplatePlugin,
  createArticleTemplate,
  createArticleTemplateController,
  formatBeijingTimestamp,
  startArticleTemplateWatcher
} from './article-template.mjs'

const wait = (milliseconds = 90) => new Promise(resolve => setTimeout(resolve, milliseconds))
const now = () => new Date('2026-10-09T17:23:45.000Z')

function fixture(t) {
  const root = fs.realpathSync(fs.mkdtempSync(path.join(os.tmpdir(), 'gaga-article-template-')))
  const cleanups = []
  const messages = []
  const logger = {
    info: message => messages.push(['info', message]),
    warn: message => messages.push(['warn', message]),
    error: message => messages.push(['error', message])
  }
  t.after(() => {
    for (const close of cleanups.reverse()) close()
    fs.rmSync(root, { recursive: true, force: true })
  })
  const file = (name, content = '') => {
    const fullPath = path.join(root, name)
    fs.mkdirSync(path.dirname(fullPath), { recursive: true })
    fs.writeFileSync(fullPath, content)
    return fullPath
  }
  const controller = (options = {}) => {
    const instance = createArticleTemplateController({ root, logger, now, settleMs: 25, ...options })
    cleanups.push(instance.close)
    return instance
  }
  return { root, file, controller, logger, messages, cleanups, read: name => fs.readFileSync(path.join(root, name), 'utf8') }
}

test('模板转义文件名，并生成一致的北京时间与空元数据', () => {
  const template = createArticleTemplate('/blog/diary/标题: "示例".md', { now: now() })
  const parsed = matter(template)
  assert.equal(parsed.data.title, '标题: "示例"')
  assert.equal(parsed.data.summary, '')
  assert.deepEqual(parsed.data.tags, [])
  assert.equal(parsed.data.created, '2026-10-10T01:23:45+08:00')
  assert.equal(parsed.data.updated, parsed.data.created)
  assert.equal(parsed.content, '\n# 标题: "示例"\n\n')
  assert.equal(matter(createArticleTemplate('/blog/学习笔记/index.md')).data.title, '学习笔记')
  assert.equal(formatBeijingTimestamp('2026-10-10T08:00:00+08:00'), '2026-10-10T08:00:00+08:00')
})

test('启动前的空文件和正文文件保持原样，启动后的变更事件也不填充', async t => {
  const f = fixture(t)
  const empty = f.file('old-empty.md')
  const content = f.file('old-content.md', '# 旧正文\n')
  const c = f.controller()
  c.notice(empty)
  c.notice(content)
  fs.writeFileSync(content, '')
  c.notice(content)
  await wait()
  assert.equal(f.read('old-empty.md'), '')
  assert.equal(f.read('old-content.md'), '')
  assert.equal(f.messages.length, 0)
})

test('新空文件只生成一次，重复事件及后续清空不重新生成', async t => {
  const f = fixture(t)
  const c = f.controller()
  const file = f.file('diary/新文章.md')
  for (let count = 0; count < 5; count++) c.notice(file)
  await wait()
  const created = f.read('diary/新文章.md')
  assert.equal(matter(created).data.title, '新文章')
  assert.equal(f.messages.filter(([type]) => type === 'info').length, 1)
  fs.writeFileSync(file, '')
  c.notice(file)
  await wait()
  assert.equal(f.read('diary/新文章.md'), '')
  assert.deepEqual(fs.readdirSync(path.dirname(file)), ['新文章.md'])
})

test('漏掉新增事件时定时补扫仍会填充，重复补扫不会延后写入', async t => {
  const f = fixture(t)
  f.file('existing.md')
  const c = f.controller({ scanIntervalMs: 10, settleMs: 40 })
  f.file('missed/deep/article.md')
  const deadline = Date.now() + 1000
  while (!f.read('missed/deep/article.md') && Date.now() < deadline) await wait(20)
  assert.equal(matter(f.read('missed/deep/article.md')).data.title, 'article')
  assert.equal(f.read('existing.md'), '')
  c.close()
  f.file('after-scan-closed.md')
  await wait()
  assert.equal(f.read('after-scan-closed.md'), '')
})

test('检查后的并发输入不会被模板覆盖', async t => {
  const f = fixture(t)
  const c = f.controller()
  const file = f.file('race.md')
  const originalWrite = fs.writeFileSync.bind(fs)
  t.mock.method(fs, 'writeFileSync', (target, ...args) => {
    if (typeof target === 'number') originalWrite(file, '# 刚刚输入的正文\n')
    return originalWrite(target, ...args)
  })
  c.notice(file)
  await wait()
  assert.ok(f.read('race.md').startsWith('# 刚刚输入的正文\n'))
})

test('新空文件仅更新权限等属性时，仍生成模板', async t => {
  const f = fixture(t)
  const c = f.controller()
  const file = f.file('metadata.md')
  c.notice(file)
  await wait(5)
  fs.chmodSync(file, 0o600)
  c.notice(file)
  await wait()
  assert.equal(matter(f.read('metadata.md')).data.title, 'metadata')
})

test('打开文件写入时系统更新属性，不影响空文件模板生成', async t => {
  const f = fixture(t)
  const c = f.controller()
  const file = f.file('open-metadata.md')
  const originalOpen = fs.openSync.bind(fs)
  t.mock.method(fs, 'openSync', (target, ...args) => {
    const handle = originalOpen(target, ...args)
    if (target === file) fs.chmodSync(file, 0o600)
    return handle
  })
  c.notice(file)
  await wait()
  assert.equal(matter(f.read('open-metadata.md')).data.title, 'open-metadata')
})

test('等待期间写入后又清空的文件，即使漏掉变更事件也不补模板', async t => {
  const f = fixture(t)
  const c = f.controller()
  const file = f.file('write-then-clear.md')
  c.notice(file)
  await wait(5)
  fs.writeFileSync(file, '# 输入过正文\n')
  fs.writeFileSync(file, '')
  await wait()
  assert.equal(f.read('write-then-clear.md'), '')
  assert.equal(f.messages.length, 0)
})

test('新文件快速写入正文或仅包含空白时，不填充模板', async t => {
  const f = fixture(t)
  const c = f.controller()
  const file = f.file('new.md')
  c.notice(file)
  fs.writeFileSync(file, '# 正在写的正文\n')
  // 即使编辑器的后续 change 事件尚未到达，写入前也会再次检查。
  c.notice(f.file('whitespace.md', '\n'))
  await wait()
  assert.equal(f.read('new.md'), '# 正在写的正文\n')
  assert.equal(f.read('whitespace.md'), '\n')
})

test('正文先出现再被清空也不补模板', async t => {
  const f = fixture(t)
  const c = f.controller()
  const file = f.file('edited.md', '# 已写内容\n')
  c.notice(file)
  fs.writeFileSync(file, '')
  c.notice(file)
  await wait()
  assert.equal(f.read('edited.md'), '')
})

test('删除再恢复的新文件不会被当作第二个空文件填充', async t => {
  const f = fixture(t)
  const c = f.controller()
  const file = f.file('restored.md')
  c.notice(file)
  fs.unlinkSync(file)
  c.remove(file)
  f.file('restored.md')
  c.notice(file)
  await wait()
  assert.equal(f.read('restored.md'), '')
})

test('编辑器原子替换文件时，放弃此前等待中的模板', async t => {
  const f = fixture(t)
  const c = f.controller()
  const file = f.file('atomic.md')
  c.notice(file)
  const temporary = f.file('temporary-save', '')
  fs.renameSync(temporary, file)
  await wait()
  assert.equal(f.read('atomic.md'), '')
})

test('新建的多层目录可以填充，目录中的已有正文保持原样', async t => {
  const f = fixture(t)
  const c = f.controller()
  f.file('new/deep/empty.md')
  f.file('new/deep/content.md', '# 正文\n')
  c.notice(path.join(f.root, 'new'))
  await wait()
  assert.equal(matter(f.read('new/deep/empty.md')).data.title, 'empty')
  assert.equal(f.read('new/deep/content.md'), '# 正文\n')
})

test('忽略隐藏、依赖、资源和生成目录，也不越过项目边界', async t => {
  const f = fixture(t)
  const c = f.controller()
  const paths = [
    '.git/note.md', '.vitepress/note.md', '.hidden/note.md', '.private.md',
    'node_modules/package/note.md', 'sub/node_modules/package/note.md',
    'public/note.md', 'assets/note.md', 'vendor/note.md', 'dist/note.md',
    'build/note.md', 'coverage/note.md', 'target/note.md', 'generated/note.md'
  ]
  for (const name of paths) c.notice(f.file(name))
  const outside = fs.mkdtempSync(path.join(os.tmpdir(), 'gaga-outside-'))
  f.cleanups.push(() => fs.rmSync(outside, { recursive: true, force: true }))
  const externalFile = path.join(outside, 'outside.md')
  fs.writeFileSync(externalFile, '')
  c.notice(externalFile)
  c.notice(f.root)
  await wait()
  for (const name of paths) assert.equal(f.read(name), '', name)
  assert.equal(fs.readFileSync(externalFile, 'utf8'), '')
})

test('不跟随软链接，也不修改旧空文件的硬链接或重命名路径', async t => {
  const f = fixture(t)
  const original = f.file('old.md')
  const renamed = f.file('rename-me.md')
  const c = f.controller()
  const hardlink = path.join(f.root, 'hardlink.md')
  fs.linkSync(original, hardlink)
  c.notice(hardlink)
  const link = path.join(f.root, 'link.md')
  fs.symlinkSync(original, link)
  c.notice(link)
  const moved = path.join(f.root, 'moved.md')
  fs.renameSync(renamed, moved)
  c.notice(moved)
  await wait()
  assert.equal(f.read('old.md'), '')
  assert.equal(f.read('hardlink.md'), '')
  assert.equal(f.read('link.md'), '')
  assert.equal(f.read('moved.md'), '')
})

test('关闭控制器会取消待处理模板，之后的事件不再写入', async t => {
  const f = fixture(t)
  const c = f.controller()
  c.notice(f.file('pending.md'))
  c.close()
  c.notice(f.file('after-close.md'))
  await wait()
  assert.equal(f.read('pending.md'), '')
  assert.equal(f.read('after-close.md'), '')
})

test('Vite 插件复用 watcher，并在服务器关闭时解绑全部监听', async t => {
  const f = fixture(t)
  const watcher = new EventEmitter()
  const httpServer = new EventEmitter()
  const plugin = articleTemplatePlugin({ root: f.root, logger: f.logger, now, settleMs: 25 })
  f.cleanups.push(() => plugin.closeBundle())
  assert.equal(plugin.apply, 'serve')
  plugin.configureServer({ watcher, httpServer, config: { root: f.root, logger: f.logger } })
  watcher.emit('add', f.file('vite.md'))
  await wait()
  assert.equal(matter(f.read('vite.md')).data.title, 'vite')
  watcher.emit('add', f.file('pending.md'))
  httpServer.emit('close')
  for (const event of ['add', 'change', 'addDir', 'unlink', 'unlinkDir']) assert.equal(watcher.listenerCount(event), 0)
  assert.equal(httpServer.listenerCount('close'), 0)
  await wait()
  assert.equal(f.read('pending.md'), '')
})

test('独立递归监听器捕获新目录中的文件，并可以完全停止', async t => {
  const f = fixture(t)
  f.file('before.md')
  const watcher = startArticleTemplateWatcher({ root: f.root, logger: f.logger, now, settleMs: 25 })
  f.cleanups.push(watcher.close)
  f.file('fresh/nested/created.md')
  const deadline = Date.now() + 3000
  while (!f.read('fresh/nested/created.md') && Date.now() < deadline) await wait(20)
  assert.equal(matter(f.read('fresh/nested/created.md')).data.title, 'created')
  assert.equal(f.read('before.md'), '')
  watcher.close()
  f.file('after.md')
  await wait()
  assert.equal(f.read('after.md'), '')
})

test('独立监听发生错误时关闭资源并通知调用方', async t => {
  const f = fixture(t)
  const nativeWatcher = new EventEmitter()
  let closed = false
  let reported
  nativeWatcher.close = () => { closed = true }
  t.mock.method(fs, 'watch', () => nativeWatcher)
  const watcher = startArticleTemplateWatcher({ root: f.root, logger: f.logger, onError: error => { reported = error } })
  f.cleanups.push(watcher.close)
  const error = new Error('watch failed')
  nativeWatcher.emit('error', error)
  assert.equal(closed, true)
  assert.equal(reported, error)
  assert.equal(f.messages.filter(([type]) => type === 'error').length, 1)
})

test('定时扫描模式不创建原生监听，只填充启动后的空文件并支持停止', async t => {
  const f = fixture(t)
  f.file('existing.md')
  t.mock.method(fs, 'watch', () => assert.fail('定时扫描模式不应调用 fs.watch'))
  const watcher = startArticleTemplateWatcher({ root: f.root, logger: f.logger, now, poll: true, scanIntervalMs: 10, settleMs: 25 })
  f.cleanups.push(watcher.close)
  f.file('diary/go概括.md')
  f.file('diary/written.md', '# 已有正文\n')
  await wait()
  assert.equal(matter(f.read('diary/go概括.md')).data.title, 'go概括')
  assert.equal(f.read('existing.md'), '')
  assert.equal(f.read('diary/written.md'), '# 已有正文\n')
  watcher.close()
  f.file('after-close.md')
  await wait()
  assert.equal(f.read('after-close.md'), '')
})

for (const code of ['EMFILE', 'ERR_FEATURE_UNAVAILABLE_ON_PLATFORM']) {
  test(`原生监听启动抛出 ${code} 时，退回扫描并继续填充新文件`, async t => {
    const f = fixture(t)
    t.mock.method(fs, 'watch', () => { throw Object.assign(new Error('watch unavailable'), { code }) })
    const watcher = startArticleTemplateWatcher({ root: f.root, logger: f.logger, now, scanIntervalMs: 10, settleMs: 25, onError: () => assert.fail('可恢复错误不应终止任务') })
    f.cleanups.push(watcher.close)
    f.file('fallback.md')
    await wait()
    assert.equal(matter(f.read('fallback.md')).data.title, 'fallback')
    assert.equal(f.messages.filter(([type]) => type === 'warn').length, 1)
  })
}

test('原生监听异步报 EMFILE 时，关闭原生监听但保留扫描', async t => {
  const f = fixture(t)
  const nativeWatcher = new EventEmitter()
  let closeCount = 0
  nativeWatcher.close = () => { closeCount++ }
  t.mock.method(fs, 'watch', () => nativeWatcher)
  const watcher = startArticleTemplateWatcher({ root: f.root, logger: f.logger, now, scanIntervalMs: 10, settleMs: 25, onError: () => assert.fail('可恢复错误不应终止任务') })
  f.cleanups.push(watcher.close)
  nativeWatcher.emit('error', Object.assign(new Error('too many open files'), { code: 'EMFILE' }))
  f.file('after-error.md')
  await wait()
  assert.equal(closeCount, 1)
  assert.equal(matter(f.read('after-error.md')).data.title, 'after-error')
  watcher.close()
  f.file('after-close.md')
  await wait()
  assert.equal(f.read('after-close.md'), '')
  assert.equal(closeCount, 1)
})

test('关闭补扫后遇到 EMFILE 会报告错误，不伪装成仍在运行', t => {
  const f = fixture(t)
  const nativeWatcher = new EventEmitter()
  nativeWatcher.close = () => {}
  let reported
  t.mock.method(fs, 'watch', () => nativeWatcher)
  const watcher = startArticleTemplateWatcher({ root: f.root, logger: f.logger, scanIntervalMs: 0, onError: error => { reported = error } })
  f.cleanups.push(watcher.close)
  const error = Object.assign(new Error('too many open files'), { code: 'EMFILE' })
  nativeWatcher.emit('error', error)
  assert.equal(reported, error)
  assert.throws(() => startArticleTemplateWatcher({ root: f.root, poll: true, scanIntervalMs: 0 }), /间隔必须大于 0/)
})

test('后台 CLI 的 --poll 模式持续运行、生成模板，并在 SIGTERM 后退出', async t => {
  const f = fixture(t)
  f.file('before.md')
  const script = fileURLToPath(new URL('./article-template.mjs', import.meta.url))
  const child = spawn(process.execPath, [script, '--poll'], { cwd: f.root, stdio: ['ignore', 'pipe', 'pipe'] })
  let output = ''
  let errorOutput = ''
  const exited = new Promise(resolve => child.once('exit', (code, signal) => resolve({ code, signal })))
  t.after(async () => {
    if (child.exitCode === null && child.signalCode === null) child.kill('SIGTERM')
    await exited
  })
  child.stdout.on('data', chunk => { output += chunk })
  child.stderr.on('data', chunk => { errorOutput += chunk })
  const readyDeadline = Date.now() + 3000
  while (!output.includes('正在监听') && child.exitCode === null && Date.now() < readyDeadline) await wait(20)
  assert.match(output, /已启用定时扫描/)
  assert.match(output, /正在监听/)
  // 进程在没有文件事件时也必须保持运行，不能因定时器 unref 而提前退出。
  await wait(150)
  assert.equal(child.exitCode, null, errorOutput)
  f.file('diary/go概括.md')
  const fillDeadline = Date.now() + 4000
  while (!f.read('diary/go概括.md') && Date.now() < fillDeadline) await wait(20)
  assert.equal(matter(f.read('diary/go概括.md')).data.title, 'go概括')
  assert.equal(f.read('before.md'), '')
  child.kill('SIGTERM')
  assert.deepEqual(await exited, { code: 0, signal: null })
  assert.equal(errorOutput, '')
})
