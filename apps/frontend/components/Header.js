import Link from 'next/link';
import { getCategories } from '@/lib/api';
import { SITE } from '@/lib/site';

export default async function Header() {
  let categories = [];
  try {
    const res = await getCategories();
    categories = res?.data || [];
  } catch {
    // Якщо бекенд недоступний під час збірки — показуємо мінімальну навігацію
    categories = [];
  }

  return (
    <header className="site-header">
      <div className="container bar">
        <Link href="/" className="brand" aria-label={`${SITE.name} — головна`}>
          <span className="dot" />
          {SITE.name}
        </Link>

        <nav className="nav" aria-label="Головна навігація">
          <span className="nav-links" style={{ display: 'contents' }}>
            {categories.slice(0, 5).map((c) => (
              <Link key={c.slug} href={`/categories/${c.slug}`}>
                {c.name}
              </Link>
            ))}
          </span>
          <Link href="/search" className="search-link" aria-label="Пошук">
            <span>⌕</span> пошук
          </Link>
        </nav>
      </div>
    </header>
  );
}
