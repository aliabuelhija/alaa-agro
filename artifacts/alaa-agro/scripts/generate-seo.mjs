// Generates public/sitemap.xml and public/seo-manifest.json.
//
// Both derive from src/config/site.ts, so the origin is defined exactly once.
// The manifest is what lets the API server return route-specific <title> and
// meta description in the raw HTML: every route is served the same index.html,
// so without it a crawler sees the homepage's metadata on all 72 urls.
//
// Run: pnpm --filter @workspace/alaa-agro run gen:seo
//
// Values are read out of the TypeScript sources with targeted regexes rather
// than by importing them — this script runs under plain node, and adding a TS
// loader for four string lookups is not worth the dependency. Every read is
// asserted, so a rename fails the build loudly instead of silently emitting
// wrong metadata.

import fs from "node:fs";
import path from "node:path";

const pkgRoot = path.resolve(import.meta.dirname, "..");
const read = (rel) => fs.readFileSync(path.join(pkgRoot, rel), "utf8");

function must(value, what) {
  if (!value) throw new Error(`generate-seo: could not read ${what}`);
  return value;
}

// ── origin + locales, from the single source of truth ───────────────────────
const siteConfig = read("src/config/site.ts");
const ORIGIN = must(
  siteConfig.match(/SITE_ORIGIN\s*=\s*"([^"]+)"/)?.[1],
  "SITE_ORIGIN from src/config/site.ts",
);
const LOCALES = must(
  siteConfig.match(/SITE_LOCALES\s*=\s*\[([^\]]+)\]/)?.[1],
  "SITE_LOCALES",
)
  .split(",")
  .map((s) => s.trim().replace(/['"]/g, ""))
  .filter(Boolean);
const DEFAULT_LOCALE = must(
  siteConfig.match(/SITE_DEFAULT_LOCALE\s*=\s*"([^"]+)"/)?.[1],
  "SITE_DEFAULT_LOCALE",
);

// ── i18n lookups ────────────────────────────────────────────────────────────
// Pulls `parent.key` out of a nested object literal by finding the parent block
// and then the key inside it.
function i18nValue(source, parent, key) {
  const start = source.indexOf(`${parent}: {`);
  if (start === -1) return null;
  let depth = 0;
  let end = start;
  for (let i = source.indexOf("{", start); i < source.length; i++) {
    if (source[i] === "{") depth++;
    else if (source[i] === "}") {
      depth--;
      if (depth === 0) {
        end = i;
        break;
      }
    }
  }
  const block = source.slice(start, end);
  const m = block.match(new RegExp(`\\b${key}:\\s*"((?:[^"\\\\]|\\\\.)*)"`));
  return m ? m[1].replace(/\\"/g, '"') : null;
}

const i18n = Object.fromEntries(
  LOCALES.map((l) => [l, read(`src/i18n/${l}.ts`)]),
);

const t = (locale, parent, key) =>
  must(i18nValue(i18n[locale], parent, key), `${locale}: ${parent}.${key}`);

// ── products ────────────────────────────────────────────────────────────────
const productsSrc = read("src/data/products.ts");
const productsArSrc = read("src/data/products.ar.ts");

// Each product entry: id, slug and the per-locale SEO strings.
const products = [];
for (const block of productsSrc.split(/\n  \{\n/).slice(1)) {
  const id = block.match(/\bid:\s*"([^"]+)"/)?.[1];
  const slug = block.match(/\bslug:\s*"([^"]+)"/)?.[1];
  if (!id || !slug) continue;
  products.push({
    id,
    slug,
    en: {
      title: must(block.match(/seoTitleEn:\s*"([^"]+)"/)?.[1], `${id} seoTitleEn`),
      description: must(block.match(/seoDescEn:\s*"([^"]+)"/)?.[1], `${id} seoDescEn`),
    },
    ru: {
      title: must(block.match(/seoTitleRu:\s*"([^"]+)"/)?.[1], `${id} seoTitleRu`),
      description: must(block.match(/seoDescRu:\s*"([^"]+)"/)?.[1], `${id} seoDescRu`),
    },
  });
}
if (products.length === 0) throw new Error("generate-seo: no products parsed");

// Arabic overlay, keyed by product id.
for (const p of products) {
  const entry = productsArSrc.split(new RegExp(`\\n  "?${p.id}"?:\\s*\\{`))[1];
  const title = entry?.match(/seoTitle:\s*\n?\s*"([^"]+)"/)?.[1];
  const description = entry?.match(/seoDesc:\s*\n?\s*"([^"]+)"/)?.[1];
  // Falls back to English, matching the runtime accessors — never to Russian.
  p.ar = {
    title: title ?? p.en.title,
    description: description ?? p.en.description,
  };
}

