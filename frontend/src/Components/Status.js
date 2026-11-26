import React from 'react';
import { Alert, Button, Spinner } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';

export function Loading() {
  const { t } = useTranslation();
  return (
    <div className="status-box" role="status">
      <Spinner animation="border" size="sm" className="me-2" />
      {t('common.loading')}
    </div>
  );
}

export function ErrorBox({ onRetry }) {
  const { t } = useTranslation();
  return (
    <Alert variant="danger" className="d-flex flex-wrap align-items-center justify-content-between gap-2">
      <span>{t('common.error')}</span>
      {onRetry && (
        <Button size="sm" variant="outline-danger" onClick={onRetry}>
          {t('common.retry')}
        </Button>
      )}
    </Alert>
  );
}

export function Empty({ children }) {
  return <div className="status-box text-muted">{children}</div>;
}
