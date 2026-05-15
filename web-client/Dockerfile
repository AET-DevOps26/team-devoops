# Stage 1: builder
FROM node:22-alpine AS builder
WORKDIR /app

# Copy package files from host
COPY package*.json ./

# Install dependencies
RUN --mount=type=cache,target=/root/.npm npm ci

# Copy the application
COPY src ./src
COPY public ./public
COPY tsconfig.json .
COPY tsconfig.app.json .
COPY tsconfig.node.json .
COPY vite.config.ts .
COPY index.html .
# Build the application
RUN npm run build

# Stage 2: run
FROM nginx:1.27-alpine

# Copy files from stage 1
COPY --from=builder /app/dist /usr/share/nginx/html

# Network
EXPOSE 80

# Healthcheck for orchestration
HEALTHCHECK --interval=30s --timeout=3s CMD wget -qO- http://localhost:80/ || exit 1

# Run application
CMD ["nginx", "-g", "daemon off;"]
