import { useTranslation } from 'react-i18next';
import { useMemo, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import type { InquiryInput } from '@/domain/contracts';
import type { EventType } from '@/domain/models';
import { getContactMethodOptions, getEventTypeOptions } from '@/i18n/helpers';
import { Button } from '@/shared/ui/Button';
import { useAppStore } from '@/state/AppStore';
import { formatCurrency } from '@/utils/format';
import { validateInquiry, type ValidationErrors } from '@/utils/validators';
import { BookingSummary } from './BookingSummary';

type InquiryErrorKey =
  | 'customerName'
  | 'email'
  | 'phone'
  | 'eventDate'
  | 'pickupLocation'
  | 'passengerCount'
  | 'carId';

interface InquiryFormProps {
  mode: 'quote' | 'reservation';
}

export const InquiryForm = ({ mode }: InquiryFormProps) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { snapshot, primaryCustomer, submitQuote, submitReservation } = useAppStore();

  const [errors, setErrors] = useState<ValidationErrors<InquiryErrorKey>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [form, setForm] = useState<InquiryInput>({
    customerName: primaryCustomer?.name ?? '',
    email: primaryCustomer?.email ?? '',
    phone: primaryCustomer?.phone ?? '',
    eventType: (searchParams.get('event') as EventType) || 'wedding',
    eventDate: searchParams.get('date') ?? '',
    endDate: searchParams.get('endDate') ?? '',
    startTime: '15:00',
    endTime: '18:00',
    pickupLocation: '',
    destination: '',
    passengerCount: 2,
    notes: '',
    extraIds: [],
    preferredContactMethod: 'email',
    carId: searchParams.get('carId') ?? '',
  });

  const selectedCar = snapshot.cars.find((car) => car.id === form.carId);
  const availableExtras = useMemo(
    () => snapshot.extras.filter((extra) => selectedCar?.includedExtraIds.includes(extra.id)),
    [selectedCar, snapshot.extras],
  );
  const selectedExtras = snapshot.extras.filter((extra) => form.extraIds.includes(extra.id));
  const eventOptions = getEventTypeOptions(t);
  const contactOptions = getContactMethodOptions(t);

  const submitLabel = mode === 'quote' ? t('actions.submitQuote') : t('actions.submitReservation');

  const updateField = <K extends keyof InquiryInput>(key: K, value: InquiryInput[K]) => {
    setForm((current) => ({ ...current, [key]: value }));
    setErrors((current) => ({ ...current, [key]: undefined }));
  };

  const toggleExtra = (extraId: string) => {
    updateField(
      'extraIds',
      form.extraIds.includes(extraId)
        ? form.extraIds.filter((item) => item !== extraId)
        : [...form.extraIds, extraId],
    );
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const nextErrors = validateInquiry(form);
    setErrors(nextErrors);

    if (Object.keys(nextErrors).length > 0) {
      return;
    }

    setIsSubmitting(true);
    try {
      const created = mode === 'quote' ? await submitQuote(form) : await submitReservation(form);
      navigate(`/confirmation/${mode}/${created.reference}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="form-layout">
      <form className="panel form-panel" onSubmit={handleSubmit}>
        <div className="stepper">
          {['Event', 'Vehicle', 'Preferences', 'Review'].map((step, index) => (
            <span key={step} className={index === 0 ? 'step step-active' : 'step'}>
              {t(`booking.steps.${step.toLowerCase()}`)}
            </span>
          ))}
        </div>
        <div className="form-grid">
          <label>
            {t('booking.form.fullName')}
            <input value={form.customerName} onChange={(event) => updateField('customerName', event.target.value)} />
            {errors.customerName ? <small className="field-error">{t(errors.customerName)}</small> : null}
          </label>
          <label>
            {t('booking.form.email')}
            <input type="email" value={form.email} onChange={(event) => updateField('email', event.target.value)} />
            {errors.email ? <small className="field-error">{t(errors.email)}</small> : null}
          </label>
          <label>
            {t('booking.form.phone')}
            <input value={form.phone} onChange={(event) => updateField('phone', event.target.value)} />
            {errors.phone ? <small className="field-error">{t(errors.phone)}</small> : null}
          </label>
          <label>
            {t('filters.eventType')}
            <select value={form.eventType} onChange={(event) => updateField('eventType', event.target.value as EventType)}>
              {eventOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </label>
          <label>
            {t('booking.form.eventDate')}
            <input type="date" value={form.eventDate} onChange={(event) => updateField('eventDate', event.target.value)} />
            {errors.eventDate ? <small className="field-error">{t(errors.eventDate)}</small> : null}
          </label>
          <label>
            {t('filters.endDate')}
            <input type="date" value={form.endDate} onChange={(event) => updateField('endDate', event.target.value)} />
          </label>
          <label>
            {t('booking.form.startTime')}
            <input type="time" value={form.startTime} onChange={(event) => updateField('startTime', event.target.value)} />
          </label>
          <label>
            {t('booking.form.endTime')}
            <input type="time" value={form.endTime} onChange={(event) => updateField('endTime', event.target.value)} />
          </label>
          <label className="full-width">
            {t('booking.form.selectedCar')}
            <select value={form.carId} onChange={(event) => updateField('carId', event.target.value)}>
              <option value="">{t('booking.form.selectCar')}</option>
              {snapshot.cars.map((car) => (
                <option key={car.id} value={car.id}>
                  {car.name}
                </option>
              ))}
            </select>
            {errors.carId ? <small className="field-error">{t(errors.carId)}</small> : null}
          </label>
          <label className="full-width">
            {t('booking.form.pickupLocation')}
            <input
              value={form.pickupLocation}
              onChange={(event) => updateField('pickupLocation', event.target.value)}
              placeholder={t('booking.form.pickupPlaceholder')}
            />
            {errors.pickupLocation ? <small className="field-error">{t(errors.pickupLocation)}</small> : null}
          </label>
          <label className="full-width">
            {t('booking.form.destination')}
            <input
              value={form.destination}
              onChange={(event) => updateField('destination', event.target.value)}
              placeholder={t('booking.form.destinationPlaceholder')}
            />
          </label>
          <label>
            {t('booking.form.passengers')}
            <input
              type="number"
              min="1"
              value={form.passengerCount}
              onChange={(event) => updateField('passengerCount', Number(event.target.value))}
            />
            {errors.passengerCount ? <small className="field-error">{t(errors.passengerCount)}</small> : null}
          </label>
          <label>
            {t('booking.form.preferredContact')}
            <select
              value={form.preferredContactMethod}
              onChange={(event) => updateField('preferredContactMethod', event.target.value as InquiryInput['preferredContactMethod'])}
            >
              {contactOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </label>
          <label className="full-width">
            {t('booking.form.specialRequests')}
            <textarea
              rows={4}
              value={form.notes}
              onChange={(event) => updateField('notes', event.target.value)}
              placeholder={t('booking.form.specialRequestsPlaceholder')}
            />
          </label>
        </div>
        <div className="extras-grid">
          {availableExtras.map((extra) => {
            const active = form.extraIds.includes(extra.id);
            return (
              <button
                key={extra.id}
                className={active ? 'extra-card extra-card-active' : 'extra-card'}
                type="button"
                onClick={() => toggleExtra(extra.id)}
              >
                <strong>{extra.name}</strong>
                <span>{extra.description}</span>
                <small>{formatCurrency(extra.price)}</small>
              </button>
            );
          })}
          {!availableExtras.length ? <p className="field-hint">{t('booking.form.extrasHint')}</p> : null}
        </div>
        <div className="form-footer">
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? t('booking.form.submitting') : submitLabel}
          </Button>
        </div>
      </form>
      <BookingSummary
        snapshot={snapshot}
        car={selectedCar}
        date={form.eventDate}
        endDate={form.endDate}
        eventType={form.eventType}
        extras={selectedExtras}
      />
    </div>
  );
};
