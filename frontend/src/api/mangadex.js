import axios from 'axios';

// MangaDex là API truyện tranh mở, có tài liệu: https://api.mangadex.org/docs/
// Toàn bộ lời gọi mạng nằm trong file này; muốn đổi nguồn dữ liệu chỉ cần sửa tại đây.
const SAFE_RATINGS = ['safe', 'suggestive'];
export const MAX_OFFSET = 10000; // giới hạn của API: offset + limit <= 10000

/** key: [a,b] -> key[]=a&key[]=b ; key: {x:1} -> key[x]=1 (đúng định dạng MangaDex). */
function serialize(params = {}) {
  const sp = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value === undefined || value === null || value === '') return;
    if (Array.isArray(value)) value.forEach((v) => sp.append(`${key}[]`, v));
    else if (typeof value === 'object')
      Object.entries(value).forEach(([k, v]) => sp.append(`${key}[${k}]`, v));
    else sp.append(key, value);
  });
  return sp.toString();
}

const http = axios.create({
  baseURL: 'https://api.mangadex.org',
  timeout: 15000,
  paramsSerializer: { serialize },
});

const get = (url, params, signal) => http.get(url, { params, signal }).then((r) => r.data);

const listParams = ({ offset = 0, limit = 24, lang, tag, ...rest }) => ({
  limit,
  offset,
  includes: ['cover_art'],
  contentRating: SAFE_RATINGS,
  hasAvailableChapters: 'true',
  availableTranslatedLanguage: lang ? [lang] : undefined,
  includedTags: tag ? [tag] : undefined,
  ...rest,
});

/** Truyện mới cập nhật chương. */
export function fetchLatest(opts, signal) {
  return get('/manga', listParams({ ...opts, order: { latestUploadedChapter: 'desc' } }), signal);
}

export function searchManga({ title, ...opts }, signal) {
  return get('/manga', listParams({ ...opts, title, order: { relevance: 'desc' } }), signal);
}

export function fetchManga(id, signal) {
  return get(`/manga/${id}`, { includes: ['cover_art', 'author', 'artist'] }, signal).then(
    (d) => d.data
  );
}

/** Rating + follows. Lỗi ở đây không được làm hỏng danh sách. */
export async function fetchStats(ids, signal) {
  if (!ids.length) return {};
  try {
    const d = await get('/statistics/manga', { manga: ids }, signal);
    return d.statistics || {};
  } catch (err) {
    if (axios.isCancel(err)) throw err;
    return {};
  }
}

export function fetchTags(signal) {
  return get('/manga/tag', {}, signal).then((d) => d.data);
}

export function fetchChapters({ mangaId, lang, offset = 0, limit = 20, order = 'desc' }, signal) {
  return get(
    `/manga/${mangaId}/feed`,
    {
      translatedLanguage: [lang],
      limit,
      offset,
      order: { volume: order, chapter: order },
      includes: ['scanlation_group'],
      includeExternalUrl: 0,
      includeEmptyPages: 0,
      contentRating: ['safe', 'suggestive', 'erotica', 'pornographic'],
    },
    signal
  );
}

export function fetchChapter(id, signal) {
  return get(`/chapter/${id}`, { includes: ['manga'] }, signal).then((d) => d.data);
}

/** Danh sách chương (tối đa 500) để làm nút chương trước/sau. */
export function fetchChapterIndex(mangaId, lang, signal) {
  return get(
    `/manga/${mangaId}/feed`,
    {
      translatedLanguage: [lang],
      limit: 500,
      order: { volume: 'asc', chapter: 'asc' },
      includeExternalUrl: 0,
      includeEmptyPages: 0,
      contentRating: ['safe', 'suggestive', 'erotica', 'pornographic'],
    },
    signal
  ).then((d) => d.data);
}

/** Link ảnh các trang của chương (at-home server). */
export async function fetchPages(chapterId, dataSaver, signal) {
  const d = await get(`/at-home/server/${chapterId}`, {}, signal);
  const { hash, data = [], dataSaver: saver = [] } = d.chapter;
  const folder = dataSaver ? 'data-saver' : 'data';
  const files = dataSaver ? saver : data;
  return files.map((f) => `${d.baseUrl}/${folder}/${hash}/${f}`);
}

export const isCancel = axios.isCancel;
