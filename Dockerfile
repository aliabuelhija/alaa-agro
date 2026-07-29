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

# --ignore-scripts is deliberate. pnpm 11 aborts the install when a dependency
# has an unapproved build script, and it rejected esbuild@0.27.3 even though
# pnpm-workspace.yaml lists `esbuild` under onlyBuiltDependencies. Opting out of
# scripts outright is deterministic and safe here:
#
#   * esbuild is the only installed package with a script (`postinstall`) — the
#     other onlyBuiltDependencies entries (@swc/core, msw, unrs-resolver) have
#     zero references in the lockfile.
#   * esbuild gets its binary from the @esbuild/linux-x64 optional dependency,
#     which is in the lockfile, rather than from that postinstall step.
#   * the two build commands below invoke esbuild directly, so a genuinely
#     broken esbuild fails loudly on the very next line instead of shipping.
#
# strictDepBuilds=false is belt-and-braces in case the check still fires.
RUN pnpm install --frozen-lockfile --ignore-scripts --config.strictDepBuilds=false

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
