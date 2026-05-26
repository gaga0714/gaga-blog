# Content Structure and Features Investigation

## Doc Reads

No llmdoc files exist yet in this project.

## Code Sections

### Configuration & Build

- `.vitepress/config.mjs` (`defineConfig`, `diaryListPlugin`, `readDiaryMeta`, `transformPageData`): Main VitePress configuration with custom diary metadata extraction, cover image handling, and page data transformation for timestamps.
- `utils/auto_sidebar.mjs` (`set_sidebar`, `getList`): Auto-generates sidebar navigation from filesystem structure; sorts diary and inter_code by creation time (newest first), others alphabetically.
- `package.json`: VitePress 1.6.3 with gray-matter for frontmatter parsing and markdown-it for rendering.

### Theme Components

- `.vitepress/theme/index.js`: Registers global components (PasswordProtect, DiaryList, DiaryEditor) and custom layout.
- `.vitepress/theme/Layout.vue`: Custom layout wrapper with diary-specific components, authentication checks for /todo/ routes, and body class toggling for home vs non-home pages.
- `.vitepress/theme/components/DiaryList.vue`: Paginated article list (10 per page) with cover images, relative timestamps, search params for page state, scroll-to-article restoration, and gradient fallback backgrounds.
- `.vitepress/theme/components/DiaryPageFooter.vue`: Shows creation/update timestamps and back-to-list button with scroll position memory.
- `.vitepress/theme/components/DiaryActions.vue`: Edit/delete buttons for authenticated users on diary articles.
- `.vitepress/theme/components/DiaryEditor.vue`: Full markdown editor with live preview, image upload, authentication, and CRUD operations via API.
- `.vitepress/theme/components/PasswordProtect.vue`: Session-based password protection (hardcoded password "mmjbgsn") with glassmorphism UI.
- `.vitepress/theme/components/BackToTop.vue`: Scroll-triggered floating button.
- `.vitepress/theme/custom.css`: Extensive custom styling with warm color palette (#c45a5a brand), glassmorphism effects, hover animations, and responsive layout adjustments.

### Authentication & API

- `.vitepress/theme/composables/diaryAuth.js` (`useDiaryAuth`): Session-based auth composable with token management, login/logout, and authenticated fetch wrapper.
- `server/index.mjs`: Express API server with JWT auth, CRUD endpoints for diary articles, image upload to `/public/diary-images/{year}/`, git auto-commit/push, and multer for file handling.
- `server/auth.mjs`: JWT signing and verification middleware.
- `server/git.mjs`: Git operations (sync, commit, push) for content management.

### Content Discovery

- `.vitepress/config.mjs` (`diaryListPlugin`): Vite plugin that scans diary directory, extracts frontmatter + first image, copies covers to `/public/covers/`, generates `/public/diary-articles.json` at build time and watches for changes in dev mode.

## Report

### Conclusions

**Content Categories:**

1. **diary** - Personal blog posts with rich metadata (title, created, updated, cover, encrypted flag), paginated list view, CRUD operations via authenticated API, automatic git-based publishing workflow
2. **algorithm** - Algorithm problems and solutions, simple markdown files without special frontmatter
3. **damn** - Interview prep materials organized by topic (html, css, javascript, vue3, react, network, engineering, ts, backend, 面试复盘), uses auto-generated sidebar
4. **IFC** - Work-related notes with subdirectory (总结)
5. **inter_code** - Code interview problems (防抖, new, 通用逆柯里化), sorted by creation time like diary
6. **todo** - Password-protected personal notes using PasswordProtect component with session auth
7. **重构** - Refactoring notes (single file found: 随记功能-修改计划.md)

**Article Metadata Patterns:**

- **diary**: YAML frontmatter with `title`, `created` (ISO 8601), `updated` (ISO 8601), optional cover image reference, optional `<PasswordProtect>` wrapper for encrypted content
- **algorithm, damn, IFC, inter_code, todo, 重构**: Minimal or no frontmatter, plain markdown content
- Fallback: If frontmatter timestamps missing, uses filesystem `birthtime` (created) and `mtime` (updated)

**Cover Images & Asset Handling:**

- Cover extraction: First image in markdown content via regex `!\[[^\]]*\]\(([^)]+)\)`
- Path normalization: Converts `../assets/`, `./assets/`, `/assets/` to absolute `/assets/` or `/covers/`
- Build-time copy: `diaryListPlugin` copies referenced images from `/assets/` to `/public/covers/` with original filename
- Upload flow: DiaryEditor uploads to `/api/upload` → server saves to `/public/diary-images/{year}/{random}.{ext}` → returns URL → inserts into markdown
- Fallback: If no cover, DiaryList generates deterministic gradient background from slug hash (8 color palettes)

**Pagination Implementation:**

- Fixed page size: 10 articles per page
- URL state: `?page=N` query param (page 1 omits param)
- Smart ellipsis: Shows current, current±1, first, last pages with clickable "…" for jump dialog
- Jump dialog: Modal input for direct page navigation
- Scroll restoration: Uses `sessionStorage.diary_scroll_to` to remember article slug, finds target page, scrolls to card, highlights with animation

**Page Navigation Features:**

- **Diary list → article**: Click card, stores slug in sessionStorage
- **Article → list**: "返回列表" button reads slug, navigates to list, scrolls to card position
- **Sidebar navigation**: Auto-generated from filesystem via `auto_sidebar.mjs`, collapsible groups, sorted by creation time for diary/inter_code
- **Search**: VitePress local search with Chinese translations
- **Back to top**: Floating button appears after 320px scroll
- **Breadcrumb timestamps**: Shows creation/update time on diary and inter_code articles

**Article Discovery & Rendering:**

- **Build time**: `diaryListPlugin` scans `/diary/*.md`, parses frontmatter with gray-matter, extracts metadata, generates JSON manifest
- **Dev mode**: File watcher triggers manifest regeneration on add/change/unlink
- **Client side**: DiaryList fetches `/diary-articles.json`, sorts by created desc, paginates, renders cards
- **Routing**: VitePress auto-generates routes from filesystem, diary articles at `/diary/{slug}.html`
- **Dynamic content**: DiaryEditor uses `/api/articles` endpoints for CRUD, server commits to git, CI/CD rebuilds site
- **Encryption**: Articles with `<PasswordProtect>` wrapper show password prompt, content hidden until session auth

### Relations

**Content Flow:**

```
Markdown files (diary/*.md)
  ↓ [gray-matter]
Frontmatter + content
  ↓ [diaryListPlugin @ build/dev]
diary-articles.json + covers copied
  ↓ [DiaryList.vue fetch]
Paginated card list
  ↓ [click card]
Article page with DiaryPageFooter + DiaryActions
```

**Edit Flow:**

```
DiaryEditor.vue
  ↓ [/api/articles POST/PUT]
server/index.mjs
  ↓ [fs.writeFileSync + gray-matter.stringify]
diary/{slug}.md updated
  ↓ [git commit + push]
GitHub repo
  ↓ [CI/CD workflow]
Rebuilt site with new content
```

**Sidebar Generation:**

```
Filesystem structure
  ↓ [auto_sidebar.mjs @ config load]
Recursive directory scan
  ↓ [sort by birthtime for diary/inter_code]
Nested sidebar items
  ↓ [VitePress themeConfig.sidebar]
Rendered navigation
```

**Authentication Layers:**

- **todo category**: PasswordProtect component with hardcoded password, session storage, Layout.vue route guard
- **diary editing**: JWT-based auth via diaryAuth.js, server-side verification, session token storage

### Gaps

- **Cover image consistency**: Build-time copy only works for images in `/assets/`, external URLs or other paths result in empty cover
- **Encryption UX**: Password hardcoded in PasswordProtect.vue, no per-article password support despite encrypted flag in metadata
- **Pagination limits**: No "items per page" configuration, fixed at 10
- **Search scope**: VitePress local search indexes all content including encrypted articles (metadata visible in search results)
- **Timestamp source**: Relies on filesystem birthtime/mtime as fallback, which can be unreliable across git clones or deployments
- **API error handling**: Server errors show generic alerts, no retry logic or detailed error messages
- **Image optimization**: No automatic resizing or format conversion for uploaded images
- **Sidebar state**: No persistence of collapsed/expanded state across page navigations
- **Mobile pagination**: Jump dialog works but could benefit from touch-optimized input

### Result

**Content is structured around 7 main categories** with diary as the most feature-rich (full CRUD, pagination, covers, encryption, timestamps). **Frontmatter patterns vary** from rich metadata in diary to minimal/none in other categories. **Cover images are extracted from markdown** and copied to `/public/covers/` at build time with gradient fallbacks. **Pagination uses URL query params** with smart ellipsis and scroll restoration. **Navigation features include** auto-generated sidebars sorted by creation time, back-to-list with position memory, and session-based authentication for protected content. **Articles are discovered** via build-time filesystem scan generating JSON manifest, with dynamic editing through authenticated API endpoints that trigger git-based publishing workflow.
