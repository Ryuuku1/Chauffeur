import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import type { AppSnapshot, Car } from '@/domain/models';
import { buttonClassName } from '@/shared/ui/Button';
import { StatusBadge } from '@/shared/ui/StatusBadge';
import { useAppStore } from '@/state/AppStore';
import { formatCurrency } from '@/utils/format';
import { getCarAvailabilityStatus } from '@/utils/pricing';
import {
  getLocalizedCarStyle,
  getLocalizedCategory,
  getLocalizedTransmission,
} from '@/i18n/helpers';

interface CarCardProps {
  car: Car;
  snapshot: AppSnapshot;
  startDate?: string;
  endDate?: string;
}

export const CarCard = ({ car, snapshot, startDate, endDate }: CarCardProps) => {
  const { t } = useTranslation();
  const { ui, toggleFavorite, toggleCompare } = useAppStore();
  const availabilityStatus = startDate
    ? getCarAvailabilityStatus(snapshot, car.id, startDate, endDate ?? startDate)
    : 'available';
  const isFavorite = ui.favorites.includes(car.id);
  const isCompared = ui.compare.includes(car.id);

  return (
    <article className="car-card">
      <div className="car-card-media">
        <img src={car.heroImage} alt={car.name} />
        <div className="car-card-overlay">
          <StatusBadge status={availabilityStatus} />
          <span className="price-chip">{t('carCard.from', { price: formatCurrency(car.pricing.basePrice) })}</span>
        </div>
      </div>
      <div className="car-card-body">
        <div className="car-card-head">
          <div>
            <p className="eyebrow">{getLocalizedCategory(t, car.category)}</p>
            <h3>{car.name}</h3>
          </div>
          <span className="car-year">{car.year}</span>
        </div>
        <p className="card-copy">{car.summary}</p>
        <div className="car-meta">
          <span>{t('carCard.seats', { count: car.seats })}</span>
          <span>{getLocalizedTransmission(t, car.transmission)}</span>
          <span>{getLocalizedCarStyle(t, car.style)}</span>
        </div>
        <div className="tag-list">
          {car.tags.map((tag) => (
            <span key={tag} className="tag">
              {tag}
            </span>
          ))}
        </div>
        <div className="card-actions">
          <Link to={`/fleet/${car.slug}`} className={buttonClassName('primary')}>
            {t('actions.viewDetails')}
          </Link>
          <button className={buttonClassName('ghost')} type="button" onClick={() => toggleFavorite(car.id)}>
            {isFavorite ? t('actions.saved') : t('actions.favorite')}
          </button>
          <button className={buttonClassName('ghost')} type="button" onClick={() => toggleCompare(car.id)}>
            {isCompared ? t('actions.comparing') : t('actions.compare')}
          </button>
        </div>
      </div>
    </article>
  );
};
