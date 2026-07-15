import type { Page } from '@playwright/test'

import {
  feedbackSummaryFixtures,
  memberFixtures,
  NAV_ITEMS,
  sportFixtures,
  teamFixtures,
} from './support/data'
import { expect, gotoApp, test, toastRegion } from './support/fixtures'

// Do not reload between pages: rebuilding the query cache would hide these regressions.

function fixtureOrThrow<T>(value: T | undefined, description: string): T {
  if (value === undefined) throw new Error(`Missing E2E fixture: ${description}`)
  return value
}

// Derive relationships from fixtures so changes fail explicitly instead of using stale names.
const defaultSport = fixtureOrThrow(sportFixtures[0], 'at least one sport')
const rosterTeam = fixtureOrThrow(
  teamFixtures.find(
    (team) =>
      team.sport.id === defaultSport.id &&
      team.trainees.some((trainee) =>
        feedbackSummaryFixtures.some((feedback) => feedback.member.id === trainee.id),
      ),
  ),
  'a team in the default sport with a trainee who has feedback',
)
const rosterMemberRef = fixtureOrThrow(
  rosterTeam.trainees.find((trainee) =>
    feedbackSummaryFixtures.some((feedback) => feedback.member.id === trainee.id),
  ),
  'a roster member referenced by feedback',
)
const rosterMember = fixtureOrThrow(
  memberFixtures.find((member) => member.id === rosterMemberRef.id),
  'the full member record for the roster member',
)
const rosterMemberName = `${rosterMember.first_name} ${rosterMember.last_name}`

const createdMember = {
  firstName: 'Cache',
  lastName: 'Consistency',
  email: 'cache.consistency@club.de',
  password: 'changeme-e2e',
}
const createdMemberName = `${createdMember.firstName} ${createdMember.lastName}`

// These scenarios load multiple large fixture tables around a mutation. Their observed runtime is
// longer than the suite's normal single-page CRUD budget, so only this file gets a larger timeout.
test.describe.configure({ timeout: 60_000 })

async function navigateTo(page: Page, path: string) {
  const navItem = fixtureOrThrow(
    NAV_ITEMS.find((item) => item.to === path),
    `navigation item for ${path}`,
  )

  await page.getByRole('link', { name: navItem.label, exact: true }).click()
  await expect(page).toHaveURL(new RegExp(`${path.replace('/', '\\/')}$`))
}

// The organization page expands its first fixture sport by default. The fixture selection above
// deliberately chooses a team in that sport, avoiding timing-sensitive expand/collapse probing.
async function openTeamRoster(page: Page, team: string) {
  const teamRow = page.getByRole('button', { name: `${team} Coach`, exact: false })
  await expect(teamRow).toBeVisible()
  await teamRow.click()
  return page.getByRole('dialog')
}

async function deleteMember(page: Page, name: string) {
  await page.getByRole('button', { name: `Delete ${name}` }).click()
  const confirm = page.getByRole('alertdialog', { name: 'Delete member' })
  await confirm.getByRole('button', { name: 'Delete', exact: true }).click()
  await expect(toastRegion(page)).toContainText('Member deleted.')
}

test('a deleted member disappears from the team roster that embedded them', async ({ page }) => {
  await gotoApp(page, '/organization')

  const roster = await openTeamRoster(page, rosterTeam.name)
  await expect(roster.getByText(rosterMemberName, { exact: true })).toBeVisible()
  const membersHeadingBefore = await roster.getByText(/^Members \(\d+\)$/).textContent()
  await page.keyboard.press('Escape')

  await navigateTo(page, '/members')
  await deleteMember(page, rosterMemberName)

  await navigateTo(page, '/organization')
  const rosterAfter = await openTeamRoster(page, rosterTeam.name)
  await expect(rosterAfter.getByText(rosterMemberName, { exact: true })).toHaveCount(0)

  const before = Number(/\((\d+)\)/.exec(membersHeadingBefore ?? '')?.[1])
  await expect(rosterAfter.getByText(`Members (${before - 1})`, { exact: true })).toBeVisible()
})

test('a deleted member disappears from the feedback list that referenced them', async ({ page }) => {
  await gotoApp(page, '/feedback')
  await expect(
    page.getByRole('cell', { name: rosterMemberName, exact: true }).first(),
  ).toBeVisible()

  await navigateTo(page, '/members')
  await deleteMember(page, rosterMemberName)

  await navigateTo(page, '/feedback')
  await expect(page.getByRole('cell', { name: rosterMemberName, exact: true })).toHaveCount(0)
})

