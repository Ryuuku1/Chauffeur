import { useTranslation } from 'react-i18next';
import { availabilityStatusKeyMap, quoteStatusKeyMap, reservationStatusKeyMap } from '@/i18n/helpers';
import type { AvailabilityStatus, QuoteStatus, ReservationStatus } from '@/domain/models';
import { cx } from '@/shared/lib/cx';

type StatusValue = AvailabilityStatus | QuoteStatus | ReservationStatus;

const labelMap: Record<StatusValue, string> = {
  ...availabilityStatusKeyMap,
  ...quoteStatusKeyMap,
  ...reservationStatusKeyMap,
};

export const StatusBadge = ({ status }: { status: StatusValue }) => {
  const { t } = useTranslation();
  return <span className={cx('status-badge', `status-${status}`)}>{t(labelMap[status])}</span>;
};
