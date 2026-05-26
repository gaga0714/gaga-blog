# Investigation: Backend Server Implementation

## Doc Reads

- No `llmdoc/` directory exists in this project.

## Code Sections

- `server/index.mjs` (`app`): Express server, all API routes, serialization lock, article CRUD, image upload.
- `server/auth.mjs` (`signToken`, `verifyToken`, `requireAuth`): JWT-based authentication middleware.
- `server/git.mjs` (`ensureSync`, `commitAndPush`, `repoFile`): Git automation via `simple-git`.
- `server/ecosystem.config.cjs`: PM2 deployment configuration.
- `server/package.json`: Dependencies and scripts.
- `server/.env.example`: All required environment variables documented.
- `.vitepress/theme/components/PasswordProtect.vue`: Client-side article password protection (not server-side encryption).

## Report

### Conclusions

**Architecture:** The server is a lightweight Express.js (ESM) application that acts as a CMS backend for a VitePress-based blog. It manages markdown articles stored in a git repository on the server filesystem.

**Authentication flow:**
1. Client sends password to `POST /api/login`.
2. Server compares against `BLOG_PASSWORD` env var (single shared password, not per-user).
3. On success, server issues a JWT signed with `JWT_SECRET`, valid for `TOKEN_TTL_HOURS` (default 12h).
4. Subsequent requests include `Authorization: Bearer <token>` header.
5. `requireAuth` middleware verifies the JWT on protected routes.

**Git integration:**
- `ensureSync()` does a hard reset to `origin/<branch>` before every write operation, ensuring the local repo matches remote.
- `commitAndPush(message)` stages all changes, commits, and pushes to origin.
- A serialization lock (`serialize()`) prevents concurrent git operations from conflicting.
- Git identity is configured per-operation via env vars (`GIT_USER_NAME`, `GIT_USER_EMAIL`).

**Article encryption / password protection:**
- There is NO server-side encryption of article content.
- Protection is purely client-side via a `<PasswordProtect>` Vue component registered globally in VitePress.
- Articles wrap sensitive content in `<PasswordProtect>...</PasswordProtect>` tags in their markdown source.
- The component checks a hardcoded password (`mmjbgsn`) in the Vue source code.
- Authentication state is stored in `sessionStorage` for the browser session.
- This is NOT cryptographic protection; the content is present in the built HTML/JS and can be extracted by anyone inspecting the page source.

**API Endpoints:**

| Method | Path | Auth | Purpose |
|--------|------|------|---------|
| POST | `/api/login` | No | Authenticate with blog password, receive JWT |
| GET | `/api/me` | Yes | Verify token validity |
| POST | `/api/articles` | Yes | Create new article (auto-generates date-based slug) |
| GET | `/api/articles/:slug` | Yes | Fetch single article for editing |
| PUT | `/api/articles/:slug` | Yes | Update existing article |
| DELETE | `/api/articles/:slug` | Yes | Delete article |
| POST | `/api/upload` | Yes | Upload image (max 8MB, png/jpg/gif/webp/svg) |
| GET | `/api/health` | No | Health check |

**Deployment (PM2):**
- Single instance, auto-restart enabled, 300MB memory limit.
- `NODE_ENV=production` set in env.
- Expected to run behind nginx reverse proxy (per `.env.example` comment).
- Port defaults to 3001.

**Article storage format:**
- Articles live in `diary/<slug>.md` within the repo.
- Slugs are auto-generated as `YYYY-MM-DD-<4-hex-chars>`.
- Front matter includes `title`, `created`, `updated` (ISO timestamps).
- Content is the markdown body after front matter.

**Security observations:**
- Slug validation (`safeSlug`) prevents path traversal.
- File upload validates extension whitelist.
- JSON body limit is 2MB; file upload limit is 8MB.
- JWT secret has a weak dev-only default; production requires setting `JWT_SECRET`.
- CORS is fully open (`cors()` with no origin restriction).
- The `PasswordProtect` component's hardcoded password offers no real security.

### Relations

- `server/index.mjs` imports from `server/auth.mjs` and `server/git.mjs`.
- The server operates on the same `diary/` directory that VitePress builds from.
- Image uploads go to `public/diary-images/<year>/` which VitePress serves as static assets.
- The `PasswordProtect.vue` component is registered globally in `.vitepress/theme/index.js` and used inline in markdown articles.

### Gaps

- No rate limiting on login endpoint (brute-force risk).
- No HTTPS termination in the server itself (relies on nginx).
- No documentation on how the server is deployed alongside VitePress builds (whether a rebuild is triggered after git push).
- The `PasswordProtect` password is hardcoded in source; no mechanism to change it without redeploying.
- No tests exist for the server.

### Result

The backend is a single-file Express CMS server that provides authenticated CRUD for markdown articles stored in a git repo. Authentication uses a shared password exchanged for a JWT. There is no server-side article encryption; the "password protection" is a client-side Vue component with a hardcoded password that wraps content sections in markdown files. Deployment uses PM2 with a single instance behind nginx.
