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
