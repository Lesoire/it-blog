import { notFound } from 'next/navigation';
import { getTagArticles, getTags } from '@/lib/api';
import ArticleCard from '@/components/ArticleCard';

export const revalidate = 120;

export async function generateStaticParams() {
  try {
    const res = await getTags();
    return (res?.data || []).map((t) => ({ slug: t.slug }));
  } catch {
    return [];
  }
}

export async function generateMetadata({ params }) {
  return {
    title: `#${params.slug}`,
    description: `Статті з тегом #${params.slug}`,
    alternates: { canonical: `/tags/${params.slug}` },
  };
}

export default async function TagPage({ params }) {
  const res = await getTagArticles(params.slug);
  const data = res?.data;
  if (!data?.tag) notFound();

  const { tag, articles } = data;

  return (
    <div className="container">
      <section className="hero" style={{ marginLeft: -24, marginRight: -24, paddingLeft: 24, paddingRight: 24 }}>
        <span className="kicker">тег</span>
        <h1 className="display" style={{ marginTop: 14 }}>#{tag.name}</h1>
      </section>
      {articles.length === 0 ? (
        <div className="empty">Немає статей з цим тегом.</div>
      ) : (
        <div className="grid" style={{ marginTop: 28 }}>
          {articles.map((a) => (
            <ArticleCard key={a.id} article={a} />
          ))}
        </div>
      )}
    </div>
  );
}
