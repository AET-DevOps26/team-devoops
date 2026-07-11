import { sportFixtures, teamFixtures } from './support/data'
import { expect, gotoApp, test } from './support/fixtures'

test('creates a sport', async ({ page }) => {
  await gotoApp(page, '/organization')

  await page.getByRole('button', { name: 'New sport' }).click()
  const dialog = page.getByRole('dialog', { name: 'New Sport' })
  await dialog.getByLabel('Name').fill('E2E Pickleball')
  await dialog.getByLabel('Description').fill('E2E indoor sessions.')
  await dialog.getByRole('button', { name: 'Next' }).click()
  await dialog.getByRole('button', { name: 'Create Sport' }).click()

  await expect(page.getByRole('status')).toContainText('Sport created.')
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

  await expect(page.getByRole('status')).toContainText('Sport updated.')
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

  await expect(page.getByRole('status')).toContainText('Sport deleted.')
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

  await expect(page.getByRole('status')).toContainText('Team created.')
  await expect(page.getByText('E2E Morning Crew', { exact: true })).toBeVisible()
})

test('edits and deletes a team', async ({ page }) => {
  await gotoApp(page, '/organization')

  const target = teamFixtures[0]
  await page.getByRole('button', { name: `Edit ${target.name}`, exact: true }).click()

  const dialog = page.getByRole('dialog', { name: 'Edit Team' })
  await dialog.getByLabel('Name').fill('E2E Football Juniors')
  await dialog.getByRole('button', { name: 'Next' }).click()
  await dialog.getByRole('button', { name: 'Save Team' }).click()

  await expect(page.getByRole('status')).toContainText('Team updated.')
  await expect(page.getByText('E2E Football Juniors', { exact: true })).toBeVisible()
  await expect(page.getByText(target.name, { exact: true })).toHaveCount(0)

  await page.getByRole('button', { name: 'Delete E2E Football Juniors' }).click()
  const confirm = page.getByRole('alertdialog', { name: 'Delete team' })
  await expect(confirm).toContainText('Delete E2E Football Juniors?')
  await confirm.getByRole('button', { name: 'Delete', exact: true }).click()

  await expect(page.getByRole('status')).toContainText('Team deleted.')
  await expect(page.getByText('E2E Football Juniors', { exact: true })).toHaveCount(0)
})
