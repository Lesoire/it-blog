'use client';

import { useEffect } from 'react';
import { incrementView } from '@/lib/api';

// Збільшує лічильник переглядів один раз на завантаження сторінки статті.
// Працює на клієнті, тому не заважає кешуванню (ISR) самої сторінки.
export default function ViewCounter({ articleId }) {
  useEffect(() => {
    if (!articleId) return;
    const key = `viewed:${articleId}`;
    // У межах сесії рахуємо лише один перегляд
    if (sessionStorage.getItem(key)) return;
    sessionStorage.setItem(key, '1');
    incrementView(articleId);
  }, [articleId]);

  return null;
}
