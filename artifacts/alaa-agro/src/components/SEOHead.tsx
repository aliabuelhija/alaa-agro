import React, { useEffect } from 'react';
import { useLocale } from '../contexts/LocaleContext';

interface SEOHeadProps {
  title: string;
  description: string;
  path?: string;
}

export function SEOHead({ title, description, path = '' }: SEOHeadProps) {
  const { locale } = useLocale();

  useEffect(() => {
    document.title = title;

    let metaDesc = document.querySelector('meta[name="description"]');
    if (!metaDesc) {
      metaDesc = document.createElement('meta');
      metaDesc.setAttribute('name', 'description');
      document.head.appendChild(metaDesc);
    }
    metaDesc.setAttribute('content', description);

    let ogTitle = document.querySelector('meta[property="og:title"]');
    if (!ogTitle) {
      ogTitle = document.createElement('meta');
      ogTitle.setAttribute('property', 'og:title');
      document.head.appendChild(ogTitle);
    }
    ogTitle.setAttribute('content', title);

    let ogDesc = document.querySelector('meta[property="og:description"]');
    if (!ogDesc) {
      ogDesc = document.createElement('meta');
      ogDesc.setAttribute('property', 'og:description');
      document.head.appendChild(ogDesc);
    }
    ogDesc.setAttribute('content', description);

    let ogLocale = document.querySelector('meta[property="og:locale"]');
    if (!ogLocale) {
      ogLocale = document.createElement('meta');
      ogLocale.setAttribute('property', 'og:locale');
      document.head.appendChild(ogLocale);
    }
    ogLocale.setAttribute('content', locale === 'en' ? 'en_US' : 'ru_RU');

    // Canonical for the current route. index.html ships one for the site root;
    // this keeps it correct as the user navigates.
    let canonical = document.querySelector('link[rel="canonical"]');
    if (!canonical) {
      canonical = document.createElement('link');
      canonical.setAttribute('rel', 'canonical');
      document.head.appendChild(canonical);
    }
    canonical.setAttribute('href', `https://alaa-argo.com${path || `/${locale}`}`);

    // Clean up alternate links
    document.querySelectorAll('link[rel="alternate"]').forEach(el => el.remove());
    
    // Add alternate links
    const addAlternate = (lang: string, href: string) => {
      const link = document.createElement('link');
      link.setAttribute('rel', 'alternate');
      link.setAttribute('hreflang', lang);
      link.setAttribute('href', `https://alaa-argo.com${href}`);
      document.head.appendChild(link);
    };

    const cleanPath = path.replace(/^\/(en|ru)/, '');
    addAlternate('en', `/en${cleanPath}`);
    addAlternate('ru', `/ru${cleanPath}`);
    addAlternate('x-default', `/en${cleanPath}`);

  }, [title, description, path, locale]);

  return null;
}
