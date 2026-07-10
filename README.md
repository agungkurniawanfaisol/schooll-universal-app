# Sekolah App — Enterprise School Website CMS

Production-ready School Website CMS with a premium public landing page and a full-featured admin panel. Built with **React 19 + Vite** (frontend) and **Laravel 13 + PHP 8.4** (backend).

> **Note:** Redis is intentionally excluded — cache uses **file driver** and queues use **database**, suitable for shared hosting.

## Features

### Public Landing Page

- Hero, About, Vision & Mission, Principal Message
- Teachers, Activities, Agenda, Gallery (lightbox)
- Testimonials, Facilities, Achievements, News
- Contact form + Google Maps
- **100% CMS-driven** — no hardcoded content
- Framer Motion animations, glassmorphism, responsive design
- SEO: meta tags, Open Graph, JSON-LD, sitemap.xml, robots.txt

### Admin CMS

- Dark mode dashboard with permission-based sidebar
- CRUD: Teachers, Agenda, Gallery, Testimonials, Activities, Facilities, Achievements, News
- Content settings: Hero, About, Vision/Mission, Contact, Navigation, Footer, Social, SEO
- Users, Roles & Permissions (Spatie)
- Media Manager (upload, compress, drag & drop)
- Reusable DataTable (search, filter, sort, pagination, bulk delete)

### Backend Architecture

- Clean Architecture: Actions, DTOs, Repositories, Services, Policies
- REST API `/api/v1` with standardized JSON responses
- Laravel Sanctum authentication
- MySQL 8 with optimized indexes
- File cache + database queue (no Redis)

## Tech Stack

| Layer    | Technologies                                                                                                    |
| -------- | --------------------------------------------------------------------------------------------------------------- |
| Frontend | React 19, Vite, TypeScript, TanStack Query, Zustand, React Hook Form, Zod, Radix UI, TailwindCSS, Framer Motion |
| Backend  | Laravel 13, PHP 8.4, Sanctum, Spatie Permission, Intervention Image                                             |
| Database | MySQL 8                                                                                                         |
| DevOps   | Docker Compose (backend, frontend, mysql, mailpit)                                                              |

## Quick Start

### Prerequisites

- Docker & Docker Compose

### 1. Clone & configure

```bash
cd sekolah-app
cp .env.example .env
cp backend/.env.example backend/.env   # if needed
```

### 2. Start all services

```bash
docker compose up -d --build
```

Services:

| Service                 | URL                          |
| ----------------------- | ---------------------------- |
| **Frontend (Vite HMR)** | http://localhost:5173        |
| **API (Laravel)**       | http://localhost:8000/api/v1 |
| **Mailpit**             | http://localhost:8025        |

### 3. Initialize backend

```bash
docker compose exec backend php artisan migrate --seed --force
docker compose exec backend php artisan storage:link
```

### 4. Default admin credentials

```
Email:    admin@sekolah.test
Password: password
```

## Project Structure

```
sekolah-app/
├── backend/                 # Laravel API
│   ├── app/
│   │   ├── Actions/
│   │   ├── DTOs/
│   │   ├── Enums/
│   │   ├── Http/Controllers/Api/V1/
│   │   ├── Models/
│   │   ├── Policies/
│   │   ├── Repositories/
│   │   └── Services/
│   └── database/migrations/
├── frontend/                # React SPA
│   └── src/
│       ├── api/
│       ├── components/
│       ├── features/
│       ├── hooks/
│       ├── pages/
│       ├── stores/
│       └── validators/
└── docker/                  # Docker configs
```

## API Response Format

```json
{
  "success": true,
  "message": "Success",
  "data": {},
  "meta": {}
}
```

## Public API Endpoints

```
GET  /api/v1/public/landing
GET  /api/v1/public/teachers
GET  /api/v1/public/news
POST /api/v1/public/contact
GET  /robots.txt
GET  /sitemap.xml
```

## Development (without Docker)

### Backend

```bash
cd backend
composer install
cp .env.example .env
php artisan key:generate
php artisan migrate --seed
php artisan serve
```

### Frontend

```bash
cd frontend
npm install
npm run dev
```

## Environment Variables

### Root `.env`

```env
BACKEND_PORT=8000
VITE_PORT=5173
VITE_API_URL=http://localhost:8000/api/v1
DB_DATABASE=sekolah_cms
DB_USERNAME=sekolah
DB_PASSWORD=secret
```

### Backend cache (shared hosting friendly)

```env
CACHE_STORE=file
QUEUE_CONNECTION=database
SESSION_DRIVER=file
```

### File storage (S3 optional)

```env
FILESYSTEM_DISK=public
AWS_ACCESS_KEY_ID=
AWS_SECRET_ACCESS_KEY=
AWS_DEFAULT_REGION=
AWS_BUCKET=
```

## Code Quality

```bash
# Frontend
cd frontend && npm run lint && npm run typecheck && npm run build

# Backend
docker compose exec backend ./vendor/bin/pint
```

## Security

- Sanctum token authentication
- Spatie permission middleware on all admin routes
- Rate limiting on auth & public endpoints
- Form Request validation on all mutations
- Secure file upload with MIME validation & image compression

## License

MIT
