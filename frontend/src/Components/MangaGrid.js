import React from 'react';
import MangaCard from './MangaCard';

export default function MangaGrid({ items, stats, lang }) {
  return (
    <div className="manga-grid">
      {items.map((m) => (
        <MangaCard key={m.id} manga={m} lang={lang} stats={stats?.[m.id]} />
      ))}
    </div>
  );
}
