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
        // Traefik strips the full `/api/v1/<name>` prefix, so duplicate the service
        // segment to survive it; also trim a bare trailing slash the services 404 on.
        rewrite: (p) => {
          const queryStart = p.indexOf('?')
          const pathname = queryStart === -1 ? p : p.slice(0, queryStart)
          const query = queryStart === -1 ? '' : p.slice(queryStart)
          const rewrittenPathname = pathname.replace(
            /^\/api\/v1\/(organization|members|events|feedback|finance|letters|helper)(?:\/(.*))?$/,
            (_match, service: string, rest: string | undefined) =>
              `/api/v1/${service}/${service}${rest ? `/${rest}` : ''}`,
          )

          return `${rewrittenPathname}${query}`
        },
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
