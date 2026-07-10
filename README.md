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

| Layer      | Technologies                                                                                                             |
| ---------- | ------------------------------------------------------------------------------------------------------------------------ |
| Frontend   | Node.js, React 19, Vite, TypeScript, TanStack Query, Zustand, React Hook Form, Zod, Radix UI, TailwindCSS, Framer Motion |
| Backend    | Laravel 13, PHP 8.4, Sanctum, Spatie Permission, Intervention Image                                                      |
| Database   | MySQL 8                                                                                                                  |
| Web Server | Apache (production)                                                                                                      |
| DevOps     | Docker Compose (backend, frontend, mysql, mailpit)                                                                       |

## Quick Start

### Prerequisites

- **Node.js 20+** and npm (required for frontend development)
- **PHP 8.4+**, Composer, and **MySQL 8** (for backend)
- **Apache** with `mod_rewrite` enabled (production)
- Docker & Docker Compose (optional, for full local stack)

### 1. Clone & configure

```bash
git clone git@github.com:agungkurniawanfaisol/schooll-universal-app.git
cd schooll-universal-app
cp .env.example .env
cp backend/.env.example backend/.env
```

Edit `.env` and `backend/.env` — set MySQL credentials and `VITE_API_URL` to your API base URL.

### 2. Start with Node.js (frontend — client development)

Frontend development begins here. Run the Vite dev server with hot reload:

```bash
cd frontend
npm install
npm run dev
```

| Service                 | URL                   |
| ----------------------- | --------------------- |
| **Frontend (Vite HMR)** | http://localhost:5173 |

The dev server proxies API requests to the backend. Keep this running while you work on UI — changes reload instantly.

**Client development workflow:**

```bash
cd frontend
npm run dev          # start dev server (keep running)
npm run typecheck    # check TypeScript
npm run lint         # lint code
npm run build        # production build
npm test             # Vitest unit tests
```

### Testing

```bash
# Backend (Pest + PHPUnit) — Docker
docker compose exec backend php artisan test

# Backend — local
cd backend && php artisan test

# Frontend unit tests (Vitest)
cd frontend && npm test

# Frontend E2E (Playwright — stack must be running)
cd frontend && npm run test:e2e
```

CI runs backend and frontend unit tests on push/PR via [`.github/workflows/test.yml`](.github/workflows/test.yml).

Point `VITE_API_URL` in `.env` to your running API (e.g. `http://localhost:8080/api/v1` when using Docker, or `http://localhost:8000/api/v1` with `php artisan serve`).

### 3. MySQL database

Create the database and user, then run migrations:

```bash
# Example — adjust credentials to match your .env
mysql -u root -p -e "CREATE DATABASE sekolah_cms CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;"
mysql -u root -p -e "CREATE USER 'sekolah'@'localhost' IDENTIFIED BY 'secret';"
mysql -u root -p -e "GRANT ALL ON sekolah_cms.* TO 'sekolah'@'localhost';"

cd backend
composer install
cp .env.example .env
php artisan key:generate
php artisan migrate --seed
php artisan storage:link
php artisan serve   # API at http://localhost:8000/api/v1
```

### 4. Apache (production)

Point Apache `DocumentRoot` to `backend/public` and enable `mod_rewrite`:

```apache
<VirtualHost *:80>
    ServerName your-school-domain.test
    DocumentRoot /var/www/schooll-universal-app/backend/public

    <Directory /var/www/schooll-universal-app/backend/public>
        AllowOverride All
        Require all granted
    </Directory>

    ErrorLog ${APACHE_LOG_DIR}/sekolah-error.log
    CustomLog ${APACHE_LOG_DIR}/sekolah-access.log combined
</VirtualHost>
```

Build the frontend and serve static files from Apache or a CDN:

```bash
cd frontend
npm run build
# Deploy frontend/dist/ to your static host or configure Apache alias
```

API will be available at `https://your-domain.test/api/v1`.

### Docker (optional full stack)

```bash
docker compose up -d --build
docker compose exec backend php artisan migrate --seed --force
docker compose exec backend php artisan storage:link
```

| Service                 | URL                          |
| ----------------------- | ---------------------------- |
| **Frontend (Vite HMR)** | http://localhost:5173        |
| **API (via proxy)**     | http://localhost:8080/api/v1 |
| **phpMyAdmin**          | http://localhost:8081        |
| **Mailpit**             | http://localhost:8025        |

With Docker running, start frontend separately for client development:

```bash
cd frontend && npm install && npm run dev
```

## Project Structure

```
schooll-universal-app/
├── backend/                 # Laravel API (Apache DocumentRoot → public/)
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
├── frontend/                # React SPA (Node.js / Vite)
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

## Environment Variables

### Root `.env`

```env
VITE_PORT=5173
VITE_API_URL=http://localhost:8000/api/v1
DB_DATABASE=sekolah_cms
DB_USERNAME=sekolah
DB_PASSWORD=secret
DB_ROOT_PASSWORD=rootsecret
MYSQL_PORT=3306
```

### Backend (Apache + MySQL)

```env
APP_URL=http://localhost
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=sekolah_cms
DB_USERNAME=sekolah
DB_PASSWORD=secret

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
# Frontend (Node.js)
cd frontend && npm run lint && npm run typecheck && npm run build

# Backend
cd backend && ./vendor/bin/pint
```

## Security

- Sanctum token authentication
- Spatie permission middleware on all admin routes
- Rate limiting on auth & public endpoints
- Form Request validation on all mutations
- Secure file upload with MIME validation & image compression

## License

MIT
