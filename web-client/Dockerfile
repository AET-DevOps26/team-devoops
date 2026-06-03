# syntax=docker/dockerfile:1.7

# Stage 1: builder
FROM node:24-alpine AS builder
WORKDIR /app

# Corepack ships with Node and pins pnpm to the version in package.json's
# "packageManager" field, so every build uses an identical pnpm regardless of host.
RUN corepack enable

# Build-time vars (Vite inlines VITE_* at build, so they must be ARGs, not ENVs at runtime).
# These will change once the server team implements path-based proxy routing
ARG VITE_MEMBERS_URL=""
ARG VITE_EVENTS_URL=""
ARG VITE_FINANCE_URL=""
ARG VITE_LETTERS_URL=""
ARG VITE_KEYCLOAK_URL=""
ENV VITE_MEMBERS_URL=$VITE_MEMBERS_URL
ENV VITE_EVENTS_URL=$VITE_EVENTS_URL
ENV VITE_FINANCE_URL=$VITE_FINANCE_URL
ENV VITE_LETTERS_URL=$VITE_LETTERS_URL
ENV VITE_KEYCLOAK_URL=$VITE_KEYCLOAK_URL

# Install dependencies first for better layer caching.
# pnpm-lock.yaml records every platform's optional native deps (lightningcss,
# rolldown, etc.), so --frozen-lockfile resolves the correct linux-musl binaries
# no matter which OS generated the lockfile.
COPY package.json pnpm-lock.yaml ./
RUN --mount=type=cache,target=/root/.local/share/pnpm/store \
    pnpm install --frozen-lockfile

# Copy the rest of the source (.dockerignore controls what's excluded)
COPY . .

RUN pnpm build

# Stage 2: runtime
FROM nginxinc/nginx-unprivileged:1.27-alpine AS runtime

# Non-root image listens on 8080 by default
EXPOSE 8080

COPY --chown=nginx:nginx nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=builder --chown=nginx:nginx /app/dist /usr/share/nginx/html

HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
    CMD wget -q --spider http://localhost:8080/ || exit 1

CMD ["nginx", "-g", "daemon off;"]
