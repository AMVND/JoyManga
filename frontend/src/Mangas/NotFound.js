import React from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

export default function NotFound() {
  const { t } = useTranslation();
  return (
    <div className="status-box">
      <h2>{t('common.notFound')}</h2>
      <Link to="/">{t('common.home')}</Link>
    </div>
  );
}
