import { test as base, expect, type Page } from '@playwright/test'
import { stubKeycloak } from './auth'
import { stubApi } from './api'

// Every test gets a context whose Keycloak endpoints and /api/v1 calls are stubbed before
// the app loads: keycloak.init() resolves as an authenticated admin session, and the app's
// axios calls are answered by the in-memory server (see api.ts).
export const test = base.extend({
  // Playwright fixture: the callback's second parameter provides the value to
  // the test (named `provide` so the react-hooks lint rule doesn't read `use`
  // as a React hook).
  context: async ({ context, baseURL }, provide) => {
    await stubKeycloak(context, new URL(baseURL ?? 'http://localhost:5199').origin)
    await stubApi(context)
    await provide(context)
  },
})

export { expect }

// Navigates and waits until the app shell has rendered past the auth spinner. Each test
// gets a pristine server copy (see stubApi), so its mutations never leak into the next.
export async function gotoApp(page: Page, path = '/'): Promise<void> {
  await page.goto(path)
  await expect(page.getByRole('link', { name: 'Dashboard' })).toBeVisible({ timeout: 15_000 })
}
