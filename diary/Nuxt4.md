# Nuxt4项目目录结构
```
my-nuxt-app/
├── .nuxt/               # Nuxt 生成的临时构建目录（自动生成，不用手动编辑）
├── assets/              # 用于放置未编译的资源文件（如 SCSS、图片）
├── components/          # Vue 组件目录（自动引入）
├── composables/         # 组合式 API（自动引入）
├── content/             # 用于存放 Markdown 内容（仅在使用 @nuxt/content 模块时）
├── layouts/             # 页面布局（如 default.vue、error.vue）
├── middleware/          # 中间件函数，用于页面导航守卫
├── modules/             # 自定义 Nuxt 模块
├── pages/               # 页面目录，对应路由（基于文件系统路由）
├── plugins/             # 插件（客户端/服务端插件）
├── public/              # 静态资源目录（不经过打包，直接映射到网站根路径）
├── server/              # 后端 API 逻辑（支持 server/api、server/middleware 等）
│   ├── api/             # API 路由
│   └── middleware/      # Server 中间件
├── app.vue              # 应用根组件（可选，Nuxt 会自动识别）
├── nuxt.config.ts       # Nuxt 配置文件（核心配置）
├── package.json         # 项目信息 & 依赖
└── tsconfig.json        # TypeScript 配置（若使用 TS）

```