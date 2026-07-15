import { test as base, expect, type Page } from '@playwright/test'
import { stubKeycloak } from './auth'
import { stubApi } from './api'

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

export async function gotoApp(page: Page, path = '/'): Promise<void> {
  await page.goto(path)
  await expect(page.getByRole('link', { name: 'Dashboard' })).toBeVisible({ timeout: 15_000 })
}

// Sonner renders its toasts inside a single labelled aria-live region (see ui/sonner.tsx).
// Assert toast copy through this rather than a bare role, so we don't need a second live
// region wrapped around it just to be queryable.
export function toastRegion(page: Page) {
  return page.getByRole('region', { name: /Notifications/ })
}
