import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { EmptyState } from '@/shared/ui/EmptyState';
import { SectionHeading } from '@/shared/ui/SectionHeading';
import { StatusBadge } from '@/shared/ui/StatusBadge';
import { useAppStore } from '@/state/AppStore';
import { formatCurrency, formatDate } from '@/utils/format';
import { buttonClassName } from '@/shared/ui/Button';

export default function CustomerDashboardPage() {
  const { t } = useTranslation();
  const { primaryCustomer, snapshot, ui } = useAppStore();

  const reservations = snapshot.reservations.filter((reservation) => reservation.customerId === primaryCustomer?.id);
  const quotes = snapshot.quotes.filter((quote) => quote.customerId === primaryCustomer?.id);
  const recentlyViewed = snapshot.cars.filter((car) => ui.recentlyViewed.includes(car.id));

  return (
    <div className="page-stack">
      <section className="page-section">
        <SectionHeading
          eyebrow={t('customerDashboard.eyebrow')}
          title={t('customerDashboard.title')}
          description={t('customerDashboard.description')}
        />
      </section>

      <section className="split-section">
        <div className="panel">
          <h3>{t('customerDashboard.quoteRequests')}</h3>
          {quotes.length ? (
            <div className="status-list">
              {quotes.map((quote) => (
                <article key={quote.id} className="status-card">
                  <div>
                    <strong>{quote.reference}</strong>
                    <p>{formatDate(quote.eventDate)} · {formatCurrency(quote.estimatedPrice)}</p>
                  </div>
                  <StatusBadge status={quote.status} />
                </article>
              ))}
            </div>
          ) : (
            <EmptyState
              title={t('customerDashboard.noQuotesTitle')}
              description={t('customerDashboard.noQuotesDescription')}
              action={<Link to="/quote-request" className={buttonClassName('secondary')}>{t('actions.requestQuote')}</Link>}
            />
          )}
        </div>
        <div className="panel">
          <h3>{t('customerDashboard.reservations')}</h3>
          {reservations.length ? (
            <div className="status-list">
              {reservations.map((reservation) => (
                <article key={reservation.id} className="status-card">
                  <div>
                    <strong>{reservation.reference}</strong>
                    <p>{formatDate(reservation.startDate)} · {formatCurrency(reservation.estimatedPrice)}</p>
                  </div>
                  <StatusBadge status={reservation.status} />
                </article>
              ))}
            </div>
          ) : (
            <EmptyState
              title={t('customerDashboard.noReservationsTitle')}
              description={t('customerDashboard.noReservationsDescription')}
              action={
                <Link to="/reservation-request" className={buttonClassName('secondary')}>
                  {t('carDetails.startReservation')}
                </Link>
              }
            />
          )}
        </div>
      </section>

      <section className="page-section">
        <SectionHeading eyebrow={t('customerDashboard.recentlyViewedEyebrow')} title={t('customerDashboard.recentlyViewedTitle')} />
        <div className="feature-grid">
          {recentlyViewed.length ? (
            recentlyViewed.map((car) => (
              <article key={car.id} className="feature-card">
                <img src={car.heroImage} alt={car.name} />
                <div>
                  <h3>{car.name}</h3>
                  <p>{car.summary}</p>
                  <Link to={`/fleet/${car.slug}`} className="text-link">
                    {t('customerDashboard.reopenCar')}
                  </Link>
                </div>
              </article>
            ))
          ) : (
            <EmptyState
              title={t('customerDashboard.noRecentTitle')}
              description={t('customerDashboard.noRecentDescription')}
              action={<Link to="/fleet" className={buttonClassName('primary')}>{t('actions.browseFleet')}</Link>}
            />
          )}
        </div>
      </section>
    </div>
  );
}
