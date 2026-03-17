import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { tenantTemplates } from '@/domain/templates';
import { Button, buttonClassName } from '@/shared/ui/Button';
import { SectionHeading } from '@/shared/ui/SectionHeading';
import { useAppStore } from '@/state/AppStore';
import { formatDate } from '@/utils/format';

export default function SettingsPage() {
  const { t } = useTranslation();
  const { snapshot, publishTenantSite, resetDemo } = useAppStore();
  const { publication } = snapshot.tenant;
  const activeTemplate = tenantTemplates.find((template) => template.id === snapshot.tenant.theme.templateId);

  return (
    <div className="page-stack">
      <section className="page-section">
        <SectionHeading
          eyebrow={t('settings.eyebrow')}
          title={t('settings.title')}
          description={t('settings.description')}
          actions={
            <Button variant="primary" onClick={() => void publishTenantSite()}>
              {t('actions.publishSite')}
            </Button>
          }
        />
      </section>

      <section className="metric-grid">
        <article className="metric-card">
          <span className="metric-label">{t('settings.publicationStatus')}</span>
          <strong className="metric-value">{t(`settings.publication.${publication.status}`)}</strong>
          <span className="metric-trend">
            {publication.lastPublishedAt
              ? t('settings.lastPublished', { date: formatDate(publication.lastPublishedAt.slice(0, 10)) })
              : t('settings.notPublishedYet')}
          </span>
        </article>
        <article className="metric-card">
          <span className="metric-label">{t('settings.activeTemplate')}</span>
          <strong className="metric-value">{activeTemplate ? t(activeTemplate.translationKey) : snapshot.tenant.theme.templateId}</strong>
          <span className="metric-trend">{snapshot.tenant.branding.brandName}</span>
        </article>
      </section>

      <section className="feature-grid">
        <article className="feature-card">
          <h3>{t('settings.cards.brandTitle')}</h3>
          <p>{t('settings.cards.brandCopy')}</p>
          <Link to="/manager/settings/brand" className={buttonClassName('secondary')}>
            {t('settings.cards.manageBrand')}
          </Link>
        </article>
        <article className="feature-card">
          <h3>{t('settings.cards.themeTitle')}</h3>
          <p>{t('settings.cards.themeCopy')}</p>
          <Link to="/manager/settings/theme" className={buttonClassName('secondary')}>
            {t('settings.cards.manageTheme')}
          </Link>
        </article>
        <article className="feature-card">
          <h3>{t('settings.cards.contentTitle')}</h3>
          <p>{t('settings.cards.contentCopy')}</p>
          <Link to="/manager/settings/content" className={buttonClassName('secondary')}>
            {t('settings.cards.manageContent')}
          </Link>
        </article>
        <article className="feature-card">
          <h3>{t('settings.cards.seoTitle')}</h3>
          <p>{t('settings.cards.seoCopy')}</p>
          <Link to="/manager/settings/seo" className={buttonClassName('secondary')}>
            {t('settings.cards.manageSeo')}
          </Link>
        </article>
      </section>

      <section className="split-section">
        <div className="panel">
          <h3>{t('settings.previewTitle')}</h3>
          <p>{t('settings.previewCopy')}</p>
          <ul className="summary-list">
            <li>
              <span>{t('settings.previewBrand')}</span>
              <strong>{snapshot.tenant.branding.brandName}</strong>
            </li>
            <li>
              <span>{t('settings.previewLocales')}</span>
              <strong>{snapshot.tenant.localization.enabledLocales.join(', ')}</strong>
            </li>
            <li>
              <span>{t('settings.previewCurrency')}</span>
              <strong>{snapshot.tenant.localization.currency}</strong>
            </li>
          </ul>
        </div>

        <div className="panel">
          <h3>{t('settings.demoTitle')}</h3>
          <p>{t('settings.demoCopy')}</p>
          <Button variant="danger" onClick={resetDemo}>
            {t('actions.resetDemoData')}
          </Button>
        </div>
      </section>
    </div>
  );
}
