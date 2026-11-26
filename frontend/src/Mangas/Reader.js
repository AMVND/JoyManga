import React, { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { fetchChapter, fetchChapterIndex, fetchPages } from '../api/mangadex';
import useAsync from '../hooks/useAsync';
import { Empty, ErrorBox, Loading } from '../components/Status';
import { chapterLabel, getTitle } from '../utils/manga';
import { readJSON, saveHistory, writeJSON } from '../utils/storage';

function PageImage({ src, index, retryText }) {
  const [attempt, setAttempt] = useState(0);
  const [failed, setFailed] = useState(false);
  if (failed) {
    return (
      <button
        type="button"
        className="reader__broken"
        onClick={() => {
          setFailed(false);
          setAttempt((n) => n + 1);
        }}
      >
        {retryText} ({index + 1})
      </button>
    );
  }
  return (
    <img
      className="reader__img"
      src={attempt ? `${src}?r=${attempt}` : src}
      alt={`#${index + 1}`}
      loading="lazy"
      onError={() => setFailed(true)}
    />
  );
}

export default function Reader() {
  const { id } = useParams();
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const [dataSaver, setDataSaver] = useState(() => readJSON('joymanga.dataSaver', false));

  useEffect(() => writeJSON('joymanga.dataSaver', dataSaver), [dataSaver]);
  useEffect(() => window.scrollTo({ top: 0 }), [id]);

  const info = useAsync((signal) => fetchChapter(id, signal), [id]);
  const pages = useAsync((signal) => fetchPages(id, dataSaver, signal), [id, dataSaver]);

  const mangaRel = info.data?.relationships?.find((r) => r.type === 'manga');
  const mangaId = mangaRel?.id;
  const lang = info.data?.attributes.translatedLanguage;

  const index = useAsync(
    (signal) => (mangaId && lang ? fetchChapterIndex(mangaId, lang, signal) : Promise.resolve(null)),
    [mangaId, lang]
  );

  const siblings = index.data || [];
  const pos = siblings.findIndex((c) => c.id === id);
  const prev = pos > 0 ? siblings[pos - 1] : null;
  const next = pos >= 0 && pos < siblings.length - 1 ? siblings[pos + 1] : null;

  // Lưu lịch sử đọc.
  useEffect(() => {
    if (!mangaRel?.attributes || !info.data) return;
    saveHistory({
      mangaId,
      chapterId: id,
      chapterNumber: info.data.attributes.chapter,
      title: getTitle(mangaRel, i18n.language),
    });
  }, [mangaRel, mangaId, info.data, id, i18n.language]);

  const label = useMemo(() => (info.data ? chapterLabel(info.data, t) : ''), [info.data, t]);

  const nav = (
    <div className="reader__nav">
      <button
        className="btn btn-outline-primary"
        disabled={!prev}
        onClick={() => navigate(`/chapter/${prev.id}`)}
      >
        ← {t('chapter.prev')}
      </button>
      <button
        className="btn btn-outline-primary"
        disabled={!next}
        onClick={() => navigate(`/chapter/${next.id}`)}
      >
        {t('chapter.next')} →
      </button>
    </div>
  );

  if (info.error) return <ErrorBox onRetry={info.reload} />;

  return (
    <div className="reader">
      <div className="reader__bar">
        {mangaId ? (
          <Link to={`/manga/${mangaId}`}>← {t('chapter.back')}</Link>
        ) : (
          <span />
        )}
        <strong className="reader__label">{label}</strong>
        <label className="form-check form-switch m-0">
          <input
            className="form-check-input"
            type="checkbox"
            checked={dataSaver}
            onChange={(e) => setDataSaver(e.target.checked)}
          />
          <span className="form-check-label">{t('chapter.dataSaver')}</span>
        </label>
      </div>

      {nav}

      {pages.error ? (
        <ErrorBox onRetry={pages.reload} />
      ) : pages.loading ? (
        <Loading />
      ) : pages.data?.length ? (
        <div className="reader__pages">
          {pages.data.map((src, i) => (
            <PageImage key={src} src={src} index={i} retryText={t('chapter.retry')} />
          ))}
        </div>
      ) : (
        <Empty>{t('chapter.noPages')}</Empty>
      )}

      {pages.data?.length ? nav : null}
    </div>
  );
}
