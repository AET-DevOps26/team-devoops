import { expect, gotoApp, test } from './support/fixtures'

test('renders a live preview with sample recipient data', async ({ page }) => {
  await gotoApp(page, '/letters')

  // Admin audience goes to the whole club.
  await expect(page.getByText('This will go to all members.')).toBeVisible()

  await page.getByLabel('Template').fill('<p>Hello {{first_name}}, welcome to the club.</p>')

  const preview = page.frameLocator('iframe[title="Letter template sample preview"]')
  // Tokens are substituted with the documented sample values ({{first_name}} -> Alex).
  await expect(preview.getByText('Hello Alex, welcome to the club.')).toBeVisible()
})

test('sends a mail letter to the admin audience', async ({ page }) => {
  await gotoApp(page, '/letters')

  await page.getByLabel('Subject').fill('E2E newsletter')
  await page.getByLabel('Template').fill('<h1>Hello {{first_name}}</h1><p>See you at training.</p>')
  await page.getByRole('button', { name: 'Send Mail' }).click()

  await expect(page.getByRole('status')).toContainText('Mail sent to all members.')
})

test('switches to PDF mode and hides the subject field', async ({ page }) => {
  await gotoApp(page, '/letters')

  await expect(page.getByLabel('Subject')).toBeVisible()
  await page.getByRole('button', { name: 'PDF' }).click()

  await expect(page.getByLabel('Subject')).toHaveCount(0)
  await expect(page.getByRole('button', { name: 'Download PDF' })).toBeVisible()
})
