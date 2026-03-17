import { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { PricingRuleEditor } from '@/features/admin/components/PricingRuleEditor';
import { SeasonEditor } from '@/features/admin/components/SeasonEditor';
import { DataTable } from '@/shared/ui/DataTable';
import { SectionHeading } from '@/shared/ui/SectionHeading';
import { Button } from '@/shared/ui/Button';
import { useAppStore } from '@/state/AppStore';
import { formatCurrency, formatDate } from '@/utils/format';

export default function PricingManagementPage() {
  const { t } = useTranslation();
  const { snapshot, upsertSeason, deleteSeason, updateCarPricing } = useAppStore();
  const [editingSeasonId, setEditingSeasonId] = useState<string | undefined>(snapshot.seasons[0]?.id);
  const selectedSeason = useMemo(
    () => snapshot.seasons.find((season) => season.id === editingSeasonId),
    [editingSeasonId, snapshot.seasons],
  );

  return (
    <div className="page-stack">
      <section className="page-section">
        <SectionHeading
          eyebrow={t('pricingManagement.eyebrow')}
          title={t('pricingManagement.title')}
          description={t('pricingManagement.description')}
          actions={
            <Button variant="secondary" onClick={() => setEditingSeasonId(undefined)}>
              {t('pricingManagement.addSeason')}
            </Button>
          }
        />
      </section>

      <div className="admin-grid">
        <section className="panel">
          <DataTable
            rows={snapshot.seasons}
            columns={[
              {
                key: 'name',
                header: t('pricingManagement.seasonColumns.season'),
                render: (season) => (
                  <button type="button" className="table-link" onClick={() => setEditingSeasonId(season.id)}>
                    {season.name}
                  </button>
                ),
              },
              {
                key: 'range',
                header: t('pricingManagement.seasonColumns.dateRange'),
                render: (season) => `${formatDate(season.startDate)} - ${formatDate(season.endDate)}`,
              },
              {
                key: 'multiplier',
                header: t('pricingManagement.seasonColumns.multiplier'),
                render: (season) => `${season.multiplier.toFixed(2)}x`,
              },
              {
                key: 'priority',
                header: t('pricingManagement.seasonColumns.priority'),
                render: (season) => String(season.priority),
              },
              {
                key: 'actions',
                header: t('pricingManagement.seasonColumns.actions'),
                render: (season) => (
                  <button type="button" className="text-link text-danger" onClick={() => deleteSeason(season.id)}>
                    {t('actions.delete')}
                  </button>
                ),
              },
            ]}
          />
        </section>
        <SeasonEditor season={selectedSeason} onSave={upsertSeason} />
      </div>

      <section className="page-section">
        <SectionHeading
          eyebrow={t('pricingManagement.pricingEyebrow')}
          title={t('pricingManagement.pricingTitle')}
          description={t('pricingManagement.pricingDescription')}
        />
        <div className="admin-grid">
          {snapshot.cars.map((car) => (
            <PricingRuleEditor key={car.id} car={car} onSave={updateCarPricing} />
          ))}
        </div>
      </section>

      <section className="panel">
        <SectionHeading eyebrow={t('pricingManagement.previewEyebrow')} title={t('pricingManagement.previewTitle')} />
        <div className="feature-grid">
          {snapshot.cars.map((car) => (
            <article key={car.id} className="feature-card">
              <img src={car.heroImage} alt={car.name} />
              <div>
                <h3>{car.name}</h3>
                <p>
                  {t('pricingManagement.baseAndMinimum', {
                    price: formatCurrency(car.pricing.basePrice),
                    hours: car.pricing.minimumHours,
                  })}
                </p>
              </div>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}
