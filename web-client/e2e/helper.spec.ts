import { ADMIN } from './support/data'
import { expect, gotoApp, test } from './support/fixtures'

test('generates a report', async ({ page }) => {
  await gotoApp(page, '/helper')

  await page.getByRole('button', { name: 'Generate report' }).click()

  await expect(page.getByRole('status')).toContainText('Generating your report')
  await expect(page.getByRole('button', { name: `Read report for ${ADMIN.name}` })).toBeVisible()
  await expect(page.getByRole('status')).toHaveCount(0)
})

test('views a report', async ({ page }) => {
  await gotoApp(page, '/helper')

  await page.getByRole('button', { name: 'Generate report' }).click()
  await page.getByRole('button', { name: `Read report for ${ADMIN.name}` }).click()

  const sheet = page.getByRole('dialog', { name: ADMIN.name })
  await expect(sheet).toBeVisible()
  await expect(sheet.getByText('Report generation in progress.')).toBeVisible()
})

test('deletes a report', async ({ page }) => {
  await gotoApp(page, '/helper')

  await page.getByRole('button', { name: 'Generate report' }).click()
  const deleteButtons = page.getByRole('button', { name: `Delete report for ${ADMIN.name}` })
  await expect(deleteButtons.first()).toBeVisible()
  const countBefore = await deleteButtons.count()

  await deleteButtons.first().click()
  const confirm = page.getByRole('alertdialog', { name: 'Delete report' })
  await expect(confirm).toContainText(`Delete ${ADMIN.name}?`)
  await confirm.getByRole('button', { name: 'Delete', exact: true }).click()

  await expect(deleteButtons).toHaveCount(countBefore - 1)
})
