export const supportedLocales = ['en', 'pt', 'es', 'fr', 'de', 'it'] as const;

export type SupportedLocale = (typeof supportedLocales)[number];

export const fallbackLocale: SupportedLocale = 'en';
export const localeStorageKey = 'chauffeur-premium-locale';

export const localeLabels: Record<SupportedLocale, string> = {
  en: 'English',
  pt: 'Português',
  es: 'Español',
  fr: 'Français',
  de: 'Deutsch',
  it: 'Italiano',
};

export const localeFlags: Record<SupportedLocale, string> = {
  en: '🇬🇧',
  pt: '🇵🇹',
  es: '🇪🇸',
  fr: '🇫🇷',
  de: '🇩🇪',
  it: '🇮🇹',
};

export const normalizeLocale = (value?: string | null): SupportedLocale => {
  if (!value) {
    return fallbackLocale;
  }

  const normalized = value.toLowerCase();

  if (normalized.startsWith('pt')) {
    return 'pt';
  }

  if (normalized.startsWith('es')) {
    return 'es';
  }

  if (normalized.startsWith('fr')) {
    return 'fr';
  }

  if (normalized.startsWith('de')) {
    return 'de';
  }

  if (normalized.startsWith('it')) {
    return 'it';
  }

  return 'en';
};
