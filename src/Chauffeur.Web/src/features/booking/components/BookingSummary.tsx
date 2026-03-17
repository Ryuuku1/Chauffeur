import { useTranslation } from 'react-i18next';
import type { AppSnapshot, Car, EventType, Extra } from '@/domain/models';
import { formatCurrency, formatDate } from '@/utils/format';
import { getLocalizedEventType } from '@/i18n/helpers';
import { getPriceEstimate } from '@/utils/pricing';

interface BookingSummaryProps {
  snapshot: AppSnapshot;
  car?: Car;
  date: string;
  endDate?: string;
  eventType: EventType;
  extras: Extra[];
}

export const BookingSummary = ({
  snapshot,
  car,
  date,
  endDate,
  eventType,
  extras,
}: BookingSummaryProps) => {
  const { t } = useTranslation();
  if (!car || !date) {
    return (
      <aside className="summary-card">
        <p className="eyebrow">{t('booking.summary.eyebrow')}</p>
        <h3>{t('booking.summary.title')}</h3>
        <p>{t('booking.summary.empty')}</p>
      </aside>
    );
  }

  const estimate = getPriceEstimate(snapshot, {
    car,
    eventType,
    date,
    endDate,
    selectedExtras: extras,
  });

  return (
    <aside className="summary-card">
      <p className="eyebrow">{t('booking.summary.eyebrow')}</p>
      <h3>{car.name}</h3>
      <ul className="summary-list">
        <li>
          <span>{t('booking.summary.eventDate')}</span>
          <strong>{formatDate(date)}</strong>
        </li>
        <li>
          <span>{t('booking.summary.eventType')}</span>
          <strong>{getLocalizedEventType(t, eventType)}</strong>
        </li>
        <li>
          <span>{t('booking.summary.startingPrice')}</span>
          <strong>{formatCurrency(estimate.basePrice)}</strong>
        </li>
        <li>
          <span>{t('booking.summary.seasonalEffect')}</span>
          <strong>{estimate.appliedSeason ? estimate.appliedSeason.name : t('booking.summary.standardCalendar')}</strong>
        </li>
        <li>
          <span>{t('booking.summary.extras')}</span>
          <strong>{extras.length ? formatCurrency(estimate.extrasTotal) : t('booking.summary.noneSelected')}</strong>
        </li>
        <li className="summary-total">
          <span>{t('booking.summary.indicativeTotal')}</span>
          <strong>{formatCurrency(estimate.total)}</strong>
        </li>
      </ul>
      <p className="summary-note">{car.pricing.quoteDisclosure}</p>
    </aside>
  );
};
