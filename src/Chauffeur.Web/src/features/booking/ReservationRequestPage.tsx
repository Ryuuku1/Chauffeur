import { useTranslation } from 'react-i18next';
import { SectionHeading } from '@/shared/ui/SectionHeading';
import { InquiryForm } from './components/InquiryForm';

export default function ReservationRequestPage() {
  const { t } = useTranslation();
  return (
    <div className="page-stack">
      <section className="page-section">
        <SectionHeading
          eyebrow={t('booking.reservationEyebrow')}
          title={t('booking.reservationTitle')}
          description={t('booking.reservationDescription')}
        />
      </section>
      <InquiryForm mode="reservation" />
    </div>
  );
}
