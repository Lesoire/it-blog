import Link from 'next/link';
import { SITE } from '@/lib/site';

export const revalidate = 3600;

export const metadata = {
  title: `Про нас — ${SITE.name}`,
  description: 'IT Blog — українське медіа про розробку програмного забезпечення.',
  alternates: { canonical: '/about' },
};

export default function AboutPage() {
  return (
    <div className="container" style={{ paddingTop: '2.5rem', paddingBottom: '3rem' }}>
      <div style={{ maxWidth: 720 }}>
        <h1 style={{ fontSize: '2rem', fontWeight: 700, marginBottom: '0.5rem' }}>
          Про IT Blog
        </h1>
        <p style={{ color: 'var(--text-2, #6b7280)', fontSize: '0.875rem', marginBottom: '2.5rem' }}>
          Засновано у 2024 році
        </p>

        <section style={{ marginBottom: '2.5rem' }}>
          <h2 style={{ fontSize: '1.2rem', fontWeight: 600, marginBottom: '0.75rem' }}>Що таке IT Blog</h2>
          <p style={{ lineHeight: 1.8, marginBottom: '0.75rem' }}>
            IT Blog — українськомовне видання для розробників і технічних фахівців. Ми публікуємо
            статті про frontend, backend, DevOps, штучний інтелект та кібербезпеку.
          </p>
          <p style={{ lineHeight: 1.8 }}>
            Наша аудиторія — junior і middle розробники, які хочуть розвиватися, та досвідчені фахівці.
          </p>
        </section>

        <section style={{ marginBottom: '2.5rem' }}>
          <h2 style={{ fontSize: '1.2rem', fontWeight: 600, marginBottom: '0.75rem' }}>Місія</h2>
          <p style={{ lineHeight: 1.8 }}>
            Робити якісні технічні знання доступними українською мовою.
          </p>
        </section>

        <section style={{ marginBottom: '2.5rem' }}>
          <h2 style={{ fontSize: '1.2rem', fontWeight: 600, marginBottom: '0.75rem' }}>Редакційна політика</h2>
          <ul style={{ lineHeight: 2, paddingLeft: '1.25rem' }}>
            <li>Кожну статтю перевіряє технічний редактор перед публікацією.</li>
            <li>Ми вказуємо дату публікації та дату останнього оновлення матеріалу.</li>
            <li>Автори підписують статті власним іменем.</li>
            <li>Рекламний і спонсорський контент чітко позначається.</li>
            <li>Помилки виправляємо з приміткою про зміни.</li>
          </ul>
        </section>

        <section style={{ marginBottom: '2.5rem' }}>
          <h2 style={{ fontSize: '1.2rem', fontWeight: 600, marginBottom: '0.75rem' }}>Команда</h2>
          <p style={{ lineHeight: 1.8, marginBottom: '1rem' }}>
            Наші автори — практикуючі інженери з досвідом у комерційних проєктах.
          </p>
          <Link
            href="/authors"
            style={{
              display: 'inline-block',
              padding: '0.5rem 1.25rem',
              background: 'var(--accent, #4f46e5)',
              color: '#fff',
              borderRadius: '8px',
              textDecoration: 'none',
              fontSize: '0.9rem',
              fontWeight: 500,
            }}
          >
            Переглянути авторів →
          </Link>
        </section>

        <section style={{ marginBottom: '2.5rem' }}>
          <h2 style={{ fontSize: '1.2rem', fontWeight: 600, marginBottom: '0.75rem' }}>Ми в мережі</h2>
          <div style={{ display: 'flex', gap: '1.25rem', flexWrap: 'wrap' }}>
            <a href="https://t.me/itblog_ua" target="_blank" rel="noopener noreferrer" style={{ fontSize: '0.9rem', color: 'var(--accent, #4f46e5)', textDecoration: 'none', fontWeight: 500 }}>Telegram ↗</a>
            <a href="https://github.com/itblog-ua" target="_blank" rel="noopener noreferrer" style={{ fontSize: '0.9rem', color: 'var(--accent, #4f46e5)', textDecoration: 'none', fontWeight: 500 }}>GitHub ↗</a>
            <a href="https://linkedin.com/company/itblog-ua" target="_blank" rel="noopener noreferrer" style={{ fontSize: '0.9rem', color: 'var(--accent, #4f46e5)', textDecoration: 'none', fontWeight: 500 }}>LinkedIn ↗</a>
          </div>
        </section>

        <section style={{ padding: '1.5rem', border: '1px solid var(--border, #e5e7eb)', borderRadius: '12px', background: 'var(--surface-2, #f9fafb)' }}>
          <h2 style={{ fontSize: '1.1rem', fontWeight: 600, marginBottom: '0.5rem' }}>Контакти</h2>
          <p style={{ lineHeight: 1.8, marginBottom: '0.5rem' }}>Питання, пропозиції статей або співпраця:</p>
          <a href="mailto:hello@itblog.dev" style={{ fontSize: '1rem', color: 'var(--accent, #4f46e5)', fontWeight: 600, textDecoration: 'none' }}>
            hello@itblog.dev
          </a>
        </section>
      </div>
    </div>
  );
}
