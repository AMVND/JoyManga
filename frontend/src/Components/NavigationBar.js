import React, { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { LanguageContext } from './LanguageContext';
import i18n from '../utils/i18n'; // Ensure this points to your i18n config file

const NavigationBar = () => {
  const { t } = useTranslation();
  const { language, setLanguage } = useContext(LanguageContext);
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();

  const handleLanguageChange = (lang) => {
    setLanguage(lang);
    // Use the imported i18n instance
    i18n.changeLanguage(lang);
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery('');
    }
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-light fixed-top shadow-sm">
      <div className="container">
        <Link className="navbar-brand" to="/">
          <img
            src="/logo.png"
            alt="Logo"
            width="30"
            height="30"
            className="d-inline-block align-top me-2"
          />
          MyApp
        </Link>
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarResponsive"
          aria-controls="navbarResponsive"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarResponsive">
          <ul className="navbar-nav me-auto mb-2 mb-lg-0">
            <li className="nav-item dropdown">
              <a
                className="nav-link dropdown-toggle"
                href="#!"
                id="languageDropdown"
                role="button"
                data-bs-toggle="dropdown"
                aria-expanded="false"
              >
                {t('navbar.language')}: {language.toUpperCase()}
              </a>
              <ul className="dropdown-menu" aria-labelledby="languageDropdown">
                <li>
                  <button className="dropdown-item" onClick={() => handleLanguageChange('en')}>
                    English
                  </button>
                </li>
                <li>
                  <button className="dropdown-item" onClick={() => handleLanguageChange('vi')}>
                    Vietnamese
                  </button>
                </li>
                {/* Add more languages as needed */}
              </ul>
            </li>
          </ul>
          <form className="d-flex me-3" onSubmit={handleSearch}>
            <input
              type="text"
              className="form-control me-2"
              placeholder={t('navbar.search')}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <button className="btn btn-outline-success" type="submit">
              Search
            </button>
          </form>
          <ul className="navbar-nav">
            <li className="nav-item">
              <Link className="nav-link" to="/profile">
                <i className="bi bi-person-circle" style={{ fontSize: '1.5rem' }}></i>
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default NavigationBar;