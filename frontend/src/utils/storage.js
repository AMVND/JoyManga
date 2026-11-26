// Bọc localStorage để không crash khi bị chặn (chế độ riêng tư, v.v.)
export function readJSON(key, fallback) {
  try {
    const raw = window.localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
}

export function writeJSON(key, value) {
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
  } catch {
    /* bỏ qua */
  }
}

const HISTORY_KEY = 'joymanga.history';
const HISTORY_MAX = 12;

export function getHistory() {
  const list = readJSON(HISTORY_KEY, []);
  return Array.isArray(list) ? list : [];
}

/** Lưu chương đang đọc cho mỗi truyện (mới nhất lên đầu). */
export function saveHistory(entry) {
  const rest = getHistory().filter((h) => h.mangaId !== entry.mangaId);
  writeJSON(HISTORY_KEY, [{ ...entry, ts: Date.now() }, ...rest].slice(0, HISTORY_MAX));
}

export function clearHistory() {
  writeJSON(HISTORY_KEY, []);
}
