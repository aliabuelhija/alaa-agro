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
const ORIGIN = process.env["PUBLIC_ORIGIN"] ?? "https://alaa-argo.com";
const SEO_LOCALES = ["en", "ru", "ar"] as const;
const DEFAULT_SEO_LOCALE = "en";
const OG_LOCALE: Record<string, string> = {
  en: "en_US",
  ru: "ru_RU",
  ar: "ar_AE",
};

function seoLinksFor(urlPath: string): string {
  const clean = urlPath.split("?")[0]!.replace(/\/+$/, "") || "/";
  const match = clean.match(/^\/(en|ru|ar)(\/.*)?$/);
  const locale = match?.[1] ?? DEFAULT_SEO_LOCALE;
  const rest = match?.[2] ?? "";
  const canonical = `${ORIGIN}/${locale}${rest}`;

  const alternates = SEO_LOCALES.map(
    (l) =>
      `<link rel="alternate" hreflang="${l}" href="${ORIGIN}/${l}${rest}" />`,
  ).join("\n    ");

  return [
    `<link rel="canonical" href="${canonical}" />`,
    alternates,
    `<link rel="alternate" hreflang="x-default" href="${ORIGIN}/${DEFAULT_SEO_LOCALE}${rest}" />`,
    `<meta property="og:url" content="${canonical}" />`,
    `<meta property="og:locale" content="${OG_LOCALE[locale] ?? "en_US"}" />`,
    ...SEO_LOCALES.filter((l) => l !== locale).map(
      (l) => `<meta property="og:locale:alternate" content="${OG_LOCALE[l]}" />`,
    ),
  ].join("\n    ");
}

if (fs.existsSync(staticDir)) {
  const indexHtml = path.join(staticDir, "index.html");
  // Read once; the file only changes on deploy.
  const shell = fs.readFileSync(indexHtml, "utf8");
  const hasPlaceholder = shell.includes("<!--SEO_LINKS-->");
  if (!hasPlaceholder) {
    logger.warn(
      "index.html has no <!--SEO_LINKS--> placeholder — canonical and hreflang will not be per-URL",
    );
  }

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
    res.type("html").send(shell.replace("<!--SEO_LINKS-->", seoLinksFor(req.path)));
  });

  logger.info({ staticDir }, "Serving static site from this process");
} else {
  logger.warn(
    { staticDir },
    "No SPA build found — running API only (expected in development)",
  );
}

export default app;
