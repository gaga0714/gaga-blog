# Investigation: Deployment, Build Process, and Operational Aspects

## Doc Reads

No llmdoc documentation exists yet. All findings derived from source code and configuration files.

## Code Sections

### Build & Configuration

- `package.json` - Root package with VitePress build scripts (docs:dev, docs:build, docs:preview)
- `.vitepress/config.mjs` - VitePress configuration with custom diary-list plugin, proxy settings, sidebar generation
- `.vitepress/theme/index.js` - Custom theme extending VitePress default theme with custom components
- `.vitepress/theme/Layout.vue` - Custom layout wrapper
- `.vitepress/theme/custom.css` - Custom styling
- `.vitepress/theme/components/` - Custom Vue components (DiaryList, DiaryEditor, PasswordProtect, etc.)
- `utils/auto_sidebar.mjs` - Sidebar generation utility (referenced in config)

### Deployment Pipeline

- `.github/workflows/toserver.yml` - GitHub Actions workflow for automated deployment to Aliyun server
- `.gitignore` - Excludes node_modules, .vitepress/dist, .vitepress/cache, server/.env, public/diary-articles.json, public/covers/

### Backend Server (Article Management API)

- `server/package.json` - Express-based backend with dependencies: express, cors, multer, gray-matter, jsonwebtoken, simple-git
- `server/index.mjs` - Main Express server providing REST API for article CRUD and image upload
- `server/auth.mjs` - JWT-based authentication middleware
- `server/git.mjs` - Git operations wrapper using simple-git
- `server/ecosystem.config.cjs` - PM2 process manager configuration
- `server/.env.example` - Environment variable template
- `server/README.md` - Deployment instructions for server setup

### Static Assets

- `public/` - Static files copied to build output (bg-page.png, public_avatar.png, diary-articles.json, covers/)
- `assets/` - Image assets referenced in markdown files
- `public/covers/` - Article cover images (copied from assets/ during build)
- `public/diary-images/` - User-uploaded images organized by year

### Utilities

