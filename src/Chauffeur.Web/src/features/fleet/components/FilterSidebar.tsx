import { useTranslation } from 'react-i18next';
import { getCategoryOptions, getEventTypeOptions, getTransmissionOptions } from '@/i18n/helpers';
import type { FleetFilters } from '../useFleetFilters';

interface FilterSidebarProps {
  filters: FleetFilters;
  onChange: (next: FleetFilters) => void;
}

export const FilterSidebar = ({ filters, onChange }: FilterSidebarProps) => (
  <FilterSidebarContent filters={filters} onChange={onChange} />
);

const FilterSidebarContent = ({ filters, onChange }: FilterSidebarProps) => {
  const { t } = useTranslation();
  const eventOptions = getEventTypeOptions(t);
  const transmissionOptions = getTransmissionOptions(t);
  const categoryOptions = getCategoryOptions(t);

  return (
    <aside className="filter-sidebar">
      <div className="panel">
        <p className="eyebrow">{t('filters.availabilitySearch')}</p>
        <div className="form-grid">
          <label>
            {t('filters.eventType')}
            <select
              value={filters.eventType}
              onChange={(event) => onChange({ ...filters, eventType: event.target.value as FleetFilters['eventType'] })}
            >
              <option value="">{t('filters.anyEvent')}</option>
              {eventOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </label>
          <label>
            {t('filters.date')}
            <input
              type="date"
              value={filters.startDate}
              onChange={(event) => onChange({ ...filters, startDate: event.target.value })}
            />
          </label>
          <label>
            {t('filters.endDate')}
            <input
              type="date"
              value={filters.endDate}
              onChange={(event) => onChange({ ...filters, endDate: event.target.value })}
            />
          </label>
        </div>
        <label className="checkbox-row">
          <input
            type="checkbox"
            checked={filters.availableOnly}
            onChange={(event) => onChange({ ...filters, availableOnly: event.target.checked })}
          />
          {t('filters.availableOnly')}
        </label>
      </div>
      <div className="panel">
        <p className="eyebrow">{t('filters.refineFleet')}</p>
        <label>
          {t('filters.search')}
          <input
            value={filters.query}
            onChange={(event) => onChange({ ...filters, query: event.target.value })}
            placeholder={t('filters.searchPlaceholder')}
          />
        </label>
        <label>
          {t('filters.minimumSeats')}
          <input
            type="range"
            min="0"
            max="5"
            value={filters.seats}
            onChange={(event) => onChange({ ...filters, seats: Number(event.target.value) })}
          />
          <span className="field-hint">
            {filters.seats === 0 ? t('filters.anySize') : t('filters.seatsPlus', { count: filters.seats })}
          </span>
        </label>
        <label>
          {t('filters.transmission')}
          <select
            value={filters.transmission}
            onChange={(event) => onChange({ ...filters, transmission: event.target.value })}
          >
            <option value="">{t('filters.any')}</option>
            {transmissionOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </label>
        <label>
          {t('filters.maxStartingPrice')}
          <input
            type="range"
            min="400"
            max="1500"
            step="20"
            value={filters.maxPrice}
            onChange={(event) => onChange({ ...filters, maxPrice: Number(event.target.value) })}
          />
          <span className="field-hint">{t('filters.upToPrice', { price: filters.maxPrice })}</span>
        </label>
        <div className="category-pills">
          {categoryOptions.map((category) => {
            const active = filters.categories.includes(category.value);
            return (
              <button
                key={category.value}
                type="button"
                className={active ? 'pill-button pill-button-active' : 'pill-button'}
                onClick={() =>
                  onChange({
                    ...filters,
                    categories: active
                      ? filters.categories.filter((item) => item !== category.value)
                      : [...filters.categories, category.value],
                  })
                }
              >
                {category.label}
              </button>
            );
          })}
        </div>
      </div>
    </aside>
  );
};
