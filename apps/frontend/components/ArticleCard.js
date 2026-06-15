import Link from 'next/link';
import Image from 'next/image';
import { accentFor, formatDate } from '@/lib/site';

export default function ArticleCard({ article, featured = false }) {
  const accent = accentFor(article.category_slug);
  return (
    <article
      className={`card${featured ? ' featured' : ''}`}
      style={{ '--cat': accent }}
    >
      <Link href={`/articles/${article.slug}`} className="cover" aria-hidden="true" tabIndex={-1}>
        {article.cover_url ? (
          <Image
            src={article.cover_url}
            alt=""
            fill
            sizes={featured ? '(max-width: 920px) 100vw, 760px' : '(max-width: 600px) 100vw, 380px'}
            style={{ objectFit: 'cover' }}
          />
        ) : null}
      </Link>
      <div className="body">
        {article.category_slug && (
          <Link href={`/categories/${article.category_slug}`} className="cat">
            {article.category_name}
          </Link>
        )}
        <h3>
          <Link href={`/articles/${article.slug}`}>{article.title}</Link>
        </h3>
        {article.excerpt && <p className="excerpt">{article.excerpt}</p>}
        <div className="meta">
          {article.author_name && <span>{article.author_name}</span>}
          <span>{formatDate(article.published_at)}</span>
          <span>{article.views} переглядів</span>
        </div>
      </div>
    </article>
  );
}
