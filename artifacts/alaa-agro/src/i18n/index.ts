import { en } from './en';
import { ru } from './ru';
import { ar } from './ar';

export const LOCALES = ['en', 'ru', 'ar'] as const;
export type Locale = (typeof LOCALES)[number];

export const DEFAULT_LOCALE: Locale = 'en';

/** Locales written right-to-left. Drives `dir` on <html> and the RTL variants. */
export const RTL_LOCALES: readonly Locale[] = ['ar'];

export function isRtl(locale: Locale): boolean {
  return RTL_LOCALES.includes(locale);
}

export function dirFor(locale: Locale): 'rtl' | 'ltr' {
  return isRtl(locale) ? 'rtl' : 'ltr';
}

export function isLocale(value: unknown): value is Locale {
  return typeof value === 'string' && (LOCALES as readonly string[]).includes(value);
}

/** Matches a leading locale segment: `/en`, `/ru/products`, … */
export const LOCALE_PATH_RE = new RegExp(`^/(${LOCALES.join('|')})(?:/|$)`);
/** Same, but for stripping/replacing the prefix. */
export const LOCALE_PREFIX_RE = new RegExp(`^/(${LOCALES.join('|')})`);

export function localeFromPath(path: string): Locale | null {
  const m = path.match(LOCALE_PATH_RE);
  return m && isLocale(m[1]) ? m[1] : null;
}

/** BCP 47 / Open Graph locale codes, for hreflang and og:locale. */
export const OG_LOCALE: Record<Locale, string> = {
  en: 'en_US',
  ru: 'ru_RU',
  ar: 'ar_AE',
};

/** Native language names, for the language switcher. */
export const LOCALE_LABEL: Record<Locale, string> = {
  en: 'English',
  ru: 'Русский',
  ar: 'العربية',
};

export const LOCALE_SHORT: Record<Locale, string> = {
  en: 'EN',
  ru: 'RU',
  ar: 'AR',
};

export const translations = { en, ru, ar };

type ObjectPaths<T> = T extends object
  ? {
      [K in keyof T]: `${K & string}${T[K] extends object ? `.${ObjectPaths<T[K]>}` : ''}`
    }[keyof T]
  : never;

export type TranslationKey = ObjectPaths<typeof en>;

/**
 * Inline copy that is not worth a key in the translation files. Arabic is
 * optional and falls back to English — never to another translation, which is
 * what the previous `locale === 'en' ? english : russian` pattern did (it showed
 * Russian to Arabic visitors).
 */
export type Localised = { en: string; ru: string; ar?: string };

export function pick(locale: Locale, values: Localised): string {
  return values[locale] ?? values.en;
}

export function getTranslation(locale: Locale, key: string): string {
  const keys = key.split('.');
  let current: any = translations[locale];

  for (const k of keys) {
    if (current?.[k] === undefined) {
      console.warn(`Missing translation for key: ${key} in locale: ${locale}`);
      // Fallback to English
      let fallback: any = translations['en'];
      for (const fk of keys) {
        if (fallback?.[fk] === undefined) return key;
        fallback = fallback[fk];
      }
      return fallback as string;
    }
    current = current[k];
  }

  return current as string;
}
