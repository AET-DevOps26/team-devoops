import { feedbackSummaryFixtures } from './support/data'
import { expect, gotoApp, test, toastRegion } from './support/fixtures'

test('composes feedback via the sport → team → event picker', async ({ page }) => {
  await gotoApp(page, '/feedback')

  await page.getByRole('button', { name: 'New feedback' }).click()
  const picker = page.getByRole('dialog', { name: 'New feedback' })

  await picker.getByRole('tab', { name: 'By event' }).click()

  for (let level = 0; level < 3; level += 1) {
    await picker.locator('ul > li button').first().click()
  }

  const traineeRow = picker.locator('ul > li').first()
  const traineeName = (await traineeRow.locator('p').first().innerText()).trim()
  await traineeRow.getByRole('button', { name: `Give feedback for ${traineeName}` }).click()

  const compose = page.getByRole('dialog', { name: 'Give Feedback' })
  await expect(compose).toContainText(traineeName)
  await compose.getByLabel('Feedback').fill('Great energy in the session — keep it up.')
  await compose.getByLabel('Rating').fill('9')
  await compose.getByRole('button', { name: 'Save Feedback' }).click()

  await expect(toastRegion(page)).toContainText(`Feedback added for ${traineeName}.`)
  await expect(
    page.getByRole('button', { name: `View feedback for ${traineeName}` }).first(),
  ).toBeVisible()
})

test('both feedback picker tabs are real tabs and reach compose', async ({ page }) => {
  await gotoApp(page, '/feedback')
  await page.getByRole('button', { name: 'New feedback' }).click()
  const picker = page.getByRole('dialog', { name: 'New feedback' })
  await expect(picker.getByRole('tab', { name: 'By member' })).toBeVisible()
  await expect(picker.getByRole('tab', { name: 'By event' })).toBeVisible()

  await picker.getByRole('tab', { name: 'By member' }).click()
  await picker.locator('ul > li').first().getByRole('button').click()
  await expect(page.getByRole('dialog', { name: 'Give Feedback' })).toBeVisible()
})

test('edits existing feedback from the detail sheet', async ({ page }) => {
  await gotoApp(page, '/feedback')

  const target = feedbackSummaryFixtures[0]
  await page.getByRole('button', { name: `View feedback for ${target.member.name}` }).first().click()

  const sheet = page.getByRole('dialog', { name: target.event.name })
  await sheet.getByRole('button', { name: 'Edit Feedback' }).click()

  const editDialog = page.getByRole('dialog', { name: 'Edit feedback' })
  await editDialog.getByLabel('Rating').fill('10')
  await editDialog.getByRole('button', { name: 'Save changes' }).click()

  await expect(sheet.getByText('10/10')).toBeVisible()
})

test('deletes feedback after confirmation', async ({ page }) => {
  await gotoApp(page, '/feedback')

  const target = feedbackSummaryFixtures[0]
  const deleteButtons = page.getByRole('button', {
    name: `Delete feedback for ${target.member.name}`,
  })
  // Wait for the row to render before counting, so the count isn't read early.
  await expect(deleteButtons.first()).toBeVisible()
  const countBefore = await deleteButtons.count()

  await deleteButtons.first().click()
  const confirm = page.getByRole('alertdialog', { name: 'Delete feedback' })
  await confirm.getByRole('button', { name: 'Delete', exact: true }).click()

  await expect(deleteButtons).toHaveCount(countBefore - 1)
})
