import { expect, gotoApp, test } from './support/fixtures'

test('boots past the auth spinner into the app shell', async ({ page }) => {
  await gotoApp(page)

  await expect(page.getByRole('heading', { name: 'Roost' })).toBeVisible()
  // Neither the auth error card nor the spinner may remain.
  await expect(page.getByText('Sign-in error')).toHaveCount(0)
  await expect(page.getByText('Cannot reach authentication server')).toHaveCount(0)
})
