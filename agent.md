# Sekolah CMS — Agent Guide

Read this file first when continuing work on this project (especially after switching AI models).

Also see: [memory.md](memory.md) · [skills.md](skills.md) · [AGENTS.md](AGENTS.md)

## Role

You are a **Senior Full-Stack Software Architect and Principal Engineer** building a production-ready, enterprise-level **School Website CMS**. This is **not** a simple CRUD app.

Priorities: clean architecture, maintainability, accessibility, security, performance, premium UI/UX.

## Project Summary

Two connected systems:

1. **Public Landing Page** — premium school website; all content is CMS-driven (nothing hardcoded).
2. **Admin CMS** — dark-mode dashboard with permission-based access to manage all landing content.

## Stack

| Layer     | Technology                                                                                                                                                                     |
| --------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| Frontend  | React 19, Vite, React Router DOM, TypeScript, TanStack React Query, Axios, React Hook Form, Zod, Radix UI, TailwindCSS 4, Lucide, Framer Motion, Zustand, clsx, tailwind-merge |
| Backend   | Laravel 12, PHP 8.4, MySQL 8, Sanctum, Spatie Permission                                                                                                                       |
| Container | Docker Compose (backend, frontend, mysql, mailpit)                                                                                                                             |

## Repository Layout

```
sekolah-app/
├── agent.md           # AI agent guide (this file)
├── memory.md          # Project status, gaps, session log
├── skills.md          # Skills index
├── AGENTS.md          # Cursor auto-discovery entry point
├── .cursor/rules/     # Auto-applied Cursor rules
├── .cursor/skills/    # Project SKILL.md files
├── backend/           # Laravel API (/api/v1)
├── frontend/          # React SPA
├── docker/
├── docker-compose.yml
└── .env.example
```

### Frontend (`frontend/src/`)

```
api/          # Axios client, endpoints, queryClient
components/   # ui/, common/, layout/
hooks/
layouts/      # PublicLayout, DashboardLayout, AuthLayout
pages/        # landing/, dashboard/, authentication/
routes/       # Router, ProtectedRoute, PermissionRoute
stores/       # Zustand: theme, sidebar, auth, notification, modal
types/
validators/   # Zod schemas
lib/          # cn() utils
```

Use `@/` path alias for imports.

### Backend (`backend/app/`)

```
Actions/ DTOs/ Enums/ Helpers/
Http/Controllers/Api/V1/   # REST controllers
Http/Requests/Api/V1/      # Form Request validation
Http/Resources/            # API Resources
Models/ Policies/
Repositories/ + Contracts/
Services/
Traits/ApiResponse.php
```

Pattern: **Controller → Service → Repository → Model**. Controllers stay thin.

## API Conventions

- Base path: `/api/v1`
- Public routes: `/api/v1/public/*` (throttled)
- Auth: Sanctum bearer tokens + refresh at `/api/v1/auth/refresh`
- Standard response:

```json
{
  "success": true,
  "message": "Success",
  "data": {},
  "meta": {}
}
```

Use `BaseApiController` + `ApiResponse` trait on all API controllers.

## Frontend Conventions

- **Zustand**: global UI only (theme, sidebar, auth, notifications, modal)
- **React Query**: all server state (fetch, cache, mutations, invalidation)
- **Forms**: React Hook Form + Zod + `@hookform/resolvers`
- **Routes**: lazy-loaded with `Suspense` + `LoadingSpinner`
- **Permissions**: `PermissionRoute` wraps dashboard routes; match backend `{module}.{action}` keys

## Development Workflow

### Start environment

```bash
cp .env.example .env
docker compose up
```

| Service             | URL                          |
| ------------------- | ---------------------------- |
| Frontend (Vite HMR) | http://localhost:5173        |
| API (Laravel)       | http://localhost:8000/api/v1 |
| Mailpit             | http://localhost:8025        |

Vite proxies `/api` → backend on port 8000.

### Default admin (after seed)

- Email: `admin@sekolah.test`
- Password: `password`

### Common commands

```bash
cd frontend && npm run lint && npm run typecheck
docker compose exec backend php artisan migrate
docker compose exec backend php artisan db:seed
```

## Implementation Rules

1. **Nothing hardcoded on landing page** — all sections read from API/CMS.
2. **Incremental delivery** — complete one feature end-to-end before moving on.
3. **Match existing patterns** — read neighboring files before adding new code.
4. **Minimize scope** — focused diffs; no unrelated refactors.
5. **Permission-gated admin** — every admin action needs policy + permission check.
6. **Indonesian UI copy** in seed data and labels; keep consistent unless user requests otherwise.

## Key Files to Read First

| Purpose            | Path                                                    |
| ------------------ | ------------------------------------------------------- |
| API routes         | `backend/routes/api.php`                                |
| Permissions list   | `backend/app/Helpers/helpers.php` → `cms_permissions()` |
| API response trait | `backend/app/Traits/ApiResponse.php`                    |
| Axios client       | `frontend/src/api/client.ts`                            |
| Router             | `frontend/src/routes/index.tsx`                         |
| Landing page       | `frontend/src/pages/landing/LandingPage.tsx`            |
| Project progress   | `memory.md`                                             |

## Related AI Context

- **[memory.md](memory.md)** — implementation status, gaps, decisions (update after each session)
- **[skills.md](skills.md)** — index of project skills
- **`.cursor/rules/`** — auto-applied coding standards
- **`.cursor/skills/`** — detailed workflow skills

## When Starting a New Session

1. Read [memory.md](memory.md) for latest status
2. Read relevant skill from `.cursor/skills/` for the task type
3. Inspect existing code in the target module before implementing
4. Update [memory.md](memory.md) when finishing significant work
