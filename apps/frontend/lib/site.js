// Загальні налаштування сайту та утиліти.

export const SITE = {
  name: 'IT Blog',
  tagline: 'Новини світу інформаційних технологій',
  description:
    'IT Blog — новини, статті та огляди про frontend, backend, DevOps, штучний інтелект та кібербезпеку українською мовою.',
  // Публічний URL сайту (для canonical, sitemap, OG). Задається через env.
  url: process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000',
};

// Колірний акцент для кожної категорії (за slug)
export const CATEGORY_ACCENT = {
  frontend: '#4f46e5',
  'backend-devops': '#0e7c66',
  'ai-ml': '#b4530a',
  cybersecurity: '#b42318',
  tools: '#6941c6',
};

export const accentFor = (slug) => CATEGORY_ACCENT[slug] || '#4f46e5';

// Формат дати укр. локаллю
export function formatDate(value) {
  if (!value) return '';
  const d = new Date(value);
  return d.toLocaleDateString('uk-UA', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
}

// ISO-дата для <time datetime> та structured data
export const isoDate = (value) => (value ? new Date(value).toISOString() : '');

// Приблизний час читання за кількістю слів у HTML
export function readingTime(html = '') {
  const text = html.replace(/<[^>]+>/g, ' ');
  const words = text.trim().split(/\s+/).filter(Boolean).length;
  const minutes = Math.max(1, Math.round(words / 200));
  return `${minutes} хв читання`;
}
