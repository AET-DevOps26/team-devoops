import { describe, expect, it } from 'vitest'

import type { AuthUser, EventListItem, SportEvent } from '@/types'
import {
  balanceFixtures,
  eventDetailsById,
  eventSummaryFixtures,
  feedbackSummaryFixtures,
  memberSummaryFixtures,
  sportFixtures,
  teamFixtures,
  transactionFixtures,
} from './fixtures'
import { TEST_PERSONAS } from './personas'
import {
  scopeBalances,
  scopeEvents,
  scopeFeedback,
  scopeMembers,
  scopeReport,
  scopeTransactions,
} from './scope'

type EventRow = EventListItem | SportEvent

const users = {
  member: TEST_PERSONAS.member,
  trainer: TEST_PERSONAS.coach,
  director: TEST_PERSONAS.director,
  admin: TEST_PERSONAS.admin,
} satisfies Record<string, AuthUser>

function ids(rows: { id: string }[]): string[] {
  return rows.map((row) => row.id)
}

function memberTeamIds(userId: string): Set<string> {
  return new Set(
    teamFixtures
      .filter((team) => team.trainees.some((member) => member.id === userId))
      .map((team) => team.id),
  )
}

function trainerTeamIds(userId: string): Set<string> {
  return new Set(
    teamFixtures
      .filter((team) => team.trainers.some((trainer) => trainer.id === userId))
      .map((team) => team.id),
  )
}

function directorSports(userId: string): Set<string> {
  return new Set(
    sportFixtures
      .filter((sport) => sport.directors.some((director) => director.id === userId))
      .map((sport) => sport.id),
  )
}

function sportTeamIds(sports: Set<string>): Set<string> {
  return new Set(teamFixtures.filter((team) => sports.has(team.sport.id)).map((team) => team.id))
}

function teamMemberIds(teamIds: Set<string>): Set<string> {
  return new Set(
    teamFixtures
      .filter((team) => teamIds.has(team.id))
      .flatMap((team) => team.trainees.map((member) => member.id)),
  )
}

function directorMemberIds(user: AuthUser): Set<string> {
  return teamMemberIds(sportTeamIds(directorSports(user.id)))
}

function trainerMemberIds(user: AuthUser): Set<string> {
  return teamMemberIds(trainerTeamIds(user.id))
}

function eventCreatorId(row: EventRow): string | undefined {
  return 'creator' in row ? row.creator?.id : eventDetailsById[row.id]?.creator?.id
}

function eventSports(row: EventRow): string[] {
  const linked = 'sports_linked' in row ? row.sports_linked : eventDetailsById[row.id]?.sports_linked
  return (linked ?? []).map((sport) => sport.id)
}

function eventTeamIds(row: EventRow): string[] {
  return row.teams_linked?.map((team) => team.id) ?? []
}

function firstOutOfScopeMember(memberIds: Set<string>): string {
  const found = memberSummaryFixtures.find((member) => !memberIds.has(member.id))
  if (!found) throw new Error('Expected at least one out-of-scope member fixture')
  return found.id
}

describe('scopeFeedback', () => {
  it('scopes feedback for every role', () => {
    expect(ids(scopeFeedback(feedbackSummaryFixtures, users.admin))).toEqual(ids(feedbackSummaryFixtures))
    expect(ids(scopeFeedback(feedbackSummaryFixtures, users.member))).toEqual(
      ids(feedbackSummaryFixtures.filter((row) => row.member.id === users.member.id)),
    )
    expect(ids(scopeFeedback(feedbackSummaryFixtures, users.trainer))).toEqual(
      ids(feedbackSummaryFixtures.filter((row) => row.creator?.id === users.trainer.id)),
    )
    expect(scopeFeedback(feedbackSummaryFixtures, users.director)).toEqual([])
  })
})

