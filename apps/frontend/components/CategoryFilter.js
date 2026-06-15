import Link from 'next/link';

export default function CategoryFilter({ categories, active }) {
  return (
    <nav className="filterbar" aria-label="Фільтр за категоріями">
      <Link href="/" className={`chip${!active ? ' active' : ''}`}>
        усі
      </Link>
      {categories.map((c) => (
        <Link
          key={c.slug}
          href={`/categories/${c.slug}`}
          className={`chip${active === c.slug ? ' active' : ''}`}
        >
          {c.name}
        </Link>
      ))}
    </nav>
  );
}
