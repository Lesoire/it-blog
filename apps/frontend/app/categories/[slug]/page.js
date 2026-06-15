import { notFound } from 'next/navigation';
import { getCategoryArticles, getCategories } from '@/lib/api';
import { SITE, accentFor } from '@/lib/site';
import ArticleCard from '@/components/ArticleCard';
import CategoryFilter from '@/components/CategoryFilter';
import Pagination from '@/components/Pagination';

export const revalidate = 120; // SSG + revalidate

export async function generateStaticParams() {
  try {
    const res = await getCategories();
    return (res?.data || []).map((c) => ({ slug: c.slug }));
  } catch {
    return [];
  }
}

export async function generateMetadata({ params }) {
  const res = await getCategoryArticles(params.slug, { perPage: 1 });
  const cat = res?.data?.category;
  if (!cat) return { title: 'Категорію не знайдено' };
  return {
    title: cat.name,
    description: cat.description || `Статті в категорії ${cat.name}`,
    alternates: { canonical: `/categories/${cat.slug}` },
  };
}

export default async function CategoryPage({ params, searchParams }) {
  const page = Math.max(1, parseInt(searchParams?.page) || 1);
  const [res, categoriesRes] = await Promise.all([
    getCategoryArticles(params.slug, { page, perPage: 9 }),
    getCategories(),
  ]);

  const data = res?.data;
  if (!data?.category) notFound();

  const { category, articles } = data;
  const meta = res?.meta;
  const accent = accentFor(category.slug);

  return (
    <div style={{ '--accent': accent }}>
      <section className="hero">
        <div className="container">
          <span className="kicker">категорія</span>
          <h1 className="display" style={{ marginTop: 14 }}>{category.name}</h1>
          {category.description && (
            <p className="lede">{category.description}</p>
          )}
        </div>
      </section>

      <div className="container">
        <CategoryFilter categories={categoriesRes?.data || []} active={category.slug} />
        {articles.length === 0 ? (
          <div className="empty">У цій категорії поки що немає статей.</div>
        ) : (
          <>
            <div className="grid">
              {articles.map((a) => (
                <ArticleCard key={a.id} article={a} />
              ))}
            </div>
            <Pagination meta={meta} basePath={`/categories/${category.slug}`} />
          </>
        )}
      </div>
    </div>
  );
}
