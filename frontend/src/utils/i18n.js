import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import { readJSON, writeJSON } from './storage';

const resources = {
  en: {
    translation: {
      nav: { search: 'Search manga…', go: 'Search', theme: 'Toggle theme', language: 'Language' },
      home: {
        latest: 'Latest updates',
        continue: 'Continue reading',
        clear: 'Clear',
        allGenres: 'All genres',
        genre: 'Genre',
        onlyLang: 'Only titles with {{lang}} chapters',
      },
      search: { title: 'Results for “{{q}}”', empty: 'No manga found for “{{q}}”.', hint: 'Type a title in the search box.' },
      detail: {
        author: 'Author',
        artist: 'Artist',
        status: 'Status',
        year: 'Year',
        more: 'Show more',
        less: 'Show less',
        chapters: 'Chapters',
        readingLang: 'Chapter language',
        sort: 'Sort',
        newest: 'Newest first',
        oldest: 'Oldest first',
        noChapters: 'No readable chapters in this language.',
        noDescription: 'No description.',
      },
      status: { ongoing: 'Ongoing', completed: 'Completed', hiatus: 'Hiatus', cancelled: 'Cancelled' },
      chapter: {
        short: 'Ch.',
        oneshot: 'Oneshot',
        prev: 'Previous',
        next: 'Next',
        dataSaver: 'Data saver',
        back: 'Back to manga',
        noPages: 'This chapter has no pages.',
        retry: 'Tap to reload image',
        unknownGroup: 'Unknown group',
      },
      common: {
        loading: 'Loading…',
        error: 'Something went wrong. Check your connection and try again.',
        retry: 'Try again',
        prev: 'Previous',
        next: 'Next',
        page: 'Page {{page}} of {{total}}',
        notFound: 'Page not found',
        home: 'Go to homepage',
      },
    },
  },
  vi: {
    translation: {
      nav: { search: 'Nhập tên truyện…', go: 'Tìm', theme: 'Đổi giao diện sáng/tối', language: 'Ngôn ngữ' },
      home: {
        latest: 'Mới cập nhật',
        continue: 'Đọc tiếp',
        clear: 'Xóa',
        allGenres: 'Mọi thể loại',
        genre: 'Thể loại',
        onlyLang: 'Chỉ truyện có chương {{lang}}',
      },
      search: { title: 'Kết quả cho “{{q}}”', empty: 'Không tìm thấy truyện nào cho “{{q}}”.', hint: 'Hãy nhập tên truyện vào ô tìm kiếm.' },
      detail: {
        author: 'Tác giả',
        artist: 'Họa sĩ',
        status: 'Tình trạng',
        year: 'Năm',
        more: 'Xem thêm',
        less: 'Thu gọn',
        chapters: 'Danh sách chương',
        readingLang: 'Ngôn ngữ chương',
        sort: 'Sắp xếp',
        newest: 'Mới nhất trước',
        oldest: 'Cũ nhất trước',
        noChapters: 'Chưa có chương đọc được ở ngôn ngữ này.',
        noDescription: 'Chưa có mô tả.',
      },
      status: { ongoing: 'Đang tiến hành', completed: 'Hoàn thành', hiatus: 'Tạm ngưng', cancelled: 'Đã hủy' },
      chapter: {
        short: 'Chương',
        oneshot: 'Oneshot',
        prev: 'Chương trước',
        next: 'Chương sau',
        dataSaver: 'Tiết kiệm dữ liệu',
        back: 'Về trang truyện',
        noPages: 'Chương này không có trang nào.',
        retry: 'Chạm để tải lại ảnh',
        unknownGroup: 'Nhóm dịch không rõ',
      },
      common: {
        loading: 'Đang tải…',
        error: 'Đã có lỗi. Hãy kiểm tra kết nối mạng rồi thử lại.',
        retry: 'Thử lại',
        prev: 'Trước',
        next: 'Sau',
        page: 'Trang {{page}} / {{total}}',
        notFound: 'Không tìm thấy trang',
        home: 'Về trang chủ',
      },
    },
  },
};

const saved = readJSON('joymanga.lang', null);

i18n.use(initReactI18next).init({
  resources,
  lng: saved === 'vi' || saved === 'en' ? saved : 'vi',
  fallbackLng: 'en',
  interpolation: { escapeValue: false },
});

i18n.on('languageChanged', (lng) => {
  writeJSON('joymanga.lang', lng);
  document.documentElement.lang = lng;
});
document.documentElement.lang = i18n.language;

export default i18n;
