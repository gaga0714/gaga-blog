const fs = require('node:fs')
const path = require('node:path')
const { pathToFileURL } = require('node:url')

async function activateWithApi(vscode, context, loadModule = file => import(pathToFileURL(file).href)) {
  const output = vscode.window.createOutputChannel('博客文章模板')
  const status = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Right, 10)
  const controllers = new Map()
  let revision = 0
  let disposed = false
  status.text = '$(file-add) 文章模板'
  status.tooltip = '新建空 Markdown 文件后自动生成模板；点击查看日志。'
  status.command = 'gagaBlog.articleTemplates.showOutput'
  context.subscriptions.push(output, status)
  const logger = {
    info: message => output.appendLine(message),
    warn: message => output.appendLine(message),
    error: message => output.appendLine(message)
  }

  function recordFor(uri) {
    if (uri.scheme !== 'file') return undefined
    const folder = vscode.workspace.getWorkspaceFolder(uri)
    return folder && controllers.get(folder.uri.toString())
  }

  function notice(uri) {
    recordFor(uri)?.controller.notice(uri.fsPath)
  }

  function stopControllers() {
    for (const record of controllers.values()) {
      record.controller.close()
      record.watcher.dispose()
    }
    controllers.clear()
    status.hide()
  }

  async function refresh() {
    const currentRevision = ++revision
    stopControllers()
    if (!vscode.workspace.isTrusted || disposed) return
    for (const folder of vscode.workspace.workspaceFolders || []) {
      if (folder.uri.scheme !== 'file' || !vscode.workspace.getConfiguration('gagaBlog.articleTemplates', folder.uri).get('enabled', false)) continue
      let watcher
      try {
        const root = fs.realpathSync(folder.uri.fsPath)
        const modulePath = path.join(root, 'scripts/article-template.mjs')
        if (fs.realpathSync(modulePath) !== modulePath) throw new Error('模板脚本不能是软链接。')
        const templateModule = await loadModule(modulePath)
        if (disposed || currentRevision !== revision) return
        watcher = vscode.workspace.createFileSystemWatcher(new vscode.RelativePattern(folder, '**/*.md'))
        const controller = templateModule.createArticleTemplateController({
          root,
          scanIntervalMs: 0,
          logger,
          canFill: filePath => !vscode.workspace.textDocuments.some(document =>
            document.uri.scheme === 'file' && path.resolve(document.uri.fsPath) === filePath &&
            (document.isDirty || document.getText().length !== 0))
        })
        const record = { controller, watcher, templateModule }
        controllers.set(folder.uri.toString(), record)
        watcher.onDidCreate(uri => controller.notice(uri.fsPath))
        watcher.onDidChange(uri => controller.notice(uri.fsPath))
        watcher.onDidDelete(uri => controller.remove(uri.fsPath))
        controller.notice(root)
        logger.info(`[article-template] 编辑器内模板已启用：${root}`)
        status.show()
      } catch (error) {
        watcher?.dispose()
        logger.error(`[article-template] 无法启用：${error.message}`)
        vscode.window.showErrorMessage(`文章模板未启用：${error.message}`)
      }
    }
    // 从终端任务切换到扩展时，结束此项目的旧模板任务。
    for (const execution of vscode.tasks.taskExecutions) {
      if (execution.task.name === '自动生成新文章模板' && execution.task.scope?.uri && controllers.has(execution.task.scope.uri.toString())) {
        execution.terminate()
      }
    }
  }

  context.subscriptions.push(
    vscode.workspace.onDidCreateFiles(event => event.files.forEach(notice)),
    vscode.workspace.onDidDeleteFiles(event => event.files.forEach(uri => recordFor(uri)?.controller.remove(uri.fsPath))),
    vscode.workspace.onDidOpenTextDocument(document => notice(document.uri)),
    vscode.workspace.onDidSaveTextDocument(document => notice(document.uri)),
    vscode.workspace.onDidChangeWorkspaceFolders(() => { void refresh() }),
    vscode.workspace.onDidChangeConfiguration(event => {
      if (event.affectsConfiguration('gagaBlog.articleTemplates')) void refresh()
    }),
    vscode.commands.registerCommand('gagaBlog.articleTemplates.showOutput', () => output.show()),
    vscode.commands.registerCommand('gagaBlog.articleTemplates.fillCurrent', async () => {
      const document = vscode.window.activeTextEditor?.document
      const record = document && recordFor(document.uri)
      if (!record || !/\.md$/i.test(document.uri.fsPath) || document.getText().length !== 0 || document.isDirty) {
        vscode.window.showInformationMessage('请先打开此博客中已保存的空 Markdown 文件。')
        return
      }
      const filePath = path.resolve(document.uri.fsPath)
      const stat = fs.lstatSync(filePath)
      if (!stat.isFile() || stat.size !== 0 || fs.realpathSync(filePath) !== filePath) return
      const edit = new vscode.WorkspaceEdit()
      edit.insert(document.uri, new vscode.Position(0, 0), record.templateModule.createArticleTemplate(filePath))
      if (await vscode.workspace.applyEdit(edit)) await document.save()
    }),
    { dispose() { disposed = true; ++revision; stopControllers() } }
  )
  await refresh()
}

exports.activate = context => activateWithApi(require('vscode'), context)
exports.activateWithApi = activateWithApi
