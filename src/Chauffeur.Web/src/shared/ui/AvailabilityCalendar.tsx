import { useTranslation } from 'react-i18next';
import type { AppSnapshot, AvailabilityStatus } from '@/domain/models';
import { availabilityStatusKeyMap } from '@/i18n/helpers';
import { cx } from '@/shared/lib/cx';
import { addDays, getMonthGrid, todayIso } from '@/utils/date';
import { formatShortDate, getWeekdayLabels } from '@/utils/format';
import { getCarAvailabilityStatus } from '@/utils/pricing';

interface AvailabilityCalendarProps {
  snapshot: AppSnapshot;
  carId: string;
  selectedDate?: string;
}

const legendStatuses: AvailabilityStatus[] = ['available', 'pending', 'booked', 'blocked', 'selected'];

export const AvailabilityCalendar = ({
  snapshot,
  carId,
  selectedDate,
}: AvailabilityCalendarProps) => {
  const { t, i18n } = useTranslation();
  const monthAnchor = todayIso().slice(0, 8) + '01';
  const grid = getMonthGrid(monthAnchor);
  const weekdays = getWeekdayLabels(i18n.resolvedLanguage);

  return (
    <section className="calendar-card">
      <div className="calendar-head">
        <div>
          <p className="eyebrow">{t('availability.eyebrow')}</p>
          <h3>{t('availability.title')}</h3>
        </div>
        <div className="calendar-legend">
          {legendStatuses.map((status) => (
            <span key={status} className={cx('calendar-legend-item', `legend-${status}`)}>
              {t(availabilityStatusKeyMap[status])}
            </span>
          ))}
        </div>
      </div>
      <div className="calendar-scroll overflow-shell scroll-shell">
        <div className="calendar-frame">
          <div className="calendar-grid calendar-weekdays">
            {weekdays.map((day) => (
              <span key={day}>{day}</span>
            ))}
          </div>
          <div className="calendar-grid">
            {grid.map((value, index) => {
              if (!value) {
                return <span key={`empty-${index}`} className="calendar-cell calendar-cell-empty" />;
              }

              const status =
                selectedDate && value === selectedDate
                  ? 'selected'
                  : getCarAvailabilityStatus(snapshot, carId, value, value);

              return (
                <span
                  key={value}
                  className={cx('calendar-cell', `calendar-${status}`)}
                  title={`${formatShortDate(value, i18n.resolvedLanguage)} - ${t(availabilityStatusKeyMap[status])}`}
                >
                  <strong>{Number(value.slice(-2))}</strong>
                </span>
              );
            })}
          </div>
        </div>
      </div>
      <p className="calendar-note">
        {t('availability.note', {
          date: formatShortDate(addDays(todayIso(), 7), i18n.resolvedLanguage),
        })}
      </p>
    </section>
  );
};
