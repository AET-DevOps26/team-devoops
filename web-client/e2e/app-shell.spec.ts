import { ADMIN, NAV_ITEMS } from './support/data'
import { expect, gotoApp, test } from './support/fixtures'

test('sidebar shows exactly the nav items the admin role may use', async ({ page }) => {
  await gotoApp(page)

  const allowed = NAV_ITEMS.filter((item) => item.roles.includes(ADMIN.role))
  for (const item of allowed) {
    await expect(page.getByRole('link', { name: item.label, exact: true })).toBeVisible()
  }

  // Nav renders from navPolicy.ts only — no extra destinations beyond the allowed set.
  await expect(page.locator('a[data-sidebar="menu-button"]')).toHaveCount(allowed.length)
})

test('user menu shows the signed-in identity and links to the profile', async ({ page }) => {
  await gotoApp(page)

  const userMenuTrigger = page.getByRole('button', { name: new RegExp(ADMIN.name) })
  await expect(userMenuTrigger).toBeVisible()
  await expect(userMenuTrigger).toContainText(ADMIN.email)

  await userMenuTrigger.click()
  await expect(page.getByRole('menuitem', { name: 'Profile' })).toBeVisible()
  await expect(page.getByRole('menuitem', { name: 'Log out' })).toBeVisible()

  await page.getByRole('menuitem', { name: 'Profile' }).click()
  await expect(page).toHaveURL(/\/profile$/)
})

test('theme switch flips the dark class and persists to localStorage', async ({ page }) => {
  await gotoApp(page)

  await page.getByRole('button', { name: new RegExp(ADMIN.name) }).click()
  await page.getByRole('menuitemradio', { name: 'Dark' }).click()

  await expect(page.locator('html')).toHaveClass(/dark/)
  await expect
    .poll(() => page.evaluate(() => localStorage.getItem('ui-theme')))
    .toBe('dark')

  // Survives a full reload (ThemeProvider re-reads localStorage).
  await gotoApp(page)
  await expect(page.locator('html')).toHaveClass(/dark/)

  await page.getByRole('button', { name: new RegExp(ADMIN.name) }).click()
  await page.getByRole('menuitemradio', { name: 'Light' }).click()
  await expect(page.locator('html')).not.toHaveClass(/dark/)
})

test('unknown paths render the NotFound page inside the shell', async ({ page }) => {
  await gotoApp(page, '/this-route-does-not-exist')

  await expect(page.getByRole('heading', { name: '404 - Page not found' })).toBeVisible()
  await page.getByRole('button', { name: 'Go home' }).click()
  await expect(page.getByText("Here's what's happening across your club.")).toBeVisible()
})
