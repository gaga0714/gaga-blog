# Backend CMS Architecture

## Overview

`server/index.mjs` is a lightweight Express.js (ESM) server acting as a CMS backend for the VitePress blog. It provides authenticated CRUD for diary articles stored as markdown files in a git repository on the server filesystem.

## Server Entry Point: `server/index.mjs`

Express app on port 3001 (configurable via `PORT` env var).

**Middleware stack:**
- CORS (fully open, no origin restriction)
- JSON body parser (2MB limit)
- multer for file uploads (8MB limit)

**Serialization lock:** A promise-based `serialize()` function prevents concurrent git operations from conflicting. All write endpoints acquire this lock before performing filesystem or git operations.

## Authentication: `server/auth.mjs`

Single shared password model (not per-user).

**Flow:**
1. Client sends password to `POST /api/login`
2. Server compares against `BLOG_PASSWORD` env var
3. On success, issues JWT signed with `JWT_SECRET`, valid for `TOKEN_TTL_HOURS` (default 12h)
4. Subsequent requests use `Authorization: Bearer <token>` header
5. `requireAuth` middleware verifies JWT on protected routes

**Exports:** `signToken(payload)`, `verifyToken(token)`, `requireAuth` (Express middleware)

## Git Integration: `server/git.mjs`

Uses `simple-git` library to manage the repo at `REPO_PATH` env var.

**Operations:**
- `ensureSync()`: Hard resets local repo to `origin/<branch>` before every write. Ensures local state matches remote.
- `commitAndPush(message)`: Stages all changes, commits, pushes to origin.
- `repoFile(relativePath)`: Resolves absolute path within repo.

**Git identity:** Configured per-operation via `GIT_USER_NAME` and `GIT_USER_EMAIL` env vars.

**Commit message conventions:**
- Create: `post: {title}`
- Update: `edit: {title}`
- Delete: `delete: {slug}`
- Upload: `upload: {filename}`

## API Endpoints

| Method | Path | Auth | Purpose |
|--------|------|------|---------|
| `POST` | `/api/login` | No | Authenticate, receive JWT |
| `GET` | `/api/me` | Yes | Verify token validity |
| `POST` | `/api/articles` | Yes | Create new article |
| `GET` | `/api/articles/:slug` | Yes | Fetch article for editing |
| `PUT` | `/api/articles/:slug` | Yes | Update article |
| `DELETE` | `/api/articles/:slug` | Yes | Delete article |
| `POST` | `/api/upload` | Yes | Upload image (max 8MB, png/jpg/gif/webp/svg) |
| `GET` | `/api/health` | No | Health check |

## Article Storage Format

- Location: `diary/<slug>.md` within the repo
- Slug generation: `YYYY-MM-DD-<4-hex-chars>` (auto-generated on create)
- Frontmatter: `title`, `created` (ISO 8601), `updated` (ISO 8601)
- Body: Markdown content after frontmatter
- Slug validation: `safeSlug()` prevents path traversal

## Image Upload

- Endpoint: `POST /api/upload`
- Storage: `public/diary-images/{year}/{random}.{ext}`
- Allowed types: png, jpg, jpeg, gif, webp, svg
- Each upload is immediately committed and pushed to git
- Images served as static assets by VitePress/Nginx

## Relationship to Frontend

**Dev mode:** Vite dev server proxies `/api` to `API_PROXY_TARGET || 'http://gaga0714.top'`

**Production:** Nginx reverse-proxies `/api/*` to `http://127.0.0.1:3001`

**Content cycle:**
1. Frontend editor (`DiaryEditor.vue`) calls API endpoints
2. Backend writes markdown to `diary/`, commits, pushes to GitHub
3. GitHub Actions rebuilds VitePress, deploys to same server
4. Updated static site reflects new content (~1-2 min turnaround)

## Environment Configuration

Required in `server/.env` (template at `server/.env.example`):

| Variable | Default | Purpose |
|----------|---------|---------|
| `BLOG_PASSWORD` | (required) | Login password |
| `JWT_SECRET` | weak dev default | Token signing key |
| `REPO_PATH` | (required) | Absolute path to repo clone (e.g. `/srv/blog-repo`) |
| `PORT` | 3001 | Server port |
| `GIT_USER_NAME` | (required) | Git commit author name |
| `GIT_USER_EMAIL` | (required) | Git commit author email |
| `GIT_BRANCH` | main | Git branch |
| `TOKEN_TTL_HOURS` | 12 | JWT expiration hours |

## Server Filesystem Layout

```
/srv/blog-repo/                  # Git clone (REPO_PATH)
  ├── diary/*.md                 # Article source files
  ├── public/diary-images/{year}/ # Uploaded images
  └── server/
      ├── index.mjs              # Application
      ├── auth.mjs               # Auth module
      ├── git.mjs                # Git module
      ├── .env                   # Secrets (not in repo)
      └── ecosystem.config.cjs   # PM2 config
```

## Security Observations

- Slug validation prevents path traversal
- File upload validates extension whitelist
- JWT secret has weak dev-only default; must be overridden in production
- CORS is fully open (no origin restriction)
- No rate limiting on any endpoint (brute-force risk on login)
- HTTPS termination handled by Nginx, not the app

## Gaps

- No rate limiting on login endpoint
- No tests for any backend code
- CORS fully open; should restrict in production
- No secret rotation strategy documented
- No rollback procedure if bad content is pushed
