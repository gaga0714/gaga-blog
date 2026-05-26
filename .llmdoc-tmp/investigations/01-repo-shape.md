# Repository Shape Investigation: gaga-blog

## Doc Reads

No existing llmdoc structure was found at investigation time.

## Code Sections

### Configuration & Entry Points

- `/package.json`: VitePress 1.6.3 project with three npm scripts: `docs:dev`, `docs:build`, `docs:preview`. Dependencies include `gray-matter` for frontmatter parsing and `markdown-it` for markdown processing.

- `/.vitepress/config.mjs`: Main VitePress configuration defining site structure, navigation, sidebar generation, custom plugins, and transformPageData hooks. Includes a custom `diaryListPlugin` that generates `/public/diary-articles.json` from diary markdown files with metadata extraction.

- `/index.md`: Homepage with hero layout, featuring navigation to diary and todo sections, personal info about the author (HDU student, frontend/backend/algorithms focus).

### Content Directories

- `/diary/` (58 markdown files): Personal blog posts ("胡言乱语"). Uses frontmatter with `created` and `updated` timestamps. Supports password-protected posts via `<PasswordProtect>` component. Has custom index page rendering `<DiaryList>` component. Files sorted by creation time (newest first).

- `/algorithm/` (113 markdown files): Algorithm practice problems, primarily LeetCode solutions organized by category (双指针, 链表, 二叉树, dp, 哈希, 图论, 贪心, etc.). Includes JavaScript-specific problems (js-*.md).

- `/damn/` (156 markdown files across 9 subdirectories): Frontend interview preparation content ("八股文"). Subdirectories: `html/`, `css/`, `javascript/`, `vue3/`, `react/`, `network/`, `engineering/`, `ts/`, `backend/`, `面试复盘/`. Each subdirectory has an `index.md` and topical articles.

- `/inter_code/` (19 markdown files): Hand-written code implementations for interviews ("手撕代码"). Files sorted by creation time (newest first).

- `/todo/` (41 files): Personal notes, daily logs (dated YYYYMMDD.md format), utility scripts, and miscellaneous documentation. Password-protected section with session-based authentication check in Layout.vue.

- `/IFC/` (11 files): IFC (Industry Foundation Classes) related work including Python scripts, .ifc files, JSON data, and summary documents about MAAS platform and backend work.

- `/重构/` (1 file): Refactoring plans and notes.

### Theme & Components

- `/.vitepress/theme/index.js`: Custom theme extending VitePress DefaultTheme. Registers global components: `PasswordProtect`, `DiaryList`, `DiaryEditor`. Applies copy-code fix and custom CSS.

- `/.vitepress/theme/Layout.vue`: Custom layout wrapper adding diary-specific components (`DiaryPageFooter`, `DiaryActions`), UI enhancements (`BackToTop`, `MouseEffect`, `ScrollFx`, `ResizableSidebar`, `SidebarToggle`), and todo authentication guard.

- `/.vitepress/theme/components/`: 10 Vue components including password protection, diary list/editor, UI effects, and navigation helpers.

- `/.vitepress/theme/composables/`: Composables for copy-code functionality and diary authentication.

- `/.vitepress/theme/custom.css`: Custom styling.

### Utilities & Automation

- `/utils/auto_sidebar.mjs`: Automatic sidebar generation from directory structure. Reads directories, filters whitelisted items, recursively builds sidebar config. Special handling for `/diary/` and `/inter_code/` to sort by file creation time (newest first).

- `/utils/add_password_to_todo.mjs` & `.js`: Utilities for adding password protection to todo articles.

- `/scripts/migrate-diary.mjs`: Migration script for diary content.

### Backend Server

- `/server/index.mjs`: Express.js API server for diary CRUD operations. Endpoints: `/api/login`, `/api/articles` (POST/GET/PUT/DELETE), `/api/upload` (image upload), `/api/health`. Uses JWT authentication, integrates with git to commit and push changes to GitHub, triggering CI/CD rebuild.

- `/server/git.mjs`: Git operations wrapper using `simple-git` for sync, commit, and push.

