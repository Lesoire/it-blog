-- =====================================================================
-- IT Blog — стартова схема бази даних (PostgreSQL)
-- =====================================================================

-- Автори / користувачі
CREATE TABLE IF NOT EXISTS users
(
    id         SERIAL PRIMARY KEY,
    name       VARCHAR(100) NOT NULL,
    slug       VARCHAR(100) NOT NULL UNIQUE,
    email      VARCHAR(150) NOT NULL UNIQUE,
    password   VARCHAR(255) NOT NULL,
    bio        TEXT,
    avatar_url VARCHAR(500),
    is_admin   BOOLEAN   DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT NOW()
);

-- Категорії
CREATE TABLE IF NOT EXISTS categories
(
    id          SERIAL PRIMARY KEY,
    name        VARCHAR(100) NOT NULL,
    slug        VARCHAR(100) NOT NULL UNIQUE,
    description TEXT,
    created_at  TIMESTAMP DEFAULT NOW()
);

-- Статті
CREATE TABLE IF NOT EXISTS articles
(
    id               SERIAL PRIMARY KEY,
    title            VARCHAR(300) NOT NULL,
    slug             VARCHAR(300) NOT NULL UNIQUE,
    excerpt          TEXT,                        -- короткий опис для анонсу
    content          TEXT         NOT NULL,
    cover_url        VARCHAR(500),
    author_id        INTEGER REFERENCES users (id),
    category_id      INTEGER REFERENCES categories (id),
    status           VARCHAR(20) DEFAULT 'draft', -- draft | published
    views            INTEGER     DEFAULT 0,
    meta_title       VARCHAR(300),                -- SEO заголовок
    meta_description VARCHAR(500),                -- SEO опис
    published_at     TIMESTAMP,
    created_at       TIMESTAMP   DEFAULT NOW(),
    updated_at       TIMESTAMP   DEFAULT NOW()
);

-- Теги
CREATE TABLE IF NOT EXISTS tags
(
    id         SERIAL PRIMARY KEY,
    name       VARCHAR(100) NOT NULL,
    slug       VARCHAR(100) NOT NULL UNIQUE,
    created_at TIMESTAMP DEFAULT NOW()
);

-- Зв'язок статей та тегів (many-to-many)
CREATE TABLE IF NOT EXISTS article_tags
(
    article_id INTEGER REFERENCES articles (id) ON DELETE CASCADE,
    tag_id     INTEGER REFERENCES tags (id) ON DELETE CASCADE,
    PRIMARY KEY (article_id, tag_id)
);

-- Індекси для швидкого пошуку
CREATE INDEX IF NOT EXISTS idx_articles_slug ON articles (slug);
CREATE INDEX IF NOT EXISTS idx_articles_status ON articles (status);
CREATE INDEX IF NOT EXISTS idx_articles_category ON articles (category_id);
CREATE INDEX IF NOT EXISTS idx_articles_author ON articles (author_id);
CREATE INDEX IF NOT EXISTS idx_articles_published ON articles (published_at DESC);

-- Повнотекстовий пошук по заголовку + тексту (простий ILIKE працює і без цього,
-- але GIN-індекс прискорює пошук на великих обсягах)
CREATE INDEX IF NOT EXISTS idx_articles_search
    ON articles USING gin (to_tsvector('simple', title || ' ' || coalesce(content, '')));
