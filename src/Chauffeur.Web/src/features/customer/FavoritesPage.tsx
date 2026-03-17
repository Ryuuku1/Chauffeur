import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { EmptyState } from '@/shared/ui/EmptyState';
import { SectionHeading } from '@/shared/ui/SectionHeading';
import { useAppStore } from '@/state/AppStore';
import { buttonClassName } from '@/shared/ui/Button';
import { CarCard } from '@/features/fleet/components/CarCard';

export default function FavoritesPage() {
  const { t } = useTranslation();
  const { snapshot, ui } = useAppStore();
  const favorites = snapshot.cars.filter((car) => ui.favorites.includes(car.id));

  return (
    <div className="page-stack">
      <section className="page-section">
        <SectionHeading
          eyebrow={t('favorites.eyebrow')}
          title={t('favorites.title')}
          description={t('favorites.description')}
        />
      </section>
      {favorites.length ? (
        <div className="card-grid">
          {favorites.map((car) => (
            <CarCard key={car.id} car={car} snapshot={snapshot} />
          ))}
        </div>
      ) : (
        <EmptyState
          title={t('favorites.emptyTitle')}
          description={t('favorites.emptyDescription')}
          action={
            <Link to="/fleet" className={buttonClassName('primary')}>
              {t('actions.browseFleet')}
            </Link>
          }
        />
      )}
    </div>
  );
}
