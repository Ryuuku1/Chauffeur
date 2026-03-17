import i18n from 'i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import { initReactI18next } from 'react-i18next';
import { localeStorageKey, normalizeLocale, supportedLocales } from './locale';
import { en } from './resources/en';
import { pt } from './resources/pt';

const resources = {
  en: { translation: en },
  pt: { translation: pt },
  es: { translation: {} },
  fr: { translation: {} },
  de: { translation: {} },
  it: { translation: {} },
};

void i18n.use(LanguageDetector).use(initReactI18next).init({
  resources,
  lng: normalizeLocale(typeof window !== 'undefined' ? localStorage.getItem(localeStorageKey) : undefined),
  fallbackLng: 'en',
  supportedLngs: supportedLocales,
  interpolation: {
    escapeValue: false,
  },
  detection: {
    order: ['localStorage', 'navigator'],
    lookupLocalStorage: localeStorageKey,
    caches: ['localStorage'],
    convertDetectedLanguage: (value: string) => normalizeLocale(value),
  },
  returnNull: false,
});

export { i18n };
