import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

const resources = {
  en: {
    translation: {
      "navbar.search": "Search Manga...",
      "navbar.searchbutton":"Search",
      "navbar.language": "Language",
      "navbar.profile": "Profile",
      "mangadetail.author": "Author",
      // add more keys...
    }
  },
  vi: {
    translation: {
      "navbar.search": "Nhập tên manga...",
      "navbar.searchbutton":"Tìm",
      "navbar.language": "Ngôn ngữ",
      "navbar.profile": "Hồ sơ",
      "mangadetail.author": "Tác giả"
      // add more keys...
    }
  },
  // add additional languages here...
};

i18n.use(initReactI18next).init({
  resources,
  lng: 'en', // default language
  interpolation: {
    escapeValue: false,
  }
});

export default i18n;
