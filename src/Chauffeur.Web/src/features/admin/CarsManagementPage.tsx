import { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { CarEditorPanel } from '@/features/admin/components/CarEditorPanel';
import { getLocalizedCategory } from '@/i18n/helpers';
import { Modal } from '@/shared/ui/Modal';
import { SectionHeading } from '@/shared/ui/SectionHeading';
import { DataTable } from '@/shared/ui/DataTable';
import { Button } from '@/shared/ui/Button';
import { useAppStore } from '@/state/AppStore';
import { formatCurrency } from '@/utils/format';

export default function CarsManagementPage() {
  const { t } = useTranslation();
  const { snapshot, upsertCar, deleteCar } = useAppStore();
  const [editingCarId, setEditingCarId] = useState<string | undefined>(snapshot.cars[0]?.id);
  const [carToDelete, setCarToDelete] = useState<string | null>(null);

  const editingCar = useMemo(
    () => snapshot.cars.find((car) => car.id === editingCarId),
    [editingCarId, snapshot.cars],
  );

  return (
    <div className="page-stack">
      <section className="page-section">
        <SectionHeading
          eyebrow={t('carsManagement.eyebrow')}
          title={t('carsManagement.title')}
          description={t('carsManagement.description')}
          actions={
            <Button variant="secondary" onClick={() => setEditingCarId(undefined)}>
              {t('actions.addNewCar')}
            </Button>
          }
        />
      </section>
      <div className="admin-grid">
        <section className="panel">
          <DataTable
            rows={snapshot.cars}
            columns={[
              {
                key: 'car',
                header: t('carsManagement.columns.car'),
                render: (car) => (
                  <button className="table-link" type="button" onClick={() => setEditingCarId(car.id)}>
                    {car.name}
                  </button>
                ),
              },
              {
                key: 'category',
                header: t('carsManagement.columns.category'),
                render: (car) => getLocalizedCategory(t, car.category),
              },
              {
                key: 'price',
                header: t('carsManagement.columns.startingPrice'),
                render: (car) => formatCurrency(car.pricing.basePrice),
              },
              { key: 'location', header: t('carsManagement.columns.location'), render: (car) => car.location },
              {
                key: 'actions',
                header: t('carsManagement.columns.actions'),
                render: (car) => (
                  <div className="table-actions">
                    <button type="button" className="text-link" onClick={() => setEditingCarId(car.id)}>
                      {t('actions.edit')}
                    </button>
                    <button type="button" className="text-link text-danger" onClick={() => setCarToDelete(car.id)}>
                      {t('actions.delete')}
                    </button>
                  </div>
                ),
              },
            ]}
          />
        </section>
        <CarEditorPanel car={editingCar} extras={snapshot.extras} onSave={upsertCar} />
      </div>

      <Modal
        isOpen={Boolean(carToDelete)}
        title={t('carsManagement.deleteModal.title')}
        description={t('carsManagement.deleteModal.description')}
        onClose={() => setCarToDelete(null)}
        footer={
          <>
            <Button variant="ghost" onClick={() => setCarToDelete(null)}>
              {t('actions.cancel')}
            </Button>
            <Button
              variant="danger"
              onClick={async () => {
                if (carToDelete) {
                  await deleteCar(carToDelete);
                  setCarToDelete(null);
                }
              }}
            >
              {t('actions.confirmDelete')}
            </Button>
          </>
        }
      />
    </div>
  );
}
