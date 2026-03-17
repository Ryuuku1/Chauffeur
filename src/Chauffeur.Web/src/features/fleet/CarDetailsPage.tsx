import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Link, Navigate, useParams } from 'react-router-dom';
import { AvailabilityCalendar } from '@/shared/ui/AvailabilityCalendar';
import { SectionHeading } from '@/shared/ui/SectionHeading';
import { buttonClassName } from '@/shared/ui/Button';
import { useAppStore } from '@/state/AppStore';
import { formatCurrency } from '@/utils/format';
import {
  getLocalizedCarStyle,
  getLocalizedCategory,
  getLocalizedEventType,
  getLocalizedTransmission,
} from '@/i18n/helpers';

export default function CarDetailsPage() {
  const { t } = useTranslation();
  const { slug } = useParams();
  const { snapshot, recordRecentlyViewed } = useAppStore();
  const car = snapshot.cars.find((item) => item.slug === slug);

  useEffect(() => {
    if (car) {
      recordRecentlyViewed(car.id);
    }
  }, [car, recordRecentlyViewed]);

  if (!car) {
    return <Navigate to="/fleet" replace />;
  }

  const relatedCars = snapshot.cars.filter((item) => item.id !== car.id && item.category === car.category).slice(0, 2);
  const includedExtras = snapshot.extras.filter((extra) => car.includedExtraIds.includes(extra.id));

  return (
    <div className="page-stack">
      <section className="details-hero">
        <div className="details-gallery">
          <img className="details-lead-image" src={car.heroImage} alt={car.name} />
          <div className="gallery-strip">
            {car.images.slice(1).map((image) => (
              <img key={image.id} src={image.url} alt={image.alt} />
            ))}
          </div>
        </div>
        <div className="details-panel panel">
          <p className="eyebrow">{getLocalizedCategory(t, car.category)} | {getLocalizedCarStyle(t, car.style)}</p>
          <h1>{car.name}</h1>
          <p className="hero-text">{car.story}</p>
          <div className="detail-stat-grid">
            <article>
              <span>{t('carDetails.startingFrom')}</span>
              <strong>{formatCurrency(car.pricing.basePrice)}</strong>
            </article>
            <article>
              <span>{t('carDetails.seats')}</span>
              <strong>{car.seats}</strong>
            </article>
            <article>
              <span>{t('carDetails.transmission')}</span>
              <strong>{getLocalizedTransmission(t, car.transmission)}</strong>
            </article>
            <article>
              <span>{t('carDetails.baseLocation')}</span>
              <strong>{car.location}</strong>
            </article>
          </div>
          <div className="hero-cta">
            <Link to={`/quote-request?carId=${car.id}`} className={buttonClassName('primary')}>
              {t('actions.requestOffer')}
            </Link>
            <Link to={`/reservation-request?carId=${car.id}`} className={buttonClassName('ghost')}>
              {t('carDetails.startReservation')}
            </Link>
          </div>
          <p className="field-hint">{car.pricing.quoteDisclosure}</p>
        </div>
      </section>

      <section className="split-section">
        <div className="panel">
          <SectionHeading eyebrow={t('carDetails.featuresEyebrow')} title={t('carDetails.featuresTitle')} />
          <div className="insight-grid">
            {car.features.map((feature) => (
              <article key={feature.id} className="insight-card">
                <h3>{feature.label}</h3>
                <p>{feature.detail}</p>
              </article>
            ))}
          </div>
        </div>
        <AvailabilityCalendar snapshot={snapshot} carId={car.id} />
      </section>

      <section className="split-section">
        <div className="panel">
          <SectionHeading eyebrow={t('carDetails.suitabilityEyebrow')} title={t('carDetails.suitabilityTitle')} />
          <div className="tag-list">
            {car.suitableEvents.map((eventType) => (
              <span key={eventType} className="tag">
                {getLocalizedEventType(t, eventType)}
              </span>
            ))}
          </div>
          <p>{car.availabilityBlurb}</p>
        </div>
        <div className="panel">
          <SectionHeading eyebrow={t('carDetails.extrasEyebrow')} title={t('carDetails.extrasTitle')} />
          <div className="quote-list">
            {includedExtras.map((extra) => (
              <article key={extra.id} className="quote-card">
                <strong>{extra.name}</strong>
                <p>{extra.description}</p>
                <span>{formatCurrency(extra.price)}</span>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="page-section">
        <SectionHeading eyebrow={t('carDetails.relatedEyebrow')} title={t('carDetails.relatedTitle')} />
        <div className="feature-grid">
          {relatedCars.map((relatedCar) => (
            <article key={relatedCar.id} className="feature-card">
              <img src={relatedCar.heroImage} alt={relatedCar.name} />
              <div>
                <h3>{relatedCar.name}</h3>
                <p>{relatedCar.summary}</p>
                <Link to={`/fleet/${relatedCar.slug}`} className="text-link">
                  {t('carDetails.openDetails')}
                </Link>
              </div>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}
