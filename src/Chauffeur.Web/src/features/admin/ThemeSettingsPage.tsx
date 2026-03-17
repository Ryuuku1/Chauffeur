import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { getTemplateThemePreset, tenantTemplates } from '@/domain/templates';
import type { UpdateTenantThemeInput } from '@/domain/contracts';
import { Button } from '@/shared/ui/Button';
import { SectionHeading } from '@/shared/ui/SectionHeading';
import { useAppStore } from '@/state/AppStore';

export default function ThemeSettingsPage() {
  const { t } = useTranslation();
  const { snapshot, updateTenantTheme } = useAppStore();
  const [theme, setTheme] = useState<UpdateTenantThemeInput>(() => snapshot.tenant.theme);

  useEffect(() => {
    setTheme(snapshot.tenant.theme);
  }, [snapshot.tenant.theme]);

  return (
    <div className="page-stack">
      <section className="page-section">
        <SectionHeading
          eyebrow={t('themeSettings.eyebrow')}
          title={t('themeSettings.title')}
          description={t('themeSettings.description')}
        />
      </section>

      <section className="split-section">
        <div className="panel">
          <h3>{t('themeSettings.templateTitle')}</h3>
          <p className="section-copy">{t('themeSettings.templateHint')}</p>
          <div className="feature-grid">
            {tenantTemplates.map((template) => {
              const active = theme.templateId === template.id;
              return (
                <button
                  key={template.id}
                  type="button"
                  className={active ? 'template-card template-card-active' : 'template-card'}
                  onClick={() => {
                    const preset = getTemplateThemePreset(template.id);
                    setTheme({
                      ...preset,
                      density: theme.density,
                    });
                  }}
                >
                  <span className="template-swatch" style={{ background: template.previewGradient }} />
                  <strong>{t(template.translationKey)}</strong>
                  <p>{t(template.descriptionKey)}</p>
                </button>
              );
            })}
          </div>
        </div>

        <form
          className="panel admin-editor"
          onSubmit={async (event) => {
            event.preventDefault();
            await updateTenantTheme(theme);
          }}
        >
          <div className="form-grid">
            <label>
              {t('themeSettings.fields.primaryColor')}
              <input type="color" value={theme.primaryColor} onChange={(event) => setTheme({ ...theme, primaryColor: event.target.value })} />
            </label>
            <label>
              {t('themeSettings.fields.secondaryColor')}
              <input type="color" value={theme.secondaryColor} onChange={(event) => setTheme({ ...theme, secondaryColor: event.target.value })} />
            </label>
            <label>
              {t('themeSettings.fields.accentColor')}
              <input type="color" value={theme.accentColor} onChange={(event) => setTheme({ ...theme, accentColor: event.target.value })} />
            </label>
            <label>
              {t('themeSettings.fields.surfaceColor')}
              <input type="color" value={theme.surfaceColor} onChange={(event) => setTheme({ ...theme, surfaceColor: event.target.value })} />
            </label>
            <label>
              {t('themeSettings.fields.surfaceSoftColor')}
              <input type="color" value={theme.surfaceSoftColor} onChange={(event) => setTheme({ ...theme, surfaceSoftColor: event.target.value })} />
            </label>
            <label>
              {t('themeSettings.fields.headingFont')}
              <input value={theme.headingFont} onChange={(event) => setTheme({ ...theme, headingFont: event.target.value })} />
            </label>
            <label>
              {t('themeSettings.fields.bodyFont')}
              <input value={theme.bodyFont} onChange={(event) => setTheme({ ...theme, bodyFont: event.target.value })} />
            </label>
            <label>
              {t('themeSettings.fields.radiusScale')}
              <select value={theme.radiusScale} onChange={(event) => setTheme({ ...theme, radiusScale: event.target.value as UpdateTenantThemeInput['radiusScale'] })}>
                <option value="soft">{t('themeSettings.radius.soft')}</option>
                <option value="rounded">{t('themeSettings.radius.rounded')}</option>
                <option value="dramatic">{t('themeSettings.radius.dramatic')}</option>
              </select>
            </label>
            <label>
              {t('themeSettings.fields.density')}
              <select value={theme.density} onChange={(event) => setTheme({ ...theme, density: event.target.value as UpdateTenantThemeInput['density'] })}>
                <option value="comfortable">{t('themeSettings.density.comfortable')}</option>
                <option value="compact">{t('themeSettings.density.compact')}</option>
              </select>
            </label>
          </div>
          <Button type="submit">{t('actions.saveSettings')}</Button>
        </form>
      </section>
    </div>
  );
}
