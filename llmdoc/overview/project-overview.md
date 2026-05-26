# Project Overview

## What This Project Is

gaga-blog is a personal blog and knowledge base built on VitePress 1.6.3. It serves dual purposes:

- **Static knowledge base**: Algorithm solutions, interview prep materials, code implementations, and notes rendered as a browsable VitePress site.
- **Dynamic blog**: Diary posts managed through an authenticated web editor backed by an Express.js API server that commits to git.

## Owner and Context

Built by a computer science student at Hangzhou Dianzi University (HDU) with a focus on frontend, backend, and algorithms. The homepage (`index.md`) describes the author and links to primary content areas.

## Project Boundaries

**In scope:**
- VitePress site configuration and custom theme
- 7 content categories (diary, algorithm, damn, inter_code, todo, IFC, 重构)
- Express.js CMS backend for diary article management
- GitHub Actions CI/CD to Aliyun server
- Build-time content discovery (sidebar generation, diary article indexing)

**Out of scope:**
- Server infrastructure provisioning (manual setup per `server/README.md`)
- Nginx configuration (lives on server, not in repo)
- DNS / SSL configuration for domain gaga0714.top

## Major Areas

### 1. VitePress Static Site

Custom theme extending DefaultTheme with glassmorphism styling, interactive effects (custom cursor, scroll particles), resizable sidebar, and password-protected sections. Content auto-discovered from filesystem structure.

### 2. Diary CMS

Full CRUD workflow: web editor at `/diary/edit` communicates with Express backend, which writes markdown files with frontmatter, commits to git, and pushes to GitHub. This triggers CI/CD to rebuild and redeploy the site.

### 3. Content Categories

Each category has distinct characteristics:
- **diary** - Rich frontmatter (title, created, updated), cover images, paginated list, CRUD API
- **algorithm** - Organized by topic subdirectories, minimal frontmatter
- **damn** - 9 subdirectories for interview topics, auto-generated sidebar
- **inter_code** - Sorted by creation time (newest first), like diary
- **todo** - Client-side password protection (hardcoded in PasswordProtect.vue)
- **IFC** - Work-related notes
- **重构** - Refactoring plans (single file)

### 4. Deployment Pipeline

GitHub Actions workflow builds VitePress, deploys static output to Aliyun, and conditionally updates the backend server when `server/**` files change.

## Production URL

- HTTP: http://121.43.140.40/
- Domain: gaga0714.top (used as API proxy target in dev)
- Deprecated: https://gaga-blog.vercel.app/
