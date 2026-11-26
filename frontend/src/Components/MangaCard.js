import React from 'react';
import { Link } from 'react-router-dom';
import { FiStar, FiHeart } from 'react-icons/fi';
import { getCoverUrl, getTitle } from '../utils/manga';

const compact = (n) =>
  new Intl.NumberFormat(undefined, { notation: 'compact' }).format(n || 0);

export default function MangaCard({ manga, lang, stats }) {
  const title = getTitle(manga, lang);
  const cover = getCoverUrl(manga);
  const rating = stats?.rating?.average;

  return (
    <Link to={`/manga/${manga.id}`} className="manga-card" title={title}>
      <div className="manga-card__cover">
        {cover ? (
          <img src={cover} alt="" loading="lazy" />
        ) : (
          <div className="manga-card__nocover">?</div>
        )}
        {(rating || stats?.follows) && (
          <div className="manga-card__stats">
            {rating ? (
              <span>
                <FiStar aria-hidden /> {rating.toFixed(1)}
              </span>
            ) : null}
            {stats?.follows ? (
              <span>
                <FiHeart aria-hidden /> {compact(stats.follows)}
              </span>
            ) : null}
          </div>
        )}
      </div>
      <div className="manga-card__title">{title}</div>
    </Link>
  );
}
