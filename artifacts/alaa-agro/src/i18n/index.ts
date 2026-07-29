import { en } from './en';
import { ru } from './ru';

export type Locale = 'en' | 'ru';

export const translations = { en, ru };

type ObjectPaths<T> = T extends object
  ? {
      [K in keyof T]: `${K & string}${T[K] extends object ? `.${ObjectPaths<T[K]>}` : ''}`
    }[keyof T]
  : never;

export type TranslationKey = ObjectPaths<typeof en>;

export function getTranslation(locale: Locale, key: string): string {
  const keys = key.split('.');
  let current: any = translations[locale];
  
  for (const k of keys) {
    if (current[k] === undefined) {
      console.warn(`Missing translation for key: ${key} in locale: ${locale}`);
      // Fallback to English
      let fallback: any = translations['en'];
      for (const fk of keys) {
        if (fallback[fk] === undefined) return key;
        fallback = fallback[fk];
      }
      return fallback as string;
    }
    current = current[k];
  }
  
  return current as string;
}
