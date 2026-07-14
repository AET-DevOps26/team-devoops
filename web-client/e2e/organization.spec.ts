import { sportFixtures, teamFixtures } from './support/data'
import { expect, gotoApp, test, toastRegion } from './support/fixtures'

test('creates a sport', async ({ page }) => {
  await gotoApp(page, '/organization')

  await page.getByRole('button', { name: 'New sport' }).click()
  const dialog = page.getByRole('dialog', { name: 'New Sport' })
  await dialog.getByLabel('Name').fill('E2E Pickleball')
  await dialog.getByLabel('Description').fill('E2E indoor sessions.')
  await dialog.getByRole('button', { name: 'Next' }).click()
  await dialog.getByRole('button', { name: 'Create Sport' }).click()

  await expect(toastRegion(page)).toContainText('Sport created.')
  await expect(page.getByText('E2E Pickleball', { exact: true })).toBeVisible()
})

test('edits a sport', async ({ page }) => {
  await gotoApp(page, '/organization')

  const target = sportFixtures[0]
  await page.getByRole('button', { name: `Edit ${target.name}`, exact: true }).click()

  const dialog = page.getByRole('dialog', { name: 'Edit Sport' })
  await dialog.getByLabel('Name').fill('E2E Football')
  await dialog.getByRole('button', { name: 'Next' }).click()
  await dialog.getByRole('button', { name: 'Save Sport' }).click()

  await expect(toastRegion(page)).toContainText('Sport updated.')
  await expect(page.getByText('E2E Football', { exact: true })).toBeVisible()
  await expect(page.getByText(target.name, { exact: true })).toHaveCount(0)
})

test('deletes a sport', async ({ page }) => {
  await gotoApp(page, '/organization')

  const target = sportFixtures[0]
  await page.getByRole('button', { name: `Delete ${target.name}`, exact: true }).click()
  const confirm = page.getByRole('alertdialog', { name: 'Delete sport' })
  await expect(confirm).toContainText(`Delete ${target.name}?`)
  await confirm.getByRole('button', { name: 'Delete sport' }).click()

  await expect(toastRegion(page)).toContainText('Sport deleted.')
  await expect(page.getByText(target.name, { exact: true })).toHaveCount(0)
})

test('creates a team', async ({ page }) => {
  await gotoApp(page, '/organization')

  const sport = sportFixtures[0]
  await page.getByRole('button', { name: 'New team' }).click()
  const dialog = page.getByRole('dialog', { name: 'New Team' })
  await dialog.getByLabel('Name').fill('E2E Morning Crew')
  await dialog.getByRole('combobox', { name: 'Sport' }).click()
  await page.getByRole('option', { name: sport.name }).click()
  await dialog.getByRole('button', { name: 'Next' }).click()
  await dialog.getByRole('button', { name: 'Create Team' }).click()

  await expect(toastRegion(page)).toContainText('Team created.')
  await expect(page.getByText('E2E Morning Crew', { exact: true })).toBeVisible()
})

test('edits and deletes a team', async ({ page }) => {
  await gotoApp(page, '/organization')

  const target = teamFixtures[0]
  const updatedName = `E2E ${target.name}`
  await page.getByRole('button', { name: `Edit ${target.name}`, exact: true }).click()

  const dialog = page.getByRole('dialog', { name: 'Edit Team' })
  await dialog.getByLabel('Name').fill(updatedName)
  await dialog.getByRole('button', { name: 'Next' }).click()
  await dialog.getByRole('button', { name: 'Save Team' }).click()

  await expect(toastRegion(page)).toContainText('Team updated.')
  await expect(page.getByText(updatedName, { exact: true })).toBeVisible()
  await expect(page.getByText(target.name, { exact: true })).toHaveCount(0)

  await page.getByRole('button', { name: `Delete ${updatedName}` }).click()
  const confirm = page.getByRole('alertdialog', { name: 'Delete team' })
  await expect(confirm).toContainText(`Delete ${updatedName}?`)
  await confirm.getByRole('button', { name: 'Delete', exact: true }).click()

  await expect(toastRegion(page)).toContainText('Team deleted.')
  await expect(page.getByText(updatedName, { exact: true })).toHaveCount(0)
})
