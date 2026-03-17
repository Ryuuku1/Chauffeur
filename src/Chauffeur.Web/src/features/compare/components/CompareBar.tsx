import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { Button, buttonClassName } from '@/shared/ui/Button';
import { useAppStore } from '@/state/AppStore';

const CloseIcon = () => (
  <svg viewBox="0 0 20 20" aria-hidden="true">
    <path d="M5.5 5.5l9 9m0-9l-9 9" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
  </svg>
);

export const CompareBar = () => {
  const { t } = useTranslation();
  const { ui, snapshot, clearCompare, dismissCompareBar } = useAppStore();
  const comparedCars = snapshot.cars.filter((car) => ui.compare.includes(car.id));

  if (!comparedCars.length || ui.compareBarDismissed) {
    return null;
  }

  return (
    <div className="compare-bar">
      <div className="compare-bar-copy">
        <strong>{t('compare.selectedCars', { count: comparedCars.length })}</strong>
        <p>{comparedCars.map((car) => car.name).join(', ')}</p>
      </div>
      <div className="compare-bar-actions">
        <button
          type="button"
          className="icon-button"
          onClick={dismissCompareBar}
          aria-label={t('compare.dismissTray')}
        >
          <CloseIcon />
        </button>
        <Button type="button" variant="ghost" size="sm" onClick={clearCompare}>
          {t('compare.clearSelection')}
        </Button>
        <Link to="/compare" className={buttonClassName('primary', 'sm')}>
          {t('compare.compareNow')}
        </Link>
      </div>
    </div>
  );
};
