# IT Blog — новинний блог про інформаційні технології

Повноцінний SEO-орієнтований новинний блог, побудований згідно з технічним завданням курсу
«SEO та пошукова оптимізація».

- **Frontend:** Next.js 14 (App Router) — React зі стратегіями **SSR / SSG / ISR**
- **Backend:** Node.js + Express — REST API
- **База даних:** PostgreSQL
- **Хостинг:** Railway (3 сервіси: Frontend, Backend, PostgreSQL)

> Ключова перевага для SEO: сторінки рендеряться **на сервері**, тому пошуковий робот
> отримує готовий HTML з повним текстом статей одразу (а не порожній `<div id="root">`,
> як у чистих CSR-застосунках).

---

## Зміст функціоналу

**Публічна частина (індексується):**
- `/` — головна: останні статті, фільтр за категоріями, пагінація (SSG + revalidate)
- `/articles/[slug]` — стаття: повний текст, автор, теги, перегляди, схожі статті (ISR)
- `/categories/[slug]` — статті категорії (SSG + revalidate)
- `/authors/[slug]` — профіль автора та його статті (SSG)
- `/tags/[slug]` — статті за тегом
- `/search?q=...` — пошук (CSR + API, не індексується)

**SEO-сторінки:**
- `/sitemap.xml`, `/robots.txt`, `/rss.xml` — генеруються динамічно
- Унікальні `<title>` / `<meta description>`, Open Graph, canonical, JSON-LD для статей

**Адмін-панель `/admin` (CSR, не індексується):**
- Авторизація (JWT)
- CRUD статей, категорій, тегів
- Завантаження зображень
- Чернетки / публікація

---

## Структура репозиторію

```
it-blog/
├── apps/
│   ├── frontend/          # Next.js (App Router)
│   │   ├── app/           # маршрути, layout, SEO-роути
│   │   ├── components/    # Header, Footer, ArticleCard, ...
│   │   └── lib/           # api-клієнт, налаштування
│   └── backend/           # Express API
│       ├── src/
│       │   ├── routes/        # public, auth, admin
│       │   ├── controllers/
│       │   ├── models/        # SQL-запити
│       │   ├── middleware/    # auth (JWT), помилки, upload
│       │   └── scripts/       # міграції, seed
│       └── migrations/        # 001_schema.sql, 002_seed.sql
├── docker-compose.yml     # локальний PostgreSQL
└── README.md
```

---

## Локальний запуск (3 кроки)

### 0. Передумови
Node.js ≥ 18, та Docker (для бази) **або** локально встановлений PostgreSQL.

### 1. База даних
```bash
# з кореня проєкту — підняти PostgreSQL у Docker
docker compose up -d
```

### 2. Backend
```bash
cd apps/backend
cp .env.example .env          # за потреби відредагувати
npm install
npm run migrate -- --seed     # створити схему + тестові дані
npm run dev                   # http://localhost:4000
```

### 3. Frontend (новий термінал)
```bash
cd apps/frontend
cp .env.example .env.local     # перевірити NEXT_PUBLIC_API_URL=http://localhost:4000
npm install
npm run dev                    # http://localhost:3000
```

Готово:
- Сайт — http://localhost:3000
- Адмінка — http://localhost:3000/admin
- API — http://localhost:4000

**Демо-доступ до адмінки:** `olena@itblog.dev` / `admin123`

---

## Розгортання на Railway

Створіть на Railway один проєкт із трьома сервісами.

### A. PostgreSQL
`New → Database → PostgreSQL`. Railway сам згенерує змінну `DATABASE_URL`.

### B. Backend (сервіс із цього репозиторію)
1. `New → GitHub Repo` → оберіть репозиторій.
2. У налаштуваннях сервісу **Root Directory:** `apps/backend`.
3. Variables:
   - `DATABASE_URL` → посилання на змінну з сервісу PostgreSQL (Reference).
   - `JWT_SECRET` → довгий випадковий рядок.
   - `PGSSL` → `true`
   - `CORS_ORIGIN` → URL вашого фронтенду (можна `*` на час налаштування).
4. Після першого деплою застосуйте міграції (один раз):
   - скопіюйте **публічний** `DATABASE_URL` бази з Railway;
   - локально: `cd apps/backend && DATABASE_URL="<той-URL>" PGSSL=true npm run migrate -- --seed`

### C. Frontend
1. Ще один сервіс із того ж репозиторію, **Root Directory:** `apps/frontend`.
2. Variables:
   - `NEXT_PUBLIC_API_URL` → публічний URL backend-сервісу (напр. `https://it-blog-backend.up.railway.app`).
   - `API_URL` → той самий публічний URL (або внутрішня адреса `http://<backend>.railway.internal:4000`).
   - `NEXT_PUBLIC_SITE_URL` → майбутній публічний URL сайту (домен або `*.up.railway.app`).
3. У сервісі ввімкніть **Generate Domain** (Settings → Networking) — отримаєте публічний URL.

Кожен `git push` у `main` автоматично перевикладає сервіси.

---

## Змінні середовища

**Backend** (`apps/backend/.env`):
| Змінна | Призначення |
|--------|-------------|
| `DATABASE_URL` | рядок підключення до PostgreSQL |
| `JWT_SECRET` | секрет для підпису токенів |
| `PORT` | порт сервера (за замовч. 4000) |
| `CORS_ORIGIN` | дозволений origin фронтенду |
| `PGSSL` | `true` для хмарної БД |

**Frontend** (`apps/frontend/.env.local`):
| Змінна | Призначення |
|--------|-------------|
| `NEXT_PUBLIC_API_URL` | URL API з боку браузера |
| `API_URL` | URL API для серверного рендерингу |
| `NEXT_PUBLIC_SITE_URL` | публічний URL сайту (SEO) |

---

## REST API (стисло)

```
GET  /api/articles                  список (пагінація, ?category=)
GET  /api/articles/:slug            одна стаття
GET  /api/articles/:slug/related    схожі
POST /api/articles/:id/view         +1 перегляд
GET  /api/categories                категорії
GET  /api/categories/:slug/articles статті категорії
GET  /api/tags , /api/tags/:slug/articles
GET  /api/authors , /api/authors/:slug , /api/authors/:slug/articles
GET  /api/search?q=...              пошук

POST /api/auth/login                { email, password } → { token }
# Захищені (Authorization: Bearer <token>):
GET/POST/PUT/DELETE /api/admin/articles[/:id]
GET/POST/PUT/DELETE /api/admin/categories[/:id]
GET/POST/DELETE     /api/admin/tags[/:id]
POST /api/admin/upload              (multipart, поле "image")
```

Формат відповіді: `{ "data": ... , "meta": {...} }` або `{ "error": { "code", "message" } }`.

---

Навчальний проєкт. Демо-контент згенеровано для наповнення.
