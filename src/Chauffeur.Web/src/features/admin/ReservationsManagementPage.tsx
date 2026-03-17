import { useTranslation } from 'react-i18next';
import { useState } from 'react';
import type { ReservationStatus } from '@/domain/models';
import { getReservationStatusOptions, reservationStatusKeyMap } from '@/i18n/helpers';
import { DataTable } from '@/shared/ui/DataTable';
import { SectionHeading } from '@/shared/ui/SectionHeading';
import { StatusBadge } from '@/shared/ui/StatusBadge';
import { useAppStore } from '@/state/AppStore';
import { formatCurrency, formatDate } from '@/utils/format';

export default function ReservationsManagementPage() {
  const { t } = useTranslation();
  const { snapshot, updateReservationStatus } = useAppStore();
  const [filter, setFilter] = useState<ReservationStatus | 'all'>('all');
  const statusOptions = getReservationStatusOptions(t);
  const rows =
    filter === 'all'
      ? snapshot.reservations
      : snapshot.reservations.filter((reservation) => reservation.status === filter);

  return (
    <div className="page-stack">
      <section className="page-section">
        <SectionHeading
          eyebrow={t('reservationsManagement.eyebrow')}
          title={t('reservationsManagement.title')}
          description={t('reservationsManagement.description')}
        />
      </section>
      <section className="panel">
        <div className="toolbar">
          <label>
            {t('reservationsManagement.filterStatus')}
            <select value={filter} onChange={(event) => setFilter(event.target.value as ReservationStatus | 'all')}>
              <option value="all">{t('reservationsManagement.allStatuses')}</option>
              {statusOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </label>
        </div>
        <DataTable
          rows={rows}
          columns={[
            { key: 'reference', header: t('reservationsManagement.columns.reference'), render: (row) => row.reference },
            {
              key: 'customer',
              header: t('reservationsManagement.columns.customer'),
              render: (row) => snapshot.customers.find((customer) => customer.id === row.customerId)?.name ?? t('reservationsManagement.unknown'),
            },
            {
              key: 'car',
              header: t('reservationsManagement.columns.car'),
              render: (row) => snapshot.cars.find((car) => car.id === row.carId)?.name ?? t('reservationsManagement.unknownCar'),
            },
            { key: 'date', header: t('reservationsManagement.columns.eventDate'), render: (row) => formatDate(row.startDate) },
            { key: 'estimate', header: t('reservationsManagement.columns.estimate'), render: (row) => formatCurrency(row.estimatedPrice) },
            { key: 'status', header: t('reservationsManagement.columns.status'), render: (row) => <StatusBadge status={row.status} /> },
            {
              key: 'actions',
              header: t('reservationsManagement.columns.actions'),
              render: (row) => (
                <div className="table-actions">
                  {(['approved', 'confirmed', 'rejected'] as ReservationStatus[]).map((status) => (
                    <button
                      key={status}
                      type="button"
                      className="text-link"
                      onClick={() => updateReservationStatus({ reservationId: row.id, status })}
                    >
                      {t(reservationStatusKeyMap[status])}
                    </button>
                  ))}
                </div>
              ),
            },
          ]}
        />
      </section>
    </div>
  );
}
