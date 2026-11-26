import React from 'react';
import { Button } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';

/** page bắt đầu từ 0. */
export default function Pager({ page, totalPages, onChange, disabled }) {
  const { t } = useTranslation();
  if (totalPages <= 1) return null;
  return (
    <nav className="pager" aria-label="pagination">
      <Button variant="outline-primary" disabled={disabled || page === 0} onClick={() => onChange(page - 1)}>
        {t('common.prev')}
      </Button>
      <span className="text-muted">{t('common.page', { page: page + 1, total: totalPages })}</span>
      <Button
        variant="outline-primary"
        disabled={disabled || page + 1 >= totalPages}
        onClick={() => onChange(page + 1)}
      >
        {t('common.next')}
      </Button>
    </nav>
  );
}
