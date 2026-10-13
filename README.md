# 个人博客

基于 VitePress 构建的个人技术博客，记录前端开发学习过程。

## 技术栈

- **框架**: VitePress 1.6.3
- **前端**: Vue 3
- **样式**: CSS
- **部署**: 阿里云服务器

## 项目结构

```
├── diary/              # 胡言乱语（日记）
├── algorithm/          # 算法学习
├── damn/              # 前端知识点
├── IFC/               # IFC 相关
├── inter_code/        # 面试代码
├── todo/              # 待办事项
├── 重构/              # 重构相关
├── .vitepress/        # VitePress 配置
│   ├── config.mjs     # 站点配置
│   └── theme/         # 自定义主题
├── assets/            # 静态资源
├── public/            # 公共文件（构建时复制）
└── server/            # 后端服务（文章加密）
```

## 功能特性

- 📝 文章分类管理（日记、算法、前端知识等）
- 🔐 文章加密功能
- 📄 分页展示
- 🎨 自定义主题样式
- 🖼️ 文章封面图片
- 🔍 页码跳转

## 编写胡言乱语文章

在 `diary/` 下创建 Markdown 文件，在文件开头填写 YAML 元数据。新文章建议固定填写 `title`、`summary`、`tags`、`created` 和 `updated`。其中，`summary` 每篇都写一句话概括，说明文章讨论什么，不重复标题或直接照搬正文开头。

```markdown
---
title: Vue 3 响应式机制笔记
summary: 从依赖收集与更新触发入手，梳理 Vue 3 响应式数据的工作过程。
tags:
  - Vue 3
  - 前端
created: '2026-10-10T10:00:00+08:00'
updated: '2026-10-10T16:00:00+08:00'
---

# Vue 3 响应式机制笔记

这里开始写正文。
```

| 字段 | 写法与用途 |
| --- | --- |
| `title` | 文章标题。不填写时取正文第一个一级标题，再回退到文件名。 |
| `summary` | 作者填写的一句话概括，使用纯文本。列表中显示在标题与正文摘录之间，详情页优先显示在标题下方。缺少或留空时不显示这一行，不自动补写。 |
| `tags` | 标签数组，没有标签时写 `[]`。旧字段 `tag` 仍可使用，也兼容用中文或英文逗号分隔的字符串；同时存在时优先读取 `tags`。 |
| `created` | 首次发布的时间，建议保留 `+08:00` 时区。列表按该时间倒序排列，日期按北京时间显示。 |
| `updated` | 最近修改的时间。修改正文时更新该字段，保留原来的 `created`。 |

**一句话概括与正文摘录分开维护。** `summary` 由作者填写；正文摘录由构建过程自动生成，移除标题、图片、代码块及 Markdown 格式后，截取前 120 个字符。你不需要为自动摘录填写字段，也不需要把概括复制进正文。

旧文章可以继续使用原有写法，缺少字段不会因此导致构建失败。详情页未填写 `summary` 时，依次兼容已有的 `description` 和 `excerpt`；这两个旧字段不会替代列表中的一句话概括。缺少 `created` 时会只读文件属性作为回退；缺少 `updated` 时优先沿用已填写的 `created`。建议补齐时间，以便跨机器构建时保持一致。

含 `<PasswordProtect>` 的文章不公开显示一句话概括或正文摘录。正文开头与文章标题相同的一级标题会在详情页隐藏，后续一级标题仍保留。

## 自动填入新文章模板

本项目使用本地 VS Code 扩展“博客文章模板”，在编辑器内部为新建空 Markdown 文件生成模板。可以关闭终端里的“自动生成新文章模板”任务，也无须运行 `npm run docs:dev` 或 `npm run articles:watch`。扩展需要保持 VS Code 项目窗口打开。

首次安装扩展时，在项目根目录打包：

```bash
python3 .vscode/article-template-extension/package.py /tmp/gaga-blog-article-template.vsix
```

然后在 VS Code 扩展面板的“…”菜单中选择“从 VSIX 安装”，选中这个文件，重新加载博客窗口。也可以使用 `code --install-extension /tmp/gaga-blog-article-template.vsix` 安装。

`.vscode/settings.json` 中的 `gagaBlog.articleTemplates.enabled` 已为本项目开启。扩展只处理已启用的受信任本地项目，状态栏显示“文章模板”时表示已就绪。点击状态栏可以查看生成日志。实现使用 [VS Code 文件创建事件和文件监听接口](https://code.visualstudio.com/api/references/vscode-api#workspace)。

扩展发现新文件后等待约 600 毫秒，确认磁盘文件为空、编辑器没有未保存内容，再写入模板。`title` 取自文件名；文件名为 `index.md` 时取父目录名。`summary` 和 `tags` 是留空待填写的字段。扩展会在再次打开项目时自动启用，终端任务已改为仅手动启动。

例如，新建 `diary/阅读笔记.md` 后会得到以下内容，时间以实际创建时的北京时间为准：

```markdown
---
title: "阅读笔记"
summary: ""
tags: []
created: "2026-10-10T14:30:00+08:00"
updated: "2026-10-10T14:30:00+08:00"
---

# 阅读笔记

```

模板中的 `summary` 和 `tags` 留空，开始写作后再补充。在其他编辑器或终端中，也可以手动运行：

```bash
npm run articles:watch
```

需要网页预览时，`npm run docs:dev` 仍会启用模板生成。手动启动的命令需要保持运行，按 **Ctrl+C** 可停止。建议使用 Node.js 22 或更新版本，并确保编辑器终端能找到 `node` 命令。

扩展使用 VS Code 文件事件，不创建终端任务或独立扫描进程。开始写作后有未保存正文、甚至未保存空白时，也不会插入模板。其他编辑器中仍可使用 `npm run articles:watch`；其原生监听遇到 `EMFILE` 等错误时会退回定时扫描。

删除文章后用同名新建空文件，也会生成模板。监听器按文件身份区分新旧文件；只清空原文件、移动后恢复原文件或重命名旧文件，不会重新生成。

监听器只处理本次启动后出现的空文件，以下情况会保持原样：

- 启动前已存在的文件，包括空文件。
- 已有正文或空白字符的文件，以及等待期间已开始写入的文件。
- 已处理的同一个文件，以及移动后恢复或从旧文件重命名的文件。
- 隐藏目录、依赖目录、资源目录及生成目录中的文件，例如 `.git`、`.vitepress`、`node_modules`、`public`、`assets`、`dist` 和 `build`。
- 软链接、项目外的文件，以及既有文件的硬链接。

因此，扩展启动前已经存在的空文件不会自动补写。可以打开这个空文件，在命令面板执行“博客：为当前空文章补模板”。

该功能不会批量补齐旧文章，也不会在后续保存时修改文章时间。需要验证模板与文章元数据处理时，运行 `npm run test:articles`。

## 开发

```bash
# 安装依赖
npm install

# 启动开发服务器
npm run docs:dev

# 构建生产版本
npm run docs:build

# 预览构建结果
npm run docs:preview
```

## 部署

- **生产环境**: http://121.43.140.40/
- **旧版本（已停用）**: https://gaga-blog.vercel.app/

## 内容参考

- https://vue3js.cn/interview
- https://github.com/camera-2018/frontend-interview
