import Link from 'next/link';

// basePath: напр. "/" або "/categories/frontend"
export default function Pagination({ meta, basePath = '/' }) {
  if (!meta || meta.totalPages <= 1) return null;
  const { page, totalPages } = meta;
  const sep = basePath.includes('?') ? '&' : '?';
  const href = (p) => (p === 1 ? basePath : `${basePath}${sep}page=${p}`);

  const pages = [];
  for (let p = 1; p <= totalPages; p++) {
    if (p === 1 || p === totalPages || Math.abs(p - page) <= 1) pages.push(p);
    else if (pages[pages.length - 1] !== '…') pages.push('…');
  }

  return (
    <nav className="pagination" aria-label="Пагінація">
      {page > 1 ? (
        <Link href={href(page - 1)} aria-label="Попередня сторінка">←</Link>
      ) : (
        <span className="disabled">←</span>
      )}
      {pages.map((p, i) =>
        p === '…' ? (
          <span key={`e${i}`} className="disabled">…</span>
        ) : p === page ? (
          <span key={p} className="current" aria-current="page">{p}</span>
        ) : (
          <Link key={p} href={href(p)}>{p}</Link>
        )
      )}
      {page < totalPages ? (
        <Link href={href(page + 1)} aria-label="Наступна сторінка">→</Link>
      ) : (
        <span className="disabled">→</span>
      )}
    </nav>
  );
}
