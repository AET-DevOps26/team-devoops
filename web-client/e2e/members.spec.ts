import { memberFixtures, memberSummaryFixtures } from './support/data'
import { expect, gotoApp, test, toastRegion } from './support/fixtures'


const targetMember = memberFixtures[0]
if (!targetMember) throw new Error('memberFixtures must contain at least one member')
const targetMemberName = `${targetMember.first_name} ${targetMember.last_name}`

test('lists every member for the admin', async ({ page }) => {
  await gotoApp(page, '/members')

  await expect(page.getByRole('heading', { name: 'Members' })).toBeVisible()
  await expect(page.getByRole('cell', { name: targetMemberName, exact: true })).toBeVisible()
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

  await expect(toastRegion(page)).toContainText('Member created.')
  await expect(page.getByRole('cell', { name: 'E2E Testperson', exact: true })).toBeVisible()
})

test('surfaces the 409 duplicate-email error and keeps the dialog open', async ({ page }) => {
  await gotoApp(page, '/members')

  await page.getByRole('button', { name: 'New member' }).click()
  const dialog = page.getByRole('dialog', { name: 'New Member' })
  await dialog.getByLabel('First name').fill('Duplicate')
  await dialog.getByLabel('Last name').fill('Email')
  await dialog.getByLabel('Email').fill(targetMember.email)
  await dialog.getByLabel('Initial password').fill('changeme-e2e')
  await dialog.getByRole('button', { name: 'Next' }).click()
  await dialog.getByRole('button', { name: 'Next' }).click()
  await dialog.getByRole('button', { name: 'Create Member' }).click()

  await expect(toastRegion(page)).toContainText(`Email already in use: ${targetMember.email}`)
  await expect(dialog).toBeVisible()
})

test('keeps the member form open on outside click and closes through explicit controls', async ({ page }) => {
  await gotoApp(page, '/members')
  await page.getByRole('button', { name: 'New member' }).click()
  let dialog = page.getByRole('dialog', { name: 'New Member' })
  await dialog.getByLabel('First name').fill('Unsaved')
  await page.locator('[data-slot="dialog-overlay"]').click({ position: { x: 4, y: 4 } })
  await expect(dialog).toBeVisible()
  await page.keyboard.press('Escape')
  await expect(dialog).toHaveCount(0)

  await page.getByRole('button', { name: 'New member' }).click()
  dialog = page.getByRole('dialog', { name: 'New Member' })
  await dialog.getByRole('button', { name: 'Close' }).click()
  await expect(dialog).toHaveCount(0)

  await page.getByRole('button', { name: 'New member' }).click()
  dialog = page.getByRole('dialog', { name: 'New Member' })
  await dialog.getByRole('button', { name: 'Cancel' }).click()
  await expect(dialog).toHaveCount(0)
})

test('renders identity validation beside the invalid field on the identity step', async ({ page }) => {
  await gotoApp(page, '/members')
  await page.getByRole('button', { name: 'New member' }).click()
  const dialog = page.getByRole('dialog', { name: 'New Member' })
  await dialog.getByLabel('Last name').fill('Only')
  await dialog.getByLabel('Email').fill('only@example.test')
  await dialog.getByLabel('Initial password').fill('changeme-e2e')
  await dialog.getByRole('button', { name: 'Next' }).click()
  await expect(dialog.getByLabel('First name')).toHaveAttribute('aria-invalid', 'true')
  await expect(dialog).toContainText('First name is required.')
  await expect(dialog.getByText('Identity')).toBeVisible()
})

test('keeps the editor open and shows the server message for a 403', async ({ page }) => {
  await gotoApp(page, '/members')
  await page.route('**/api/v1/members/*', async (route) => {
    if (route.request().method() === 'PATCH') {
      await route.fulfill({
        status: 403,
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ message: 'Editing members is disabled for this test.' }),
      })
      return
    }
    await route.fallback()
  })
  await page.getByRole('button', { name: `Edit ${targetMemberName}` }).click()
  const dialog = page.getByRole('dialog', { name: 'Edit Member' })
  await dialog.getByLabel('First name').fill('Blocked')
  await dialog.getByRole('button', { name: 'Next' }).click()
  await dialog.getByRole('button', { name: 'Next' }).click()
  await dialog.getByRole('button', { name: 'Save Member' }).click()
  await expect(toastRegion(page)).toContainText('Editing members is disabled for this test.')
  await expect(dialog).toBeVisible()
})

test('edits a member and reflects the change in the table', async ({ page }) => {
  await gotoApp(page, '/members')

  await page.getByRole('button', { name: `Edit ${targetMemberName}` }).click()
  const dialog = page.getByRole('dialog', { name: 'Edit Member' })
  const updatedFirstName = `Updated-${targetMember.first_name}`
  const updatedMemberName = `${updatedFirstName} ${targetMember.last_name}`
  await dialog.getByLabel('First name').fill(updatedFirstName)
  await dialog.getByRole('button', { name: 'Next' }).click()
  await dialog.getByRole('button', { name: 'Next' }).click()
  await dialog.getByRole('button', { name: 'Save Member' }).click()

  await expect(toastRegion(page)).toContainText('Member updated.')
  await expect(page.getByRole('cell', { name: updatedMemberName, exact: true })).toBeVisible()
  await expect(page.getByRole('cell', { name: targetMemberName, exact: true })).toHaveCount(0)
})

test('deletes a member after confirmation', async ({ page }) => {
  await gotoApp(page, '/members')

  await page.getByRole('button', { name: `Delete ${targetMemberName}` }).click()
  const confirm = page.getByRole('alertdialog', { name: 'Delete member' })
  await expect(confirm).toContainText(`Delete ${targetMemberName}?`)
  await confirm.getByRole('button', { name: 'Delete', exact: true }).click()

  await expect(toastRegion(page)).toContainText('Member deleted.')
  await expect(page.getByRole('cell', { name: targetMemberName, exact: true })).toHaveCount(0)
})
