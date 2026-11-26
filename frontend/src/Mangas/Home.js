import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { fetchLatest, fetchStats, fetchTags, MAX_OFFSET } from '../api/mangadex';
import useAsync from '../hooks/useAsync';
import MangaGrid from '../components/MangaGrid';
import Pager from '../components/Pager';
import { Empty, ErrorBox, Loading } from '../components/Status';
import { getHistory, clearHistory } from '../utils/storage';
import { chapterLabel, pickLocalized } from '../utils/manga';

const LIMIT = 24;
const LANG_NAMES = { vi: 'tiếng Việt', en: 'English' };

function ContinueReading() {
  const { t } = useTranslation();
  const [items, setItems] = useState(getHistory);
  if (!items.length) return null;
  return (
    <section className="mb-4">
      <div className="section-head">
        <h2>{t('home.continue')}</h2>
        <button
          className="btn btn-link btn-sm"
          onClick={() => {
            clearHistory();
            setItems([]);
          }}
        >
          {t('home.clear')}
        </button>
      </div>
      <div className="history-row">
        {items.map((h) => (
          <Link key={h.mangaId} to={`/chapter/${h.chapterId}`} className="history-item">
            <span className="history-item__text">
              <strong>{h.title}</strong>
              <small>{chapterLabel({ attributes: { chapter: h.chapterNumber } }, t)}</small>
            </span>
          </Link>
        ))}
      </div>
    </section>
  );
}

export default function Home() {
  const { t, i18n } = useTranslation();
  const lang = i18n.language;
  const [page, setPage] = useState(0);
  const [tag, setTag] = useState('');
  const [onlyLang, setOnlyLang] = useState(true);

  // Đổi bộ lọc -> về trang đầu.
  useEffect(() => setPage(0), [tag, onlyLang, lang]);
  useEffect(() => window.scrollTo({ top: 0 }), [page]);

  const tags = useAsync((signal) => fetchTags(signal), []);
  const list = useAsync(
    async (signal) => {
      const res = await fetchLatest(
        { offset: page * LIMIT, limit: LIMIT, lang: onlyLang ? lang : undefined, tag },
        signal
      );
      const stats = await fetchStats(res.data.map((m) => m.id), signal);
      return { ...res, stats };
    },
    [page, tag, onlyLang, lang]
  );

  const genres = (tags.data || [])
    .filter((x) => x.attributes.group === 'genre')
    .map((x) => ({ id: x.id, name: pickLocalized(x.attributes.name, 'en') }))
    .sort((a, b) => a.name.localeCompare(b.name));

  const totalPages = Math.min(
    Math.ceil((list.data?.total || 0) / LIMIT),
    Math.floor(MAX_OFFSET / LIMIT)
  );

  return (
    <>
      <ContinueReading />

      <div className="section-head">
        <h2>{t('home.latest')}</h2>
        <div className="filters">
          <select
            className="form-select form-select-sm"
            value={tag}
            onChange={(e) => setTag(e.target.value)}
            aria-label={t('home.genre')}
          >
            <option value="">{t('home.allGenres')}</option>
            {genres.map((g) => (
              <option key={g.id} value={g.id}>
                {g.name}
              </option>
            ))}
          </select>
          <label className="form-check form-check-inline m-0">
            <input
              className="form-check-input"
              type="checkbox"
              checked={onlyLang}
              onChange={(e) => setOnlyLang(e.target.checked)}
            />
            <span className="form-check-label">
              {t('home.onlyLang', { lang: LANG_NAMES[lang] || lang })}
            </span>
          </label>
        </div>
      </div>

      {list.error ? (
        <ErrorBox onRetry={list.reload} />
      ) : list.loading && !list.data ? (
        <Loading />
      ) : list.data?.data.length ? (
        <div className={list.loading ? 'is-refreshing' : ''}>
          <MangaGrid items={list.data.data} stats={list.data.stats} lang={lang} />
          <Pager page={page} totalPages={totalPages} onChange={setPage} disabled={list.loading} />
        </div>
      ) : (
        <Empty>—</Empty>
      )}
    </>
  );
}
