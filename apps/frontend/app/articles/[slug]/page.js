import Link from 'next/link';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import { getArticle, getRelated } from '@/lib/api';
import { SITE, formatDate, isoDate, readingTime } from '@/lib/site';
import ArticleCard from '@/components/ArticleCard';
import ViewCounter from '@/components/ViewCounter';

export const revalidate = 30;

export async function generateMetadata({ params }) {
  const res = await getArticle(params.slug);
  const article = res?.data || res;
  if (!article) return {};
  return {
    title: `${article.title} Ч ${SITE.name}`,
    description: article.excerpt || '',
    alternates: { canonical: `/articles/${params.slug}` },
    openGraph: {
      title: article.title,
      description: article.excerpt || '',
      images: article.cover_url ? [{ url: article.cover_url }] : [],
      type: 'article',
      publishedTime: isoDate(article.published_at),
      modifiedTime: isoDate(article.updated_at),
      authors: article.author_name ? [article.author_name] : [],
    },
  };
}

export default async function ArticlePage({ params }) {
  const [articleRes, relatedRes] = await Promise.all([
    getArticle(params.slug),
    getRelated(params.slug),
  ]);

  const article = articleRes?.data || articleRes;
  if (!article) notFound();

  const related = relatedRes?.data || relatedRes || [];

  return (
    <div className="container" style={{ paddingTop: '2rem', paddingBottom: '3rem' }}>
      <div style={{ maxWidth: 760, margin: '0 auto' }}>

        {article.category_slug && (
          <Link href={`/categories/${article.category_slug}`} className="cat" style={{ display: 'inline-block', marginBottom: '1rem' }}>
            {article.category_name}
          </Link>
        )}

        <h1 style={{ fontSize: 'clamp(1.5rem, 4vw, 2.25rem)', fontWeight: 700, lineHeight: 1.3, marginBottom: '1rem' }}>
          {article.title}
        </h1>

        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', fontSize: '0.875rem', color: 'var(--text-2, #6b7280)', marginBottom: '1.5rem', alignItems: 'center' }}>
          <time dateTime={isoDate(article.published_at)}>{formatDate(article.published_at)}</time>
          {article.updated_at && article.updated_at !== article.published_at && (
            <span>ќновлено: <time dateTime={isoDate(article.updated_at)}>{formatDate(article.updated_at)}</time></span>
          )}
          {article.content && <span>{readingTime(article.content)}</span>}
          <ViewCounter id={article.id} initialViews={article.views} />
        </div>

        {article.cover_url && (
          <div style={{ position: 'relative', width: '100%', aspectRatio: '16/9', borderRadius: '12px', overflow: 'hidden', marginBottom: '2rem' }}>
            <Image src={article.cover_url} alt={article.title} fill style={{ objectFit: 'cover' }} sizes="(max-width: 800px) 100vw, 760px" priority />
          </div>
        )}

        {article.content ? (
          <div className="prose" dangerouslySetInnerHTML={{ __html: article.content }} style={{ lineHeight: 1.8, marginBottom: '3rem' }} />
        ) : (
          article.excerpt && (
            <p style={{ lineHeight: 1.8, marginBottom: '3rem', fontSize: '1.1rem' }}>{article.excerpt}</p>
          )
        )}

        {article.author_slug && (
          <div style={{ display: 'flex', gap: '1.25rem', alignItems: 'flex-start', padding: '1.5rem', border: '1px solid var(--border, #e5e7eb)', borderRadius: '12px', background: 'var(--surface-2, #f9fafb)', marginBottom: '3rem' }}>
            <Link href={`/authors/${article.author_slug}`} style={{ flexShrink: 0 }}>
              <div style={{ width: 64, height: 64, borderRadius: '50%', overflow: 'hidden', position: 'relative', background: '#e5e7eb' }}>
                {article.author_avatar ? (
                  <Image src={article.author_avatar} alt={article.author_name} fill style={{ objectFit: 'cover' }} sizes="64px" />
                ) : (
                  <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.5rem', color: '#9ca3af' }}>
                    {article.author_name?.[0] || '?'}
                  </div>
                )}
              </div>
            </Link>
            <div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-2, #6b7280)', marginBottom: '0.2rem' }}>јвтор</div>
              <Link href={`/authors/${article.author_slug}`} style={{ fontWeight: 600, fontSize: '1rem', textDecoration: 'none', color: 'inherit' }}>
                {article.author_name}
              </Link>
              {article.author_bio && (
                <p style={{ fontSize: '0.875rem', color: 'var(--text-2, #6b7280)', marginTop: '0.35rem', lineHeight: 1.6 }}>
                  {article.author_bio}
                </p>
              )}
            </div>
          </div>
        )}

        {article.tags?.length > 0 && (
          <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '3rem' }}>
            {article.tags.map((tag) => (
              <Link key={tag.slug} href={`/tags/${tag.slug}`} style={{ padding: '0.25rem 0.75rem', border: '1px solid var(--border, #e5e7eb)', borderRadius: '999px', fontSize: '0.8rem', textDecoration: 'none', color: 'var(--text-2, #6b7280)' }}>
                #{tag.name}
              </Link>
            ))}
          </div>
        )}

      </div>

      {related.length > 0 && (
        <div style={{ marginTop: '1rem' }}>
          <h2 style={{ fontSize: '1.2rem', fontWeight: 600, marginBottom: '1.5rem' }}>—хож≥ статт≥</h2>
          <div className="grid">
            {related.map((a) => (
              <ArticleCard key={a.id} article={a} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
