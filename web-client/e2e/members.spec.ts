import { memberSummaryFixtures } from './support/data'
import { expect, gotoApp, test } from './support/fixtures'

// Admin members CRUD. Each test gets a pristine server copy (stubApi resets it),
// so the specs are order-independent.

test('lists every member for the admin', async ({ page }) => {
  await gotoApp(page, '/members')

  await expect(page.getByRole('heading', { name: 'Members' })).toBeVisible()
  await expect(page.getByRole('cell', { name: 'Lena Roth', exact: true })).toBeVisible()
  // Admin scope = all rows (one table row per member summary + 1 header row).
  await expect(page.getByRole('row')).toHaveCount(memberSummaryFixtures.length + 1)
})

test('creates a member through the stepper dialog', async ({ page }) => {
  await gotoApp(page, '/members')

  await page.getByRole('button', { name: 'New member' }).click()
  const dialog = page.getByRole('dialog', { name: 'New Member' })
  await dialog.getByLabel('First name').fill('E2E')
  await dialog.getByLabel('Last name').fill('Testperson')
  await dialog.getByLabel('Email').fill('e2e.testperson@club.de')
  await dialog.getByLabel('Initial password').fill('changeme-e2e')
  await dialog.getByRole('button', { name: 'Next' }).click()
  await dialog.getByRole('button', { name: 'Next' }).click()
  await dialog.getByRole('button', { name: 'Create Member' }).click()

  await expect(page.getByRole('status')).toContainText('Member created.')
  await expect(page.getByRole('cell', { name: 'E2E Testperson', exact: true })).toBeVisible()
})

test('surfaces the 409 duplicate-email error inside the dialog', async ({ page }) => {
  await gotoApp(page, '/members')

  await page.getByRole('button', { name: 'New member' }).click()
  const dialog = page.getByRole('dialog', { name: 'New Member' })
  await dialog.getByLabel('First name').fill('Duplicate')
  await dialog.getByLabel('Last name').fill('Email')
  // lena.roth@club.de belongs to an existing fixture member -> 409.
  await dialog.getByLabel('Email').fill('lena.roth@club.de')
  await dialog.getByLabel('Initial password').fill('changeme-e2e')
  await dialog.getByRole('button', { name: 'Next' }).click()
  await dialog.getByRole('button', { name: 'Next' }).click()
  await dialog.getByRole('button', { name: 'Create Member' }).click()

  await expect(dialog).toContainText('Email already in use')
  await expect(dialog).toBeVisible()
})

test('edits a member and reflects the change in the table', async ({ page }) => {
  await gotoApp(page, '/members')

  await page.getByRole('button', { name: 'Edit Lena Roth' }).click()
  const dialog = page.getByRole('dialog', { name: 'Edit Member' })
  await dialog.getByLabel('First name').fill('Magda')
  await dialog.getByRole('button', { name: 'Next' }).click()
  await dialog.getByRole('button', { name: 'Next' }).click()
  await dialog.getByRole('button', { name: 'Save Member' }).click()

  await expect(page.getByRole('status')).toContainText('Member updated.')
  await expect(page.getByRole('cell', { name: 'Magda Roth', exact: true })).toBeVisible()
  await expect(page.getByRole('cell', { name: 'Lena Roth', exact: true })).toHaveCount(0)
})

test('deletes a member after confirmation', async ({ page }) => {
  await gotoApp(page, '/members')

  await page.getByRole('button', { name: 'Delete Lena Roth' }).click()
  const confirm = page.getByRole('alertdialog', { name: 'Delete member' })
  await expect(confirm).toContainText('Delete Lena Roth?')
  await confirm.getByRole('button', { name: 'Delete', exact: true }).click()

  await expect(page.getByRole('status')).toContainText('Member deleted.')
  await expect(page.getByRole('cell', { name: 'Lena Roth', exact: true })).toHaveCount(0)
})
