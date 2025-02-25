import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

const resources = {
  en: {
    translation: {
      "navbar.search": "Search Manga...",
      "navbar.language": "Language",
      "navbar.profile": "Profile",
      // add more keys...
    }
  },
  vi: {
    translation: {
      "navbar.search": "Tìm kiếm...",
      "navbar.language": "Ngôn ngữ",
      "navbar.profile": "Hồ sơ",
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
