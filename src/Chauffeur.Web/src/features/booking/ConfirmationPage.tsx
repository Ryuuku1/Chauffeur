import { useTranslation } from 'react-i18next';
import { Link, Navigate, useParams } from 'react-router-dom';
import { buttonClassName } from '@/shared/ui/Button';
import { StatusBadge } from '@/shared/ui/StatusBadge';
import { useAppStore } from '@/state/AppStore';

export default function ConfirmationPage() {
  const { t } = useTranslation();
  const { kind, reference } = useParams();
  const { snapshot } = useAppStore();

  const record =
    kind === 'quote'
      ? snapshot.quotes.find((quote) => quote.reference === reference)
      : snapshot.reservations.find((reservation) => reservation.reference === reference);

  if (!record || !reference) {
    return <Navigate to="/" replace />;
  }

  return (
    <section className="confirmation-card panel">
      <p className="eyebrow">
        {kind === 'quote' ? t('booking.confirmation.quoteEyebrow') : t('booking.confirmation.reservationEyebrow')}
      </p>
      <h1>{t('booking.confirmation.reference', { reference })}</h1>
      <p>{t('booking.confirmation.copy')}</p>
      <StatusBadge status={record.status} />
      <div className="hero-cta">
        <Link to="/customer/dashboard" className={buttonClassName('primary')}>
          {t('actions.viewDashboard')}
        </Link>
        <Link to="/fleet" className={buttonClassName('ghost')}>
          {t('actions.continueBrowsing')}
        </Link>
      </div>
    </section>
  );
}
