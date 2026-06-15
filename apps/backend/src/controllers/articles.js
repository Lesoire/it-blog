import * as Articles from '../models/articles.js';
import { ok, fail, asyncH } from '../middleware/error.js';

// GET /api/articles?page=&perPage=&category=
export const list = asyncH(async (req, res) => {
  const page = Math.max(1, parseInt(req.query.page) || 1);
  const perPage = Math.min(50, Math.max(1, parseInt(req.query.perPage) || 10));
  const categorySlug = req.query.category || null;
  const result = await Articles.listPublished({ page, perPage, categorySlug });
  ok(res, result.data, result.meta);
});

// GET /api/articles/:slug
export const getOne = asyncH(async (req, res) => {
  const article = await Articles.getBySlug(req.params.slug);
  if (!article) return fail(res, 404, 'NOT_FOUND', 'Статтю не знайдено');
  ok(res, article);
});

// GET /api/articles/:slug/related
export const related = asyncH(async (req, res) => {
  const rows = await Articles.getRelated(req.params.slug, 3);
  ok(res, rows);
});

// POST /api/articles/:id/view
export const view = asyncH(async (req, res) => {
  const id = parseInt(req.params.id);
  if (!id) return fail(res, 400, 'BAD_REQUEST', 'Невірний id');
  await Articles.incrementViews(id);
  ok(res, { incremented: true });
});