- `scripts/migrate-diary.mjs` - One-time migration script to add frontmatter (title, created, updated) to diary/*.md files

## Report

### Conclusions

**Build Process:**

1. **VitePress Static Site Generation**: The project uses VitePress 1.6.3 to build a static site from markdown files
2. **Build Command**: `npm run docs:build` compiles to `.vitepress/dist/`
3. **Custom Build Plugin**: `diaryListPlugin()` in config.mjs generates `public/diary-articles.json` during build and dev, scanning diary/*.md files for metadata
4. **Cover Image Processing**: During build, the plugin copies cover images from `assets/` to `public/covers/` and rewrites paths
5. **Frontmatter Enrichment**: `transformPageData()` hook adds formatted created/updated timestamps to page data for diary and inter_code sections

**Deployment Architecture:**

1. **Production Server**: Aliyun server at 121.43.140.40
2. **Two-Part Deployment**:
   - **Frontend (Static)**: VitePress build output served by Nginx from `/home/html/gaga-blog/`
   - **Backend (API)**: Node.js Express server managed by PM2, running from `/srv/blog-repo/server/`
3. **Deployment Trigger**: Push to `main` branch triggers GitHub Actions workflow
4. **Old Deployment**: Vercel deployment (https://gaga-blog.vercel.app/) is deprecated

**GitHub Actions Workflow (`.github/workflows/toserver.yml`):**

1. **Trigger**: Push to main branch
2. **Build Steps**:
   - Checkout code
   - Install dependencies with `npm ci`
   - Build VitePress with `npm run docs:build`
   - Copy `.vitepress/dist/*` to `deploy/` staging directory
3. **Frontend Deployment**:
   - SSH to server and clear `/home/html/gaga-blog/*`
   - SCP upload `deploy/**` to `/home/html/gaga-blog/` (strip_components: 1 removes deploy/ wrapper)
   - Restart Nginx
4. **Backend Deployment (Conditional)**:
   - Uses `dorny/paths-filter@v3` to detect changes in `server/**`
   - If backend changed:
     - SSH to server, cd to `/srv/blog-repo`
     - `git fetch` and `git reset --hard origin/main` to sync repo
     - `npm ci --omit=dev` in server/ directory
     - `pm2 restart gaga-blog-server --update-env`
     - `pm2 save` to persist PM2 state
5. **Secrets Required**: SSH_HOST, SSH_USER, SSH_KEY

**Backend Server Architecture:**

1. **Purpose**: Provides authenticated API for creating/editing/deleting diary articles and uploading images
2. **Technology**: Express.js (Node.js) with JWT authentication
3. **Port**: 3001 (configurable via PORT env var)
4. **Nginx Reverse Proxy**: `/api/*` requests proxied to `http://127.0.0.1:3001`
5. **Git Integration**: Server operates on a clone of the repo at `/srv/blog-repo`, commits changes, and pushes to GitHub to trigger CI rebuild
6. **Process Management**: PM2 with ecosystem.config.cjs (1 instance, 300M memory limit, autorestart enabled)

**Backend API Endpoints:**

- `POST /api/login` - Password authentication, returns JWT token
- `GET /api/me` - Verify token validity
- `POST /api/articles` - Create new diary article (generates slug, writes to diary/, commits & pushes)
- `GET /api/articles/:slug` - Fetch article for editing
- `PUT /api/articles/:slug` - Update article (preserves created timestamp, updates updated timestamp)
- `DELETE /api/articles/:slug` - Delete article
- `POST /api/upload` - Upload image (stores in public/diary-images/{year}/, commits & pushes immediately)
- `GET /api/health` - Health check endpoint

**Backend Git Workflow:**

1. **Serialized Operations**: Uses promise queue to prevent concurrent git operations
2. **Before Each Write**: `ensureSync()` fetches and hard resets to `origin/main`
3. **After Each Write**: `commitAndPush()` stages all changes, commits with descriptive message, pushes to origin
4. **Commit Messages**: `post: {title}`, `edit: {title}`, `delete: {slug}`, `upload: {filename}`
5. **Git Config**: Sets user.name and user.email from env vars (GIT_USER_NAME, GIT_USER_EMAIL)

**Environment Configuration:**

Backend requires `.env` file with:
- `BLOG_PASSWORD` - Frontend login password
- `JWT_SECRET` - Token signing key (should be long random string)
- `REPO_PATH` - Absolute path to cloned repo on server (e.g., `/srv/blog-repo`)
- `PORT` - Server port (default 3001)
- `GIT_USER_NAME` / `GIT_USER_EMAIL` - Git commit identity
- `GIT_BRANCH` - Branch name (default main)
- `TOKEN_TTL_HOURS` - JWT expiration (default 12)

**Static Asset Handling:**

1. **Build-Time Assets**:
   - `public/` directory contents copied to dist root during build
   - `assets/` images referenced in markdown, bundled by VitePress
   - Cover images copied from assets/ to public/covers/ by diaryListPlugin
2. **Runtime Assets**:
   - User uploads go to `public/diary-images/{year}/` via backend API
   - Immediately committed and pushed to trigger rebuild
3. **Ignored Files**:
   - `public/diary-articles.json` (generated during build)
   - `public/covers/` (generated during build)
   - Both regenerated on each build, not committed to git

**Git Workflow:**

1. **Repository**: git@github.com:gaga0714/gaga-blog.git
2. **Main Branch**: `main`
3. **Server Setup**: Server uses SSH deploy key with write access to push changes
4. **SSH Config**: Server uses custom SSH host alias (github.com-blog) to use dedicated deploy key
5. **Deployment Loop**:
   - User edits article via frontend → Backend commits & pushes to GitHub
   - GitHub Actions triggered → Builds and deploys to server
   - New content visible after ~1-2 minutes

**Development Workflow:**

1. **Local Dev**: `npm run docs:dev` starts VitePress dev server with HMR
2. **API Proxy**: Vite dev server proxies `/api` to `process.env.API_PROXY_TARGET || 'http://gaga0714.top'`
3. **Local Backend**: Can run backend locally with `npm run dev` in server/ (requires local test repo clone)
4. **Build Preview**: `npm run docs:preview` serves production build locally

### Relations

**Build Pipeline Flow:**
```
Source Files (diary/*.md, damn/, etc.)
  ↓
VitePress Build (config.mjs)
  ↓ (diaryListPlugin)
Generate diary-articles.json + copy covers
  ↓
.vitepress/dist/
  ↓ (GitHub Actions)
Aliyun Server /home/html/gaga-blog/
  ↓ (Nginx)
Public HTTP Access (121.43.140.40)
```

**Content Update Flow:**
```
Frontend Editor (diary/edit.md)
  ↓ (POST /api/articles)
Backend Server (server/index.mjs)
  ↓ (git commit & push)
GitHub Repository
  ↓ (GitHub Actions trigger)
Build & Deploy
  ↓
Updated Site Live
```

**Component Dependencies:**
- VitePress config depends on: gray-matter, markdown-it, utils/auto_sidebar.mjs
- Backend depends on: express, cors, multer, gray-matter, jsonwebtoken, simple-git, dotenv
- GitHub Actions depends on: appleboy/ssh-action, appleboy/scp-action, dorny/paths-filter
- PM2 manages backend process lifecycle
- Nginx serves static files and reverse proxies API requests

**File System Layout on Server:**
```
/home/html/gaga-blog/          # Static site files (Nginx document root)
  ├── index.html
  ├── assets/
  ├── diary/
  ├── public/
  └── ...

/srv/blog-repo/                # Git repository clone
  ├── diary/                   # Markdown source files
  ├── server/                  # Backend application
  │   ├── index.mjs
  │   ├── .env                 # Environment secrets
  │   └── node_modules/
  ├── public/
  │   └── diary-images/        # User uploads
  └── ...
```

### Gaps

1. **Nginx Configuration**: No nginx config file found in repo. Actual server nginx configuration not visible (likely in `/etc/nginx/conf.d/` or `/etc/nginx/sites-enabled/` on server)

2. **SSL/HTTPS Setup**: README mentions production URL uses HTTP (121.43.140.40), but no SSL certificate configuration visible. Unclear if HTTPS is configured on server.

3. **Server Provisioning**: No infrastructure-as-code or server setup automation. Server setup is manual following server/README.md instructions.

4. **Backup Strategy**: No documented backup strategy for:
   - User-uploaded images in public/diary-images/
   - Server .env secrets
   - PM2 process state

5. **Monitoring**: No application monitoring, error tracking, or uptime monitoring configured in codebase.

6. **Rate Limiting**: Backend API has no rate limiting or abuse prevention beyond JWT authentication.

7. **Image Optimization**: Uploaded images are stored as-is without compression or optimization.

8. **Build Artifacts**: `.vitepress/dist/` exists in local workspace (stale build output), but correctly excluded from git.

9. **Domain Configuration**: README mentions domain `gaga0714.top` in API proxy config, but relationship to IP 121.43.140.40 unclear. No DNS configuration documented.

10. **Rollback Strategy**: No documented rollback procedure if deployment fails or introduces bugs.

11. **Environment Parity**: Dev environment uses proxy to production API by default, not local backend. Could cause confusion during development.

12. **Secret Management**: GitHub Actions secrets (SSH_HOST, SSH_USER, SSH_KEY) and server .env file managed manually, no secret rotation strategy.

### Result

**Deployment Process Summary:**

The gaga-blog project uses a **two-tier deployment architecture** on an Aliyun server (121.43.140.40):

1. **Static Frontend**: VitePress builds markdown content to static HTML/CSS/JS, deployed to `/home/html/gaga-blog/` and served by Nginx
2. **Dynamic Backend**: Express.js API server running on port 3001 via PM2, providing authenticated article management

**Build Process:**
- VitePress compiles markdown to static site
- Custom plugin generates diary article index (diary-articles.json) and processes cover images
- Output: `.vitepress/dist/` directory with complete static site

**Deployment Trigger:**
- Push to `main` branch triggers GitHub Actions workflow
- Workflow builds site, uploads to server via SSH/SCP, restarts Nginx
- If server/ directory changed, also syncs backend code and restarts PM2 process

**Operational Flow:**
1. Content authors use frontend editor at `/diary/edit`
2. Backend API commits changes to git and pushes to GitHub
3. GitHub Actions automatically rebuilds and redeploys
4. Changes live in ~1-2 minutes

**Key Technologies:**
- **Build**: VitePress 1.6.3, Vue 3, gray-matter
- **Backend**: Express, JWT auth, simple-git, multer
- **Deployment**: GitHub Actions, SSH/SCP, PM2, Nginx
- **Server**: Aliyun (121.43.140.40), Ubuntu/Linux

**Configuration Files:**
- `.vitepress/config.mjs` - Build configuration
- `server/ecosystem.config.cjs` - PM2 process config
- `server/.env` - Backend secrets (not in repo)
- `.github/workflows/toserver.yml` - CI/CD pipeline

**Static Assets:**
- `public/` - Copied to build output root
- `assets/` - Bundled by VitePress
- `public/covers/` - Generated during build (not committed)
- `public/diary-images/` - User uploads (committed via backend)

The deployment is fully automated via GitHub Actions with conditional backend updates based on file changes. The backend enables a git-based CMS workflow where content changes trigger automatic rebuilds.
