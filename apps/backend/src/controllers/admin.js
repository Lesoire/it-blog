import * as Articles from '../models/articles.js';
import * as Categories from '../models/categories.js';
import * as Tags from '../models/tags.js';
import * as Users from '../models/users.js';
import { ok, fail, asyncH } from '../middleware/error.js';

// ---------- Статті ----------
export const listArticles = asyncH(async (req, res) => {
  ok(res, await Articles.adminList());
});

export const getArticle = asyncH(async (req, res) => {
  const art = await Articles.adminGetById(parseInt(req.params.id));
  if (!art) return fail(res, 404, 'NOT_FOUND', 'Статтю не знайдено');
  ok(res, art);
});

export const createArticle = asyncH(async (req, res) => {
  const { title, slug, content } = req.body || {};
  if (!title || !slug || !content) {
    return fail(res, 400, 'BAD_REQUEST', 'Обовʼязкові поля: title, slug, content');
  }
  // автор за замовчуванням — поточний користувач
  const data = { ...req.body, author_id: req.body.author_id || req.user.id };
  const article = await Articles.create(data);
  ok(res, article);
});

export const updateArticle = asyncH(async (req, res) => {
  const article = await Articles.update(parseInt(req.params.id), req.body || {});
  if (!article) return fail(res, 404, 'NOT_FOUND', 'Статтю не знайдено');
  ok(res, article);
});

export const deleteArticle = asyncH(async (req, res) => {
  const okDel = await Articles.remove(parseInt(req.params.id));
  if (!okDel) return fail(res, 404, 'NOT_FOUND', 'Статтю не знайдено');
  ok(res, { deleted: true });
});

// ---------- Категорії ----------
export const listCategories = asyncH(async (req, res) => {
  ok(res, await Categories.listAll());
});

export const createCategory = asyncH(async (req, res) => {
  const { name, slug } = req.body || {};
  if (!name || !slug) return fail(res, 400, 'BAD_REQUEST', 'Обовʼязкові поля: name, slug');
  ok(res, await Categories.create(req.body));
});

export const updateCategory = asyncH(async (req, res) => {
  const cat = await Categories.update(parseInt(req.params.id), req.body || {});
  if (!cat) return fail(res, 404, 'NOT_FOUND', 'Категорію не знайдено');
  ok(res, cat);
});

export const deleteCategory = asyncH(async (req, res) => {
  const okDel = await Categories.remove(parseInt(req.params.id));
  if (!okDel) return fail(res, 404, 'NOT_FOUND', 'Категорію не знайдено');
  ok(res, { deleted: true });
});

// ---------- Теги ----------
export const listTags = asyncH(async (req, res) => {
  ok(res, await Tags.listAll());
});

export const createTag = asyncH(async (req, res) => {
  const { name, slug } = req.body || {};
  if (!name || !slug) return fail(res, 400, 'BAD_REQUEST', 'Обовʼязкові поля: name, slug');
  ok(res, await Tags.create(req.body));
});

export const deleteTag = asyncH(async (req, res) => {
  const okDel = await Tags.remove(parseInt(req.params.id));
  if (!okDel) return fail(res, 404, 'NOT_FOUND', 'Тег не знайдено');
  ok(res, { deleted: true });
});

// ---------- Автори ----------
export const listAuthors = asyncH(async (req, res) => {
  ok(res, await Users.listAuthors());
});

// ---------- Завантаження зображення ----------
// Файл уже збережено multer-middleware; повертаємо публічний URL.
export const upload = asyncH(async (req, res) => {
  if (!req.file) return fail(res, 400, 'BAD_REQUEST', 'Файл не надіслано (поле "image")');
  const base = process.env.PUBLIC_URL || `${req.protocol}://${req.get('host')}`;
  const url = `${base}/uploads/${req.file.filename}`;
  ok(res, { url, filename: req.file.filename });
});
