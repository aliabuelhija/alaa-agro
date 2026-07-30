import React, { createContext, useContext, useEffect, useState } from 'react';
import {
  DEFAULT_LOCALE,
  Locale,
  Localised,
  dirFor,
  getTranslation,
  isLocale,
  isRtl,
  pick,
} from '../i18n';

const STORAGE_KEY = 'alaa_agro_locale';

interface LocaleContextType {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  t: (key: string) => string;
  /** Inline copy that has no translation key. Falls back to English, not Russian. */
  pick: (values: Localised) => string;
  dir: 'rtl' | 'ltr';
  rtl: boolean;
}

const LocaleContext = createContext<LocaleContextType | undefined>(undefined);

export function LocaleProvider({ children }: { children: React.ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    return isLocale(saved) ? saved : DEFAULT_LOCALE;
  });

  const setLocale = (newLocale: Locale) => {
    setLocaleState(newLocale);
    localStorage.setItem(STORAGE_KEY, newLocale);
  };

  // `dir` has to live on <html> rather than a wrapper: it drives Tailwind's rtl:
  // variants, logical properties (ms-/me-, text-start/end), scrollbar placement
  // and native form-control direction.
  useEffect(() => {
    document.documentElement.lang = locale;
    document.documentElement.dir = dirFor(locale);
  }, [locale]);

  return (
    <LocaleContext.Provider
      value={{
        locale,
        setLocale,
        t: (key: string) => getTranslation(locale, key),
        pick: (values: Localised) => pick(locale, values),
        dir: dirFor(locale),
        rtl: isRtl(locale),
      }}
    >
      {children}
    </LocaleContext.Provider>
  );
}

export function useLocale() {
  const context = useContext(LocaleContext);
  if (!context) {
    throw new Error('useLocale must be used within a LocaleProvider');
  }
  return context;
}
