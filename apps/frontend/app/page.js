import { getArticles, getCategories } from '@/lib/api';
import { SITE } from '@/lib/site';
import ArticleCard from '@/components/ArticleCard';
import CategoryFilter from '@/components/CategoryFilter';
import Pagination from '@/components/Pagination';

// SSG + періодична регенерація (revalidate). Сторінка віддається як готовий HTML.
export const revalidate = 60;

export const metadata = {
  alternates: { canonical: '/' },
};

export default async function HomePage({ searchParams }) {
  const page = Math.max(1, parseInt(searchParams?.page) || 1);

  const [articlesRes, categoriesRes] = await Promise.all([
    getArticles({ page, perPage: 9 }),
    getCategories(),
  ]);

  const articles = articlesRes?.data || [];
  const meta = articlesRes?.meta;
  const categories = categoriesRes?.data || [];

  const [featured, ...rest] = articles;

  return (
    <>
      <section className="hero">
        <div className="container">
          <span className="kicker">{SITE.name.toLowerCase()}</span>
          <h1 className="display" style={{ marginTop: 14 }}>
            {SITE.tagline}
          </h1>
          <p className="lede">
            Статті, новини та практичні розбори про frontend, backend, DevOps,
            штучний інтелект та кібербезпеку — українською.
          </p>
        </div>
      </section>

      <div className="container">
        <CategoryFilter categories={categories} />

        {articles.length === 0 ? (
          <div className="empty">Поки що немає опублікованих статей.</div>
        ) : (
          <>
            <div className="grid">
              {page === 1 && featured && (
                <ArticleCard article={featured} featured />
              )}
              {(page === 1 ? rest : articles).map((a) => (
                <ArticleCard key={a.id} article={a} />
              ))}
            </div>
            <Pagination meta={meta} basePath="/" />
          </>
        )}
      </div>
    </>
  );
}
