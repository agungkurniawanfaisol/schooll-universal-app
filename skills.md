# Sekolah CMS — Skills Index

Project-specific Cursor skills. Detailed skills live in `.cursor/skills/` and load when their triggers match the task.

## How to Use

1. Read [agent.md](agent.md) for project overview
2. Read [memory.md](memory.md) for current status and gaps
3. Apply the relevant skill below for your task type
4. Follow rules in `.cursor/rules/` (auto-applied by Cursor)

---

## Available Skills

### `sekolah-cms-architecture`

**Path:** `.cursor/skills/sekolah-cms-architecture/SKILL.md`

**Use when:** Designing features, adding modules, migrations, API structure, architecture decisions.

---

### `sekolah-cms-development`

**Path:** `.cursor/skills/sekolah-cms-development/SKILL.md`

**Use when:** Implementing CMS modules, wiring frontend to API, forms, Docker/dev tasks.

---

## Cursor Rules (Auto-Applied)

| Rule                 | Scope                    | File                                  |
| -------------------- | ------------------------ | ------------------------------------- |
| Project standards    | Always                   | `.cursor/rules/project-standards.mdc` |
| Frontend conventions | `frontend/**/*.{ts,tsx}` | `.cursor/rules/frontend-react.mdc`    |
| Backend conventions  | `backend/**/*.php`       | `.cursor/rules/backend-laravel.mdc`   |

---

## Updating

When project patterns change:

1. Update the relevant `SKILL.md` in `.cursor/skills/`
2. Update [memory.md](memory.md) with decisions
3. Update rules in `.cursor/rules/` if conventions change
