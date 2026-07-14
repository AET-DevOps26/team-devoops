import { eventSummaryFixtures } from './support/data'
import { expect, gotoApp, test } from './support/fixtures'

test('creates an event through the four-step dialog', async ({ page }) => {
  await gotoApp(page, '/sport-events')

  await page.getByRole('button', { name: 'New event' }).click()
  const dialog = page.getByRole('dialog', { name: 'New Event' })

  await dialog.getByLabel('Name').fill('E2E Friendly Match')
  await dialog.getByRole('button', { name: 'Next' }).click()
  // Schedule step is pre-filled with a valid start/end pair.
  await dialog.getByRole('button', { name: 'Next' }).click()
  // Sports & teams and attendees are optional for the admin.
  await dialog.getByRole('button', { name: 'Next' }).click()
  await dialog.getByRole('button', { name: 'Create Event' }).click()

  // Creation opens the detail sheet for the new event; the notice behind the
  // modal sheet is aria-hidden until the sheet closes.
  const sheet = page.getByRole('dialog', { name: 'E2E Friendly Match' })
  await expect(sheet).toBeVisible()
  await sheet.getByRole('button', { name: 'Close' }).click()

  await expect(page.getByRole('status')).toContainText('Event created.')
  await expect(page.getByRole('button', { name: 'View E2E Friendly Match' })).toBeVisible()
})

test('blocks an empty name on the details step', async ({ page }) => {
  await gotoApp(page, '/sport-events')

  await page.getByRole('button', { name: 'New event' }).click()
  const dialog = page.getByRole('dialog', { name: 'New Event' })

  // The name input is `required`, so a blank submit is stopped by the browser
  // and the dialog stays on the first step.
  await dialog.getByRole('button', { name: 'Next' }).click()
  await expect(dialog.getByLabel('Name')).toBeVisible()
  await expect(dialog.getByRole('button', { name: 'Next' })).toBeVisible()
})

test('edits an event name from the list', async ({ page }) => {
  await gotoApp(page, '/sport-events')

  const target = eventSummaryFixtures[0]
  await page.getByRole('button', { name: `Edit ${target.name}` }).first().click()

  const dialog = page.getByRole('dialog', { name: 'Edit Event' })
  await dialog.getByLabel('Name').fill('Renamed E2E Session')
  await dialog.getByRole('button', { name: 'Next' }).click()
  await dialog.getByRole('button', { name: 'Next' }).click()
  await dialog.getByRole('button', { name: 'Next' }).click()
  await dialog.getByRole('button', { name: 'Save Event' }).click()

  await expect(page.getByRole('status')).toContainText('Event updated.')
  await expect(page.getByRole('button', { name: 'View Renamed E2E Session' })).toBeVisible()
})

test('deletes an event after confirmation', async ({ page }) => {
  await gotoApp(page, '/sport-events')

  const target = eventSummaryFixtures[0]
  await page.getByRole('button', { name: `Delete ${target.name}` }).first().click()

  const confirm = page.getByRole('alertdialog')
  await confirm.getByRole('button', { name: 'Delete', exact: true }).click()

  await expect(page.getByRole('status')).toContainText('Event deleted.')
})
