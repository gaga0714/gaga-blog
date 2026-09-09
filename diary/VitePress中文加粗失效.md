---
title: VitePress 中文加粗（**）失效问题排查
created: '2026-09-09T10:53:06+08:00'
updated: '2026-09-09T10:53:06+08:00'
---

# VitePress 中文加粗（`**`）失效问题排查

## 问题发现

一篇笔记里写了这么一行：

```md
- AI agent：**能够通过自主规划和行动来完成目标。**具体来说：给一个复杂目标……
```

页面上加粗没生效，`**` 原样显示成了文字。而同一篇里 `**工具调用**` 这种独立成行的加粗却是正常的。

## 导致原因

VitePress 的 Markdown 走的是 markdown-it（遵循 CommonMark 规则），本项目也没有配置任何 CJK 相关插件，所以完全按 CommonMark 的「flanking（侧接）」规则来判断 `**` 能否成对。

结束的 `**` 内侧紧挨着 `。`（标点），外侧紧跟 `具`（汉字，既不是空白也不是标点）。CommonMark 规定：当结束 `**` 内侧是标点时，外侧必须是**空白或标点**才允许闭合。这里外侧是汉字 → 判定失败 → `**` 不闭合 → 加粗失效。

根子在于 CommonMark 这套规则是为「用空格分词的语言」设计的，它把汉字当成和英文字母一样的普通字符，于是「标点紧贴汉字」这个中文里极常见的组合被一刀切地拒绝了。

对比之下 `**工具调用**` 能生效，是因为结束 `**` 后面是换行（空白），满足规则。

## 解决方案

引入 `markdown-it-cjk-friendly` 插件，在 VitePress 配置里挂到 markdown-it 上。这样存量文稿一个字都不用改。

```bash
npm install markdown-it-cjk-friendly@3
```

`.vitepress/config.mjs`：

```js
import cjkFriendly from 'markdown-it-cjk-friendly'

export default defineConfig({
  markdown: {
    lineNumbers: true,
    config: (md) => {
      md.use(cjkFriendly)
    },
  },
})
```

> 注意：VitePress 的 markdown 配置在启动时读取，改完需要重启 dev server 才生效。

## 方案原理

插件的做法是**在解析层修规则**，而不是改文稿、也不是往文本里塞空格或零宽字符。

它替换了 markdown-it 内部计算 `**` 侧接性的那段逻辑（token 化后、成对匹配前的 `scanDelims` 环节），把判定改成 CJK-aware：

- 识别 CJK 汉字、假名、谚文以及全角标点（`。，、（）` 等）；
- 当 `**` 一侧是「CJK 全角标点」、另一侧是「CJK 文字」时，按中文排版直觉判定它可以成对，不再套用那条为空格分词语言设计的旧规则。

因为它只在涉及 CJK 字符时才介入，对纯英文内容行为完全不变，所以可以全站安全启用，不用逐篇去改 `**`。

对应的上游规范讨论见 [commonmark-spec#650](https://github.com/commonmark/commonmark-spec/issues/650)。
