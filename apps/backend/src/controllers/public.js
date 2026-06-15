import * as Categories from '../models/categories.js';
import * as Tags from '../models/tags.js';
import * as Users from '../models/users.js';
import * as Articles from '../models/articles.js';
import { ok, fail, asyncH } from '../middleware/error.js';

// ---- Категорії ----
export const listCategories = asyncH(async (req, res) => {
  ok(res, await Categories.listAll());
});

export const categoryArticles = asyncH(async (req, res) => {
  const cat = await Categories.getBySlug(req.params.slug);
  if (!cat) return fail(res, 404, 'NOT_FOUND', 'Категорію не знайдено');
  const page = Math.max(1, parseInt(req.query.page) || 1);
  const perPage = Math.min(50, Math.max(1, parseInt(req.query.perPage) || 10));
  const result = await Articles.listPublished({ page, perPage, categorySlug: cat.slug });
  ok(res, { category: cat, articles: result.data }, result.meta);
});

// ---- Теги ----
export const listTags = asyncH(async (req, res) => {
  ok(res, await Tags.listAll());
});

export const tagArticles = asyncH(async (req, res) => {
  const tag = await Tags.getBySlug(req.params.slug);
  if (!tag) return fail(res, 404, 'NOT_FOUND', 'Тег не знайдено');
  // статті за тегом
  const { query } = await import('../db.js');
  const { rows } = await query(
    `SELECT a.id, a.title, a.slug, a.excerpt, a.cover_url, a.views, a.published_at,
            c.name AS category_name, c.slug AS category_slug,
            u.name AS author_name, u.slug AS author_slug
       FROM articles a
       JOIN article_tags at ON at.article_id = a.id
       LEFT JOIN categories c ON c.id = a.category_id
       LEFT JOIN users u ON u.id = a.author_id
      WHERE at.tag_id = $1 AND a.status = 'published'
      ORDER BY a.published_at DESC`,
    [tag.id]
  );
  ok(res, { tag, articles: rows });
});

// ---- Автори ----
export const getAuthor = asyncH(async (req, res) => {
  const author = await Users.getBySlug(req.params.slug);
  if (!author) return fail(res, 404, 'NOT_FOUND', 'Автора не знайдено');
  ok(res, author);
});

export const authorArticles = asyncH(async (req, res) => {
  const author = await Users.getBySlug(req.params.slug);
  if (!author) return fail(res, 404, 'NOT_FOUND', 'Автора не знайдено');
  const { query } = await import('../db.js');
  const { rows } = await query(
    `SELECT a.id, a.title, a.slug, a.excerpt, a.cover_url, a.views, a.published_at,
            c.name AS category_name, c.slug AS category_slug
       FROM articles a
       LEFT JOIN categories c ON c.id = a.category_id
      WHERE a.author_id = $1 AND a.status = 'published'
      ORDER BY a.published_at DESC`,
    [author.id]
  );
  ok(res, { author, articles: rows });
});

export const listAuthors = asyncH(async (req, res) => {
  ok(res, await Users.listAuthors());
});

// ---- Пошук ----
export const search = asyncH(async (req, res) => {
  const q = (req.query.q || '').trim();
  if (!q) return ok(res, [], { total: 0, page: 1, perPage: 10, totalPages: 1 });
  const page = Math.max(1, parseInt(req.query.page) || 1);
  const result = await Articles.search(q, { page, perPage: 10 });
  ok(res, result.data, result.meta);
});
