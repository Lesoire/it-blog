# IT Blog

Навчальний SEO-орієнтований блог про інформаційні технології. Побудований як повноцінний продакшн-стек з серверним рендерингом, REST API та адмін-панеллю.

**Живий сайт:** [seoitblog.pp.ua](https://seoitblog.pp.ua)

---

## Стек

| Шар | Технологія |
|-----|-----------|
| Frontend | Next.js 14 (App Router) — SSR / SSG / ISR |
| Backend | Node.js + Express — REST API |
| База даних | PostgreSQL |
| Хостинг | Railway (3 сервіси: Frontend, Backend, PostgreSQL) |

---

## Структура репозиторію

```
it-blog/
├── apps/
│   ├── frontend/               # Next.js (App Router)
│   │   ├── app/                # сторінки та маршрути
│   │   │   ├── page.js         # головна — SSG + revalidate
│   │   │   ├── articles/[slug] # стаття — ISR
│   │   │   ├── categories/[slug]
│   │   │   ├── authors/        # список авторів
│   │   │   ├── authors/[slug]  # профіль автора
│   │   │   ├── about/          # сторінка про блог (E-E-A-T)
│   │   │   ├── tags/[slug]
│   │   │   ├── search/
│   │   │   ├── admin/          # адмін-панель (CSR, не індексується)
│   │   │   ├── sitemap.js      # динамічний sitemap.xml
│   │   │   ├── robots.js       # robots.txt
│   │   │   └── rss.xml/        # RSS-стрічка
│   │   ├── components/         # Header, Footer, ArticleCard, Pagination, ...
│   │   └── lib/                # api-клієнт, site.js, adminApi.js
│   └── backend/                # Express API
│       ├── src/
│       │   ├── routes/         # public.js, auth.js, admin.js
│       │   ├── controllers/    # articles.js, public.js, auth.js, admin.js
│       │   ├── models/         # SQL-запити (users, articles, categories, tags)
│       │   ├── middleware/     # JWT-авторизація, обробка помилок, upload
│       │   └── scripts/        # migrate.js
│       └── migrations/
│           ├── 001_schema.sql  # схема БД
│           └── 002_seed.sql    # тестові дані (3 автори, 15 статей)
├── docker-compose.yml          # локальний PostgreSQL
└── README.md
```

---

## Публічні сторінки

| URL | Рендеринг | Опис |
|-----|-----------|------|
| `/` | SSG + ISR | Головна — останні статті, фільтр за категоріями, пагінація |
| `/articles/[slug]` | ISR | Повний текст статті, автор, теги, схожі статті |
| `/categories/[slug]` | SSG | Статті категорії |
| `/authors` | SSG | Список авторів |
| `/authors/[slug]` | SSG | Профіль автора, біографія, кількість статей |
| `/about` | Static | Про блог — місія, редполітика, контакти (E-E-A-T) |
| `/tags/[slug]` | SSR | Статті за тегом |
| `/search` | CSR | Пошук (не індексується) |
| `/sitemap.xml` | Dynamic | Генерується з бази даних |
| `/robots.txt` | Dynamic | Керування індексацією |
| `/rss.xml` | Dynamic | RSS-стрічка статей |

---

## REST API

```
GET  /api/articles                     список статей (пагінація, ?category=, ?page=)
GET  /api/articles/:slug               одна стаття
GET  /api/articles/:slug/related       схожі статті
POST /api/articles/:id/view            +1 перегляд

GET  /api/categories                   всі категорії
GET  /api/categories/:slug/articles    статті категорії

GET  /api/tags                         всі теги
GET  /api/tags/:slug/articles          статті за тегом

GET  /api/authors                      всі автори
GET  /api/authors/:slug                профіль автора
GET  /api/authors/:slug/articles       статті автора

GET  /api/search?q=...                 повнотекстовий пошук

POST /api/auth/login                   { email, password } → { token }

# Захищені (Bearer token):
GET/POST/PUT/DELETE  /api/admin/articles[/:id]
GET/POST/PUT/DELETE  /api/admin/categories[/:id]
GET/POST/DELETE      /api/admin/tags[/:id]
POST                 /api/admin/upload
```

Формат відповіді: `{ "data": ..., "meta": { page, perPage, total, totalPages } }`

---

## База даних

5 таблиць: `users` (автори), `articles`, `categories`, `tags`, `article_tags`.

Seed містить: 3 автори, 5 категорій, 15 опублікованих статей, теги.

---

## SEO-особливості

- Серверний рендеринг — пошуковий робот отримує готовий HTML
- Унікальні `<title>` і `<meta description>` для кожної сторінки
- Open Graph теги для соцмереж
- Canonical URL
- JSON-LD (Article, Person) для структурованих даних
- Динамічний sitemap.xml і robots.txt
- ISR — сторінки оновлюються без повного перебудування

---

## Змінні середовища

**Backend** (`apps/backend/.env`):

| Змінна | Опис |
|--------|------|
| `DATABASE_URL` | рядок підключення PostgreSQL |
| `JWT_SECRET` | секрет для JWT-токенів |
| `PORT` | порт сервера (за замовч. 4000) |
| `CORS_ORIGIN` | дозволений origin фронтенду |
| `PGSSL` | `true` для хмарної БД |

**Frontend** (`apps/frontend/.env.local`):

| Змінна | Опис |
|--------|------|
| `NEXT_PUBLIC_API_URL` | URL API з боку браузера |
| `API_URL` | URL API для серверного рендерингу |
| `NEXT_PUBLIC_SITE_URL` | публічний URL сайту |
