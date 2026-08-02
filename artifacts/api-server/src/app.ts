import fs from "node:fs";
import path from "node:path";
import express, { type Express } from "express";
import cors from "cors";
import pinoHttp from "pino-http";
import router from "./routes";
import { logger } from "./lib/logger";

const app: Express = express();

app.use(
  pinoHttp({
    logger,
    serializers: {
      req(req) {
        return {
          id: req.id,
          method: req.method,
          url: req.url?.split("?")[0],
        };
      },
      res(res) {
        return {
          statusCode: res.statusCode,
        };
      },
    },
  }),
);
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api", router);

// ── Static site ───────────────────────────────────────────────────────────────
// One process serves both the API and the built SPA, so there is no external
// path router that can drift out of sync with the app. In development this
// block is skipped (no build on disk) — Vite serves the SPA and proxies /api
// to this server instead.
const staticDir =
  process.env["STATIC_DIR"] ??
  path.resolve(import.meta.dirname, "../../alaa-agro/dist/public");

// ── Per-request SEO links ────────────────────────────────────────────────────
// Every route is served the same index.html, so anything URL-specific has to be
// injected here. A hardcoded canonical is worse than none: it told crawlers all
// 72 urls were duplicates of the homepage, which would drop the product pages
// from the index entirely. SEOHead maintains these client-side once the app
// boots; this covers the crawler's first, JS-free fetch.
// The manifest is emitted by the frontend build (scripts/generate-seo.mjs) from
// src/config/site.ts, so the origin and the per-route copy have exactly one
// definition. PUBLIC_ORIGIN can override the origin for a staging host.
interface SeoManifest {
  origin: string;
  locales: string[];
  defaultLocale: string;
  routes: Record<string, { title: string; description: string }>;
}

function loadSeoManifest(dir: string): SeoManifest {
  const fallback: SeoManifest = {
    origin: "https://alaa-agro.com",
    locales: ["en", "ru", "ar"],
    defaultLocale: "en",
    routes: {},
  };
  try {
    const raw = fs.readFileSync(path.join(dir, "seo-manifest.json"), "utf8");
    const parsed = JSON.parse(raw) as SeoManifest;
    if (!parsed.origin || !parsed.routes) throw new Error("malformed manifest");
    return parsed;
  } catch (err) {
    logger.warn(
      { err },
      "seo-manifest.json missing or unreadable — falling back to origin-only SEO tags",
    );
    return fallback;
  }
}

const OG_LOCALE: Record<string, string> = {
  en: "en_US",
  ru: "ru_RU",
  ar: "ar_AE",
};

const HTML_ESCAPES: Record<string, string> = {
  "&": "&amp;",
  "<": "&lt;",
  ">": "&gt;",
  '"': "&quot;",
};

