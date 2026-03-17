import { useTranslation } from 'react-i18next';
import { SectionHeading } from '@/shared/ui/SectionHeading';
import { useAppStore } from '@/state/AppStore';

export default function FaqPage() {
  const { t } = useTranslation();
  const { snapshot } = useAppStore();

  return (
    <div className="page-stack">
      <section className="page-section">
        <SectionHeading
          eyebrow={t('faq.eyebrow')}
          title={t('faq.title')}
          description={t('faq.description')}
        />
      </section>
      <div className="faq-accordion">
        {snapshot.faqs.map((faq) => (
          <details key={faq.id} className="faq-item">
            <summary>{faq.question}</summary>
            <p>{faq.answer}</p>
          </details>
        ))}
      </div>
    </div>
  );
}
