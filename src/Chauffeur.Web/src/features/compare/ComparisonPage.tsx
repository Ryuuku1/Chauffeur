import type { CSSProperties } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { EmptyState } from '@/shared/ui/EmptyState';
import { SectionHeading } from '@/shared/ui/SectionHeading';
import { useAppStore } from '@/state/AppStore';
import { formatCurrency } from '@/utils/format';
import { buttonClassName } from '@/shared/ui/Button';
import {
  getLocalizedCategory,
  getLocalizedEventType,
  getLocalizedTransmission,
} from '@/i18n/helpers';

export default function ComparisonPage() {
  const { t } = useTranslation();
  const { snapshot, ui, clearCompare, removeComparedCar } = useAppStore();
  const cars = snapshot.cars.filter((car) => ui.compare.includes(car.id));
  const compareTableStyle = {
    gridTemplateColumns: `minmax(11rem, 12rem) repeat(${cars.length}, minmax(16rem, 18rem))`,
    minWidth: `${12 + cars.length * 16}rem`,
  } as CSSProperties;

  if (!cars.length) {
    return (
      <EmptyState
        title={t('compare.emptyTitle')}
        description={t('compare.emptyDescription')}
        action={
          <Link to="/fleet" className={buttonClassName('primary')}>
            {t('actions.browseFleet')}
          </Link>
        }
      />
    );
  }

  return (
    <div className="page-stack">
      <section className="page-section">
        <SectionHeading
          eyebrow={t('compare.eyebrow')}
          title={t('compare.title')}
          description={t('compare.description')}
          actions={
            <button type="button" className={buttonClassName('ghost', 'sm')} onClick={clearCompare}>
              {t('compare.clearSelection')}
            </button>
          }
        />
      </section>
      <div className="compare-scroll overflow-shell">
        <div className="compare-table" style={compareTableStyle}>
          <div className="compare-column compare-column-header">
            <strong className="compare-row-label">{t('compare.attributes.car')}</strong>
            <span className="compare-row-label">{t('compare.attributes.category')}</span>
            <span className="compare-row-label">{t('compare.attributes.startingPrice')}</span>
            <span className="compare-row-label">{t('compare.attributes.seats')}</span>
            <span className="compare-row-label">{t('compare.attributes.transmission')}</span>
            <span className="compare-row-label">{t('compare.attributes.bestFor')}</span>
            <span className="compare-row-label">{t('compare.actions')}</span>
          </div>
          {cars.map((car) => (
            <div key={car.id} className="compare-column">
              <div className="compare-column-hero">
                <img src={car.heroImage} alt={car.name} />
                <div className="compare-column-heading">
                  <strong>{car.name}</strong>
                  <button
                    type="button"
                    className={buttonClassName('ghost', 'sm')}
                    onClick={() => removeComparedCar(car.id)}
                  >
                    {t('compare.removeCar')}
                  </button>
                </div>
              </div>
              <span className="compare-value">{getLocalizedCategory(t, car.category)}</span>
              <span className="compare-value">{formatCurrency(car.pricing.basePrice)}</span>
              <span className="compare-value">{car.seats}</span>
              <span className="compare-value">{getLocalizedTransmission(t, car.transmission)}</span>
              <span className="compare-value">
                {car.suitableEvents.map((eventType) => getLocalizedEventType(t, eventType)).join(', ')}
              </span>
              <div className="compare-column-actions">
                <Link to={`/quote-request?carId=${car.id}`} className={buttonClassName('secondary', 'sm')}>
                  {t('actions.requestQuote')}
                </Link>
                <Link to={`/fleet/${car.slug}`} className={buttonClassName('ghost', 'sm')}>
                  {t('actions.viewDetails')}
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
