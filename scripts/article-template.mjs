import fs from 'node:fs'
import path from 'node:path'
import { createHash } from 'node:crypto'
import { fileURLToPath } from 'node:url'

const EXCLUDED_DIRECTORIES = new Set([
  'node_modules', 'public', 'assets', 'vendor', 'bower_components', 'jspm_packages',
  'dist', 'build', 'out', 'output', 'coverage', 'target', 'generated', 'cache',
  '__pycache__', 'venv', 'env'
])

export function formatBeijingTimestamp(value = new Date()) {
  const date = new Date(value)
  if (!Number.isFinite(date.getTime())) throw new TypeError('文章时间无效')
  return new Date(date.getTime() + 8 * 60 * 60 * 1000).toISOString().replace(/\.\d{3}Z$/, '+08:00')
}

export function createArticleTemplate(filePath, { now = new Date() } = {}) {
  const filename = path.basename(filePath).replace(/\.md$/i, '')
  const title = (filename.toLowerCase() === 'index' ? path.basename(path.dirname(filePath)) : filename)
    .replace(/[\r\n\t]+/g, ' ').trim() || '新文章'
  const timestamp = formatBeijingTimestamp(now)
  const heading = title.replace(/[\\`*_{}\[\]()<>#!|&]/g, '\\$&')
  return `---\ntitle: ${JSON.stringify(title)}\nsummary: ""\ntags: []\ncreated: ${JSON.stringify(timestamp)}\nupdated: ${JSON.stringify(timestamp)}\n---\n\n# ${heading}\n\n`
}

function sameFile(a, b) {
  return a.dev === b.dev && a.ino === b.ino && a.birthtimeMs === b.birthtimeMs
}

function unchangedEmptyFile(a, b) {
  // macOS 可能在打开文件时更新扩展属性和 ctime；正文是否变化由大小与 mtime 判断。
  return sameFile(a, b) && a.size === 0 && b.size === 0 && a.mtimeMs === b.mtimeMs
}

function fileIdentity(stat) {
  return `${stat.dev}:${stat.ino}:${stat.birthtimeMs}`
}

function missingFile(error) {
  return error?.code === 'ENOENT' || error?.code === 'ENOTDIR'
}

export function createArticleTemplateController({ root = process.cwd(), settleMs = 600, scanIntervalMs = 1000, keepAlive = false, canFill = () => true, logger = console, now = () => new Date() } = {}) {
  const rootDirectory = fs.realpathSync(root)
  // 记录文件身份，而非路径；删除后同名新建的文件需要重新处理。
  const knownFiles = new Set()
  const pending = new Map()
  let closed = false
  let scanTimer

  function relativeName(filePath) {
    const absolute = path.resolve(rootDirectory, filePath)
    const relative = path.relative(rootDirectory, absolute)
    if (!relative || relative === '..' || relative.startsWith(`..${path.sep}`) || path.isAbsolute(relative)) return null
    const segments = relative.split(path.sep)
    if (segments.some(segment => segment.startsWith('.'))) return null
    if (segments.slice(0, -1).some(segment => EXCLUDED_DIRECTORIES.has(segment.toLowerCase()))) return null
    return relative
  }

  function articleName(filePath) {
    const relative = relativeName(filePath)
    return relative && /\.md$/i.test(relative) ? relative : null
  }

  function warn(relative, error) {
    logger.warn?.(`[article-template] 未填入 ${relative}：${error?.code || error?.message || error}`)
  }

  function cancel(relative) {
    const item = pending.get(relative)
    if (item) {
      clearTimeout(item.timer)
      knownFiles.add(fileIdentity(item.stat))
    }
    pending.delete(relative)
  }

  function remove(filePath) {
    if (closed) return
    const relative = relativeName(filePath)
    if (!relative) return
    if (/\.md$/i.test(relative)) cancel(relative)
    for (const name of pending.keys()) {
      if (name.startsWith(relative + path.sep)) cancel(name)
    }
  }

  function fill(relative, expected) {
    pending.delete(relative)
    knownFiles.add(fileIdentity(expected))
    if (closed) return
    const filePath = path.join(rootDirectory, relative)
    const lockName = `.gaga-template-${createHash('sha256').update(relative).digest('hex').slice(0, 16)}.lock`
    const lockPath = path.join(path.dirname(filePath), lockName)
    let lock
    let handle
    try {
      if (!canFill(filePath)) return
      const current = fs.lstatSync(filePath)
      if (!current.isFile() || !unchangedEmptyFile(current, expected)) return
      if (fs.realpathSync(filePath) !== filePath) return
      // 多个监听进程不能同时填充同一个新文件。
      try { lock = fs.openSync(lockPath, 'wx', 0o600) } catch (error) {
        if (error.code === 'EEXIST') return
        throw error
      }
      handle = fs.openSync(filePath, fs.constants.O_WRONLY | fs.constants.O_APPEND | (fs.constants.O_NOFOLLOW || 0))
      const opened = fs.fstatSync(handle)
      const atPath = fs.lstatSync(filePath)
      if (!opened.isFile() || !unchangedEmptyFile(opened, expected) || !sameFile(opened, atPath)) return
      const template = createArticleTemplate(filePath, { now: now() })
      // 复核空文件后追加写入，避免其他进程在检查与写入之间输入的内容被覆盖。
      if (!unchangedEmptyFile(fs.fstatSync(handle), expected)) return
      if (!canFill(filePath)) return
      fs.writeFileSync(handle, template, 'utf8')
      logger.info?.(`[article-template] 已填入模板：${relative}`)
    } catch (error) {
      if (!missingFile(error)) warn(relative, error)
    } finally {
      if (handle !== undefined) fs.closeSync(handle)
      if (lock !== undefined) {
        fs.closeSync(lock)
        try { fs.unlinkSync(lockPath) } catch (error) { if (!missingFile(error)) warn(relative, error) }
      }
    }
  }

  function inspect(filePath, stat) {
    const relative = articleName(filePath)
    if (!relative) return
    let item = pending.get(relative)
    if (item && !sameFile(stat, item.stat)) {
      cancel(relative)
      item = undefined
    }
    if (!stat.isFile() || stat.size !== 0 || knownFiles.has(fileIdentity(stat)) || (item && !unchangedEmptyFile(stat, item.stat))) {
      cancel(relative)
      knownFiles.add(fileIdentity(stat))
      return
    }
    // 重复事件和补扫不会延后未变化文件的等待时间。
    if (item) return
    pending.set(relative, {
      stat,
      timer: setTimeout(() => fill(relative, stat), settleMs)
    })
  }

  function walk(directory, initial = false) {
    let entries
    try { entries = fs.readdirSync(directory, { withFileTypes: true }) } catch (error) {
      if (!missingFile(error)) warn(path.relative(rootDirectory, directory) || '.', error)
      return
    }
    for (const entry of entries) {
      if (entry.name.startsWith('.')) continue
      const filePath = path.join(directory, entry.name)
      if (entry.isDirectory()) {
        if (!EXCLUDED_DIRECTORIES.has(entry.name.toLowerCase())) walk(filePath, initial)
        continue
      }
      if (initial && entry.isFile()) {
        try { knownFiles.add(fileIdentity(fs.lstatSync(filePath))) } catch (error) {
          if (!missingFile(error)) warn(path.relative(rootDirectory, filePath), error)
        }
      }
      const relative = articleName(filePath)
      if (!relative) continue
      if (initial || !entry.isFile()) continue
      try { inspect(filePath, fs.lstatSync(filePath)) } catch (error) {
        if (missingFile(error)) cancel(relative)
        else { cancel(relative); warn(relative, error) }
      }
    }
  }

  function notice(filePath) {
    if (closed) return
    const absolute = path.resolve(rootDirectory, filePath)
    if (absolute === rootDirectory) { walk(rootDirectory); return }
    const relative = relativeName(absolute)
    if (!relative) return
    try {
      const stat = fs.lstatSync(absolute)
      if (stat.isDirectory()) {
        if (!EXCLUDED_DIRECTORIES.has(path.basename(absolute).toLowerCase()) && fs.realpathSync(absolute) === absolute) walk(absolute)
      } else {
        inspect(absolute, stat)
      }
    } catch (error) {
      remove(absolute)
      if (!missingFile(error)) warn(relative, error)
    }
  }

  function close() {
    closed = true
    clearInterval(scanTimer)
    for (const item of pending.values()) clearTimeout(item.timer)
    pending.clear()
  }

  // 启动时仅登记已有文件，包括空文件；它们永远不会被本次监听填充。
  walk(rootDirectory, true)
  // 文件系统可能合并或遗漏事件，补扫覆盖初次监听尚未就绪的窗口。
  if (scanIntervalMs > 0) {
    scanTimer = setInterval(() => notice(rootDirectory), scanIntervalMs)
    if (!keepAlive) scanTimer.unref?.()
  }
  return { root: rootDirectory, notice, remove, close }
}

export function articleTemplatePlugin(options = {}) {
  let stop
  return {
    name: 'gaga-article-template',
    apply: 'serve',
    configureServer(server) {
      stop?.()
      const controller = createArticleTemplateController({ ...options, root: options.root || server.config.root, logger: options.logger || server.config.logger })
      const watcher = server.watcher
      const onFile = filePath => controller.notice(filePath)
      const onRemove = filePath => controller.remove(filePath)
      for (const event of ['add', 'change', 'addDir']) watcher.on(event, onFile)
      for (const event of ['unlink', 'unlinkDir']) watcher.on(event, onRemove)
      let stopped = false
      stop = () => {
        if (stopped) return
        stopped = true
        controller.close()
        for (const event of ['add', 'change', 'addDir']) watcher.off(event, onFile)
        for (const event of ['unlink', 'unlinkDir']) watcher.off(event, onRemove)
        server.httpServer?.off('close', stop)
      }
      server.httpServer?.once('close', stop)
      controller.notice(controller.root)
      ;(options.logger || server.config.logger).info?.('[article-template] 已启用新建空 Markdown 文件模板。')
    },
    closeBundle() { stop?.() }
  }
}

export function startArticleTemplateWatcher(options = {}) {
  const logger = options.logger || console
  const scanIntervalMs = options.scanIntervalMs ?? 1000
  if (options.poll && !(scanIntervalMs > 0)) throw new TypeError('定时扫描的间隔必须大于 0')
  // 独立运行时由扫描定时器维持进程，原生监听失效后仍能继续生成模板。
  const controller = createArticleTemplateController({ ...options, scanIntervalMs, keepAlive: true })
  let watcher
  let closed = false
  const close = () => {
    if (closed) return
    closed = true
    controller.close()
    watcher?.close()
  }
  const fallbackToPolling = error => {
    const recoverable = ['EMFILE', 'ENFILE', 'ENOSPC', 'ERR_FEATURE_UNAVAILABLE_ON_PLATFORM']
    if (closed || !(scanIntervalMs > 0) || !recoverable.includes(error.code)) return false
    watcher?.close()
    watcher = undefined
    logger.warn?.(`[article-template] 原生监听不可用（${error.code}），继续每 ${scanIntervalMs} 毫秒扫描新文件。`)
    return true
  }
  if (options.poll) {
    logger.info?.(`[article-template] 已启用定时扫描（每 ${scanIntervalMs} 毫秒）。`)
    return { root: controller.root, close }
  }
  try {
    watcher = fs.watch(controller.root, { recursive: true }, (_event, filename) => {
      controller.notice(filename ? path.join(controller.root, filename.toString()) : controller.root)
    })
    watcher.on('error', error => {
      if (closed || fallbackToPolling(error)) return
      logger.error?.(`[article-template] 监听已停止：${error.code || error.message}`)
      close()
      options.onError?.(error)
    })
    // 补上目录快照与监听器注册之间出现的文件。
    controller.notice(controller.root)
  } catch (error) {
    if (fallbackToPolling(error)) return { root: controller.root, close }
    close()
    if (error.code === 'ERR_FEATURE_UNAVAILABLE_ON_PLATFORM') {
      throw new Error('当前 Node.js 不支持递归文件监听，请使用 Node.js 22 或更新版本。', { cause: error })
    }
    throw error
  }
  return { root: controller.root, close }
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  let watcher
  const stop = () => {
    watcher?.close()
    process.removeListener('SIGINT', stop)
    process.removeListener('SIGTERM', stop)
  }
  try {
    watcher = startArticleTemplateWatcher({ poll: process.argv.slice(2).includes('--poll'), onError: () => { process.exitCode = 1; stop() } })
    console.info(`[article-template] 正在监听 ${watcher.root}，按 Ctrl+C 停止。`)
    process.once('SIGINT', stop)
    process.once('SIGTERM', stop)
  } catch (error) {
    console.error(`[article-template] 无法启动监听：${error.code || error.message}`)
    process.exitCode = 1
  }
}
