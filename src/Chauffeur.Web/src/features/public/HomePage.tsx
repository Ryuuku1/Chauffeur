import { useTranslation } from 'react-i18next';
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { getLocalizedCategory } from '@/i18n/helpers';
import { resolveLocalizedText } from '@/shared/lib/localizedText';
import { buttonClassName } from '@/shared/ui/Button';
import { SectionHeading } from '@/shared/ui/SectionHeading';
import { useAppStore } from '@/state/AppStore';
import { formatCurrency } from '@/utils/format';
import { getEventTypeOptions } from '@/i18n/helpers';

export default function HomePage() {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const { snapshot } = useAppStore();
  const [eventType, setEventType] = useState('wedding');
  const [date, setDate] = useState('');
  const eventOptions = getEventTypeOptions(t);
  const featuredMetrics = [
    t('home.metrics.responseTime', { returnObjects: true }) as { label: string; value: string; detail: string },
    t('home.metrics.fleetCategories', { returnObjects: true }) as { label: string; value: string; detail: string },
    t('home.metrics.leadEvents', { returnObjects: true }) as { label: string; value: string; detail: string },
  ];
  const featuredCars = snapshot.cars.filter((car) => car.featured).slice(0, 3);
  const { content, theme } = snapshot.tenant;
  const sectionEnabled = (key: string) => content.homepageSections.find((section) => section.key === key)?.enabled !== false;

  return (
    <div className="page-stack">
      <section className={`hero-banner hero-banner-${theme.templateId}`}>
        <div className="hero-copy">
          <p className="eyebrow">{resolveLocalizedText(content.heroEyebrow, i18n.resolvedLanguage, t('home.eyebrow'))}</p>
          <h1>{resolveLocalizedText(content.heroTitle, i18n.resolvedLanguage, t('home.title'))}</h1>
          <p className="hero-text">{resolveLocalizedText(content.heroSubtitle, i18n.resolvedLanguage, t('home.subtitle'))}</p>
          <div className="hero-cta">
            <Link to="/fleet" className={buttonClassName('primary')}>
              {resolveLocalizedText(content.heroPrimaryCtaLabel, i18n.resolvedLanguage, t('actions.exploreFleet'))}
            </Link>
            <Link to="/quote-request" className={buttonClassName('ghost')}>
              {resolveLocalizedText(content.heroSecondaryCtaLabel, i18n.resolvedLanguage, t('actions.requestOffer'))}
            </Link>
          </div>
          <div className="metric-strip">
            {featuredMetrics.map((metric) => (
              <article key={metric.label}>
                <strong>{metric.value}</strong>
                <span>{metric.label}</span>
                <small>{metric.detail}</small>
              </article>
            ))}
          </div>
        </div>
        <div className="hero-panel panel panel-elevated">
          <p className="eyebrow">{t('filters.availabilitySearch')}</p>
          <h2>{resolveLocalizedText(content.availabilityPanelTitle, i18n.resolvedLanguage, t('home.searchTitle'))}</h2>
          <div className="form-grid">
            <label>
              {t('filters.eventType')}
              <select value={eventType} onChange={(event) => setEventType(event.target.value)}>
                {eventOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </label>
            <label>
              {t('filters.date')}
              <input type="date" value={date} onChange={(event) => setDate(event.target.value)} />
            </label>
          </div>
          <button
            className={buttonClassName('primary', 'md', true)}
            type="button"
            onClick={() => navigate(`/fleet?event=${eventType}&date=${date}`)}
          >
            {t('actions.seeMatchingCars')}
          </button>
          <p className="field-hint">
            {resolveLocalizedText(content.availabilityPanelHint, i18n.resolvedLanguage, t('home.searchHint', {
              price: formatCurrency(Math.min(...snapshot.cars.map((car) => car.pricing.basePrice))),
            })).replace('{{price}}', formatCurrency(Math.min(...snapshot.cars.map((car) => car.pricing.basePrice))))}
          </p>
        </div>
      </section>

      {sectionEnabled('valueProps') ? (
        <section className="panel panel-soft">
          <SectionHeading
            eyebrow={t('home.why.eyebrow')}
            title={resolveLocalizedText(content.trustSectionTitle, i18n.resolvedLanguage, t('home.why.title'))}
            description={resolveLocalizedText(content.trustSectionDescription, i18n.resolvedLanguage, t('home.why.description'))}
          />
          <div className="insight-grid">
            <article className="insight-card">
              <h3>{t('home.why.hospitalityTitle')}</h3>
              <p>{t('home.why.hospitalityCopy')}</p>
            </article>
            <article className="insight-card">
              <h3>{t('home.why.conversionTitle')}</h3>
              <p>{t('home.why.conversionCopy')}</p>
            </article>
            <article className="insight-card">
              <h3>{t('home.why.opsTitle')}</h3>
              <p>{t('home.why.opsCopy')}</p>
            </article>
          </div>
        </section>
      ) : null}

      {sectionEnabled('featuredFleet') ? (
        <section className="page-section">
          <SectionHeading
            eyebrow={t('home.featured.eyebrow')}
            title={t('home.featured.title')}
            description={t('home.featured.description')}
            actions={
              <Link to="/fleet" className={buttonClassName('secondary')}>
                {t('actions.viewAllCars')}
              </Link>
            }
          />
          <div className="feature-grid">
            {featuredCars.map((car) => (
              <article key={car.id} className="feature-card">
                <img src={car.heroImage} alt={car.name} />
                <div>
                  <p className="eyebrow">{getLocalizedCategory(t, car.category)}</p>
                  <h3>{car.name}</h3>
                  <p>{car.summary}</p>
                  <span>{t('home.featured.from', { price: formatCurrency(car.pricing.basePrice) })}</span>
                </div>
              </article>
            ))}
          </div>
        </section>
      ) : null}

      {sectionEnabled('process') ? (
        <section className="page-section">
          <SectionHeading eyebrow={t('home.process.eyebrow')} title={t('home.process.title')} />
          <div className="timeline-grid">
            {snapshot.steps.map((step) => (
              <article key={step.id} className="timeline-card">
                <strong>{step.title}</strong>
                <p>{step.description}</p>
              </article>
            ))}
          </div>
        </section>
      ) : null}

      {sectionEnabled('testimonials') || sectionEnabled('faqPreview') ? (
        <section className="page-section split-section">
          {sectionEnabled('testimonials') ? (
            <div className="panel">
              <SectionHeading eyebrow={t('home.testimonials.eyebrow')} title={t('home.testimonials.title')} />
              <div className="quote-list">
                {snapshot.testimonials.map((testimonial) => (
                  <article key={testimonial.id} className="quote-card">
                    <p>"{testimonial.quote}"</p>
                    <strong>{testimonial.name}</strong>
                    <span>{testimonial.title}</span>
                  </article>
                ))}
              </div>
            </div>
          ) : null}
          {sectionEnabled('faqPreview') ? (
            <div className="panel">
              <SectionHeading eyebrow={t('home.faq.eyebrow')} title={t('home.faq.title')} />
              <div className="faq-list">
                {snapshot.faqs.slice(0, 3).map((faq) => (
                  <article key={faq.id}>
                    <h3>{faq.question}</h3>
                    <p>{faq.answer}</p>
                  </article>
                ))}
                <Link to="/faq" className="text-link">
                  {t('home.faq.readAll')}
                </Link>
              </div>
            </div>
          ) : null}
        </section>
      ) : null}
    </div>
  );
}
