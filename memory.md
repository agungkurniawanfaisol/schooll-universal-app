# Sekolah CMS — Project Memory

Living document of implementation status, decisions, and known gaps. **Update this file after each significant work session.**

Last updated: 2026-07-10 (landing-admin sync)

---

## Current Status: Landing + Admin Settings Synced

Dashboard CRUD, media manager, landing page, and all Pengaturan pages read/write the same `/api/v1` content. Re-seed demo data with `docker compose exec backend php artisan db:seed --class=CmsContentSeeder`. Next: role form permissions, Redis, sitemap, README.

---

## Implemented

### Infrastructure

- [x] Docker Compose: nginx, backend (Laravel), frontend (Vite), mysql, phpmyadmin, mailpit
- [x] Hot reload: Vite HMR on :5173, Laravel artisan serve in backend container
- [x] `.env.example` with port and DB config
- [x] Nginx reverse proxy to Laravel; Vite dev proxy for `/api`

### Backend

- [x] Laravel 12 API at `/api/v1`
- [x] Sanctum authentication (login, logout, me, refresh)
- [x] **Bulk delete endpoints** for all CMS resources (`POST /{resource}/bulk-delete`)
- [x] Spatie Permission: roles (Super Admin, Admin, Editor) + module permissions via `cms_permissions()`
- [x] Repository + Service pattern for all content modules
- [x] Form Request validation per module
- [x] Policies for all models
- [x] API Resources + standardized `ApiResponse` trait
- [x] Rate limiting on public/auth/api routes
- [x] 26 database migrations (users, permissions, media, all CMS tables)
- [x] Factories for content models
- [x] Seeders: `RolePermissionSeeder`, `CmsContentSeeder` (demo content + admin user)
- [x] Public API: landing aggregate, teachers, activities, agendas, galleries, testimonials, facilities, achievements, news, contact submit
- [x] Admin API: CRUD for all modules, content settings, SEO, contacts

### Frontend

- [x] React 19 + Vite + TypeScript strict
- [x] TailwindCSS 4 + Radix UI component library (`components/ui/`)
- [x] Zustand stores: auth, theme, sidebar, notification, modal
- [x] Axios client with token refresh queue + global error toasts
- [x] TanStack React Query setup
- [x] Lazy-loaded routes with Suspense
- [x] ProtectedRoute + PermissionRoute
- [x] Public landing page with all sections
- [x] Dashboard pages for all CMS modules (list + form pages)
- [x] Reusable DataTable, CmsListPage, CmsFormPage
- [x] **Fixed API endpoints** — `/api/v1`, plural names (`agendas`, `galleries`)
- [x] **API mappers** — frontend ↔ backend field mapping (`status` ↔ `isPublished`)
- [x] **Dashboard wired to API** — CRUD pages, media upload, dashboard stats
- [x] **Landing wired** — `LandingDataProvider` + live section data from `/public/landing`
- [x] **Auth fixed** — Sanctum token refresh, login `admin@sekolah.test` / `password`
- [x] **Mobile-responsive DataTable** — card view on `<768px` via `DataTableCardList`; compact pagination; mobile sort dropdown
- [x] **Admin mobile polish** — PageHeader full-width actions, Dashboard recent lists stack, CmsFormPage sticky footer, settings touch targets
- [x] **Landing mobile polish** — section padding rhythm, text truncation, hero CTA stack, carousel edge padding, gallery mobile overlay
- [x] **Settings pages wired to API** — Umum, Hero, Tentang, Visi & Misi, Kepala Sekolah, Kontak, Navigasi, Footer, SEO, Media Sosial via `useContentApi` + `useSettingsApi`
- [x] **Landing cache invalidation** — admin saves invalidate `['public', 'landing']` query
- [x] **Seeder navigation aligned** — 8 menu items matching landing section anchors

---

## Not Yet Implemented / Known Gaps

### Infrastructure

- [ ] **Redis** service in docker-compose
- [ ] **Root README.md**
- [ ] Production nginx config for built frontend
- [ ] Husky + lint-staged pre-commit hooks

### Backend

- [ ] Excel export/import
- [ ] sitemap.xml and robots.txt routes
- [ ] JSON-LD structured data endpoint
- [ ] Image crop/compress in MediaService
- [ ] S3 storage documented in `.env.example`
- [ ] Queue workers in docker-compose

### Frontend

- [ ] **Role form page** — permission picker wired to API
- [ ] Media Manager: drag-drop, crop, compress UI
- [ ] Rich text editor for news/content
- [ ] Excel export/import UI
- [ ] Profile page
- [ ] Contact submissions admin list page
- [x] Tests (Vitest frontend, Pest backend)

### SEO

- [ ] Dynamic sitemap generation
- [ ] robots.txt
- [ ] Full Open Graph + Twitter Card per page

---

## Recommended Next Steps

1. Wire role form with permissions picker
2. Add Redis to docker-compose
3. Add sitemap.xml + robots.txt
4. Write root README.md

Re-seed demo content:

```bash
docker compose exec backend php artisan db:seed --class=CmsContentSeeder
```

---

## Session Log

### 2026-07-10 — Landing-admin data sync

- Wired all Pengaturan pages to `/api/v1/content/*`, `/settings`, `/seo`
- Added PrincipalSettingsPage + `usePrincipal` / `useSavePrincipal` hooks
- Added `contentMappers.ts`; fixed `useGeneralSettings` to load hero_stats from hero group
- Expanded CmsContentSeeder navigation to 8 items (matches PublicNavbar)
- Verified landing API returns seeded hero/about/principal data; typecheck passes

### 2026-07-10 — Mobile responsive refactor

- Added `DataTableCardList` with card layout for all 10 CMS list pages on mobile
- Extended `DataTableColumn` API (`cardPrimary`, `cardHidden`, `cardPriority`, `cardRender`)
- Compact pagination mode, mobile sort/filter toolbar improvements
- Polished admin dashboard, forms, settings pages, and all landing sections for small screens
- `npm run typecheck` passes

### 2026-07-10 — API wiring

- Fixed frontend endpoints to `/api/v1` with plural resource paths
- Added backend bulk-delete trait + routes
- Wired dashboard CRUD, media manager, landing page to live API
- Moved AI context docs to project root (`agent.md`, `memory.md`, `skills.md`)

### 2026-07-10 — Initial scaffold

- Full project structure: backend API, frontend SPA, Docker, migrations, seeders
- AI context: agent.md, skills.md, memory.md, Cursor rules and skills