test('renaming a member updates the name shown in their team roster and feedback', async ({
  page,
}) => {
  await gotoApp(page, '/organization')

  const rosterBefore = await openTeamRoster(page, rosterTeam.name)
  await expect(rosterBefore.getByText(rosterMemberName, { exact: true })).toBeVisible()
  await page.keyboard.press('Escape')

  await navigateTo(page, '/feedback')
  await expect(
    page.getByRole('cell', { name: rosterMemberName, exact: true }).first(),
  ).toBeVisible()

  await navigateTo(page, '/members')

  await page.getByRole('button', { name: `Edit ${rosterMemberName}` }).click()
  const dialog = page.getByRole('dialog', { name: 'Edit Member' })
  const renamedFirstName = `Renamed-${rosterMember.first_name}`
  const renamedMemberName = `${renamedFirstName} ${rosterMember.last_name}`
  await dialog.getByLabel('First name').fill(renamedFirstName)
  await dialog.getByRole('button', { name: 'Next' }).click()
  await dialog.getByRole('button', { name: 'Next' }).click()
  await dialog.getByRole('button', { name: 'Save Member' }).click()
  await expect(toastRegion(page)).toContainText('Member updated.')

  await navigateTo(page, '/organization')
  const roster = await openTeamRoster(page, rosterTeam.name)
  await expect(roster.getByText(renamedMemberName, { exact: true })).toBeVisible()
  await expect(roster.getByText(rosterMemberName, { exact: true })).toHaveCount(0)

  await page.keyboard.press('Escape')
  await navigateTo(page, '/feedback')
  await expect(
    page.getByRole('cell', { name: renamedMemberName, exact: true }).first(),
  ).toBeVisible()
  await expect(page.getByRole('cell', { name: rosterMemberName, exact: true })).toHaveCount(0)
})

test('a created member is immediately addressable as a feedback recipient', async ({ page }) => {
  await gotoApp(page, '/members')

  await page.getByRole('button', { name: 'New member' }).click()
  const dialog = page.getByRole('dialog', { name: 'New Member' })
  await dialog.getByLabel('First name').fill(createdMember.firstName)
  await dialog.getByLabel('Last name').fill(createdMember.lastName)
  await dialog.getByLabel('Email').fill(createdMember.email)
  await dialog.getByLabel('Initial password').fill(createdMember.password)
  await dialog.getByRole('button', { name: 'Next' }).click()
  await dialog.getByRole('button', { name: 'Next' }).click()
  await dialog.getByRole('button', { name: 'Create Member' }).click()

  await expect(toastRegion(page)).toContainText('Member created.')
  await expect(page.getByRole('cell', { name: createdMemberName, exact: true })).toBeVisible()

  await navigateTo(page, '/feedback')
  await page.getByRole('button', { name: 'New feedback' }).click()
  const picker = page.getByRole('dialog', { name: 'New feedback' })
  await picker.getByLabel('Search members').fill(createdMemberName)
  await expect(
    picker.getByRole('button', { name: `Give feedback for ${createdMemberName}` }),
  ).toBeVisible()
})

test('deleting a transaction recalculates the balances derived from it', async ({ page }) => {
  await gotoApp(page, '/payments')

  await page.getByRole('tab', { name: 'Transactions' }).click()
  const deleteButton = page.getByRole('button', { name: /^Delete / }).first()
  await expect(deleteButton).toBeVisible()
  const transactionRow = deleteButton.locator('xpath=ancestor::tr')
  const memberName = (await transactionRow.getByRole('cell').nth(1).textContent())?.trim()
  if (!memberName) throw new Error('The deletable transaction must identify its member')

  await page.getByRole('tab', { name: 'Balances' }).click()
  const balanceRow = page.getByRole('button', { name: memberName, exact: false })
  await expect(balanceRow).toBeVisible()
  const balanceBefore = await balanceRow.textContent()

  await page.getByRole('tab', { name: 'Transactions' }).click()
  await deleteButton.click()
  const confirm = page.getByRole('alertdialog', { name: 'Delete transaction' })
  await confirm.getByRole('button', { name: 'Delete', exact: true }).click()
  await expect(toastRegion(page)).toContainText('Transaction deleted.')

  await page.getByRole('tab', { name: 'Balances' }).click()
  await expect(balanceRow).toBeVisible()
  await expect(balanceRow).not.toHaveText(balanceBefore ?? '')
})
