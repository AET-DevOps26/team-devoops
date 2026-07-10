import { test as base, expect, type Page } from '@playwright/test'
import { stubKeycloak } from './auth'

// Every test gets a context whose Keycloak endpoints are stubbed before the app
// loads, so keycloak.init() resolves as an authenticated admin session with no
// auth server running.
export const test = base.extend({
  // Playwright fixture: the callback's second parameter provides the value to
  // the test (named `provide` so the react-hooks lint rule doesn't read `use`
  // as a React hook).
  context: async ({ context, baseURL }, provide) => {
    await stubKeycloak(context, new URL(baseURL ?? 'http://localhost:5199').origin)
    await provide(context)
  },
})

export { expect }

// Navigates and waits until the app shell has rendered past the auth spinner.
// Every full page load resets the in-memory mock fixture state (module state
// lives in the browser bundle), which keeps tests independent.
export async function gotoApp(page: Page, path = '/'): Promise<void> {
  await page.goto(path)
  await expect(page.getByRole('link', { name: 'Dashboard' })).toBeVisible({ timeout: 15_000 })
}
