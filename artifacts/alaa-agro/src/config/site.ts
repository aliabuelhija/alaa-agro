/**
 * Single source of truth for the site's public origin.
 *
 * Everything that emits an absolute URL — canonical, hreflang, og:url, the
 * sitemap, robots.txt and the server's per-request SEO injection — derives from
 * this one value. It previously lived as three separate hardcoded literals,
 * which is how the site ended up publishing alaa-argo.com URLs while Search
 * Console was verified for alaa-agro.com.
 *
 * Note the spelling: alaa-AGRO (agriculture). alaa-ARGO is the secondary domain
 * and is NOT the SEO origin.
 *
 * Read by:
 *   - src/components/SEOHead.tsx          (client-side, during navigation)
 *   - scripts/generate-seo.mjs            (build time: sitemap + manifest)
 *   - artifacts/api-server/src/app.ts     (per request, via seo-manifest.json)
 */
export const SITE_ORIGIN = "https://alaa-agro.com";

/** Locales, in the order they should appear in hreflang sets. */
export const SITE_LOCALES = ["en", "ru", "ar"] as const;

export const SITE_DEFAULT_LOCALE = "en";
