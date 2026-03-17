import { useTranslation } from 'react-i18next';
import { useMemo, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { EmptyState } from '@/shared/ui/EmptyState';
import { SectionHeading } from '@/shared/ui/SectionHeading';
import { useAppStore } from '@/state/AppStore';
import { buttonClassName } from '@/shared/ui/Button';
import { CarCard } from './components/CarCard';
import { FilterSidebar } from './components/FilterSidebar';
import { useFleetFilters, type FleetFilters } from './useFleetFilters';

const createInitialFilters = (searchParams: URLSearchParams): FleetFilters => ({
  query: '',
  categories: [],
  eventType: (searchParams.get('event') as FleetFilters['eventType']) ?? '',
  seats: 0,
  transmission: '',
  maxPrice: 1500,
  startDate: searchParams.get('date') ?? '',
  endDate: searchParams.get('endDate') ?? '',
  availableOnly: Boolean(searchParams.get('date')),
});

export default function FleetPage() {
  const { t } = useTranslation();
  const { snapshot } = useAppStore();
  const [searchParams] = useSearchParams();
  const [filters, setFilters] = useState<FleetFilters>(() => createInitialFilters(searchParams));
  const cars = useFleetFilters(snapshot, filters);

  const selectedCount = useMemo(() => cars.length, [cars.length]);

  return (
    <div className="page-stack">
      <section className="page-section">
        <SectionHeading
          eyebrow={t('fleet.eyebrow')}
          title={t('fleet.title')}
          description={t('fleet.description')}
          actions={
            <Link to="/quote-request" className={buttonClassName('primary')}>
              {t('actions.requestConciergeHelp')}
            </Link>
          }
        />
      </section>
      <div className="catalog-layout">
        <FilterSidebar filters={filters} onChange={setFilters} />
        <section className="catalog-content">
          <div className="catalog-toolbar panel">
            <strong>{t('fleet.toolbar', { count: selectedCount })}</strong>
            <p>{t('fleet.toolbarCopy')}</p>
          </div>
          {cars.length ? (
            <div className="card-grid">
              {cars.map((car) => (
                <CarCard
                  key={car.id}
                  car={car}
                  snapshot={snapshot}
                  startDate={filters.startDate}
                  endDate={filters.endDate}
                />
              ))}
            </div>
          ) : (
            <EmptyState
              title={t('fleet.emptyTitle')}
              description={t('fleet.emptyDescription')}
              action={
                <button type="button" className={buttonClassName('secondary')} onClick={() => setFilters(createInitialFilters(new URLSearchParams()))}>
                  {t('actions.resetFilters')}
                </button>
              }
            />
          )}
        </section>
      </div>
    </div>
  );
}
