import { ADMIN, memberFixtures } from './support/data'
import { expect, gotoApp, test } from './support/fixtures'

test('edits and saves the own record', async ({ page }) => {
  await gotoApp(page, '/profile')

  const adminMember = memberFixtures.find((member) => member.id === ADMIN.id)
  if (!adminMember) throw new Error('admin persona must exist in memberFixtures')

  const phone = page.getByLabel('Phone number')
  const save = page.getByRole('button', { name: 'Save profile' })
  await expect(phone).toHaveValue(adminMember.phone_number)
  await expect(save).toBeDisabled()

  await phone.fill('+49 170 000000')
  await expect(save).toBeEnabled()
  await save.click()

  await expect(page.getByRole('status')).toContainText('Profile updated.')
  await expect(phone).toHaveValue('+49 170 000000')
  await expect(save).toBeDisabled()
})

test('cancels and reverts unsaved changes', async ({ page }) => {
  await gotoApp(page, '/profile')

  const adminMember = memberFixtures.find((member) => member.id === ADMIN.id)
  if (!adminMember) throw new Error('admin persona must exist in memberFixtures')

  const address = page.getByLabel('Address')
  const save = page.getByRole('button', { name: 'Save profile' })
  const cancel = page.getByRole('button', { name: 'Cancel' })
  await expect(address).toHaveValue(adminMember.address)
  await expect(save).toBeDisabled()

  await address.fill('E2E profile street 12')
  await expect(save).toBeEnabled()
  await expect(cancel).toBeEnabled()
  await cancel.click()

  await expect(address).toHaveValue(adminMember.address)
  await expect(save).toBeDisabled()
})
