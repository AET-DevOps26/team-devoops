import { balanceFixtures, transactionFixtures } from './support/data'
import { expect, gotoApp, test } from './support/fixtures'

const paymentMember = transactionFixtures.find((transaction) =>
  balanceFixtures.some((balance) => balance.member.id === transaction.member.id),
)?.member
if (!paymentMember) {
  throw new Error('fixtures must contain a transaction member with a balance')
}

test('clicking a balance row jumps to Transactions filtered to that member', async ({
  page,
}) => {
  await gotoApp(page, '/payments')

  await expect(page.getByRole('tab', { name: 'Balances', selected: true })).toBeVisible()

  await page.getByRole('searchbox', { name: 'Search members' }).fill(paymentMember.name)
  const row = page.getByRole('button', { name: paymentMember.name, exact: false })
  await row.click()

  await expect(page.getByRole('tab', { name: 'Transactions', selected: true })).toBeVisible()
  await expect(page.getByRole('button', { name: 'Clear Member' })).toBeVisible()
  await expect(
    page.getByRole('cell', { name: paymentMember.name, exact: true }).first(),
  ).toBeVisible()

  await page.getByRole('button', { name: 'Clear Member' }).click()
  await expect(page.getByRole('button', { name: 'Clear Member' })).toHaveCount(0)
})

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
  await page.getByRole('combobox', { name: 'Search members' }).fill(paymentMember.name)
  await page.getByRole('option', { name: paymentMember.name }).click()

  await dialog.getByRole('button', { name: 'Payment' }).click()
  await dialog.getByLabel('Amount').fill('25.50')
  await dialog.getByLabel('Title').fill('E2E membership payment')
  await dialog.getByRole('button', { name: 'Record Transaction' }).click()

  await expect(page.getByText(`Transaction recorded for ${paymentMember.name}.`)).toBeVisible()
  await page.getByRole('tab', { name: 'Transactions' }).click()
  await expect(
    page.getByRole('cell', { name: 'E2E membership payment', exact: true }),
  ).toBeVisible()
})

test('rejects a malformed amount with a form error', async ({ page }) => {
  await gotoApp(page, '/payments')

  await page.getByRole('button', { name: 'New Transaction' }).click()
  const dialog = page.getByRole('dialog', { name: 'New Transaction' })

  await dialog.getByRole('combobox', { name: 'Member' }).click()
  await page.getByRole('combobox', { name: 'Search members' }).fill(paymentMember.name)
  await page.getByRole('option', { name: paymentMember.name }).click()
  await dialog.getByLabel('Amount').fill('not-a-number')
  await dialog.getByLabel('Title').fill('E2E fee')
  await dialog.getByRole('button', { name: 'Record Transaction' }).click()

  await expect(dialog).toContainText('Enter an amount in euros with up to two decimals.')
})

test('deletes a transaction from the managed table', async ({ page }) => {
  await gotoApp(page, '/payments')
  await page.getByRole('tab', { name: 'Transactions' }).click()

  // Admin-created fixture transactions expose a delete action. Wait for the first row's
  // delete button so the count below isn't read before the table has loaded.
  const deleteButtons = page.getByRole('button', { name: /^Delete / })
  await expect(deleteButtons.first()).toBeVisible()
  const countBefore = await deleteButtons.count()
  expect(countBefore).toBeGreaterThan(0)

  await deleteButtons.first().click()
  const confirm = page.getByRole('alertdialog', { name: 'Delete transaction' })
  await confirm.getByRole('button', { name: 'Delete', exact: true }).click()

  await expect(page.getByText('Transaction deleted.')).toBeVisible()
})