- `/server/auth.mjs`: JWT token signing and verification middleware.

- `/server/ecosystem.config.cjs`: PM2 process manager configuration.

- `/server/package.json`: Server dependencies including express, cors, multer, jsonwebtoken, simple-git, gray-matter.

- `/server/README.md`: Deployment documentation for setting up the backend on a server with SSH keys, PM2, and nginx reverse proxy.

### CI/CD & Deployment

- `/.github/workflows/toserver.yml`: GitHub Actions workflow triggered on push to main. Steps: checkout, install deps, build VitePress, deploy to Alibaba Cloud server via SSH/SCP, restart nginx, conditionally sync and restart backend server if `/server/**` files changed.

### Static Assets

- `/public/`: Contains `bg-page.png` (background image), `public_avatar.png`, `diary-articles.json` (generated), `covers/` (diary cover images), `daily-log.md`.

- `/assets/`: Static resources referenced by markdown files.

## Report

### Conclusions

1. **Project Type**: VitePress 1.6.3-based personal blog and knowledge base for a computer science student at HDU.

2. **Primary Content Categories**:
   - Personal diary/blog (58 posts in `/diary/`)
   - Algorithm practice (113 problems in `/algorithm/`)
   - Frontend interview prep (156 articles in `/damn/`)
   - Code implementations (19 in `/inter_code/`)
   - Personal notes and todos (41 files in `/todo/`)
   - IFC/work-related content (11 files in `/IFC/`)

3. **Development Entry Points**:
   - `npm run docs:dev` - Start VitePress dev server (port default 5173)
   - `npm run docs:build` - Build static site to `.vitepress/dist/`
   - `npm run docs:preview` - Preview production build

4. **Backend Server Entry Points**:
   - `cd server && npm start` - Start Express API server (port 3001)
   - `cd server && npm run dev` - Start with watch mode
   - Managed via PM2 in production: `pm2 start ecosystem.config.cjs`

5. **Content Discovery Mechanism**:
   - Sidebar auto-generated by `/utils/auto_sidebar.mjs` reading directory structure
   - Diary articles indexed via custom Vite plugin (`diaryListPlugin`) that generates `/public/diary-articles.json`
   - Navigation defined in `/.vitepress/config.mjs` with nested dropdown menus
   - Special sorting: `/diary/` and `/inter_code/` sorted by file creation time (newest first)

6. **Special Features**:
   - Password-protected articles via `<PasswordProtect>` component
   - Online diary editor at `/diary/edit` with JWT authentication
   - Image upload to `/public/diary-images/{year}/`
   - Git-backed publishing: backend commits and pushes to GitHub, triggering CI/CD
   - Custom UI enhancements: mouse effects, scroll effects, resizable sidebar, back-to-top button

7. **Deployment Architecture**:
   - Frontend: Static site built by VitePress, deployed to Alibaba Cloud server at `/home/html/gaga-blog/`
   - Backend: Express server at `/srv/blog-repo/server/`, reverse-proxied via nginx at `/api/`
   - CI/CD: GitHub Actions workflow deploys on push to main branch
   - Production URL: http://121.43.140.40/

### Relations

**Configuration Layer**:
- `/.vitepress/config.mjs` imports `/utils/auto_sidebar.mjs` for sidebar generation
- `/.vitepress/config.mjs` defines `diaryListPlugin` that reads `/diary/*.md` and writes `/public/diary-articles.json`
- `/.vitepress/config.mjs` uses `gray-matter` to parse frontmatter from markdown files

**Theme Layer**:
- `/.vitepress/theme/index.js` extends VitePress DefaultTheme and registers custom components
- `/.vitepress/theme/Layout.vue` wraps DefaultTheme.Layout with custom slots and authentication guards
- Components in `/.vitepress/theme/components/` are registered globally or used in Layout

**Content Layer**:
- `/diary/index.md` renders `<DiaryList>` component which fetches `/public/diary-articles.json`
- Each content directory (`/damn/html/`, `/damn/css/`, etc.) has `index.md` and sidebar auto-generated
- Markdown files can include `<PasswordProtect>` component for access control

