# Deployment Reference

## GitHub Actions CI/CD

**Workflow:** `.github/workflows/toserver.yml`
**Trigger:** Push to `main` branch

### Pipeline Steps

1. **Checkout** code
2. **Install** dependencies with `npm ci`
3. **Build** VitePress with `npm run docs:build`
4. **Stage** build output: copy `.vitepress/dist/*` to `deploy/` directory
5. **Deploy frontend:**
   - SSH to server, clear `/home/html/gaga-blog/*`
   - SCP upload `deploy/**` to `/home/html/gaga-blog/` (strip_components: 1)
   - Restart Nginx
6. **Detect backend changes:** `dorny/paths-filter@v3` checks if `server/**` files changed
7. **Deploy backend (conditional):**
   - SSH to `/srv/blog-repo`
   - `git fetch && git reset --hard origin/main`
   - `npm ci --omit=dev` in server/ directory
   - `pm2 restart gaga-blog-server --update-env`
   - `pm2 save`

### Required Secrets

- `SSH_HOST` - Server IP/hostname
- `SSH_USER` - SSH username
- `SSH_KEY` - SSH private key

### GitHub Actions Dependencies

- `appleboy/ssh-action` - Remote SSH commands
- `appleboy/scp-action` - File transfer
- `dorny/paths-filter@v3` - Conditional step detection

## Production Server: Aliyun

**IP:** 121.43.140.40
**Domain:** gaga0714.top

### Nginx Configuration

- Serves static files from `/home/html/gaga-blog/`
- Reverse proxies `/api/*` to `http://127.0.0.1:3001`
- Nginx config not in repo (managed on server)

### PM2 Process Management

Configuration in `server/ecosystem.config.cjs`:
- App name: `gaga-blog-server`
- Entry: `index.mjs`
- Single instance
- Memory limit: 300MB
- Auto-restart enabled
- `NODE_ENV=production`

**Common PM2 commands:**
```bash
pm2 start ecosystem.config.cjs    # Start
pm2 restart gaga-blog-server      # Restart
pm2 logs gaga-blog-server         # View logs
pm2 save                          # Persist state
```

### Server Filesystem

```
/home/html/gaga-blog/      # Static site (Nginx document root)
/srv/blog-repo/             # Git clone (backend repo)
  └── server/
      ├── .env              # Environment secrets
      └── ecosystem.config.cjs
```

### SSH Configuration

Server uses custom SSH host alias (`github.com-blog`) with a dedicated deploy key for push access to the GitHub repository.

## Build Process Detail

1. VitePress reads `.vitepress/config.mjs`
2. `diaryListPlugin()` scans `diary/*.md`, generates `public/diary-articles.json` and copies covers to `public/covers/`
3. `auto_sidebar.mjs` generates sidebar config from filesystem
4. VitePress compiles markdown to static HTML/CSS/JS in `.vitepress/dist/`
5. Build output is self-contained; all assets bundled or in `public/`

### Build Artifacts (gitignored)

- `.vitepress/dist/` - Full static site output
- `.vitepress/cache/` - VitePress build cache
- `public/diary-articles.json` - Generated article index
- `public/covers/` - Copied cover images

## Environment Configuration

### Frontend (`.vitepress/config.mjs`)

- `API_PROXY_TARGET` - Dev proxy target (default: `http://gaga0714.top`)

### Backend (`server/.env`)

See `server/.env.example` for template. Key variables:

| Variable | Default | Required |
|----------|---------|----------|
| `BLOG_PASSWORD` | - | Yes |
| `JWT_SECRET` | weak default | Yes (production) |
| `REPO_PATH` | - | Yes |
| `PORT` | 3001 | No |
| `GIT_USER_NAME` | - | Yes |
| `GIT_USER_EMAIL` | - | Yes |
| `GIT_BRANCH` | main | No |
| `TOKEN_TTL_HOURS` | 12 | No |

## Content Update Cycle

```
Author edits via /diary/edit
  -> Backend writes markdown, commits, pushes to GitHub
    -> GitHub Actions triggers on push to main
      -> Build VitePress, deploy to Aliyun
        -> Updated site live (~1-2 min)
```

## Gaps

- No Nginx config in repo; server setup is manual
- No SSL/HTTPS configuration documented
- No infrastructure-as-code or automated provisioning
- No backup strategy for uploads, secrets, or PM2 state
- No monitoring or error tracking
- No rollback procedure documented
- Dev environment proxies to production API by default
- Secret rotation not documented