describe('scopeTransactions', () => {
  it('scopes transactions for every role', () => {
    const directorIds = directorMemberIds(users.director)

    expect(ids(scopeTransactions(transactionFixtures, users.admin))).toEqual(ids(transactionFixtures))
    expect(ids(scopeTransactions(transactionFixtures, users.member))).toEqual(
      ids(
        transactionFixtures.filter(
          (row) => row.member.id === users.member.id || row.creator?.id === users.member.id,
        ),
      ),
    )
    expect(scopeTransactions(transactionFixtures, users.trainer)).toEqual([])
    expect(ids(scopeTransactions(transactionFixtures, users.director))).toEqual(
      ids(
        transactionFixtures.filter(
          (row) =>
            row.member.id === users.director.id ||
            row.creator?.id === users.director.id ||
            directorIds.has(row.member.id),
        ),
      ),
    )
  })
})

describe('scopeBalances', () => {
  it('scopes balances for every role', () => {
    const directorIds = directorMemberIds(users.director)

    expect(scopeBalances(balanceFixtures, users.admin)).toEqual(balanceFixtures)
    expect(scopeBalances(balanceFixtures, users.member)).toEqual(
      balanceFixtures.filter((row) => row.member.id === users.member.id),
    )
    expect(scopeBalances(balanceFixtures, users.trainer)).toEqual([])
    expect(scopeBalances(balanceFixtures, users.director)).toEqual(
      balanceFixtures.filter((row) => directorIds.has(row.member.id)),
    )
  })
})

describe('scopeEvents', () => {
  it('scopes events for every role', () => {
    const memberTeams = memberTeamIds(users.member.id)
    const trainerTeams = trainerTeamIds(users.trainer.id)
    const directorSportIds = directorSports(users.director.id)
    const directorTeams = sportTeamIds(directorSportIds)

    expect(ids(scopeEvents(eventSummaryFixtures, users.admin))).toEqual(ids(eventSummaryFixtures))
    expect(ids(scopeEvents(eventSummaryFixtures, users.member))).toEqual(
      ids(eventSummaryFixtures.filter((row) => eventTeamIds(row).some((teamId) => memberTeams.has(teamId)))),
    )
    expect(ids(scopeEvents(eventSummaryFixtures, users.trainer))).toEqual(
      ids(
        eventSummaryFixtures.filter(
          (row) =>
            eventCreatorId(row) === users.trainer.id ||
            eventTeamIds(row).some((teamId) => trainerTeams.has(teamId)),
        ),
      ),
    )
    expect(ids(scopeEvents(eventSummaryFixtures, users.director))).toEqual(
      ids(
        eventSummaryFixtures.filter(
          (row) =>
            eventSports(row).some((sport) => directorSportIds.has(sport)) ||
            eventTeamIds(row).some((teamId) => directorTeams.has(teamId)),
        ),
      ),
    )
  })
})

describe('scopeMembers', () => {
  it('scopes members for every role', () => {
    const trainerIds = trainerMemberIds(users.trainer)
    const directorIds = directorMemberIds(users.director)

    expect(ids(scopeMembers(memberSummaryFixtures, users.admin))).toEqual(ids(memberSummaryFixtures))
    expect(ids(scopeMembers(memberSummaryFixtures, users.member))).toEqual([users.member.id])
    expect(ids(scopeMembers(memberSummaryFixtures, users.trainer))).toEqual(
      ids(memberSummaryFixtures.filter((row) => trainerIds.has(row.id))),
    )
    expect(ids(scopeMembers(memberSummaryFixtures, users.director))).toEqual(
      ids(memberSummaryFixtures.filter((row) => directorIds.has(row.id))),
    )
  })
})

describe('scopeReport', () => {
  it('allows reports for every role according to member scope', () => {
    const trainerIds = trainerMemberIds(users.trainer)
    const directorIds = directorMemberIds(users.director)
    const trainerMemberId = [...trainerIds][0]
    const directorMemberId = [...directorIds][0]

    expect(scopeReport(users.member.id, users.admin)).toBe(true)
    expect(scopeReport(users.member.id, users.member)).toBe(true)
    expect(scopeReport(firstOutOfScopeMember(new Set([users.member.id])), users.member)).toBe(false)
    expect(scopeReport(trainerMemberId, users.trainer)).toBe(true)
    expect(scopeReport(firstOutOfScopeMember(trainerIds), users.trainer)).toBe(false)
    expect(scopeReport(directorMemberId, users.director)).toBe(true)
    expect(scopeReport(firstOutOfScopeMember(directorIds), users.director)).toBe(false)
  })
})
