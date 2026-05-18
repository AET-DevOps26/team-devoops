# syntax=docker/dockerfile:1.7

# Stage 1: builder
FROM node:22-alpine AS builder
WORKDIR /app

# Build-time vars (Vite inlines VITE_* at build, so they must be ARGs, not ENVs at runtime)
ARG VITE_API_URL=""
ENV VITE_API_URL=$VITE_API_URL

# Install dependencies first for better layer caching
COPY package.json package-lock.json ./
RUN --mount=type=cache,target=/root/.npm \
    npm ci --no-audit --no-fund

# Copy the rest of the source (.dockerignore controls what's excluded)
COPY . .

RUN npm run build

# Stage 2: runtime
FROM nginxinc/nginx-unprivileged:1.27-alpine AS runtime

# Non-root image listens on 8080 by default
EXPOSE 8080

COPY --chown=nginx:nginx nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=builder --chown=nginx:nginx /app/dist /usr/share/nginx/html

HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
    CMD wget -q --spider http://localhost:8080/ || exit 1

CMD ["nginx", "-g", "daemon off;"]
