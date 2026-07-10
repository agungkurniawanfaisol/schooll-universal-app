# Sekolah CMS — AI Agent Entry Point

Cursor auto-reads this file at the project root. For full context, also read the companion docs at the same level.

## Read in order

1. **[agent.md](agent.md)** — Project overview, stack, architecture, dev workflow
2. **[memory.md](memory.md)** — Current implementation status, gaps, decisions
3. **[skills.md](skills.md)** — Index of project skills and Cursor rules

## Quick context

Enterprise **School Website CMS**: Laravel 12 API + React 19 SPA + Docker.

- Public landing page (all content CMS-driven)
- Admin dashboard (permission-based, dark mode)
- Default admin: `admin@sekolah.test` / `password`
- Dev: `docker compose up` → frontend :5173, API :8000

## Cursor integration

| Location          | Purpose                                      |
| ----------------- | -------------------------------------------- |
| `AGENTS.md`       | Cursor auto-discovery (this file)            |
| `agent.md`        | Full agent guide — `@agent.md` in chat       |
| `memory.md`       | Living project state — update after sessions |
| `skills.md`       | Skills index                                 |
| `.cursor/rules/`  | Auto-applied rules                           |
| `.cursor/skills/` | Project SKILL.md files                       |

After significant work, update **memory.md**.
