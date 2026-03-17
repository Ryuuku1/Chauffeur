import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import type { UpdateTenantSeoInput } from '@/domain/contracts';
import { Button } from '@/shared/ui/Button';
import { SectionHeading } from '@/shared/ui/SectionHeading';
import { useAppStore } from '@/state/AppStore';

export default function SeoSettingsPage() {
  const { t } = useTranslation();
  const { snapshot, updateTenantSeo } = useAppStore();
  const [seo, setSeo] = useState<UpdateTenantSeoInput>(snapshot.tenant.seo);

  return (
    <div className="page-stack">
      <section className="page-section">
        <SectionHeading
          eyebrow={t('seoSettings.eyebrow')}
          title={t('seoSettings.title')}
          description={t('seoSettings.description')}
        />
      </section>

      <form
        className="panel admin-editor"
        onSubmit={async (event) => {
          event.preventDefault();
          await updateTenantSeo(seo);
        }}
      >
        <div className="form-grid">
          <label className="full-width">
            {t('seoSettings.fields.siteTitle')}
            <input value={seo.siteTitle} onChange={(event) => setSeo({ ...seo, siteTitle: event.target.value })} />
          </label>
          <label className="full-width">
            {t('seoSettings.fields.siteDescription')}
            <textarea
              rows={3}
              value={seo.siteDescription}
              onChange={(event) => setSeo({ ...seo, siteDescription: event.target.value })}
            />
          </label>
          <label className="full-width">
            {t('seoSettings.fields.keywords')}
            <input
              value={seo.keywords.join(', ')}
              onChange={(event) =>
                setSeo({
                  ...seo,
                  keywords: event.target.value.split(',').map((item) => item.trim()).filter(Boolean),
                })
              }
            />
          </label>
          <label>
            {t('seoSettings.fields.ogImageUrl')}
            <input value={seo.ogImageUrl} onChange={(event) => setSeo({ ...seo, ogImageUrl: event.target.value })} />
          </label>
          <label>
            {t('seoSettings.fields.themeColor')}
            <input type="color" value={seo.themeColor} onChange={(event) => setSeo({ ...seo, themeColor: event.target.value })} />
          </label>
        </div>
        <Button type="submit">{t('actions.saveSettings')}</Button>
      </form>
    </div>
  );
}