// ── route table — mirrors the <SEOHead> call in each page ───────────────────
function routesFor(locale) {
  const suffix = " | ALAA AGRO";
  return [
    { path: "", title: t(locale, "seo", "homeTitle"), description: t(locale, "seo", "homeDesc") },
    {
      path: "/products",
      title: `${t(locale, "productsPage", "title")} | ALAA AGRO TRADE LLC`,
      description: t(locale, "productsPage", "desc"),
    },
    {
      path: "/about",
      title: `${t(locale, "aboutPage", "title")}${suffix}`,
      description: t(locale, "aboutPage", "mission"),
    },
    {
      path: "/quality",
      title: `${t(locale, "qualityPage", "title")}${suffix}`,
      description: t(locale, "qualityPage", "intro"),
    },
    {
      path: "/packaging",
      title: `${t(locale, "packagingPage", "title")}${suffix}`,
      description: t(locale, "packagingPage", "subtitle"),
    },
    {
      path: "/trade",
      title: `${t(locale, "nav", "trade")}${suffix}`,
      description: t(locale, "tradeProcess", "title"),
    },
    {
      path: "/quote",
      title: `${t(locale, "nav", "quote")}${suffix}`,
      description: t(locale, "quotePage", "desc"),
    },
    {
      path: "/contact",
      title: `${t(locale, "nav", "contact")}${suffix}`,
      description: t(locale, "contactPage", "desc"),
    },
    ...products.map((p) => ({
      path: `/products/${p.slug}`,
      title: p[locale].title,
      description: p[locale].description,
    })),
  ];
}

// ── sitemap.xml ─────────────────────────────────────────────────────────────
const allPaths = routesFor(DEFAULT_LOCALE).map((r) => r.path);

const urls = LOCALES.flatMap((locale) =>
  allPaths.map((p) => {
    const alternates = [
      ...LOCALES.map(
        (l) => `    <xhtml:link rel="alternate" hreflang="${l}" href="${ORIGIN}/${l}${p}" />`,
      ),
      `    <xhtml:link rel="alternate" hreflang="x-default" href="${ORIGIN}/${DEFAULT_LOCALE}${p}" />`,
    ].join("\n");
    return `  <url>\n    <loc>${ORIGIN}/${locale}${p}</loc>\n${alternates}\n  </url>`;
  }),
);

fs.writeFileSync(
  path.join(pkgRoot, "public/sitemap.xml"),
  `<?xml version="1.0" encoding="UTF-8"?>
<!-- Generated by scripts/generate-seo.mjs — do not edit by hand. -->
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">
${urls.join("\n")}
</urlset>
`,
);

// ── robots.txt ──────────────────────────────────────────────────────────────
fs.writeFileSync(
  path.join(pkgRoot, "public/robots.txt"),
  `User-agent: *\nAllow: /\n\nSitemap: ${ORIGIN}/sitemap.xml\n`,
);

// ── seo-manifest.json — consumed by the API server ──────────────────────────
const routes = {};
for (const locale of LOCALES) {
  for (const r of routesFor(locale)) {
    routes[`/${locale}${r.path}`] = { title: r.title, description: r.description };
  }
}

fs.writeFileSync(
  path.join(pkgRoot, "public/seo-manifest.json"),
  JSON.stringify(
    { origin: ORIGIN, locales: LOCALES, defaultLocale: DEFAULT_LOCALE, routes },
    null,
    1,
  ),
);

console.log(
  `origin      ${ORIGIN}\n` +
    `sitemap     ${urls.length} urls (${LOCALES.length} locales x ${allPaths.length} paths, ${products.length} products)\n` +
    `robots      Sitemap: ${ORIGIN}/sitemap.xml\n` +
    `manifest    ${Object.keys(routes).length} routes with title + description`,
);
