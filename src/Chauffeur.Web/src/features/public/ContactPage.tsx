import { useTranslation } from 'react-i18next';
import { SectionHeading } from '@/shared/ui/SectionHeading';
import { useAppStore } from '@/state/AppStore';

export default function ContactPage() {
  const { t } = useTranslation();
  const { snapshot } = useAppStore();
  const { branding } = snapshot.tenant;

  return (
    <div className="page-stack">
      <section className="page-section">
        <SectionHeading
          eyebrow={t('contact.eyebrow')}
          title={t('contact.title')}
          description={t('contact.description')}
        />
      </section>
      <section className="split-section">
        <div className="panel">
          <h3>{t('contact.email')}</h3>
          <p>{branding.contactEmail}</p>
          <h3>{t('contact.phone')}</h3>
          <p>{branding.contactPhone}</p>
          <h3>{t('contact.whatsapp')}</h3>
          <p>{branding.whatsapp}</p>
        </div>
        <div className="panel">
          <h3>{t('contact.coverage')}</h3>
          <p>{branding.serviceArea}</p>
          <h3>{t('contact.hours')}</h3>
          <p>{branding.conciergeHours}</p>
          <h3>{t('contact.bestUse')}</h3>
          <p>{t('contact.bestUseCopy')}</p>
        </div>
      </section>
    </div>
  );
}
