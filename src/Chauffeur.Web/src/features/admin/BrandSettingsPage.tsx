import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import type { UpdateTenantBrandingInput, UpdateTenantLocalizationInput } from '@/domain/contracts';
import { localeLabels } from '@/i18n/locale';
import { Button } from '@/shared/ui/Button';
import { SectionHeading } from '@/shared/ui/SectionHeading';
import { useAppStore } from '@/state/AppStore';

const localeOptions: UpdateTenantLocalizationInput['enabledLocales'] = ['en', 'pt', 'es', 'fr', 'de', 'it'];

export default function BrandSettingsPage() {
  const { t } = useTranslation();
  const { snapshot, updateTenantBranding, updateTenantLocalization } = useAppStore();
  const [branding, setBranding] = useState<UpdateTenantBrandingInput>(snapshot.tenant.branding);
  const [localization, setLocalization] = useState<UpdateTenantLocalizationInput>(snapshot.tenant.localization);

  return (
    <div className="page-stack">
      <section className="page-section">
        <SectionHeading
          eyebrow={t('brandSettings.eyebrow')}
          title={t('brandSettings.title')}
          description={t('brandSettings.description')}
        />
      </section>

      <section className="admin-grid">
        <form
          className="panel admin-editor"
          onSubmit={async (event) => {
            event.preventDefault();
            await updateTenantBranding(branding);
            await updateTenantLocalization(localization);
          }}
        >
          <div className="form-grid">
            <label>
              {t('brandSettings.fields.brandName')}
              <input value={branding.brandName} onChange={(event) => setBranding({ ...branding, brandName: event.target.value })} />
            </label>
            <label>
              {t('brandSettings.fields.brandShortName')}
              <input value={branding.brandShortName} onChange={(event) => setBranding({ ...branding, brandShortName: event.target.value })} />
            </label>
            <label>
              {t('brandSettings.fields.brandMark')}
              <input value={branding.brandMark} maxLength={2} onChange={(event) => setBranding({ ...branding, brandMark: event.target.value })} />
            </label>
            <label>
              {t('brandSettings.fields.brandTagline')}
              <input value={branding.brandTagline} onChange={(event) => setBranding({ ...branding, brandTagline: event.target.value })} />
            </label>
            <label>
              {t('brandSettings.fields.logoUrl')}
              <input value={branding.logoUrl} onChange={(event) => setBranding({ ...branding, logoUrl: event.target.value })} />
            </label>
            <label>
              {t('brandSettings.fields.faviconUrl')}
              <input value={branding.faviconUrl} onChange={(event) => setBranding({ ...branding, faviconUrl: event.target.value })} />
            </label>
            <label>
              {t('brandSettings.fields.contactEmail')}
              <input value={branding.contactEmail} onChange={(event) => setBranding({ ...branding, contactEmail: event.target.value })} />
            </label>
            <label>
              {t('brandSettings.fields.contactPhone')}
              <input value={branding.contactPhone} onChange={(event) => setBranding({ ...branding, contactPhone: event.target.value })} />
            </label>
            <label>
              {t('brandSettings.fields.whatsapp')}
              <input value={branding.whatsapp} onChange={(event) => setBranding({ ...branding, whatsapp: event.target.value })} />
            </label>
            <label>
              {t('brandSettings.fields.serviceArea')}
              <input value={branding.serviceArea} onChange={(event) => setBranding({ ...branding, serviceArea: event.target.value })} />
            </label>
            <label>
              {t('brandSettings.fields.conciergeHours')}
              <input value={branding.conciergeHours} onChange={(event) => setBranding({ ...branding, conciergeHours: event.target.value })} />
            </label>
            <label>
              {t('brandSettings.fields.supportDomain')}
              <input value={branding.supportDomain} onChange={(event) => setBranding({ ...branding, supportDomain: event.target.value })} />
            </label>
            <label className="full-width">
              {t('brandSettings.fields.legalCompanyName')}
              <input value={branding.legalCompanyName} onChange={(event) => setBranding({ ...branding, legalCompanyName: event.target.value })} />
            </label>
            <label>
              {t('brandSettings.fields.defaultLocale')}
              <select
                value={localization.defaultLocale}
                onChange={(event) =>
                  setLocalization({
                    ...localization,
                    defaultLocale: event.target.value as UpdateTenantLocalizationInput['defaultLocale'],
                  })
                }
              >
                {localeOptions.map((locale) => (
                  <option key={locale} value={locale}>
                    {localeLabels[locale]}
                  </option>
                ))}
              </select>
            </label>
            <label>
              {t('brandSettings.fields.currency')}
              <select
                value={localization.currency}
                onChange={(event) =>
                  setLocalization({
                    ...localization,
                    currency: event.target.value as UpdateTenantLocalizationInput['currency'],
                  })
                }
              >
                <option value="EUR">EUR</option>
                <option value="USD">USD</option>
                <option value="GBP">GBP</option>
              </select>
            </label>
          </div>

          <div className="checkbox-list">
            <div>
              <strong>{t('brandSettings.enabledLocales')}</strong>
              <div className="category-pills">
                {localeOptions.map((locale) => {
                  const active = localization.enabledLocales.includes(locale);
                  return (
                    <button
                      key={locale}
                      type="button"
                      className={active ? 'pill-button pill-button-active' : 'pill-button'}
                      onClick={() =>
                        setLocalization({
                          ...localization,
                          enabledLocales: active
                            ? localization.enabledLocales.filter((item) => item !== locale)
                            : [...localization.enabledLocales, locale],
                        })
                      }
                    >
                      {localeLabels[locale]}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          <Button type="submit">{t('actions.saveSettings')}</Button>
        </form>

        <section className="panel">
          <h3>{t('brandSettings.previewTitle')}</h3>
          <p>{t('brandSettings.previewCopy')}</p>
          <div className="brand-preview">
            {branding.logoUrl ? (
              <img src={branding.logoUrl} alt={branding.brandName} className="brand-logo brand-logo-large" />
            ) : (
              <span className="brand-mark brand-mark-large">{branding.brandMark}</span>
            )}
            <div>
              <strong>{branding.brandName}</strong>
              <p>{branding.brandTagline}</p>
            </div>
          </div>
        </section>
      </section>
    </div>
  );
}
