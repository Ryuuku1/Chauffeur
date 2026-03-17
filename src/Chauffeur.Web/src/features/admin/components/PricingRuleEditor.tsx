import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import type { UpdateCarPricingInput } from '@/domain/contracts';
import type { Car } from '@/domain/models';
import { getEventTypeOptions } from '@/i18n/helpers';
import { Button } from '@/shared/ui/Button';

interface PricingRuleEditorProps {
  car: Car;
  onSave: (input: UpdateCarPricingInput) => Promise<void>;
}

export const PricingRuleEditor = ({ car, onSave }: PricingRuleEditorProps) => {
  const { t } = useTranslation();
  const [form, setForm] = useState<UpdateCarPricingInput>({
    carId: car.id,
    basePrice: car.pricing.basePrice,
    minimumHours: car.pricing.minimumHours,
    eventAdjustments: car.pricing.eventAdjustments,
  });
  const eventOptions = getEventTypeOptions(t);

  useEffect(() => {
    setForm({
      carId: car.id,
      basePrice: car.pricing.basePrice,
      minimumHours: car.pricing.minimumHours,
      eventAdjustments: car.pricing.eventAdjustments,
    });
  }, [car]);

  return (
    <form
      className="panel compact-form"
      onSubmit={async (event) => {
        event.preventDefault();
        await onSave(form);
      }}
    >
      <h3>{car.name}</h3>
      <div className="form-grid">
        <label>
          {t('carsManagement.editor.basePrice')}
          <input
            type="number"
            value={form.basePrice}
            onChange={(event) => setForm({ ...form, basePrice: Number(event.target.value) })}
          />
        </label>
        <label>
          {t('carsManagement.editor.minimumHours')}
          <input
            type="number"
            value={form.minimumHours}
            onChange={(event) => setForm({ ...form, minimumHours: Number(event.target.value) })}
          />
        </label>
        {eventOptions.map((option) => (
          <label key={option.value}>
            {option.label}
            <input
              type="number"
              step="0.01"
              value={form.eventAdjustments[option.value]}
              onChange={(event) =>
                setForm({
                  ...form,
                  eventAdjustments: {
                    ...form.eventAdjustments,
                    [option.value]: Number(event.target.value),
                  },
                })
              }
            />
          </label>
        ))}
      </div>
      <Button type="submit" variant="secondary">
        {t('actions.updatePricing')}
      </Button>
    </form>
  );
};
