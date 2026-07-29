# ALAA AGRO TRADE LLC

Bilingual (EN/RU) marketing and lead-capture site for ALAA AGRO TRADE LLC, a
Russian exporter of grains, pulses, oilseeds, seeds and sunflower oil to
international B2B buyers.

Live: https://alaa-agro.onrender.com — target domain `alaa-agro.ru`.

## Run locally

Two processes. The API must be running for the quote forms to work.

```bash
pnpm install

pnpm --filter @workspace/api-server run dev   # API on :8080
pnpm --filter @workspace/alaa-agro  run dev   # site on :5173
```

Then open http://localhost:5173. Vite proxies `/api` to `:8080` (see
`server.proxy` in `artifacts/alaa-agro/vite.config.ts`) — in production a single
Express process serves both, so there is no proxy involved.

Other commands:

```bash
pnpm run typecheck                              # whole workspace
pnpm run build                                  # typecheck + build both packages
pnpm --filter @workspace/db run push            # push DB schema (dev only)
pnpm --filter @workspace/alaa-agro run gen:sitemap  # regenerate public/sitemap.xml
```

## Stack

- pnpm workspaces, Node 24, TypeScript 5.9
- Frontend: React 19, Vite 7, Tailwind v4, wouter, framer-motion
- API: Express 5, pino
- DB: Neon Postgres + Drizzle ORM
- Email: Brevo HTTP API
- Deploy: Docker on Render (`render.yaml`)

## Layout

```
artifacts/alaa-agro       the website (SPA)
artifacts/api-server      Express API; also serves the built SPA in production
artifacts/mockup-sandbox  shadcn/ui playground, not part of the product
lib/db                    Drizzle schema — one table, quote_requests
lib/api-spec              OpenAPI spec + Orval codegen
lib/api-zod               generated Zod schemas
lib/api-client-react      generated React Query client
```

Source of truth for content:

| What | Where |
|---|---|
| Products (16, with EN+RU copy and specs) | `artifacts/alaa-agro/src/data/products.ts` |
| Translations | `artifacts/alaa-agro/src/i18n/{en,ru}.ts` |
| DB schema | `lib/db/src/schema/index.ts` |
| Routes | `artifacts/alaa-agro/src/App.tsx` |

## Architecture notes

- **One process in production.** `api-server` mounts `/api` and then serves
  `artifacts/alaa-agro/dist/public`. `/api` is excluded from the SPA fallback so
  an unmatched API route returns 404 rather than `index.html` with a 200 — that
  would make a failed form post look like a success to the browser. Paths with a
  file extension also 404 rather than returning the shell, to avoid soft 404s.
- **Leads are saved before they are emailed.** `POST /api/quote` writes to
  `quote_requests` first and treats the Brevo call as best-effort, recording the
  outcome in `email_sent` (`yes` / `no_smtp` / `pending`). A lead is never lost
  because email failed.
- **`BREVO_SENDER_EMAIL` must be a verified sender in Brevo.** It is not the
  SMTP login. Brevo rejects unverified senders, and because email failure is
  non-fatal that shows up as leads arriving with no notification.
- **Every product needs both languages.** `products.ts` carries `*Ru` variants
  alongside the English fields; `i18n/en.ts` and `i18n/ru.ts` must stay in step.
- **`sitemap.xml` is generated**, not hand-edited — see `gen:sitemap`. It has to
  include the product detail pages, which are the highest-intent SEO pages.
- **`index.html` meta tags matter.** Crawlers and link-preview scrapers do not
  run the JS that `SEOHead` uses to patch the document, so the static tags must
  stand on their own for the site root.

## Environment

| Variable | Required | Notes |
|---|---|---|
| `DATABASE_URL` | yes | Neon Postgres connection string |
| `PORT` | yes | Render sets this; `8080` locally |
| `BREVO_API_KEY` | for email | Brevo transactional API key |
| `BREVO_SENDER_EMAIL` | for email | Must be verified in Brevo |
| `QUOTE_RECIPIENT_EMAIL` | for email | Where quote notifications go |
| `STATIC_DIR` | no | Defaults to the sibling SPA build |

Locally these come from `artifacts/api-server/.env` (gitignored, loaded via
`node --env-file-if-exists`). In production they come from Render's environment.

## Deploy

Render builds the `Dockerfile` and runs one web service. Push to `main` and it
redeploys.

Notes on the Docker build, both of which cost a failed deploy to learn:

- The base image must be **glibc** (`node:24-bookworm-slim`), not Alpine.
  `pnpm-workspace.yaml` strips every musl native binary via `overrides`, so
  `vite build` has no rollup/lightningcss/Tailwind-oxide binary on musl.
- The install runs with `--ignore-scripts`. pnpm 11 otherwise aborts on
  esbuild's unapproved postinstall; esbuild takes its binary from the
  `@esbuild/linux-x64` optional dependency, so the script is not needed.

The four `*-win32-x64*` entries in the root `package.json` are deliberate — the
same `overrides` block strips esbuild's win32 binary, so they keep Windows
development working. Don't remove them.
