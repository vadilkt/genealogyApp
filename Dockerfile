# ─── Stage 1: build ──────────────────────────────────────────────────────────
FROM node:20-alpine AS builder

RUN apk add --no-cache libc6-compat
WORKDIR /app

COPY . .

RUN yarn install --frozen-lockfile

# Bust layer cache on every new Railway deploy
ARG RAILWAY_GIT_COMMIT_SHA
RUN echo "Building commit: ${RAILWAY_GIT_COMMIT_SHA:-local}"

ENV NEXT_TELEMETRY_DISABLED=1
RUN yarn build

# ─── Stage 2: runtime ────────────────────────────────────────────────────────
FROM node:20-alpine AS runner

WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
ENV PORT=3000
ENV HOSTNAME=0.0.0.0

# `output: 'standalone'` emits a self-contained server at .next/standalone/server.js
COPY --from=builder /app/.next/standalone ./

# Static assets must sit next to server.js at .next/static/
COPY --from=builder /app/.next/static ./.next/static

# Public directory (/locales, favicon, etc.)
COPY --from=builder /app/public ./public

EXPOSE 3000

CMD ["node", "server.js"]
