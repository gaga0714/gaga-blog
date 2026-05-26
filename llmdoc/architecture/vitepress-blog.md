# VitePress Blog Architecture

## Configuration: `.vitepress/config.mjs`

Central configuration defining:

- **Site metadata**: Title "gaga's blog", markdown line numbers enabled
- **Navigation**: 6 top-level items (home, diary, interview topics dropdown with 9 sub-categories, hand-written code, algorithm, todo)
- **Sidebar**: 12 sidebar groups auto-generated via `set_sidebar()` from `utils/auto_sidebar.mjs`
- **Search**: VitePress local search with Chinese translations
- **Social links**: GitHub profile
- **Vite plugins**: Custom `diaryListPlugin()` for article indexing
- **Dev proxy**: `/api` proxied to `process.env.API_PROXY_TARGET || 'http://gaga0714.top'`
- **transformPageData**: Injects `diaryFileCreated` / `diaryFileUpdated` timestamps for diary and inter_code pages

## Auto-Sidebar: `utils/auto_sidebar.mjs`

`set_sidebar(path)` generates sidebar config by:

1. Scanning the directory at `path` recursively
2. Filtering by whitelist of known content directories
3. Building nested sidebar item structures
4. **Special sorting** for `/diary/` and `/inter_code/`: files sorted by filesystem `birthtime` (newest first)
5. All other directories: default alphabetical sort

The sidebar is generated at config load time (build and dev), not at runtime.

## Diary List Plugin: `diaryListPlugin()` in `config.mjs`

A custom Vite plugin that generates the diary article index.

**Build-time behavior:**
1. Scans `diary/*.md` files
2. Parses frontmatter with gray-matter (title, created, updated)
3. Extracts first image from markdown content as cover
4. Copies cover images from `assets/` to `public/covers/` (path rewriting)
5. Writes `public/diary-articles.json` with all article metadata

**Dev-mode behavior:**
- File watcher triggers manifest regeneration on add/change/unlink of diary files

**Generated JSON schema** (`diary-articles.json`):
```
[{ title, slug, created, updated, cover, encrypted }]
```

## Custom Theme System

### Theme Entry: `.vitepress/theme/index.js`

Extends `DefaultTheme` with:
- Custom `Layout.vue` replacing the default layout
- Three globally registered components: `PasswordProtect`, `DiaryList`, `DiaryEditor`
- Copy-code fix via `useCopyCodeFix()` composable in `enhanceApp`

### Layout: `.vitepress/theme/Layout.vue`

Wraps `DefaultTheme.Layout` using VitePress slots:

- **`#doc-before`**: `DiaryPageFooter` (timestamps + back button), `DiaryActions` (edit/delete buttons)
- **`#layout-bottom`**: `BackToTop`, `MouseEffect`, `ScrollFx`, `ResizableSidebar`, `SidebarToggle`

Additional responsibilities:
- Route guard for `/todo/` (checks session authentication)
- Body class toggling for home vs non-home pages (controls background image)

### Styling: `.vitepress/theme/custom.css`

Brand palette: warm amber/coral (`#c45a5a` primary, `#e8a87c` secondary, `#f0c5a0` accent).

Key visual effects:
- Glassmorphism (`backdrop-filter: blur()`) on navbar, sidebar, features, search modal
- Fixed background image (`/bg-page.png`) with overlay on non-home pages
- Hero avatar float animation, tail-wag SVG pseudo-element
- Feature cards with gradient bars and hover lift
- Sidebar collapse via `html.sidebar-collapsed` class (toggled by SidebarToggle)
- Content width overrides: 860px (with aside) / 900px (without sidebar)
- Respects `prefers-reduced-motion`

### Components: `.vitepress/theme/components/`

| Component | Purpose |
|-----------|---------|
| `DiaryList.vue` | Paginated article cards (10/page), cover images, gradient fallbacks, search-param pagination, scroll restoration |
| `DiaryEditor.vue` | Markdown editor with live preview, image upload, CRUD via `/api/articles` |
| `DiaryActions.vue` | Edit/delete buttons on diary pages (auth-gated) |
| `DiaryPageFooter.vue` | Created/updated timestamps, back-to-list button with scroll memory |
| `PasswordProtect.vue` | Client-side password gate for `/todo/` (hardcoded password, sessionStorage) |
| `MouseEffect.vue` | Custom duck cursor with sparkle/ripple particles |
| `ScrollFx.vue` | Scroll progress bar and star particles |
| `BackToTop.vue` | Floating button, appears after 320px scroll |
| `ResizableSidebar.vue` | Drag handle to resize sidebar width (localStorage) |
| `SidebarToggle.vue` | Collapse/expand sidebar button (localStorage) |

### Composables: `.vitepress/theme/composables/`

- `diaryAuth.js` (`useDiaryAuth`): Session-based auth using `/api/login`, token in sessionStorage, authenticated fetch wrapper
- `copyCode.js` (`useCopyCodeFix`): Overrides VitePress copy-code to strip shell prompts

## Content Discovery Flow

```
Filesystem (diary/*.md, etc.)
  |
  ├─[config load]─> auto_sidebar.mjs ──> themeConfig.sidebar
  |
  ├─[build/dev]──> diaryListPlugin ──> diary-articles.json + public/covers/
  |                                      |
  |                                      └─> DiaryList.vue (fetch at runtime)
  |
  └─[VitePress]──> Route generation from filesystem
                    transformPageData injects timestamps
```

## Authentication Layers

Two separate mechanisms:

1. **todo section**: `PasswordProtect.vue` with hardcoded password (`mmjbgsn`), sessionStorage state, Layout.vue route guard. Client-side only, no real security.
2. **Diary editing**: JWT-based via `useDiaryAuth` composable and `/api/login` endpoint. Server-side verification on all write operations.

## Invariants

- Sidebar generation runs at config load time, not at runtime
- `diary-articles.json` is regenerated every build (gitignored)
- `public/covers/` is regenerated every build (gitignored)
- Diary and inter_code sorting relies on filesystem `birthtime` (unreliable across git clones)
- Global components (`PasswordProtect`, `DiaryList`, `DiaryEditor`) are available in any markdown file

## Gaps

- Filesystem `birthtime` for sorting is unreliable after git clone or deployment
- PasswordProtect password is hardcoded in Vue source (visible in built JS)
- No documented frontmatter schema per content category
- No component API documentation
- Search indexes all content including password-protected articles
