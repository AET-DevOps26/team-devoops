import { expect, gotoApp, test } from './support/fixtures'

test('shows a field error when no member is selected', async ({ page }) => {
  await gotoApp(page, '/payments')

  await page.getByRole('button', { name: 'New Transaction' }).click()
  const dialog = page.getByRole('dialog', { name: 'New Transaction' })

  await dialog.getByLabel('Amount').fill('25')
  await dialog.getByLabel('Title').fill('E2E fee')
  await dialog.getByRole('button', { name: 'Record Transaction' }).click()

  await expect(dialog).toContainText('Select a member.')
  await expect(dialog.getByRole('combobox').first()).toHaveAttribute('aria-invalid', 'true')
})

test('records a transaction via the searchable member combobox', async ({ page }) => {
  await gotoApp(page, '/payments')

  await page.getByRole('button', { name: 'New Transaction' }).click()
  const dialog = page.getByRole('dialog', { name: 'New Transaction' })

  await dialog.getByRole('combobox', { name: 'Member' }).click()
  await page.getByRole('combobox', { name: 'Search members' }).fill('Marie Wolf')
  await page.getByRole('option', { name: 'Marie Wolf' }).click()

  await dialog.getByRole('button', { name: 'Payment' }).click()
  await dialog.getByLabel('Amount').fill('25.50')
  await dialog.getByLabel('Title').fill('E2E membership payment')
  await dialog.getByRole('button', { name: 'Record Transaction' }).click()

  await expect(page.getByRole('status')).toContainText('Transaction recorded for Marie Wolf.')
  await expect(
    page.getByRole('cell', { name: 'E2E membership payment', exact: true }),
  ).toBeVisible()
})

test('rejects a malformed amount with a form error', async ({ page }) => {
  await gotoApp(page, '/payments')

  await page.getByRole('button', { name: 'New Transaction' }).click()
  const dialog = page.getByRole('dialog', { name: 'New Transaction' })

  await dialog.getByRole('combobox', { name: 'Member' }).click()
  await page.getByRole('combobox', { name: 'Search members' }).fill('Marie Wolf')
  await page.getByRole('option', { name: 'Marie Wolf' }).click()
  await dialog.getByLabel('Amount').fill('not-a-number')
  await dialog.getByLabel('Title').fill('E2E fee')
  await dialog.getByRole('button', { name: 'Record Transaction' }).click()

  await expect(dialog).toContainText('Enter an amount in euros with up to two decimals.')
})

test('deletes a transaction from the managed table', async ({ page }) => {
  await gotoApp(page, '/payments')

  // Admin-created fixture transactions expose a delete action.
  const deleteButtons = page.getByRole('button', { name: /^Delete / })
  const countBefore = await deleteButtons.count()
  expect(countBefore).toBeGreaterThan(0)

  await deleteButtons.first().click()
  const confirm = page.getByRole('alertdialog', { name: 'Delete transaction' })
  await confirm.getByRole('button', { name: 'Delete', exact: true }).click()

  await expect(page.getByRole('status')).toContainText('Transaction deleted.')
})