**Backend Layer**:
- `/server/index.mjs` imports `auth.mjs` for JWT middleware and `git.mjs` for repository operations
- Backend operates on repository at `REPO_PATH` (env var), committing to `/diary/*.md` files
- Image uploads go to `/public/diary-images/{year}/` and are committed to git

**Deployment Layer**:
- `/.github/workflows/toserver.yml` builds VitePress and deploys to server
- Workflow conditionally restarts backend if `/server/**` files changed
- Backend uses PM2 for process management, configured via `/server/ecosystem.config.cjs`

### Gaps

1. **Missing Documentation**:
   - No llmdoc structure exists yet
   - No architecture documentation for the diary publishing workflow
   - No component API documentation for custom Vue components
   - No guide for adding new content categories beyond existing ones

2. **Unclear Conventions**:
   - Naming convention for algorithm files (e.g., "双指针04-hot-042.接雨水.md") not documented
   - Frontmatter schema for different content types not specified
   - Password protection mechanism for todo section vs diary articles differs (session-based vs component-based)

3. **Configuration Details**:
   - Environment variables for backend server documented in `/server/README.md` but no `.env.example` file found
   - API proxy target in `/.vitepress/config.mjs` defaults to `http://gaga0714.top` but can be overridden via `API_PROXY_TARGET` env var
   - Deployment secrets (`SSH_HOST`, `SSH_USER`, `SSH_KEY`) referenced in workflow but not documented

4. **Build Artifacts**:
   - `/.vitepress/dist/` (build output) not in repository
   - `/.vitepress/cache/` (VitePress cache) not in repository
   - `/public/diary-articles.json` generated at build time, unclear if committed

5. **Unused/Legacy Code**:
   - `/重构/` directory has only one file, purpose unclear
   - `/IFC/` appears to be work-related content, relationship to blog unclear
   - `/utils/add_password_to_todo.js` and `.mjs` both exist, unclear which is canonical
   - `/markdown-examples.md` and `/api-examples.md` at root appear to be VitePress scaffolding examples

### Result

**Repository Shape Summary**:

This is a VitePress-based personal blog and knowledge management system with the following characteristics:

**Entry Points**:
- Development: `npm run docs:dev` (VitePress dev server)
- Build: `npm run docs:build` (static site generation)
- Backend: `cd server && npm start` (Express API for diary publishing)

**Content Organization**:
- `/diary/` - Personal blog posts (58 files, sorted newest first)
- `/algorithm/` - LeetCode solutions (113 files, categorized by topic)
- `/damn/` - Frontend interview prep (156 files across 9 subdirectories)
- `/inter_code/` - Interview code implementations (19 files, sorted newest first)
- `/todo/` - Personal notes and daily logs (41 files, password-protected)
- `/IFC/` - Work-related IFC content (11 files)
- `/重构/` - Refactoring notes (1 file)

**Key Configuration Files**:
- `/.vitepress/config.mjs` - Site config, navigation, sidebar, plugins
- `/utils/auto_sidebar.mjs` - Automatic sidebar generation from directory structure
- `/server/index.mjs` - Backend API for diary CRUD operations
- `/.github/workflows/toserver.yml` - CI/CD deployment to Alibaba Cloud

**Content Discovery**:
- Sidebar auto-generated from directory structure via `set_sidebar()` function
- Diary articles indexed in `/public/diary-articles.json` by custom Vite plugin
- Navigation menu defined in config with nested dropdowns for `/damn/` categories

**Special Features**:
- Git-backed publishing: backend commits to repo and pushes to GitHub
- Password-protected content via `<PasswordProtect>` component
- Online diary editor with JWT authentication
- Custom theme with UI enhancements (mouse effects, resizable sidebar, etc.)
- Image upload to `/public/diary-images/{year}/`

**Deployment**:
- Frontend: Static site deployed to Alibaba Cloud server via GitHub Actions
- Backend: Express server on same server, reverse-proxied via nginx
- Production URL: http://121.43.140.40/
