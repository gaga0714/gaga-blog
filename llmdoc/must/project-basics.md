# Project Basics

## Identity

VitePress-based personal blog and knowledge management system for a computer science student at HDU. Combines static site generation with a git-backed CMS backend for dynamic content management.

## Tech Stack

**Frontend:**
- VitePress 1.6.3 (Vue 3, Vite)
- Custom theme extending DefaultTheme
- gray-matter for frontmatter parsing
- markdown-it for rendering

**Backend:**
- Express.js (ESM)
- JWT authentication
- simple-git for repository operations
- multer for file uploads
- PM2 for process management

**Deployment:**
- GitHub Actions CI/CD
- Aliyun server (121.43.140.40)
- Nginx for static serving and reverse proxy

## Content Organization

Seven main categories:

1. **diary** (58 posts) - Personal blog with rich metadata, covers, CRUD via API
2. **algorithm** (113 files) - LeetCode solutions organized by topic
3. **damn** (156 files, 9 subdirs) - Frontend interview prep (HTML, CSS, JS, Vue3, React, Network, Engineering, TS, Backend, 面试复盘)
4. **inter_code** (19 files) - Hand-written code implementations
5. **todo** (41 files) - Password-protected personal notes
6. **IFC** (11 files) - Work-related IFC content
7. **重构** (1 file) - Refactoring notes

## Key File Locations

**Configuration:**
- `.vitepress/config.mjs` - Site config, nav, sidebar, plugins
- `utils/auto_sidebar.mjs` - Auto-generates sidebar from filesystem
- `server/index.mjs` - Backend API server
- `server/ecosystem.config.cjs` - PM2 configuration

**Theme:**
- `.vitepress/theme/index.js` - Theme entry point
- `.vitepress/theme/Layout.vue` - Custom layout wrapper
- `.vitepress/theme/custom.css` - Brand styling
- `.vitepress/theme/components/` - Custom Vue components

**Content:**
- `diary/*.md` - Blog posts with frontmatter
- `public/diary-articles.json` - Generated article index
- `public/covers/` - Article cover images (build-time)
- `public/diary-images/` - User uploads (runtime)

## Development Commands

**Frontend:**
```bash
npm run docs:dev      # Dev server with HMR
npm run docs:build    # Build to .vitepress/dist/
npm run docs:preview  # Preview production build
```

**Backend:**
```bash
cd server
npm start            # Production mode
npm run dev          # Watch mode
```

**Production:**
```bash
pm2 start server/ecosystem.config.cjs
pm2 logs gaga-blog-server
```

## Content Publishing Flow

1. User edits article via `/diary/edit` (authenticated)
2. Backend commits to git and pushes to GitHub
3. GitHub Actions rebuilds and deploys
4. Changes live in ~1-2 minutes
