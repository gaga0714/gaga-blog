---
title: vitepress生成静态网站
created: '2025-04-19T23:39:23+08:00'
updated: '2025-04-20T01:31:34+08:00'
---
# vitepress生成静态网站

呃呃最开始想记点东西，干脆写个静态网站好了🥵

## 资源库
首先放上仓库地址：https://github.com/vuejs/vitepress

然后是官网地址：https://vitepress.dev/

视频：【手把手教你使用vitepress搭建并部署一个自己的知识库（无需服务器）】 https://www.bilibili.com/video/BV1XW4y1w7bc/?share_source=copy_web&vd_source=c7a8c2728d5ed02cdd74fed0dbaa1168

20250420 报告重构完毕！
## 快速开始
看别人都是fork了仓库项目，嗯嗯我也这样干了，然后就没有然后了...

所以为什么呢？

别管了，按官网教程造一造先

安装： `pnpm add -D vitepress`

创建项目： `pnpm vitepress init`

```
┌  Welcome to VitePress!
│
◇  Where should VitePress initialize the config?
│  ./docs
│
◇  Where should VitePress look for your markdown files?
│  ./docs
│
◇  Site title:
│  My Awesome Project
│
◇  Site description:
│  A VitePress Site
│
◇  Theme:
│  Default Theme
│
◇  Use TypeScript for config and theme files?
│  Yes
│
◇  Add VitePress npm scripts to package.json?
│  Yes
│
◇  Add a prefix for VitePress npm scripts?
│  Yes
│
◇  Prefix for VitePress npm scripts:
│  docs
│
└  Done! Now run pnpm run docs:dev and start writing.
```

运行： `pnpm run docs:dev`

