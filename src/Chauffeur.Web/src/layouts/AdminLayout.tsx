import { useTranslation } from 'react-i18next';
import { Link, NavLink, Outlet } from 'react-router-dom';
import { Button } from '@/shared/ui/Button';
import { LanguageSwitcher } from '@/shared/ui/LanguageSwitcher';
import { ToastViewport } from '@/shared/ui/ToastViewport';
import { useAppStore } from '@/state/AppStore';

const navClassName = ({ isActive }: { isActive: boolean }) =>
  isActive ? 'side-nav-link side-nav-link-active' : 'side-nav-link';

export const AdminLayout = () => {
  const { t } = useTranslation();
  const { signOutManager, snapshot, toasts, dismissToast } = useAppStore();
  const { branding, publication } = snapshot.tenant;

  return (
    <div className="admin-shell">
      <aside className="admin-sidebar">
        <Link to="/manager/dashboard" className="brand-lockup">
          {branding.logoUrl ? (
            <img src={branding.logoUrl} alt={branding.brandName} className="brand-logo" />
          ) : (
            <span className="brand-mark">{branding.brandMark}</span>
          )}
          <span>
            <strong>{branding.brandName}</strong>
            <small>{t('layout.managerSubtitle')}</small>
          </span>
        </Link>
        <div className={`publication-pill publication-${publication.status}`}>
          <span>{t('settings.publicationStatus')}</span>
          <strong>{t(`settings.publication.${publication.status}`)}</strong>
        </div>
        <nav className="side-nav">
          <NavLink to="/manager/dashboard" className={navClassName}>
            {t('adminNav.dashboard')}
          </NavLink>
          <NavLink to="/manager/cars" className={navClassName}>
            {t('adminNav.cars')}
          </NavLink>
          <NavLink to="/manager/reservations" className={navClassName}>
            {t('adminNav.reservations')}
          </NavLink>
          <NavLink to="/manager/quotes" className={navClassName}>
            {t('adminNav.quotes')}
          </NavLink>
          <NavLink to="/manager/pricing" className={navClassName}>
            {t('adminNav.pricing')}
          </NavLink>
          <NavLink to="/manager/availability" className={navClassName}>
            {t('adminNav.availability')}
          </NavLink>
          <NavLink to="/manager/settings" className={navClassName}>
            {t('adminNav.website')}
          </NavLink>
        </nav>
        <div className="admin-sidebar-footer">
          <LanguageSwitcher />
          <Link to="/" className="text-link">
            {t('adminNav.backToSite')}
          </Link>
          <Button variant="secondary" onClick={signOutManager}>
            {t('adminNav.signOut')}
          </Button>
        </div>
      </aside>
      <div className="admin-content">
        <Outlet />
      </div>
      <ToastViewport toasts={toasts} onDismiss={dismissToast} />
    </div>
  );
};