/** Metadata comes from our own build, but it still lands inside HTML attributes. */
function escapeAttr(value: string): string {
  return value.replace(/[&<>"]/g, (c) => HTML_ESCAPES[c] ?? c);
}

function buildSeoHead(seo: SeoManifest, urlPath: string): string {
  const origin = process.env["PUBLIC_ORIGIN"] ?? seo.origin;
  const clean = urlPath.split("?")[0]!.replace(/\/+$/, "") || "/";
  const localeRe = new RegExp(`^/(${seo.locales.join("|")})(/.*)?$`);
  const match = clean.match(localeRe);
  const locale = match?.[1] ?? seo.defaultLocale;
  const rest = match?.[2] ?? "";
  const canonical = `${origin}/${locale}${rest}`;

  const tags = [
    `<link rel="canonical" href="${canonical}" />`,
    ...seo.locales.map(
      (l) => `<link rel="alternate" hreflang="${l}" href="${origin}/${l}${rest}" />`,
    ),
    `<link rel="alternate" hreflang="x-default" href="${origin}/${seo.defaultLocale}${rest}" />`,
    `<meta property="og:url" content="${canonical}" />`,
    `<meta property="og:locale" content="${OG_LOCALE[locale] ?? "en_US"}" />`,
    ...seo.locales
      .filter((l) => l !== locale)
      .map((l) => `<meta property="og:locale:alternate" content="${OG_LOCALE[l]}" />`),
  ];

  // Route-specific title and description. Without this every url returns the
  // homepage's, because they all share one index.html. Unknown routes (a 404
  // path, say) simply keep the shell's defaults.
  const meta = seo.routes[`/${locale}${rest}`];
  if (meta) {
    const title = escapeAttr(meta.title);
    const description = escapeAttr(meta.description);
    tags.push(
      `<title>${title}</title>`,
      `<meta name="description" content="${description}" />`,
      `<meta property="og:title" content="${title}" />`,
      `<meta property="og:description" content="${description}" />`,
      `<meta name="twitter:title" content="${title}" />`,
      `<meta name="twitter:description" content="${description}" />`,
    );
  }

  return tags.join("\n    ");
}

/**
 * The shell ships a default title/description/og pair for the site root. When a
 * route has its own, strip the defaults so the document does not end up with two
 * of each — crawlers pick unpredictably between duplicates.
 */
function stripShellMeta(html: string): string {
  return html
    .replace(/\n?\s*<title>[\s\S]*?<\/title>/i, "")
    .replace(/\n?\s*<meta\s+name="description"[\s\S]*?\/>/i, "")
    .replace(/\n?\s*<meta\s+property="og:title"[\s\S]*?\/>/i, "")
    .replace(/\n?\s*<meta\s+property="og:description"[\s\S]*?\/>/i, "")
    .replace(/\n?\s*<meta\s+name="twitter:title"[\s\S]*?\/>/i, "")
    .replace(/\n?\s*<meta\s+name="twitter:description"[\s\S]*?\/>/i, "");
}

if (fs.existsSync(staticDir)) {
  const indexHtml = path.join(staticDir, "index.html");
  // Read once; both only change on deploy.
  const shell = fs.readFileSync(indexHtml, "utf8");
  const seo = loadSeoManifest(staticDir);
  const hasPlaceholder = shell.includes("<!--SEO_LINKS-->");
  if (!hasPlaceholder) {
    logger.warn(
      "index.html has no <!--SEO_LINKS--> placeholder — canonical and hreflang will not be per-URL",
    );
  }
  // Pre-strip the shell's default title/description once, rather than per request.
  const shellNoMeta = stripShellMeta(shell);
  logger.info(
    { origin: process.env["PUBLIC_ORIGIN"] ?? seo.origin, routes: Object.keys(seo.routes).length },
    "SEO manifest loaded",
  );

  // Vite fingerprints filenames under /assets, so those can be cached hard.
  app.use(
    "/assets",
    express.static(path.join(staticDir, "assets"), {
      immutable: true,
      maxAge: "1y",
    }),
  );

  // Everything else (images, PDFs, robots.txt, sitemap.xml) keeps the default
  // revalidation behaviour, since those filenames are stable across deploys.
  app.use(express.static(staticDir, { index: false }));

  // SPA fallback so client-side routes like /en/products/wheat resolve.
  // /api is excluded deliberately: an unmatched API route must 404 rather than
  // return index.html with a 200, which would make failed form posts look like
  // successes to the browser.
  app.use((req, res, next) => {
    if (req.method !== "GET" && req.method !== "HEAD") {
      next();
      return;
    }
    if (req.path.startsWith("/api")) {
      next();
      return;
    }
    // A dot in the final path segment means the client asked for a file, not an
    // app route. Those must 404 rather than get the shell: answering 200 with
    // HTML turns every missing asset into a soft 404, which hides broken images
    // and lets crawlers index the shell under junk URLs. App routes never carry
    // an extension (/en/products/wheat).
    if (path.extname(req.path)) {
      next();
      return;
    }
    if (!req.accepts("html")) {
      next();
      return;
    }
    if (!hasPlaceholder) {
      res.sendFile(indexHtml);
      return;
    }
    const head = buildSeoHead(seo, req.path);
    // Only drop the shell's defaults when this route supplied its own.
    const base = head.includes("<title>") ? shellNoMeta : shell;
    res.type("html").send(base.replace("<!--SEO_LINKS-->", head));
  });

  logger.info({ staticDir }, "Serving static site from this process");
} else {
  logger.warn(
    { staticDir },
    "No SPA build found — running API only (expected in development)",
  );
}

export default app;
