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

# Standalone output: server.js + traced node_modules + .next/server/
# server.js ends up at the root of the standalone directory
COPY --from=builder /app/apps/ms-genealogie-app/.next/standalone ./

# Static assets (/_next/static/) — must sit next to server.js in .next/static/
COPY --from=builder /app/apps/ms-genealogie-app/.next/static ./.next/static

# Public directory (/locales, favicon, etc.)
COPY --from=builder /app/apps/ms-genealogie-app/public ./public

EXPOSE 3000

CMD ["node", "server.js"]
