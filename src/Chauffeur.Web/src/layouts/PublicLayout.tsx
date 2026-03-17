import { useTranslation } from 'react-i18next';
import { Link, NavLink, Outlet } from 'react-router-dom';
import { CompareBar } from '@/features/compare/components/CompareBar';
import { resolveLocalizedText } from '@/shared/lib/localizedText';
import { buttonClassName } from '@/shared/ui/Button';
import { LanguageSwitcher } from '@/shared/ui/LanguageSwitcher';
import { ToastViewport } from '@/shared/ui/ToastViewport';
import { useAppStore } from '@/state/AppStore';

const navClassName = ({ isActive }: { isActive: boolean }) =>
  isActive ? 'nav-link nav-link-active' : 'nav-link';

export const PublicLayout = () => {
  const { t, i18n } = useTranslation();
  const { role, snapshot, toasts, dismissToast } = useAppStore();
  const { branding, content, navigation } = snapshot.tenant;
  const footerTagline = resolveLocalizedText(content.footerTagline, i18n.resolvedLanguage, t('layout.footerTagline'));

  return (
    <div className="app-shell">
      <header className="site-header">
        <Link to="/" className="brand-lockup">
          {branding.logoUrl ? (
            <img src={branding.logoUrl} alt={branding.brandName} className="brand-logo" />
          ) : (
            <span className="brand-mark">{branding.brandMark}</span>
          )}
          <span>
            <strong>{branding.brandName}</strong>
            <small>{branding.brandTagline || t('layout.brandSubtitle')}</small>
          </span>
        </Link>
        <nav className="site-nav">
          {navigation.filter((item) => item.visible).map((item) => (
            <NavLink key={item.id} to={item.path} className={navClassName}>
              {t(item.translationKey)}
            </NavLink>
          ))}
        </nav>
        <div className="header-actions">
          <LanguageSwitcher />
          <Link to="/quote-request" className={buttonClassName('ghost')}>
            {t('nav.requestQuote')}
          </Link>
          <Link to={role === 'manager' ? '/manager/dashboard' : '/manager/login'} className={buttonClassName('primary')}>
            {role === 'manager' ? t('nav.openManagerSuite') : t('nav.managerAccess')}
          </Link>
        </div>
      </header>
      <main className="page-shell">
        <Outlet />
      </main>
      <footer className="site-footer">
        <div>
          <strong>{branding.brandName}</strong>
          <p>{footerTagline}</p>
        </div>
        {content.footerColumns.map((column) => (
          <div key={column.id}>
            <span>{resolveLocalizedText(column.heading, i18n.resolvedLanguage)}</span>
            <p>{resolveLocalizedText(column.body, i18n.resolvedLanguage)}</p>
          </div>
        ))}
      </footer>
      <CompareBar />
      <ToastViewport toasts={toasts} onDismiss={dismissToast} />
    </div>
  );
};
