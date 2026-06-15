'use client';

const BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';
const TOKEN_KEY = 'itblog_admin_token';

export const getToken = () =>
  typeof window !== 'undefined' ? localStorage.getItem(TOKEN_KEY) : null;
export const setToken = (t) => localStorage.setItem(TOKEN_KEY, t);
export const clearToken = () => localStorage.removeItem(TOKEN_KEY);

async function request(path, { method = 'GET', body, auth = true, isForm = false } = {}) {
  const headers = {};
  if (!isForm) headers['Content-Type'] = 'application/json';
  if (auth) {
    const token = getToken();
    if (token) headers['Authorization'] = `Bearer ${token}`;
  }
  const res = await fetch(`${BASE}${path}`, {
    method,
    headers,
    body: isForm ? body : body ? JSON.stringify(body) : undefined,
  });
  const json = await res.json().catch(() => ({}));
  if (!res.ok) {
    const message = json?.error?.message || `Помилка ${res.status}`;
    const err = new Error(message);
    err.status = res.status;
    throw err;
  }
  return json;
}

// Auth
export const login = (email, password) =>
  request('/api/auth/login', { method: 'POST', body: { email, password }, auth: false });

// Articles
export const listArticles = () => request('/api/admin/articles');
export const getArticle = (id) => request(`/api/admin/articles/${id}`);
export const createArticle = (data) => request('/api/admin/articles', { method: 'POST', body: data });
export const updateArticle = (id, data) => request(`/api/admin/articles/${id}`, { method: 'PUT', body: data });
export const deleteArticle = (id) => request(`/api/admin/articles/${id}`, { method: 'DELETE' });

// Categories
export const listCategories = () => request('/api/admin/categories');
export const createCategory = (data) => request('/api/admin/categories', { method: 'POST', body: data });
export const updateCategory = (id, data) => request(`/api/admin/categories/${id}`, { method: 'PUT', body: data });
export const deleteCategory = (id) => request(`/api/admin/categories/${id}`, { method: 'DELETE' });

// Tags
export const listTags = () => request('/api/admin/tags');
export const createTag = (data) => request('/api/admin/tags', { method: 'POST', body: data });
export const deleteTag = (id) => request(`/api/admin/tags/${id}`, { method: 'DELETE' });

// Authors
export const listAuthors = () => request('/api/admin/authors');

// Upload
export const uploadImage = (file) => {
  const fd = new FormData();
  fd.append('image', file);
  return request('/api/admin/upload', { method: 'POST', body: fd, isForm: true });
};
