import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import type { UpdateTenantContentInput, UpdateTenantNavigationInput } from '@/domain/contracts';
import type { LocalizedText } from '@/domain/models';
import { Button } from '@/shared/ui/Button';
import { SectionHeading } from '@/shared/ui/SectionHeading';
import { useAppStore } from '@/state/AppStore';

const updateLocalizedField = (
  source: LocalizedText,
  locale: 'en' | 'pt',
  value: string,
): LocalizedText => ({
  ...source,
  [locale]: value,
});

export default function ContentManagementPage() {
  const { t } = useTranslation();
  const { snapshot, updateTenantContent, updateTenantNavigation } = useAppStore();
  const [content, setContent] = useState<UpdateTenantContentInput>(snapshot.tenant.content);
  const [navigation, setNavigation] = useState<UpdateTenantNavigationInput>(snapshot.tenant.navigation);

  return (
    <div className="page-stack">
      <section className="page-section">
        <SectionHeading
          eyebrow={t('contentSettings.eyebrow')}
          title={t('contentSettings.title')}
          description={t('contentSettings.description')}
        />
      </section>

      <form
        className="panel admin-editor"
        onSubmit={async (event) => {
          event.preventDefault();
          await updateTenantContent(content);
          await updateTenantNavigation(navigation);
        }}
      >
        <div className="form-grid">
          <label>
            {t('contentSettings.fields.heroTitleEn')}
            <input
              value={content.heroTitle.en ?? ''}
              onChange={(event) => setContent({ ...content, heroTitle: updateLocalizedField(content.heroTitle, 'en', event.target.value) })}
            />
          </label>
          <label>
            {t('contentSettings.fields.heroTitlePt')}
            <input
              value={content.heroTitle.pt ?? ''}
              onChange={(event) => setContent({ ...content, heroTitle: updateLocalizedField(content.heroTitle, 'pt', event.target.value) })}
            />
          </label>
          <label className="full-width">
            {t('contentSettings.fields.heroSubtitleEn')}
            <textarea
              rows={3}
              value={content.heroSubtitle.en ?? ''}
              onChange={(event) =>
                setContent({ ...content, heroSubtitle: updateLocalizedField(content.heroSubtitle, 'en', event.target.value) })
              }
            />
          </label>
          <label className="full-width">
            {t('contentSettings.fields.heroSubtitlePt')}
            <textarea
              rows={3}
              value={content.heroSubtitle.pt ?? ''}
              onChange={(event) =>
                setContent({ ...content, heroSubtitle: updateLocalizedField(content.heroSubtitle, 'pt', event.target.value) })
              }
            />
          </label>
          <label>
            {t('contentSettings.fields.primaryCtaEn')}
            <input
              value={content.heroPrimaryCtaLabel.en ?? ''}
              onChange={(event) =>
                setContent({ ...content, heroPrimaryCtaLabel: updateLocalizedField(content.heroPrimaryCtaLabel, 'en', event.target.value) })
              }
            />
          </label>
          <label>
            {t('contentSettings.fields.primaryCtaPt')}
            <input
              value={content.heroPrimaryCtaLabel.pt ?? ''}
              onChange={(event) =>
                setContent({
                  ...content,
                  heroPrimaryCtaLabel: updateLocalizedField(content.heroPrimaryCtaLabel, 'pt', event.target.value),
                })
              }
            />
          </label>
          <label>
            {t('contentSettings.fields.secondaryCtaEn')}
            <input
              value={content.heroSecondaryCtaLabel.en ?? ''}
              onChange={(event) =>
                setContent({
                  ...content,
                  heroSecondaryCtaLabel: updateLocalizedField(content.heroSecondaryCtaLabel, 'en', event.target.value),
                })
              }
            />
          </label>
          <label>
            {t('contentSettings.fields.secondaryCtaPt')}
            <input
              value={content.heroSecondaryCtaLabel.pt ?? ''}
              onChange={(event) =>
                setContent({
                  ...content,
                  heroSecondaryCtaLabel: updateLocalizedField(content.heroSecondaryCtaLabel, 'pt', event.target.value),
                })
              }
            />
          </label>
        </div>

        <div className="checkbox-list">
          <div>
            <strong>{t('contentSettings.sectionVisibility')}</strong>
            <div className="category-pills">
              {content.homepageSections.map((section) => {
                const key = `contentSettings.sections.${section.key}`;
                return (
                  <button
                    key={section.key}
                    type="button"
                    className={section.enabled ? 'pill-button pill-button-active' : 'pill-button'}
                    onClick={() =>
                      setContent({
                        ...content,
                        homepageSections: content.homepageSections.map((item) =>
                          item.key === section.key ? { ...item, enabled: !item.enabled } : item,
                        ),
                      })
                    }
                  >
                    {t(key)}
                  </button>
                );
              })}
            </div>
          </div>

          <div>
            <strong>{t('contentSettings.navigationVisibility')}</strong>
            <div className="category-pills">
              {navigation.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  className={item.visible ? 'pill-button pill-button-active' : 'pill-button'}
                  onClick={() =>
                    setNavigation(
                      navigation.map((navItem) =>
                        navItem.id === item.id ? { ...navItem, visible: !navItem.visible } : navItem,
                      ),
                    )
                  }
                >
                  {t(item.translationKey)}
                </button>
              ))}
            </div>
          </div>
        </div>

        <Button type="submit">{t('actions.saveSettings')}</Button>
      </form>
    </div>
  );
}
