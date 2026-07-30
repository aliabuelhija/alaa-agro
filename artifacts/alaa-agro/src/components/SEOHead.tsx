import { useEffect } from 'react';
import { useLocale } from '../contexts/LocaleContext';
import {
  DEFAULT_LOCALE,
  LOCALES,
  LOCALE_PREFIX_RE,
  OG_LOCALE,
} from '../i18n';

const ORIGIN = 'https://alaa-argo.com';

interface SEOHeadProps {
  title: string;
  description: string;
  path?: string;
}

function upsertMeta(attr: 'name' | 'property', key: string, content: string) {
  let el = document.querySelector(`meta[${attr}="${key}"]`);
  if (!el) {
    el = document.createElement('meta');
    el.setAttribute(attr, key);
    document.head.appendChild(el);
  }
  el.setAttribute('content', content);
}

export function SEOHead({ title, description, path = '' }: SEOHeadProps) {
  const { locale } = useLocale();

  useEffect(() => {
    document.title = title;

    upsertMeta('name', 'description', description);
    upsertMeta('property', 'og:title', title);
    upsertMeta('property', 'og:description', description);
    upsertMeta('property', 'og:locale', OG_LOCALE[locale]);
    upsertMeta('name', 'twitter:title', title);
    upsertMeta('name', 'twitter:description', description);

    // Alternate og:locale entries for the other languages.
    document
      .querySelectorAll('meta[property="og:locale:alternate"]')
      .forEach((el) => el.remove());
    for (const l of LOCALES) {
      if (l === locale) continue;
      const el = document.createElement('meta');
      el.setAttribute('property', 'og:locale:alternate');
      el.setAttribute('content', OG_LOCALE[l]);
      document.head.appendChild(el);
    }

    const cleanPath = path.replace(LOCALE_PREFIX_RE, '');
    const canonicalPath = path || `/${locale}`;

    // Canonical for the current route. index.html ships one for the site root;
    // this keeps it correct as the user navigates.
    let canonical = document.querySelector('link[rel="canonical"]');
    if (!canonical) {
      canonical = document.createElement('link');
      canonical.setAttribute('rel', 'canonical');
      document.head.appendChild(canonical);
    }
    canonical.setAttribute('href', `${ORIGIN}${canonicalPath}`);
    upsertMeta('property', 'og:url', `${ORIGIN}${canonicalPath}`);

    // One hreflang per locale, plus x-default pointing at the default locale.
    document
      .querySelectorAll('link[rel="alternate"]')
      .forEach((el) => el.remove());

    const addAlternate = (lang: string, href: string) => {
      const link = document.createElement('link');
      link.setAttribute('rel', 'alternate');
      link.setAttribute('hreflang', lang);
      link.setAttribute('href', `${ORIGIN}${href}`);
      document.head.appendChild(link);
    };

    for (const l of LOCALES) addAlternate(l, `/${l}${cleanPath}`);
    addAlternate('x-default', `/${DEFAULT_LOCALE}${cleanPath}`);
  }, [title, description, path, locale]);

  return null;
}
