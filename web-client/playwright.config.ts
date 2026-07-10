import { defineConfig, devices } from '@playwright/test'

// E2E runs against the Vite dev server in mock mode: every queryFn serves fixtures
// (VITE_USE_MOCKS=true), so no backend is needed. Keycloak is not needed either —
// e2e/support/auth.ts intercepts the OIDC endpoints per test context so
// keycloak.init({ onLoad: 'check-sso' }) resolves as an authenticated session.
// The app runs as ONE identity, the admin persona (see e2e/README.md for why).
const PORT = 5199

export default defineConfig({
  testDir: './e2e',
  outputDir: './test-results',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 1 : 0,
  reporter: process.env.CI ? [['list'], ['html', { open: 'never' }]] : 'list',
  timeout: 30_000,
  expect: { timeout: 10_000 },
  use: {
    baseURL: `http://localhost:${PORT}`,
    trace: 'on-first-retry',
  },
  projects: [{ name: 'chromium', use: { ...devices['Desktop Chrome'] } }],
  webServer: {
    command: `pnpm exec vite --port ${PORT} --strictPort`,
    url: `http://localhost:${PORT}`,
    reuseExistingServer: !process.env.CI,
    timeout: 60_000,
    env: {
      // Process env beats .env.development, so a developer's local env file
      // cannot leak into the E2E run.
      VITE_USE_MOCKS: 'true',
      VITE_MOCK_PERSONA: 'admin',
      VITE_KEYCLOAK_URL: 'http://localhost:8081/auth',
    },
  },
})
