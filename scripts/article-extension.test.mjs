import test from 'node:test'
import assert from 'node:assert/strict'
import fs from 'node:fs'
import os from 'node:os'
import path from 'node:path'
import { createRequire } from 'node:module'
import { pathToFileURL } from 'node:url'
import { createArticleTemplateController, createArticleTemplate } from './article-template.mjs'

const { activateWithApi } = createRequire(import.meta.url)('../.vscode/article-template-extension/extension.cjs')
const wait = () => new Promise(resolve => setTimeout(resolve, 80))

function fixture(t, { enabled = true } = {}) {
  const root = fs.realpathSync(fs.mkdtempSync(path.join(os.tmpdir(), 'gaga-extension-')))
  fs.mkdirSync(path.join(root, 'scripts'))
  fs.writeFileSync(path.join(root, 'scripts/article-template.mjs'), '')
  const uri = file => ({ scheme: 'file', fsPath: file, toString: () => pathToFileURL(file).href })
  const folder = { uri: uri(root) }
  const callbacks = {}
  const events = {}
  const register = (map, name) => callback => { map[name] = callback; return { dispose() { delete map[name] } } }
  const context = { subscriptions: [] }
  const lines = []
  let stoppedTemplate = 0
  let stoppedOther = 0
  let shown = false
  const api = {
    StatusBarAlignment: { Right: 2 },
    RelativePattern: class {},
    window: {
      createOutputChannel: () => ({ appendLine: line => lines.push(line), show() {}, dispose() {} }),
      createStatusBarItem: () => ({ show() { shown = true }, hide() { shown = false }, dispose() {} }),
      showErrorMessage: message => { throw new Error(message) },
      showInformationMessage() {}
    },
    workspace: {
      isTrusted: true,
      workspaceFolders: [folder],
      textDocuments: [],
      getConfiguration: () => ({ get: () => enabled }),
      getWorkspaceFolder: value => value.fsPath.startsWith(root + path.sep) ? folder : undefined,
      createFileSystemWatcher: () => ({
        onDidCreate: register(events, 'create'),
        onDidChange: register(events, 'change'),
        onDidDelete: register(events, 'delete'),
        dispose() { for (const name of Object.keys(events)) delete events[name] }
      }),
      onDidCreateFiles: register(callbacks, 'create'),
      onDidDeleteFiles: register(callbacks, 'delete'),
      onDidOpenTextDocument: register(callbacks, 'open'),
      onDidSaveTextDocument: register(callbacks, 'save'),
      onDidChangeWorkspaceFolders: register(callbacks, 'folders'),
      onDidChangeConfiguration: register(callbacks, 'config')
    },
    commands: { registerCommand: () => ({ dispose() {} }) },
    tasks: { taskExecutions: [
      { task: { name: '自动生成新文章模板', scope: folder }, terminate() { stoppedTemplate++ } },
      { task: { name: '网页预览', scope: folder }, terminate() { stoppedOther++ } }
    ] }
  }
  t.after(() => {
    for (const item of context.subscriptions.reverse()) item.dispose()
    fs.rmSync(root, { recursive: true, force: true })
  })
  const file = (name, content = '') => {
    const target = path.join(root, name)
    fs.mkdirSync(path.dirname(target), { recursive: true })
    fs.writeFileSync(target, content)
    return uri(target)
  }
  const activate = () => activateWithApi(api, context, async () => ({
    createArticleTemplateController: options => createArticleTemplateController({ ...options, settleMs: 25 }),
    createArticleTemplate
  }))
  return { root, api, callbacks, events, file, activate, lines, stopped: () => [stoppedTemplate, stoppedOther], shown: () => shown }
}

test('编辑器事件生成新文章，同名重建也生成，旧文章保持原样', async t => {
  const f = fixture(t)
  const old = f.file('diary/old.md')
  await f.activate()
  assert.equal(f.shown(), true)
  assert.deepEqual(f.stopped(), [1, 0])
  const article = f.file('diary/go总结.md')
  f.callbacks.create({ files: [article] })
  f.events.create(article)
  await wait()
  assert.match(fs.readFileSync(article.fsPath, 'utf8'), /title: "go总结"/)
  assert.equal(fs.readFileSync(old.fsPath, 'utf8'), '')
  fs.unlinkSync(article.fsPath)
  f.callbacks.delete({ files: [article] })
  f.file('diary/go总结.md')
  f.events.create(article)
  await wait()
  assert.match(fs.readFileSync(article.fsPath, 'utf8'), /title: "go总结"/)
  assert.equal(f.lines.filter(line => line.includes('已填入模板')).length, 2)
})

test('编辑器有未保存正文或空白时，空磁盘文件不会被模板写入', async t => {
  const f = fixture(t)
  await f.activate()
  const article = f.file('diary/unsaved.md')
  f.callbacks.create({ files: [article] })
  f.api.workspace.textDocuments.push({ uri: article, isDirty: true, getText: () => '# 刚输入的正文' })
  await wait()
  assert.equal(fs.readFileSync(article.fsPath, 'utf8'), '')
  const blank = f.file('diary/dirty-blank.md')
  f.api.workspace.textDocuments.push({ uri: blank, isDirty: true, getText: () => '' })
  f.events.create(blank)
  await wait()
  assert.equal(fs.readFileSync(blank.fsPath, 'utf8'), '')
})

test('未启用的项目不监听文件，不停止任务，不显示模板状态', async t => {
  const f = fixture(t, { enabled: false })
  await f.activate()
  assert.equal(f.shown(), false)
  assert.deepEqual(f.stopped(), [0, 0])
  assert.equal(f.events.create, undefined)
  const article = f.file('other.md')
  f.callbacks.create({ files: [article] })
  await wait()
  assert.equal(fs.readFileSync(article.fsPath, 'utf8'), '')
})

test('编辑器打开或保存新文件时，补上文件系统漏报的创建事件', async t => {
  const f = fixture(t)
  await f.activate()
  const opened = f.file('opened.md')
  f.callbacks.open({ uri: opened })
  const saved = f.file('saved.md')
  f.callbacks.save({ uri: saved })
  await wait()
  assert.match(fs.readFileSync(opened.fsPath, 'utf8'), /title: "opened"/)
  assert.match(fs.readFileSync(saved.fsPath, 'utf8'), /title: "saved"/)
})
