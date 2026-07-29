# syntax=docker/dockerfile:1

# ── Build ─────────────────────────────────────────────────────────────────────
FROM node:24-alpine AS build
WORKDIR /app

RUN corepack enable && corepack prepare pnpm@11.18.0 --activate

# The whole workspace is copied at once on purpose: pnpm catalogs and
# `workspace:*` links make the manifests interdependent, so per-package COPY
# layers buy little and break easily.
COPY . .

RUN pnpm install --frozen-lockfile

RUN pnpm --filter @workspace/alaa-agro run build \
 && pnpm --filter @workspace/api-server run build

# ── Runtime ───────────────────────────────────────────────────────────────────
FROM node:24-alpine AS runtime
WORKDIR /app

ENV NODE_ENV=production \
    STATIC_DIR=/app/public \
    PORT=8080

# The API is a self-contained esbuild bundle, so the runtime image needs no
# node_modules at all — just the bundle and the built static site.
COPY --from=build /app/artifacts/api-server/dist ./server
COPY --from=build /app/artifacts/alaa-agro/dist/public ./public

# Don't run as root.
USER node

EXPOSE 8080

CMD ["node", "--enable-source-maps", "server/index.mjs"]
