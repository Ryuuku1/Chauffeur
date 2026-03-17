import { useEffect, useMemo, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import type { SupportedLocale } from '@/i18n/locale';
import { localeFlags, localeLabels, supportedLocales } from '@/i18n/locale';
import { useAppStore } from '@/state/AppStore';

const GlobeIcon = () => (
  <svg viewBox="0 0 24 24" aria-hidden="true" className="nav-icon">
    <path
      d="M12 3a9 9 0 1 0 9 9a9 9 0 0 0-9-9Zm6.8 8h-3.2a14 14 0 0 0-1.4-5a7.03 7.03 0 0 1 4.6 5ZM12 5.1c.8 1 1.8 3 2.1 5.9H9.9C10.2 8.1 11.2 6.1 12 5.1ZM9.8 6A14.2 14.2 0 0 0 8.4 11H5.2a7.03 7.03 0 0 1 4.6-5Zm-4.6 7h3.2a14.2 14.2 0 0 0 1.4 5A7.03 7.03 0 0 1 5.2 13Zm6.8 5.9c-.8-1-1.8-3-2.1-5.9h4.2c-.3 2.9-1.3 4.9-2.1 5.9Zm2.2-.9a14 14 0 0 0 1.4-5h3.2a7.03 7.03 0 0 1-4.6 5Z"
      fill="currentColor"
    />
  </svg>
);

const nextLocaleIndex = (current: number, total: number, direction: 1 | -1) => {
  if (total === 0) {
    return 0;
  }

  return (current + direction + total) % total;
};

export const LanguageSwitcher = () => {
  const { i18n, t } = useTranslation();
  const { snapshot } = useAppStore();
  const [isOpen, setIsOpen] = useState(false);
  const [highlightedLocale, setHighlightedLocale] = useState<SupportedLocale | null>(null);
  const menuRef = useRef<HTMLDivElement | null>(null);
  const triggerRef = useRef<HTMLButtonElement | null>(null);
  const itemRefs = useRef<Record<SupportedLocale, HTMLButtonElement | null>>({
    en: null,
    pt: null,
    es: null,
    fr: null,
    de: null,
    it: null,
  });

  const enabledLocales = useMemo(
    () => supportedLocales.filter((locale) => snapshot.tenant.localization.enabledLocales.includes(locale)),
    [snapshot.tenant.localization.enabledLocales],
  );

  const currentLocale =
    ((i18n.resolvedLanguage ?? snapshot.tenant.localization.defaultLocale) as SupportedLocale) ?? 'en';

  useEffect(() => {
    const handlePointerDown = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    window.addEventListener('mousedown', handlePointerDown);
    return () => window.removeEventListener('mousedown', handlePointerDown);
  }, []);

  useEffect(() => {
    if (!isOpen) {
      setHighlightedLocale(null);
      return;
    }

    const initialLocale = enabledLocales.includes(currentLocale) ? currentLocale : enabledLocales[0];
    setHighlightedLocale(initialLocale ?? null);
    window.requestAnimationFrame(() => {
      if (initialLocale) {
        itemRefs.current[initialLocale]?.focus();
      }
    });
  }, [currentLocale, enabledLocales, isOpen]);

  const changeLocale = (locale: SupportedLocale) => {
    void i18n.changeLanguage(locale);
    setIsOpen(false);
    window.requestAnimationFrame(() => triggerRef.current?.focus());
  };

  return (
    <div className="language-menu" ref={menuRef}>
      <button
        ref={triggerRef}
        type="button"
        className={isOpen ? 'language-trigger language-trigger-open' : 'language-trigger'}
        aria-haspopup="menu"
        aria-expanded={isOpen}
        aria-label={t('language.label')}
        onClick={() => setIsOpen((open) => !open)}
        onKeyDown={(event) => {
          if (event.key === 'ArrowDown' || event.key === 'Enter' || event.key === ' ') {
            event.preventDefault();
            setIsOpen(true);
          }
        }}
      >
        <GlobeIcon />
        <span className="language-current">{currentLocale.toUpperCase()}</span>
      </button>

      {isOpen ? (
        <div
          className="menu-panel"
          role="menu"
          aria-label={t('language.label')}
          onKeyDown={(event) => {
            if (event.key === 'Escape') {
              event.preventDefault();
              setIsOpen(false);
              triggerRef.current?.focus();
              return;
            }

            if (event.key !== 'ArrowDown' && event.key !== 'ArrowUp') {
              return;
            }

            event.preventDefault();
            const activeLocale = highlightedLocale ?? currentLocale;
            const currentIndex = enabledLocales.findIndex((locale) => locale === activeLocale);
            const nextIndex = nextLocaleIndex(currentIndex < 0 ? 0 : currentIndex, enabledLocales.length, event.key === 'ArrowDown' ? 1 : -1);
            const nextLocale = enabledLocales[nextIndex];
            setHighlightedLocale(nextLocale);
            itemRefs.current[nextLocale]?.focus();
          }}
        >
          {enabledLocales.map((locale) => {
            const active = locale === currentLocale;

            return (
              <button
                key={locale}
                ref={(node) => {
                  itemRefs.current[locale] = node;
                }}
                type="button"
                role="menuitemradio"
                aria-checked={active}
                className={active ? 'menu-item menu-item-active' : 'menu-item'}
                onFocus={() => setHighlightedLocale(locale)}
                onClick={() => changeLocale(locale)}
              >
                <span className="flag-badge" aria-hidden="true">
                  {localeFlags[locale]}
                </span>
                <span className="menu-item-meta">
                  <strong>{localeLabels[locale]}</strong>
                  <small>{locale.toUpperCase()}</small>
                </span>
              </button>
            );
          })}
        </div>
      ) : null}
    </div>
  );
};
