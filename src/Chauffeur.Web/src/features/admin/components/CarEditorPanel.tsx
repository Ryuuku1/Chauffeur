import { useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  carCategoryOptions,
  transmissionOptions,
} from '@/domain/constants';
import type { UpsertCarInput } from '@/domain/contracts';
import type { Car, Extra } from '@/domain/models';
import {
  getCarStyleOptions,
  getCategoryOptions,
  getEventTypeOptions,
  getTransmissionOptions,
} from '@/i18n/helpers';
import { Button } from '@/shared/ui/Button';
import { validateCarForm } from '@/utils/validators';

interface CarEditorPanelProps {
  car?: Car;
  extras: Extra[];
  onSave: (input: UpsertCarInput) => Promise<void>;
}

const createDefaultInput = (car?: Car): UpsertCarInput => ({
  id: car?.id,
  slug: car?.slug ?? '',
  name: car?.name ?? '',
  brand: car?.brand ?? '',
  model: car?.model ?? '',
  year: car?.year ?? 2020,
  category: car?.category ?? carCategoryOptions[0],
  style: car?.style ?? 'Limousine',
  transmission: car?.transmission ?? transmissionOptions[0],
  seats: car?.seats ?? 4,
  location: car?.location ?? '',
  heroImage: car?.heroImage ?? '',
  accent: car?.accent ?? '#d4a457',
  summary: car?.summary ?? '',
  story: car?.story ?? '',
  tags: car?.tags ?? [],
  featured: car?.featured ?? false,
  availabilityBlurb: car?.availabilityBlurb ?? '',
  imageUrls: car?.images.map((image) => image.url) ?? [],
  includedExtraIds: car?.includedExtraIds ?? [],
  suitableEvents: car?.suitableEvents ?? ['wedding'],
  basePrice: car?.pricing.basePrice ?? 650,
  minimumHours: car?.pricing.minimumHours ?? 3,
  eventAdjustments:
    car?.pricing.eventAdjustments ?? {
      wedding: 1.1,
      proposal: 1,
      photoshoot: 1.1,
      anniversary: 1.05,
      'luxury-transfer': 1,
      corporate: 1.05,
      other: 1,
    },
});

