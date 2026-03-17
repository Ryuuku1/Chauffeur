import { i18n } from '@/i18n';
import { fallbackLocale, normalizeLocale } from '@/i18n/locale';

const getLocale = (locale?: string): string =>
  normalizeLocale(locale ?? i18n.resolvedLanguage ?? fallbackLocale);

const getDefaultCurrency = (): string => {
  if (typeof window === 'undefined') {
    return 'EUR';
  }

  try {
    const raw = localStorage.getItem('chauffeur-premium-db');
    if (!raw) {
      return 'EUR';
    }

    const parsed = JSON.parse(raw) as {
      tenant?: { localization?: { currency?: string } };
    };

    return parsed.tenant?.localization?.currency ?? 'EUR';
  } catch {
    return 'EUR';
  }
};

export const formatCurrency = (value: number, options?: { locale?: string; currency?: string }): string =>
  new Intl.NumberFormat(getLocale(options?.locale), {
    style: 'currency',
    currency: options?.currency ?? getDefaultCurrency(),
    maximumFractionDigits: 0,
  }).format(value);

export const formatDate = (value: string, locale?: string): string =>
  new Intl.DateTimeFormat(getLocale(locale), {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(new Date(`${value}T00:00:00`));

export const formatShortDate = (value: string, locale?: string): string =>
  new Intl.DateTimeFormat(getLocale(locale), {
    day: 'numeric',
    month: 'short',
  }).format(new Date(`${value}T00:00:00`));

export const formatNumber = (value: number, locale?: string): string =>
  new Intl.NumberFormat(getLocale(locale)).format(value);

export const getWeekdayLabels = (locale?: string): string[] => {
  const formatter = new Intl.DateTimeFormat(getLocale(locale), { weekday: 'short' });
  return Array.from({ length: 7 }, (_, index) =>
    formatter.format(new Date(Date.UTC(2024, 0, 7 + index))),
  );
};
