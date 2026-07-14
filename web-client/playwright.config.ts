import { defineConfig, devices } from '@playwright/test'

// E2E runs against the Vite dev server. The app's /api/v1/* calls are intercepted per test
// context by e2e/support/api.ts and served in-memory, so no real services are needed.
// Keycloak is not needed either — e2e/support/auth.ts intercepts the OIDC endpoints so
// keycloak.init() resolves as an authenticated session. The app runs as ONE identity, the
// seeded admin (see e2e/README.md for why).
const PORT = 5199

export default defineConfig({
  testDir: './e2e',
  outputDir: './test-results',
  fullyParallel: true,
  // Eight Chromium contexts saturate this machine and starve the preview server,
  // causing auth/app hydration to miss the existing 30s test budget. Four keeps
  // tests fully parallel while leaving capacity for the browser and web server.
  workers: 4,
  forbidOnly: !!process.env.CI,
  retries: 0,
  reporter: process.env.CI ? [['list'], ['html', { open: 'never' }]] : 'list',
  timeout: 30_000,
  expect: { timeout: 10_000 },
  use: {
    baseURL: `http://localhost:${PORT}`,
    trace: 'on-first-retry',
  },
  projects: [{ name: 'chromium', use: { ...devices['Desktop Chrome'] } }],
  webServer: {
    // Preview serves the already-built bundle without Vite's per-worker transform
    // contention. Run `pnpm build` before E2E (the e2e script does this).
    command: `pnpm exec vite preview --port ${PORT} --strictPort`,
    url: `http://localhost:${PORT}`,
    reuseExistingServer: !process.env.CI,
    timeout: 60_000,
    env: {
      VITE_KEYCLOAK_URL: 'http://localhost:8081/auth',
    },
  },
})
