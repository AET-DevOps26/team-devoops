import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import path from 'path'

export default defineConfig({
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  plugins: [react(), tailwindcss()] as any[],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
    },
  },
  server: {
    port: 3000,
    open: true,
    proxy: {
      '/api': {
        target: 'http://localhost',
        changeOrigin: true,
        // No rewrite needed: Traefik's stripprefix middlewares already leave the path in
        // the shape each backend expects (`/api/v1` stripped for most services, leaving
        // e.g. `/organization/teams`; the full `/api/v1/helper` stripped for py-genai-helper,
        // leaving `/reports/...`), so the client's request path can be forwarded as-is.
        configure: (proxy) => {
          proxy.on('proxyReq', (proxyReq) => {
            // Strip cookies: unused by services, and big localhost cookie jars can 400.
            proxyReq.removeHeader('cookie')
          })
        },
      },
    },
  },
  test: {
    environment: 'jsdom',
    globals: true,
    passWithNoTests: true,
    // Heavy page/dialog component tests exceed the 5s default when v8 coverage
    // instrumentation is on (pnpm test:coverage); the suite itself stays fast.
    testTimeout: 15_000,
    setupFiles: ['src/setupTests.ts'],
    include: ['src/**/*.{test,spec}.{js,jsx,ts,tsx}'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'lcov'],
      include: ['src/**/*.{ts,tsx}'],
      exclude: ['src/**/*.{test,spec}.{ts,tsx}', 'src/main.tsx'],
    },
  },
})
