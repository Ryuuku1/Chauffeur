import type { LocalizedText } from '@/domain/models';
import { fallbackLocale, normalizeLocale } from '@/i18n/locale';

export const resolveLocalizedText = (
  value: LocalizedText | undefined,
  locale?: string,
  fallback = '',
): string => {
  if (!value) {
    return fallback;
  }

  const normalized = normalizeLocale(locale ?? fallbackLocale);
  return (
    value[normalized] ??
    value[fallbackLocale] ??
    Object.values(value).find((item): item is string => Boolean(item && item.trim())) ??
    fallback
  );
};
