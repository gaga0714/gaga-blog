# Documentation Index

## Must-Read Startup Docs

See `llmdoc/startup.md` for the ordered reading list.

## Documentation Categories

### `/must/`

Recurring startup context read on every run:
- `project-basics.md` - Identity, tech stack, content organization, key commands

### `/overview/`

Project identity and boundaries:
- `project-overview.md` - What this project is, owner context, major areas, production URLs

### `/architecture/`

System structure, flows, and invariants:
- `vitepress-blog.md` - VitePress config, auto-sidebar, diary list plugin, custom theme, content discovery flow
- `backend-cms.md` - Express server, authentication, git integration, API endpoints, relationship to frontend

### `/guides/`

One workflow per document. Currently empty.

### `/reference/`

Stable lookup facts and contracts:
- `deployment.md` - GitHub Actions pipeline, Aliyun server setup, PM2 config, environment variables, build process

### `/memory/`

Historical process memory:
- `doc-gaps.md` - Known documentation gaps and uncertainties
- `decisions/` - Owned by recorder (currently empty)
- `reflections/` - Owned by reflector (currently empty)

## Routing Rules

**For new tasks:**
1. Start with `llmdoc/startup.md`
2. Read the ordered must-read docs
3. Escalate to guides or reference as needed

**For specific questions:**
- VitePress config, theme, or content discovery → `architecture/vitepress-blog.md`
- Backend API, auth, or git operations → `architecture/backend-cms.md`
- Deployment, CI/CD, or server setup → `reference/deployment.md`
- Project identity or boundaries → `overview/project-overview.md`

**For documentation maintenance:**
- Known gaps → `memory/doc-gaps.md`
- Decisions → `memory/decisions/`
- Reflections → `memory/reflections/` (reflector only)

## Temporary Investigation Artifacts

`.llmdoc-tmp/investigations/` contains raw investigation reports. These are not part of the stable documentation system and should not be referenced in production work.
