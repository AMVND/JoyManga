import {
  pickLocalized,
  getTitle,
  getCoverUrl,
  pickReadingLanguage,
  chapterLabel,
} from './manga';

const t = (k) => ({ 'chapter.short': 'Ch.', 'chapter.oneshot': 'Oneshot' }[k]);

test('pickLocalized falls back to en then first value', () => {
  expect(pickLocalized({ vi: 'a', en: 'b' }, 'vi')).toBe('a');
  expect(pickLocalized({ en: 'b' }, 'vi')).toBe('b');
  expect(pickLocalized({ ja: 'c' }, 'vi')).toBe('c');
  expect(pickLocalized(null, 'vi', 'x')).toBe('x');
});

test('getTitle uses altTitles for the requested language', () => {
  const manga = {
    attributes: { title: { en: 'Title' }, altTitles: [{ vi: 'Tên Việt' }] },
  };
  expect(getTitle(manga, 'vi')).toBe('Tên Việt');
  expect(getTitle(manga, 'en')).toBe('Title');
});

test('getCoverUrl builds thumbnail url or returns null', () => {
  const manga = {
    id: 'abc',
    relationships: [{ type: 'cover_art', attributes: { fileName: 'c.jpg' } }],
  };
  expect(getCoverUrl(manga)).toBe('https://uploads.mangadex.org/covers/abc/c.jpg.256.jpg');
  expect(getCoverUrl({ id: 'x', relationships: [] })).toBeNull();
});

test('pickReadingLanguage', () => {
  expect(pickReadingLanguage(['en', 'vi'], 'vi')).toBe('vi');
  expect(pickReadingLanguage(['en', 'ja'], 'vi')).toBe('en');
  expect(pickReadingLanguage(['ja'], 'vi')).toBe('ja');
});

test('chapterLabel', () => {
  expect(chapterLabel({ attributes: { chapter: '3', title: 'Hi' } }, t)).toBe('Ch. 3 — Hi');
  expect(chapterLabel({ attributes: {} }, t)).toBe('Oneshot');
});
