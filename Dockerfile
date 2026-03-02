# ─── Stage 1: build ──────────────────────────────────────────────────────────
FROM node:20-alpine AS builder

RUN apk add --no-cache libc6-compat
WORKDIR /app

# Copy full monorepo (needed for yarn workspaces resolution)
COPY . .

RUN yarn install --frozen-lockfile

ENV NEXT_TELEMETRY_DISABLED=1
RUN yarn workspace @ms-genealogie/app build

# ─── Stage 2: runtime ────────────────────────────────────────────────────────
FROM node:20-alpine AS runner

WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
# Bind to all interfaces so Railway healthcheck can reach the server
ENV HOSTNAME=0.0.0.0

# outputFileTracingRoot = monorepo root → standalone mirrors the full monorepo tree
# server.js lands at apps/ms-genealogie-app/server.js inside standalone/
COPY --from=builder /app/apps/ms-genealogie-app/.next/standalone ./

# Static assets: must sit next to server.js in apps/ms-genealogie-app/.next/static/
COPY --from=builder /app/apps/ms-genealogie-app/.next/static ./apps/ms-genealogie-app/.next/static

# Public directory (/locales, favicon, etc.)
COPY --from=builder /app/apps/ms-genealogie-app/public ./apps/ms-genealogie-app/public

EXPOSE 3000

CMD ["node", "apps/ms-genealogie-app/server.js"]
