import { useTranslation } from 'react-i18next';
import { SectionHeading } from '@/shared/ui/SectionHeading';
import { InquiryForm } from './components/InquiryForm';

export default function QuoteRequestPage() {
  const { t } = useTranslation();
  return (
    <div className="page-stack">
      <section className="page-section">
        <SectionHeading
          eyebrow={t('booking.quoteEyebrow')}
          title={t('booking.quoteTitle')}
          description={t('booking.quoteDescription')}
        />
      </section>
      <InquiryForm mode="quote" />
    </div>
  );
}
