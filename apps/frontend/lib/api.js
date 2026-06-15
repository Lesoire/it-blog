// Клієнт для звернень до backend REST API.
//
// Сервер (Server Components) може ходити у внутрішню мережу Railway через API_URL,
// а браузер (пошук, адмінка) — через публічний NEXT_PUBLIC_API_URL.

const SERVER_BASE =
  process.env.API_URL ||
  process.env.NEXT_PUBLIC_API_URL ||
  'http://localhost:4000';

const CLIENT_BASE =
  process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';

// Базовий URL: на сервері — SERVER_BASE, у браузері — CLIENT_BASE
export const apiBase = () =>
  typeof window === 'undefined' ? SERVER_BASE : CLIENT_BASE;

// Загальний fetch з підтримкою ISR (revalidate) для серверних запитів
async function apiGet(path, { revalidate = 60, tags } = {}) {
  const url = `${apiBase()}${path}`;
  const res = await fetch(url, {
    next: { revalidate, tags },
    headers: { Accept: 'application/json' },
  });
  if (!res.ok) {
    if (res.status === 404) return null;
    throw new Error(`API ${res.status}: ${url}`);
  }
  return res.json();
}

// ---- Публічні запити (для Server Components) ----

export const getArticles = (params = {}) => {
  const qs = new URLSearchParams(params).toString();
  return apiGet(`/api/articles${qs ? `?${qs}` : ''}`, { revalidate: 60 });
};

export const getArticle = (slug) =>
  apiGet(`/api/articles/${slug}`, { revalidate: 30 });

export const getRelated = (slug) =>
  apiGet(`/api/articles/${slug}/related`, { revalidate: 60 });

export const getCategories = () =>
  apiGet('/api/categories', { revalidate: 300 });

export const getCategoryArticles = (slug, params = {}) => {
  const qs = new URLSearchParams(params).toString();
  return apiGet(`/api/categories/${slug}/articles${qs ? `?${qs}` : ''}`, { revalidate: 120 });
};

export const getTags = () => apiGet('/api/tags', { revalidate: 300 });

export const getTagArticles = (slug) =>
  apiGet(`/api/tags/${slug}/articles`, { revalidate: 120 });

export const getAuthor = (slug) =>
  apiGet(`/api/authors/${slug}`, { revalidate: 300 });

export const getAuthorArticles = (slug) =>
  apiGet(`/api/authors/${slug}/articles`, { revalidate: 300 });

export const getAuthors = () => apiGet('/api/authors', { revalidate: 300 });

// ---- Клієнтські запити (браузер) ----

export const searchArticles = async (q) => {
  const res = await fetch(`${CLIENT_BASE}/api/search?q=${encodeURIComponent(q)}`);
  if (!res.ok) throw new Error('Помилка пошуку');
  return res.json();
};

export const incrementView = (id) =>
  fetch(`${CLIENT_BASE}/api/articles/${id}/view`, { method: 'POST' }).catch(() => {});
