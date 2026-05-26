# Documentation Gaps

This file tracks known gaps and uncertainties in the llmdoc system.

## Missing Documentation

### Guides (Workflows)

- No guide for adding a new content category beyond the existing 7
- No guide for customizing the theme (colors, fonts, effects)
- No guide for adding a new Vue component to the theme
- No guide for troubleshooting build failures
- No guide for local backend development setup

### Reference

- No component API documentation for custom Vue components
- No frontmatter schema reference per content category
- No Nginx configuration documented (lives on server only)
- No SSL/HTTPS setup documented
- No backup/restore procedures

### Architecture

- No documentation of the password protection mechanism differences (todo vs diary)
- No documentation of the naming conventions for algorithm files
- No documentation of the sidebar whitelist logic in auto_sidebar.mjs

## Unclear Conventions

- Algorithm file naming pattern (e.g., "双指针04-hot-042.接雨水.md") not documented
- Frontmatter schema varies by category but not specified anywhere
- Password protection: todo uses PasswordProtect component with hardcoded password, diary uses JWT auth - why two mechanisms?
- Filesystem birthtime used for sorting diary/inter_code - unreliable across git clones

## Configuration Details Not Documented

- API proxy target defaults to production (gaga0714.top) in dev mode - could cause confusion
- Deployment secrets (SSH_HOST, SSH_USER, SSH_KEY) referenced in workflow but not documented
- Domain gaga0714.top relationship to IP 121.43.140.40 unclear
- No .env.example for frontend (only backend has one)

## Unused/Legacy Code

- `/重构/` directory has only one file, purpose unclear
- `/IFC/` appears to be work-related content, relationship to blog unclear
- `/utils/add_password_to_todo.js` and `.mjs` both exist, unclear which is canonical
- `/markdown-examples.md` and `/api-examples.md` at root appear to be VitePress scaffolding examples

## Build Artifacts

- `public/diary-articles.json` generated at build time, unclear if ever committed (currently gitignored)
- `public/covers/` generated at build time (gitignored)
- Cover image extraction only works for images in `/assets/`, external URLs result in empty cover

## Security & Operations Gaps

- No rate limiting on backend API (brute-force risk)
- No monitoring or error tracking configured
- No rollback strategy documented
- No secret rotation strategy
- CORS fully open on backend (no origin restriction)
- PasswordProtect password hardcoded in Vue source (visible in built JS)
- Search indexes all content including password-protected articles

## Next Steps

When creating new documentation:
1. Prioritize guides for common workflows (adding content, customizing theme)
2. Document frontmatter schemas in reference/
3. Document component APIs in reference/
4. Consider splitting vitepress-blog.md if it grows beyond 150 lines
