import Link from 'next/link';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import { getArticle, getRelated, getArticles } from '@/lib/api';
import { SITE, accentFor, formatDate, isoDate, readingTime } from '@/lib/site';
import ArticleCard from '@/components/ArticleCard';
import ViewCounter from '@/components/ViewCounter';

// ISR: сторінка кешується та періодично оновлюється.
export const revalidate = 30;
export const dynamicParams = true; // нові slug-и будуються на вимогу

// Попередньо генеруємо сторінки для наявних статей (SSG під час збірки)
export async function generateStaticParams() {
  try {
    const res = await getArticles({ perPage: 50 });
    return (res?.data || []).map((a) => ({ slug: a.slug }));
  } catch {
    return [];
  }
}

// Унікальні SEO-метатеги для кожної статті
export async function generateMetadata({ params }) {
  const res = await getArticle(params.slug);
  const a = res?.data;
  if (!a) return { title: 'Статтю не знайдено' };

  const title = a.meta_title || a.title;
  const description = a.meta_description || a.excerpt || SITE.description;
  const url = `${SITE.url}/articles/${a.slug}`;

  return {
    title,
    description,
    alternates: { canonical: `/articles/${a.slug}` },
    openGraph: {
      type: 'article',
      title,
      description,
      url,
      images: a.cover_url ? [{ url: a.cover_url }] : undefined,
      publishedTime: isoDate(a.published_at),
      authors: a.author_name ? [a.author_name] : undefined,
      section: a.category_name,
      tags: (a.tags || []).map((t) => t.name),
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: a.cover_url ? [a.cover_url] : undefined,
    },
  };
}

export default async function ArticlePage({ params }) {
  const res = await getArticle(params.slug);
  const a = res?.data;
  if (!a) notFound();

  const relatedRes = await getRelated(params.slug);
  const related = relatedRes?.data || [];
  const accent = accentFor(a.category_slug);

  // Structured Data (JSON-LD) для пошукових систем
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: a.title,
    description: a.excerpt,
    image: a.cover_url ? [a.cover_url] : undefined,
    datePublished: isoDate(a.published_at),
    dateModified: isoDate(a.updated_at || a.published_at),
    author: a.author_name
      ? { '@type': 'Person', name: a.author_name, url: `${SITE.url}/authors/${a.author_slug}` }
      : undefined,
    publisher: { '@type': 'Organization', name: SITE.name },
    articleSection: a.category_name,
    keywords: (a.tags || []).map((t) => t.name).join(', '),
    mainEntityOfPage: `${SITE.url}/articles/${a.slug}`,
  };

  return (
    <article className="article-wrap" style={{ '--accent': accent }}>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <ViewCounter articleId={a.id} />

      <div className="container">
        <header className="article-head">
          {a.category_slug && (
            <Link href={`/categories/${a.category_slug}`} className="kicker">
              {a.category_name}
            </Link>
          )}
          <h1 className="display">{a.title}</h1>
          <div className="article-meta">
            {a.author_slug && (
              <Link href={`/authors/${a.author_slug}`} className="author-chip">
                {a.author_avatar && (
                  <Image src={a.author_avatar} alt={a.author_name} width={30} height={30} />
                )}
                {a.author_name}
              </Link>
            )}
            <time dateTime={isoDate(a.published_at)}>{formatDate(a.published_at)}</time>
            <span>{readingTime(a.content)}</span>
            <span>{a.views} переглядів</span>
          </div>
        </header>
      </div>

      {a.cover_url && (
        <div className="container">
          <div className="article-cover">
            <Image
              src={a.cover_url}
              alt={a.title}
              width={980}
              height={490}
              priority
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            />
          </div>
        </div>
      )}

      <div className="container">
        {/* Контент статті — у HTML, тому повністю видимий пошуковим роботам */}
        <div className="prose" dangerouslySetInnerHTML={{ __html: a.content }} />

        {a.tags?.length > 0 && (
          <div className="tags-row">
            {a.tags.map((t) => (
              <Link key={t.slug} href={`/tags/${t.slug}`} className="tag">
                #{t.name}
              </Link>
            ))}
          </div>
        )}

        {related.length > 0 && (
          <>
            <div className="section-title">
              <span className="kicker">схожі статті</span>
            </div>
            <div className="grid">
              {related.map((r) => (
                <ArticleCard key={r.id} article={r} />
              ))}
            </div>
          </>
        )}
      </div>
    </article>
  );
}
