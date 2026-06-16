import Link from 'next/link';
import Image from 'next/image';
import { getAuthors } from '@/lib/api';
import { SITE } from '@/lib/site';

export const revalidate = 300;

export const metadata = {
  title: `Автори — ${SITE.name}`,
  description: 'Познайомтесь з командою авторів IT Blog — досвідчені розробники та інженери, які діляться знаннями.',
  alternates: { canonical: '/authors' },
};

export default async function AuthorsPage() {
  const res = await getAuthors();
  const authors = res?.data || res || [];

  return (
    <div className="container" style={{ paddingTop: '2.5rem', paddingBottom: '3rem' }}>
      <div style={{ marginBottom: '2.5rem' }}>
        <h1 style={{ fontSize: '2rem', fontWeight: 700, marginBottom: '0.5rem' }}>
          Автори
        </h1>
        <p style={{ color: 'var(--text-2, #6b7280)', fontSize: '1.05rem' }}>
          Матеріали IT Blog пишуть практикуючі інженери з реальним досвідом у своїх галузях.
        </p>
      </div>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
          gap: '1.5rem',
        }}
      >
        {authors.map((author) => (
          <Link
            key={author.id}
            href={`/authors/${author.slug}`}
            style={{ textDecoration: 'none', color: 'inherit' }}
          >
            <div
              style={{
                border: '1px solid var(--border, #e5e7eb)',
                borderRadius: '12px',
                padding: '1.5rem',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                textAlign: 'center',
                gap: '0.75rem',
                transition: 'box-shadow 0.2s',
              }}
            >
              <div
                style={{
                  width: 80,
                  height: 80,
                  borderRadius: '50%',
                  overflow: 'hidden',
                  position: 'relative',
                  flexShrink: 0,
                  background: '#f3f4f6',
                }}
              >
                {author.avatar_url ? (
                  <Image
                    src={author.avatar_url}
                    alt={author.name}
                    fill
                    style={{ objectFit: 'cover' }}
                    sizes="80px"
                  />
                ) : (
                  <div
                    style={{
                      width: '100%',
                      height: '100%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '2rem',
                      color: '#9ca3af',
                    }}
                  >
                    {author.name?.[0] || '?'}
                  </div>
                )}
              </div>

              <div>
                <h2 style={{ fontSize: '1.05rem', fontWeight: 600, margin: 0 }}>
                  {author.name}
                </h2>
                {author.bio && (
                  <p
                    style={{
                      fontSize: '0.875rem',
                      color: 'var(--text-2, #6b7280)',
                      marginTop: '0.4rem',
                      lineHeight: 1.5,
                    }}
                  >
                    {author.bio}
                  </p>
                )}
              </div>

              <span
                style={{
                  fontSize: '0.8rem',
                  color: 'var(--accent, #4f46e5)',
                  fontWeight: 500,
                  marginTop: 'auto',
                }}
              >
                Переглянути профіль →
              </span>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}