export const CarEditorPanel = ({ car, extras, onSave }: CarEditorPanelProps) => {
  const { t } = useTranslation();
  const [form, setForm] = useState<UpsertCarInput>(createDefaultInput(car));
  const [errors, setErrors] = useState<Record<string, string>>({});
  const eventOptions = getEventTypeOptions(t);
  const categoryOptions = getCategoryOptions(t);
  const styleOptions = getCarStyleOptions(t);
  const transmissionLabels = getTransmissionOptions(t);

  useEffect(() => {
    setForm(createDefaultInput(car));
    setErrors({});
  }, [car]);

  const imageValue = useMemo(() => form.imageUrls.join('\n'), [form.imageUrls]);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const nextErrors = validateCarForm(form);
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) {
      return;
    }

    await onSave(form);
  };

  return (
    <form className="panel admin-editor" onSubmit={handleSubmit}>
      <div className="section-heading">
        <div>
          <p className="eyebrow">
            {car ? t('carsManagement.editor.editEyebrow') : t('carsManagement.editor.addEyebrow')}
          </p>
          <h2>{car ? car.name : t('carsManagement.editor.createTitle')}</h2>
        </div>
      </div>
      <div className="form-grid">
        <label>
          {t('carsManagement.editor.name')}
          <input value={form.name} onChange={(event) => setForm({ ...form, name: event.target.value })} />
          {errors.name ? <small className="field-error">{t(errors.name)}</small> : null}
        </label>
        <label>
          {t('carsManagement.editor.slug')}
          <input value={form.slug} onChange={(event) => setForm({ ...form, slug: event.target.value })} />
          {errors.slug ? <small className="field-error">{t(errors.slug)}</small> : null}
        </label>
        <label>
          {t('carsManagement.editor.brand')}
          <input value={form.brand} onChange={(event) => setForm({ ...form, brand: event.target.value })} />
        </label>
        <label>
          {t('carsManagement.editor.model')}
          <input value={form.model} onChange={(event) => setForm({ ...form, model: event.target.value })} />
        </label>
        <label>
          {t('carsManagement.editor.year')}
          <input type="number" value={form.year} onChange={(event) => setForm({ ...form, year: Number(event.target.value) })} />
        </label>
        <label>
          {t('carsManagement.editor.seats')}
          <input type="number" value={form.seats} onChange={(event) => setForm({ ...form, seats: Number(event.target.value) })} />
        </label>
        <label>
          {t('carsManagement.editor.category')}
          <select value={form.category} onChange={(event) => setForm({ ...form, category: event.target.value as Car['category'] })}>
            {categoryOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </label>
        <label>
          {t('carsManagement.editor.style')}
          <select value={form.style} onChange={(event) => setForm({ ...form, style: event.target.value as Car['style'] })}>
            {styleOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </label>
        <label>
          {t('carsManagement.editor.transmission')}
          <select
            value={form.transmission}
            onChange={(event) => setForm({ ...form, transmission: event.target.value as Car['transmission'] })}
          >
            {transmissionLabels.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </label>
        <label>
          {t('carsManagement.editor.location')}
          <input value={form.location} onChange={(event) => setForm({ ...form, location: event.target.value })} />
        </label>
        <label>
          {t('carsManagement.editor.heroImageUrl')}
          <input value={form.heroImage} onChange={(event) => setForm({ ...form, heroImage: event.target.value })} />
          {errors.heroImage ? <small className="field-error">{t(errors.heroImage)}</small> : null}
        </label>
        <label>
          {t('carsManagement.editor.accentColor')}
          <input type="color" value={form.accent} onChange={(event) => setForm({ ...form, accent: event.target.value })} />
        </label>
        <label>
          {t('carsManagement.editor.basePrice')}
          <input
            type="number"
            value={form.basePrice}
            onChange={(event) => setForm({ ...form, basePrice: Number(event.target.value) })}
          />
          {errors.basePrice ? <small className="field-error">{t(errors.basePrice)}</small> : null}
        </label>
        <label>
          {t('carsManagement.editor.minimumHours')}
          <input
            type="number"
            value={form.minimumHours}
            onChange={(event) => setForm({ ...form, minimumHours: Number(event.target.value) })}
          />
        </label>
        <label className="full-width">
          {t('carsManagement.editor.summary')}
          <input value={form.summary} onChange={(event) => setForm({ ...form, summary: event.target.value })} />
          {errors.summary ? <small className="field-error">{t(errors.summary)}</small> : null}
        </label>
        <label className="full-width">
          {t('carsManagement.editor.story')}
          <textarea rows={4} value={form.story} onChange={(event) => setForm({ ...form, story: event.target.value })} />
        </label>
        <label className="full-width">
          {t('carsManagement.editor.availabilityBlurb')}
          <input
            value={form.availabilityBlurb}
            onChange={(event) => setForm({ ...form, availabilityBlurb: event.target.value })}
          />
        </label>
        <label className="full-width">
          {t('carsManagement.editor.tags')}
          <input
            value={form.tags.join(', ')}
            onChange={(event) =>
              setForm({
                ...form,
                tags: event.target.value.split(',').map((value) => value.trim()).filter(Boolean),
              })
            }
          />
        </label>
        <label className="full-width">
          {t('carsManagement.editor.galleryImageUrls')}
          <textarea
            rows={4}
            value={imageValue}
            onChange={(event) =>
              setForm({
                ...form,
                imageUrls: event.target.value.split('\n').map((value) => value.trim()).filter(Boolean),
              })
            }
          />
        </label>
      </div>
      <div className="checkbox-list">
        <div>
          <strong>{t('carsManagement.editor.supportedEvents')}</strong>
          <div className="category-pills">
            {eventOptions.map((option) => {
              const active = form.suitableEvents.includes(option.value);
              return (
                <button
                  key={option.value}
                  type="button"
                  className={active ? 'pill-button pill-button-active' : 'pill-button'}
                  onClick={() =>
                    setForm({
                      ...form,
                      suitableEvents: active
                        ? form.suitableEvents.filter((item) => item !== option.value)
                        : [...form.suitableEvents, option.value],
                    })
                  }
                >
                  {option.label}
                </button>
              );
            })}
          </div>
        </div>
        <div>
          <strong>{t('carsManagement.editor.includedExtras')}</strong>
          <div className="category-pills">
            {extras.map((extra) => {
              const active = form.includedExtraIds.includes(extra.id);
              return (
                <button
                  key={extra.id}
                  type="button"
                  className={active ? 'pill-button pill-button-active' : 'pill-button'}
                  onClick={() =>
                    setForm({
                      ...form,
                      includedExtraIds: active
                        ? form.includedExtraIds.filter((item) => item !== extra.id)
                        : [...form.includedExtraIds, extra.id],
                    })
                  }
                >
                  {extra.name}
                </button>
              );
            })}
          </div>
        </div>
      </div>
      <label className="checkbox-row">
        <input type="checkbox" checked={form.featured} onChange={(event) => setForm({ ...form, featured: event.target.checked })} />
        {t('carsManagement.editor.featureOnHomepage')}
      </label>
      <Button type="submit">{t('actions.saveCar')}</Button>
    </form>
  );
};
