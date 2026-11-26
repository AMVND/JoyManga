import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { Badge } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import { fetchChapters, fetchManga } from '../api/mangadex';
import useAsync from '../hooks/useAsync';
import Pager from '../components/Pager';
import { Empty, ErrorBox, Loading } from '../components/Status';
import {
  chapterLabel,
  formatDate,
  getCoverUrl,
  getDescription,
  getPeople,
  getTags,
  getTitle,
  pickReadingLanguage,
} from '../utils/manga';

const PER_PAGE = 20;

export default function MangaDetail() {
  const { id } = useParams();
  const { t, i18n } = useTranslation();
  const ui = i18n.language;

  const [readLang, setReadLang] = useState(null);
  const [order, setOrder] = useState('desc');
  const [page, setPage] = useState(0);
  const [expanded, setExpanded] = useState(false);

  const manga = useAsync((signal) => fetchManga(id, signal), [id]);

  // Chọn ngôn ngữ chương khi đã biết manga có những ngôn ngữ nào.
  useEffect(() => {
    if (manga.data) {
      setReadLang(
        pickReadingLanguage(manga.data.attributes.availableTranslatedLanguages || [], ui)
      );
    }
  }, [manga.data, ui]);

  useEffect(() => setPage(0), [readLang, order, id]);

  const chapters = useAsync(
    (signal) =>
      readLang
        ? fetchChapters({ mangaId: id, lang: readLang, offset: page * PER_PAGE, limit: PER_PAGE, order }, signal)
        : Promise.resolve(null),
    [id, readLang, order, page]
  );

  if (manga.error) return <ErrorBox onRetry={manga.reload} />;
  if (!manga.data) return <Loading />;

  const m = manga.data;
  const cover = getCoverUrl(m, 512);
  const title = getTitle(m, ui);
  const description = getDescription(m, ui);
  const authors = getPeople(m, 'author');
  const artists = getPeople(m, 'artist').filter((a) => !authors.includes(a));
  const languages = m.attributes.availableTranslatedLanguages || [];
  const total = chapters.data?.total || 0;

  return (
    <>
      <section className="detail">
        <div className="detail__cover">{cover && <img src={cover} alt={title} />}</div>
        <div className="detail__info">
          <h1>{title}</h1>
          <dl className="detail__meta">
            {authors.length > 0 && (
              <>
                <dt>{t('detail.author')}</dt>
                <dd>{authors.join(', ')}</dd>
              </>
            )}
            {artists.length > 0 && (
              <>
                <dt>{t('detail.artist')}</dt>
                <dd>{artists.join(', ')}</dd>
              </>
            )}
            {m.attributes.status && (
              <>
                <dt>{t('detail.status')}</dt>
                <dd>{t(`status.${m.attributes.status}`, m.attributes.status)}</dd>
              </>
            )}
            {m.attributes.year && (
              <>
                <dt>{t('detail.year')}</dt>
                <dd>{m.attributes.year}</dd>
              </>
            )}
          </dl>
          <div className="detail__tags">
            {getTags(m, 'en').map((tag) => (
              <Badge key={tag.id} bg="secondary" className="tag">
                {tag.name}
              </Badge>
            ))}
          </div>
          <p className={`detail__desc ${expanded ? 'is-open' : ''}`}>
            {description || t('detail.noDescription')}
          </p>
          {description.length > 220 && (
            <button className="btn btn-link btn-sm p-0" onClick={() => setExpanded((v) => !v)}>
              {expanded ? t('detail.less') : t('detail.more')}
            </button>
          )}
        </div>
      </section>

      <section className="mt-4">
        <div className="section-head">
          <h2>{t('detail.chapters')}</h2>
          <div className="filters">
            {languages.length > 1 && (
              <select
                className="form-select form-select-sm"
                value={readLang || ''}
                onChange={(e) => setReadLang(e.target.value)}
                aria-label={t('detail.readingLang')}
              >
                {languages.map((l) => (
                  <option key={l} value={l}>
                    {l.toUpperCase()}
                  </option>
                ))}
              </select>
            )}
            <select
              className="form-select form-select-sm"
              value={order}
              onChange={(e) => setOrder(e.target.value)}
              aria-label={t('detail.sort')}
            >
              <option value="desc">{t('detail.newest')}</option>
              <option value="asc">{t('detail.oldest')}</option>
            </select>
          </div>
        </div>

        {chapters.error ? (
          <ErrorBox onRetry={chapters.reload} />
        ) : chapters.loading && !chapters.data ? (
          <Loading />
        ) : chapters.data?.data.length ? (
          <div className={chapters.loading ? 'is-refreshing' : ''}>
            <ul className="chapter-list">
              {chapters.data.data.map((c) => {
                const group = c.relationships?.find((r) => r.type === 'scanlation_group')?.attributes
                  ?.name;
                return (
                  <li key={c.id}>
                    <Link to={`/chapter/${c.id}`}>
                      <span className="chapter-list__title">{chapterLabel(c, t)}</span>
                      <span className="chapter-list__meta">
                        {group || t('chapter.unknownGroup')} · {formatDate(c.attributes.publishAt, ui)}
                      </span>
                    </Link>
                  </li>
                );
              })}
            </ul>
            <Pager
              page={page}
              totalPages={Math.ceil(total / PER_PAGE)}
              onChange={setPage}
              disabled={chapters.loading}
            />
          </div>
        ) : (
          <Empty>{t('detail.noChapters')}</Empty>
        )}
      </section>
    </>
  );
}
