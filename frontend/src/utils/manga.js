// Hàm thuần (không phụ thuộc axios/React) để dễ kiểm thử.

/** Lấy chuỗi theo ngôn ngữ ưu tiên: lang -> en -> giá trị đầu tiên. */
export function pickLocalized(obj, lang, fallback = '') {
  if (!obj || typeof obj !== 'object') return fallback;
  return obj[lang] || obj.en || Object.values(obj)[0] || fallback;
}

/** Tên truyện: ưu tiên title theo ngôn ngữ, sau đó altTitles cùng ngôn ngữ, cuối cùng title.en. */
export function getTitle(manga, lang) {
  const attrs = manga?.attributes;
  if (!attrs) return '';
  if (attrs.title?.[lang]) return attrs.title[lang];
  const alt = (attrs.altTitles || []).find((a) => a[lang]);
  if (alt) return alt[lang];
  return pickLocalized(attrs.title, lang, '—');
}

export function getDescription(manga, lang) {
  return pickLocalized(manga?.attributes?.description, lang, '');
}

export function getCoverUrl(manga, size = 256) {
  const cover = manga?.relationships?.find(
    (r) => r.type === 'cover_art' && r.attributes?.fileName
  );
  if (!cover) return null;
  const suffix = size ? `.${size}.jpg` : '';
  return `https://uploads.mangadex.org/covers/${manga.id}/${cover.attributes.fileName}${suffix}`;
}

export function getPeople(manga, type) {
  const seen = new Set();
  return (manga?.relationships || [])
    .filter((r) => r.type === type && r.attributes?.name)
    .map((r) => r.attributes.name)
    .filter((n) => (seen.has(n) ? false : seen.add(n)));
}

export function getTags(manga, lang) {
  return (manga?.attributes?.tags || []).map((t) => ({
    id: t.id,
    name: pickLocalized(t.attributes?.name, lang, ''),
    group: t.attributes?.group,
  }));
}

/** "Ch. 12 — Tiêu đề" / "Oneshot" */
export function chapterLabel(chapter, t) {
  const a = chapter?.attributes || {};
  const num = a.chapter ? `${t('chapter.short')} ${a.chapter}` : t('chapter.oneshot');
  return a.title ? `${num} — ${a.title}` : num;
}

export function formatDate(value, lang) {
  if (!value) return '';
  const d = new Date(value);
  return Number.isNaN(d.getTime()) ? '' : d.toLocaleDateString(lang);
}

/** Chọn ngôn ngữ đọc: ưu tiên ngôn ngữ giao diện, rồi en, rồi ngôn ngữ đầu tiên có sẵn. */
export function pickReadingLanguage(available = [], preferred = 'en') {
  if (available.includes(preferred)) return preferred;
  if (available.includes('en')) return 'en';
  return available[0] || preferred;
}
