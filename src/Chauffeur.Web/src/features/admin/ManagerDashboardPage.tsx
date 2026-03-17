import { useTranslation } from 'react-i18next';
import { MetricCard } from '@/shared/ui/MetricCard';
import { SectionHeading } from '@/shared/ui/SectionHeading';
import { StatusBadge } from '@/shared/ui/StatusBadge';
import { useAppStore } from '@/state/AppStore';
import { formatCurrency, formatDate, formatNumber } from '@/utils/format';
import { getMostRequestedCar } from '@/utils/pricing';

export default function ManagerDashboardPage() {
  const { t } = useTranslation();
  const { snapshot } = useAppStore();
  const today = new Date().toISOString().slice(0, 10);
  const availableToday = snapshot.cars.filter(
    (car) =>
      !snapshot.blockedDates.some((slot) => slot.carId === car.id && today >= slot.startDate && today <= slot.endDate) &&
      !snapshot.reservations.some(
        (reservation) =>
          reservation.carId === car.id &&
          reservation.status !== 'rejected' &&
          today >= reservation.startDate &&
          today <= reservation.endDate,
      ),
  ).length;
  const pendingQuotes = snapshot.quotes.filter((quote) => quote.status === 'pending' || quote.status === 'reviewing').length;
  const confirmedBookings = snapshot.reservations.filter(
    (reservation) => reservation.status === 'approved' || reservation.status === 'confirmed',
  ).length;
  const placeholderRevenue = snapshot.reservations.reduce((sum, reservation) => sum + reservation.estimatedPrice, 0);
  const busiestSeason = [...snapshot.seasons].sort((left, right) => right.multiplier - left.multiplier)[0];
  const mostRequestedCar = getMostRequestedCar(snapshot);
  const utilization = snapshot.cars.length
    ? Math.round((snapshot.reservations.length / (snapshot.cars.length * 4)) * 100)
    : 0;

  return (
    <div className="page-stack">
      <section className="page-section">
        <SectionHeading
          eyebrow={t('adminDashboard.eyebrow')}
          title={t('adminDashboard.title')}
          description={t('adminDashboard.description')}
        />
      </section>

      <div className="metric-grid">
        <MetricCard
          label={t('adminDashboard.metrics.totalCars')}
          value={formatNumber(snapshot.cars.length)}
          trend={t('adminDashboard.metrics.activeRotation')}
        />
        <MetricCard
          label={t('adminDashboard.metrics.availableToday')}
          value={formatNumber(availableToday)}
          trend={t('adminDashboard.metrics.liveAgainst')}
        />
        <MetricCard
          label={t('adminDashboard.metrics.pendingRequests')}
          value={formatNumber(pendingQuotes)}
          trend={t('adminDashboard.metrics.quotePipeline')}
        />
        <MetricCard
          label={t('adminDashboard.metrics.confirmedBookings')}
          value={formatNumber(confirmedBookings)}
          trend={t('adminDashboard.metrics.approvedConfirmed')}
        />
        <MetricCard
          label={t('adminDashboard.metrics.revenuePlaceholder')}
          value={formatCurrency(placeholderRevenue)}
          trend={t('adminDashboard.metrics.mockTotal')}
        />
        <MetricCard
          label={t('adminDashboard.metrics.busiestSeason')}
          value={busiestSeason?.name ?? t('adminDashboard.noSeasonData')}
          trend={
            busiestSeason
              ? t('adminDashboard.metrics.multiplier', { value: busiestSeason.multiplier })
              : t('adminDashboard.noSeasonData')
          }
        />
      </div>

      <section className="split-section">
        <div className="panel">
          <SectionHeading
            eyebrow={t('adminDashboard.upcomingEyebrow')}
            title={t('adminDashboard.upcomingTitle')}
          />
          <div className="status-list">
            {snapshot.reservations.slice(0, 4).map((reservation) => {
              const car = snapshot.cars.find((item) => item.id === reservation.carId);
              return (
                <article key={reservation.id} className="status-card">
                  <div>
                    <strong>{reservation.reference}</strong>
                    <p>{car?.name ?? t('adminDashboard.noRequestData')} - {formatDate(reservation.startDate)}</p>
                  </div>
                  <StatusBadge status={reservation.status} />
                </article>
              );
            })}
          </div>
        </div>
        <div className="panel">
          <SectionHeading eyebrow={t('adminDashboard.demandEyebrow')} title={t('adminDashboard.demandTitle')} />
          <div className="insight-grid">
            <article className="insight-card">
              <h3>{t('adminDashboard.mostRequestedTitle')}</h3>
              <p>{mostRequestedCar ? mostRequestedCar.name : t('adminDashboard.noRequestData')}</p>
            </article>
            <article className="insight-card">
              <h3>{t('adminDashboard.peakPricingTitle')}</h3>
              <p>
                {busiestSeason
                  ? t('adminDashboard.peakPricingCopy', { season: busiestSeason.name })
                  : t('adminDashboard.noSeasonData')}
              </p>
            </article>
            <article className="insight-card">
              <h3>{t('adminDashboard.utilizationTitle')}</h3>
              <p>{t('adminDashboard.utilizationCopy', { value: formatNumber(utilization) })}</p>
            </article>
          </div>
        </div>
      </section>
    </div>
  );
}
