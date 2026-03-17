import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import type { UpsertSeasonInput } from '@/domain/contracts';
import type { Season } from '@/domain/models';
import { Button } from '@/shared/ui/Button';
import { validateSeasonForm } from '@/utils/validators';

interface SeasonEditorProps {
  season?: Season;
  onSave: (input: UpsertSeasonInput) => Promise<unknown>;
}

const createSeasonInput = (season?: Season): UpsertSeasonInput => ({
  id: season?.id,
  name: season?.name ?? '',
  startDate: season?.startDate ?? '',
  endDate: season?.endDate ?? '',
  multiplier: season?.multiplier ?? 1,
  priority: season?.priority ?? 1,
  tone: season?.tone ?? '#c48747',
});

export const SeasonEditor = ({ season, onSave }: SeasonEditorProps) => {
  const { t } = useTranslation();
  const [form, setForm] = useState<UpsertSeasonInput>(createSeasonInput(season));
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    setForm(createSeasonInput(season));
    setErrors({});
  }, [season]);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const nextErrors = validateSeasonForm(form);
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) {
      return;
    }

    await onSave(form);
  };

  return (
    <form className="panel compact-form" onSubmit={handleSubmit}>
      <h3>{season ? t('pricingManagement.seasonEditor.editTitle') : t('pricingManagement.seasonEditor.createTitle')}</h3>
      <div className="form-grid">
        <label>
          {t('pricingManagement.seasonEditor.name')}
          <input value={form.name} onChange={(event) => setForm({ ...form, name: event.target.value })} />
          {errors.name ? <small className="field-error">{t(errors.name)}</small> : null}
        </label>
        <label>
          {t('pricingManagement.seasonEditor.multiplier')}
          <input
            type="number"
            step="0.01"
            value={form.multiplier}
            onChange={(event) => setForm({ ...form, multiplier: Number(event.target.value) })}
          />
          {errors.multiplier ? <small className="field-error">{t(errors.multiplier)}</small> : null}
        </label>
        <label>
          {t('pricingManagement.seasonEditor.startDate')}
          <input type="date" value={form.startDate} onChange={(event) => setForm({ ...form, startDate: event.target.value })} />
          {errors.startDate ? <small className="field-error">{t(errors.startDate)}</small> : null}
        </label>
        <label>
          {t('pricingManagement.seasonEditor.endDate')}
          <input type="date" value={form.endDate} onChange={(event) => setForm({ ...form, endDate: event.target.value })} />
          {errors.endDate ? <small className="field-error">{t(errors.endDate)}</small> : null}
        </label>
        <label>
          {t('pricingManagement.seasonEditor.priority')}
          <input
            type="number"
            value={form.priority}
            onChange={(event) => setForm({ ...form, priority: Number(event.target.value) })}
          />
        </label>
        <label>
          {t('pricingManagement.seasonEditor.tone')}
          <input type="color" value={form.tone} onChange={(event) => setForm({ ...form, tone: event.target.value })} />
        </label>
      </div>
      <Button type="submit">{t('actions.saveSeason')}</Button>
    </form>
  );
};
