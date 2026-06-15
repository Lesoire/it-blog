import Image from 'next/image';
import { notFound } from 'next/navigation';
import { getAuthorArticles, getAuthors } from '@/lib/api';
import { SITE } from '@/lib/site';
import ArticleCard from '@/components/ArticleCard';

export const revalidate = 300; // SSG (статичні дані)

export async function generateStaticParams() {
  try {
    const res = await getAuthors();
    return (res?.data || []).map((a) => ({ slug: a.slug }));
  } catch {
    return [];
  }
}

export async function generateMetadata({ params }) {
  const res = await getAuthorArticles(params.slug);
  const author = res?.data?.author;
  if (!author) return { title: 'Автора не знайдено' };
  return {
    title: author.name,
    description: author.bio || `Статті автора ${author.name}`,
    alternates: { canonical: `/authors/${author.slug}` },
  };
}

export default async function AuthorPage({ params }) {
  const res = await getAuthorArticles(params.slug);
  const data = res?.data;
  if (!data?.author) notFound();

  const { author, articles } = data;

  return (
    <div className="container">
      <div className="profile">
        {author.avatar_url && (
          <Image src={author.avatar_url} alt={author.name} width={84} height={84} />
        )}
        <div>
          <span className="kicker">автор</span>
          <h1 className="display" style={{ fontSize: '2rem', marginTop: 8 }}>{author.name}</h1>
          {author.bio && <p className="bio">{author.bio}</p>}
        </div>
      </div>

      <div className="section-title" style={{ borderTop: 'none', marginTop: 24, paddingTop: 24 }}>
        <span className="kicker">{articles.length} публікацій</span>
      </div>

      {articles.length === 0 ? (
        <div className="empty">У автора поки що немає опублікованих статей.</div>
      ) : (
        <div className="grid">
          {articles.map((a) => (
            <ArticleCard key={a.id} article={a} />
          ))}
        </div>
      )}
    </div>
  );
}
