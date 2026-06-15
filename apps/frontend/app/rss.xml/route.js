import { getArticles } from '@/lib/api';
import { SITE } from '@/lib/site';

export const revalidate = 1800;

const escape = (s = '') =>
  s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

export async function GET() {
  let articles = [];
  try {
    const res = await getArticles({ perPage: 20 });
    articles = res?.data || [];
  } catch {
    articles = [];
  }

  const items = articles
    .map(
      (a) => `    <item>
      <title>${escape(a.title)}</title>
      <link>${SITE.url}/articles/${a.slug}</link>
      <guid>${SITE.url}/articles/${a.slug}</guid>
      <description>${escape(a.excerpt || '')}</description>
      <category>${escape(a.category_name || '')}</category>
      <pubDate>${a.published_at ? new Date(a.published_at).toUTCString() : ''}</pubDate>
    </item>`
    )
    .join('\n');

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0">
  <channel>
    <title>${escape(SITE.name)}</title>
    <link>${SITE.url}</link>
    <description>${escape(SITE.description)}</description>
    <language>uk</language>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
${items}
  </channel>
</rss>`;

  return new Response(xml, {
    headers: { 'Content-Type': 'application/rss+xml; charset=utf-8' },
  });
}
