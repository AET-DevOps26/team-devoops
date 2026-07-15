import {
  ADMIN,
  dashboardFixtures,
  eventSummaryFixtures,
  feedbackSummaryFixtures,
  memberFixtures,
  sportFixtures,
  teamFixtures,
} from './support/data'
import { expect, gotoApp, test } from './support/fixtures'


test('dashboard greets the admin and shows the admin count envelope', async ({ page }) => {
  await gotoApp(page)

  const adminDashboard = dashboardFixtures.admin
  if (adminDashboard.role !== 'admin') throw new Error('expected the admin envelope')

  await expect(page.getByRole('heading', { name: ADMIN.name })).toBeVisible()
  // StatCard renders label + value as sibling paragraphs inside the card div.
  const membersCard = page.getByText('Total Members', { exact: true }).locator('..')
  await expect(membersCard).toContainText(String(adminDashboard.total_members))
  const sportsCard = page.getByText('Total Sports', { exact: true }).locator('..')
  await expect(sportsCard).toContainText(String(adminDashboard.total_sports))
  await expect(page.getByText('Organization Summary')).toBeVisible()
})

test('events page lists every fixture event for the admin', async ({ page }) => {
  await gotoApp(page, '/sport-events')

  await expect(page.getByRole('heading', { name: 'Events' })).toBeVisible()
  const first = eventSummaryFixtures[0]
  const last = eventSummaryFixtures[eventSummaryFixtures.length - 1]
  await expect(page.getByRole('button', { name: `View ${first.name}` }).first()).toBeVisible()
  await expect(page.getByRole('button', { name: `View ${last.name}` }).first()).toBeVisible()
})

test('feedback page lists fixture rows with ratings for the admin', async ({ page }) => {
  await gotoApp(page, '/feedback')

  await expect(page.getByRole('heading', { name: 'Feedback' })).toBeVisible()
  const first = feedbackSummaryFixtures[0]
  await expect(
    page.getByRole('button', { name: `View feedback for ${first.member.name}` }).first(),
  ).toBeVisible()
  await expect(page.getByText(`${first.rating}/10`).first()).toBeVisible()
})

test('teams page shows fixture sports and teams', async ({ page }) => {
  await gotoApp(page, '/organization')

  await expect(page.getByText(sportFixtures[0].name).first()).toBeVisible()
  await expect(page.getByText(teamFixtures[0].name).first()).toBeVisible()
})

test('payments page shows the managed lens with fixture balances', async ({ page }) => {
  await gotoApp(page, '/payments')

  await expect(page.getByText('Member balances and transaction history.')).toBeVisible()
  await expect(page.getByRole('tab', { name: 'Balances', selected: true })).toBeVisible()
  await expect(page.getByRole('tab', { name: 'Transactions' })).toBeVisible()
  await expect(page.getByRole('button', { name: 'New Transaction' })).toBeVisible()
})

test('development page renders the report generator', async ({ page }) => {
  await gotoApp(page, '/helper')

  await expect(page.getByRole('heading', { name: 'Development' })).toBeVisible()
})

test('profile page loads the admin persona member record', async ({ page }) => {
  await gotoApp(page, '/profile')

  const adminMember = memberFixtures.find((member) => member.id === ADMIN.id)
  if (!adminMember) throw new Error('admin persona must exist in memberFixtures')

  await expect(page.getByLabel('Email')).toHaveValue(adminMember.email)
  await expect(page.getByLabel('First name')).toHaveValue(adminMember.first_name)
})
