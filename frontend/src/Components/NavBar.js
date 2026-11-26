import React, { useEffect, useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { FiBookOpen, FiMoon, FiSun, FiSearch } from 'react-icons/fi';
import { readJSON, writeJSON } from '../utils/storage';

function useTheme() {
  const [theme, setTheme] = useState(
    () =>
      readJSON('joymanga.theme', null) ||
      (window.matchMedia?.('(prefers-color-scheme: dark)').matches ? 'dark' : 'light')
  );
  useEffect(() => {
    document.documentElement.setAttribute('data-bs-theme', theme);
    writeJSON('joymanga.theme', theme);
  }, [theme]);
  return [theme, () => setTheme((t) => (t === 'dark' ? 'light' : 'dark'))];
}

export default function NavBar() {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const [text, setText] = useState(params.get('q') || '');
  const [theme, toggleTheme] = useTheme();

  const submit = (e) => {
    e.preventDefault();
    const q = text.trim();
    if (q) navigate(`/search?q=${encodeURIComponent(q)}`);
  };

  return (
    <header className="topbar">
      <div className="container topbar__inner">
        <Link to="/" className="brand">
          <FiBookOpen aria-hidden /> <span>JoyManga</span>
        </Link>

        <form className="topbar__search" onSubmit={submit} role="search">
          <input
            type="search"
            className="form-control"
            placeholder={t('nav.search')}
            aria-label={t('nav.search')}
            value={text}
            onChange={(e) => setText(e.target.value)}
          />
          <button className="btn btn-primary" type="submit" aria-label={t('nav.go')}>
            <FiSearch aria-hidden />
          </button>
        </form>

        <div className="topbar__tools">
          <div className="btn-group" role="group" aria-label={t('nav.language')}>
            {['vi', 'en'].map((lng) => (
              <button
                key={lng}
                type="button"
                className={`btn btn-sm ${i18n.language === lng ? 'btn-primary' : 'btn-outline-primary'}`}
                onClick={() => i18n.changeLanguage(lng)}
                aria-pressed={i18n.language === lng}
              >
                {lng.toUpperCase()}
              </button>
            ))}
          </div>
          <button
            type="button"
            className="btn btn-sm btn-outline-primary"
            onClick={toggleTheme}
            aria-label={t('nav.theme')}
            title={t('nav.theme')}
          >
            {theme === 'dark' ? <FiSun aria-hidden /> : <FiMoon aria-hidden />}
          </button>
        </div>
      </div>
    </header>
  );
}
