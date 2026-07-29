# syntax=docker/dockerfile:1

# ── Build ─────────────────────────────────────────────────────────────────────
# Debian (glibc), NOT Alpine. pnpm-workspace.yaml strips every musl binary via
# overrides — `rollup-linux-x64-musl`, `lightningcss-linux-x64-musl` and
# `@tailwindcss/oxide-linux-x64-musl` are all set to "-" — leaving only the
# glibc `-gnu` builds. On Alpine, `vite build` would have no native binary.
FROM node:24-bookworm-slim AS build
WORKDIR /app

RUN corepack enable && corepack prepare pnpm@11.18.0 --activate

# The whole workspace is copied at once on purpose: pnpm catalogs and
# `workspace:*` links make the manifests interdependent, so per-package COPY
# layers buy little and break easily.
COPY . .

# CI=false keeps ERR_PNPM_IGNORED_BUILDS a warning rather than a hard failure.
# esbuild is already listed under `onlyBuiltDependencies` in pnpm-workspace.yaml,
# so its build script is approved; this only stops the stricter CI-mode check
# (which build platforms set by default) from aborting the install. If esbuild
# were genuinely broken, the api-server build below would fail loudly — it runs
# esbuild directly.
RUN CI=false pnpm install --frozen-lockfile

RUN pnpm --filter @workspace/alaa-agro run build \
 && pnpm --filter @workspace/api-server run build

# ── Runtime ───────────────────────────────────────────────────────────────────
FROM node:24-bookworm-slim AS runtime
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
