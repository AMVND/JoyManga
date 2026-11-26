import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { fetchStats, searchManga, MAX_OFFSET } from '../api/mangadex';
import useAsync from '../hooks/useAsync';
import MangaGrid from '../components/MangaGrid';
import Pager from '../components/Pager';
import { Empty, ErrorBox, Loading } from '../components/Status';

const LIMIT = 24;

export default function Search() {
  const { t, i18n } = useTranslation();
  const [params] = useSearchParams();
  const q = (params.get('q') || '').trim();
  const [page, setPage] = useState(0);

  useEffect(() => setPage(0), [q]);
  useEffect(() => window.scrollTo({ top: 0 }), [page, q]);

  const res = useAsync(
    async (signal) => {
      if (!q) return null;
      const r = await searchManga({ title: q, offset: page * LIMIT, limit: LIMIT }, signal);
      const stats = await fetchStats(r.data.map((m) => m.id), signal);
      return { ...r, stats };
    },
    [q, page]
  );

  if (!q) return <Empty>{t('search.hint')}</Empty>;

  const totalPages = Math.min(
    Math.ceil((res.data?.total || 0) / LIMIT),
    Math.floor(MAX_OFFSET / LIMIT)
  );

  return (
    <>
      <div className="section-head">
        <h2>{t('search.title', { q })}</h2>
      </div>
      {res.error ? (
        <ErrorBox onRetry={res.reload} />
      ) : res.loading && !res.data ? (
        <Loading />
      ) : res.data?.data.length ? (
        <div className={res.loading ? 'is-refreshing' : ''}>
          <MangaGrid items={res.data.data} stats={res.data.stats} lang={i18n.language} />
          <Pager page={page} totalPages={totalPages} onChange={setPage} disabled={res.loading} />
        </div>
      ) : (
        <Empty>{t('search.empty', { q })}</Empty>
      )}
    </>
  );
}
