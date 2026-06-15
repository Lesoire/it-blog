import { getArticles, getCategories, getAuthors, getTags } from '@/lib/api';
import { SITE } from '@/lib/site';

export const revalidate = 3600;

export default async function sitemap() {
  const base = SITE.url;
  const now = new Date();

  const staticPages = [
    { url: `${base}/`, lastModified: now, changeFrequency: 'daily', priority: 1 },
    { url: `${base}/search`, lastModified: now, changeFrequency: 'monthly', priority: 0.3 },
  ];

  try {
    const [articlesRes, categoriesRes, authorsRes, tagsRes] = await Promise.all([
      getArticles({ perPage: 100 }),
      getCategories(),
      getAuthors(),
      getTags(),
    ]);

    const articles = (articlesRes?.data || []).map((a) => ({
      url: `${base}/articles/${a.slug}`,
      lastModified: a.published_at ? new Date(a.published_at) : now,
      changeFrequency: 'weekly',
      priority: 0.8,
    }));

    const categories = (categoriesRes?.data || []).map((c) => ({
      url: `${base}/categories/${c.slug}`,
      lastModified: now,
      changeFrequency: 'weekly',
      priority: 0.6,
    }));

    const authors = (authorsRes?.data || []).map((a) => ({
      url: `${base}/authors/${a.slug}`,
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.4,
    }));

    const tags = (tagsRes?.data || []).map((t) => ({
      url: `${base}/tags/${t.slug}`,
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.3,
    }));

    return [...staticPages, ...articles, ...categories, ...authors, ...tags];
  } catch {
    return staticPages;
  }
}
