import { Suspense } from 'react';
import SearchClient from './SearchClient';

// Пошук рендериться на клієнті (CSR), тому не потребує SEO-індексації.
export const metadata = {
  title: 'Пошук',
  robots: { index: false }, // сторінку результатів пошуку не індексуємо
};

export default function SearchPage() {
  return (
    <Suspense fallback={<div className="empty">Завантаження…</div>}>
      <SearchClient />
    </Suspense>
  );
}
