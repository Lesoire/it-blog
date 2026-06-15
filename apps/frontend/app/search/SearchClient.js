'use client';

import { useState, useEffect, useCallback } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { searchArticles } from '@/lib/api';
import ArticleCard from '@/components/ArticleCard';

export default function SearchClient() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const initial = searchParams.get('q') || '';

  const [query, setQuery] = useState(initial);
  const [results, setResults] = useState([]);
  const [meta, setMeta] = useState(null);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);

  const runSearch = useCallback(async (q) => {
    const term = q.trim();
    if (!term) {
      setResults([]);
      setMeta(null);
      setSearched(false);
      return;
    }
    setLoading(true);
    setSearched(true);
    try {
      const res = await searchArticles(term);
      setResults(res?.data || []);
      setMeta(res?.meta || null);
    } catch {
      setResults([]);
    } finally {
      setLoading(false);
    }
  }, []);

  // Пошук при першому завантаженні, якщо є ?q=
  useEffect(() => {
    if (initial) runSearch(initial);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onSubmit = () => {
    router.replace(`/search?q=${encodeURIComponent(query)}`);
    runSearch(query);
  };

  return (
    <div className="container" style={{ paddingTop: 48, paddingBottom: 64 }}>
      <span className="kicker">пошук</span>
      <h1 className="display" style={{ marginTop: 14, fontSize: '2.4rem' }}>
        Знайти статтю
      </h1>

      <div className="search-box">
        <input
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && onSubmit()}
          placeholder="React, Docker, безпека…"
          aria-label="Пошуковий запит"
          autoFocus
        />
        <button className="btn" onClick={onSubmit} disabled={loading}>
          {loading ? '…' : 'Шукати'}
        </button>
      </div>

      {meta && (
        <p className="kicker" style={{ marginTop: 18 }}>
          знайдено: {meta.total}
        </p>
      )}

      <div style={{ marginTop: 24 }}>
        {loading ? (
          <div className="empty">Шукаємо…</div>
        ) : results.length > 0 ? (
          <div className="grid">
            {results.map((a) => (
              <ArticleCard key={a.id} article={a} />
            ))}
          </div>
        ) : searched ? (
          <div className="empty">За запитом нічого не знайдено. Спробуйте інші слова.</div>
        ) : (
          <div className="empty">Введіть запит, щоб шукати серед статей.</div>
        )}
      </div>
    </div>
  );
}
