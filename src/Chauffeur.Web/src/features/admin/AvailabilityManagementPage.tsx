import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { AvailabilityCalendar } from '@/shared/ui/AvailabilityCalendar';
import { DataTable } from '@/shared/ui/DataTable';
import { SectionHeading } from '@/shared/ui/SectionHeading';
import { Button } from '@/shared/ui/Button';
import { useAppStore } from '@/state/AppStore';
import { formatDate } from '@/utils/format';
import { validateBlockedDateForm } from '@/utils/validators';

export default function AvailabilityManagementPage() {
  const { t } = useTranslation();
  const { snapshot, upsertBlockedDate, deleteBlockedDate } = useAppStore();
  const [form, setForm] = useState({
    carId: snapshot.cars[0]?.id ?? '',
    startDate: '',
    endDate: '',
    label: '',
  });
  const errors = validateBlockedDateForm(form);

  return (
    <div className="page-stack">
      <section className="page-section">
        <SectionHeading
          eyebrow={t('availabilityManagement.eyebrow')}
          title={t('availabilityManagement.title')}
          description={t('availabilityManagement.description')}
        />
      </section>

      <div className="admin-grid">
        <section className="panel">
          <h3>{t('availabilityManagement.manualTitle')}</h3>
          <form
            className="compact-form"
            onSubmit={async (event) => {
              event.preventDefault();
              if (Object.keys(errors).length > 0) {
                return;
              }

              await upsertBlockedDate(form);
              setForm({ carId: snapshot.cars[0]?.id ?? '', startDate: '', endDate: '', label: '' });
            }}
          >
            <label>
              {t('availabilityManagement.car')}
              <select value={form.carId} onChange={(event) => setForm({ ...form, carId: event.target.value })}>
                {snapshot.cars.map((car) => (
                  <option key={car.id} value={car.id}>
                    {car.name}
                  </option>
                ))}
              </select>
            </label>
            <label>
              {t('availabilityManagement.startDate')}
              <input type="date" value={form.startDate} onChange={(event) => setForm({ ...form, startDate: event.target.value })} />
              {errors.startDate ? <small className="field-error">{t(errors.startDate)}</small> : null}
            </label>
            <label>
              {t('availabilityManagement.endDate')}
              <input type="date" value={form.endDate} onChange={(event) => setForm({ ...form, endDate: event.target.value })} />
              {errors.endDate ? <small className="field-error">{t(errors.endDate)}</small> : null}
            </label>
            <label>
              {t('availabilityManagement.reason')}
              <input value={form.label} onChange={(event) => setForm({ ...form, label: event.target.value })} />
              {errors.label ? <small className="field-error">{t(errors.label)}</small> : null}
            </label>
            <Button type="submit">{t('actions.saveBlock')}</Button>
          </form>
        </section>
        <section className="panel">
          <h3>{t('availabilityManagement.blockedListTitle')}</h3>
          <DataTable
            rows={snapshot.blockedDates}
            columns={[
              {
                key: 'car',
                header: t('availabilityManagement.columns.car'),
                render: (row) => snapshot.cars.find((car) => car.id === row.carId)?.name ?? t('availabilityManagement.unknownCar'),
              },
              {
                key: 'range',
                header: t('availabilityManagement.columns.range'),
                render: (row) => `${formatDate(row.startDate)} - ${formatDate(row.endDate)}`,
              },
              { key: 'label', header: t('availabilityManagement.columns.reason'), render: (row) => row.label },
              {
                key: 'actions',
                header: t('availabilityManagement.columns.actions'),
                render: (row) => (
                  <button type="button" className="text-link text-danger" onClick={() => deleteBlockedDate(row.id)}>
                    {t('actions.remove')}
                  </button>
                ),
              },
            ]}
          />
        </section>
      </div>

      <section className="admin-grid">
        {snapshot.cars.map((car) => (
          <AvailabilityCalendar key={car.id} snapshot={snapshot} carId={car.id} />
        ))}
      </section>
    </div>
  );
}
