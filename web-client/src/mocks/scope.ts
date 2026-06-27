import type {
  AuthUser,
  Balance,
  EventSummary,
  FeedbackSummary,
  Member,
  MemberSummary,
  SportEvent,
  Transaction,
} from '@/types'
import { eventDetailsById, sportFixtures, teamFixtures } from './fixtures'

type MemberRow = Member | MemberSummary
type EventRow = EventSummary | SportEvent

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
      .map((sport) => sport.name),
  )
}

function sportTeamIds(sports: Set<string>): Set<string> {
  return new Set(teamFixtures.filter((team) => sports.has(team.sport)).map((team) => team.id))
}

function teamMemberIds(teamIds: Set<string>): Set<string> {
  return new Set(
    teamFixtures
      .filter((team) => teamIds.has(team.id))
      .flatMap((team) => team.trainees.map((member) => member.id)),
  )
}

function memberIdsInDirectorScope(user: AuthUser): Set<string> {
  return teamMemberIds(sportTeamIds(directorSports(user.id)))
}

function memberIdsInTrainerScope(user: AuthUser): Set<string> {
  return teamMemberIds(trainerTeamIds(user.id))
}

function eventHasTeam(row: EventRow, teamIds: Set<string>): boolean {
  return row.teams_linked?.some((team) => teamIds.has(team.id)) ?? false
}

function eventHasSport(row: EventRow, sports: Set<string>): boolean {
  if ('sports_linked' in row) {
    return row.sports_linked?.some((sport) => sports.has(sport)) ?? false
  }

  const detail = eventDetailsById[row.id]
  return detail?.sports_linked?.some((sport) => sports.has(sport)) ?? false
}

function eventCreatorId(row: EventRow): string | undefined {
  if ('creator' in row) return row.creator.id
  return eventDetailsById[row.id]?.creator.id
}

function eventInMemberScope(row: EventRow, user: AuthUser): boolean {
  return eventHasTeam(row, memberTeamIds(user.id))
}

function eventInTrainerScope(row: EventRow, user: AuthUser): boolean {
  return eventCreatorId(row) === user.id || eventHasTeam(row, trainerTeamIds(user.id))
}

function eventInDirectorScope(row: EventRow, user: AuthUser): boolean {
  const sports = directorSports(user.id)
  return eventHasSport(row, sports) || eventHasTeam(row, sportTeamIds(sports))
}

export function scopeFeedback<T extends FeedbackSummary>(rows: T[], user: AuthUser): T[] {
  switch (user.role) {
    case 'admin':
      return rows
    case 'trainer':
      return rows.filter((row) => row.creator.id === user.id)
    case 'member':
      return rows.filter((row) => row.member.id === user.id)
    case 'director':
      return []
  }
}

export function scopeTransactions<T extends Transaction>(rows: T[], user: AuthUser): T[] {
  switch (user.role) {
    case 'admin':
      return rows
    case 'member':
      return rows.filter((row) => row.member.id === user.id)
    case 'director': {
      const memberIds = memberIdsInDirectorScope(user)
      return rows.filter((row) => memberIds.has(row.member.id))
    }
    case 'trainer':
      return []
  }
}

export function scopeBalances<T extends Balance>(rows: T[], user: AuthUser): T[] {
  switch (user.role) {
    case 'admin':
      return rows
    case 'member':
      return rows.filter((row) => row.member.id === user.id)
    case 'director': {
      const memberIds = memberIdsInDirectorScope(user)
      return rows.filter((row) => memberIds.has(row.member.id))
    }
    case 'trainer':
      return []
  }
}

export function scopeEvents<T extends EventRow>(rows: T[], user: AuthUser): T[] {
  switch (user.role) {
    case 'admin':
      return rows
    case 'member':
      return rows.filter((row) => eventInMemberScope(row, user))
    case 'trainer':
      return rows.filter((row) => eventInTrainerScope(row, user))
    case 'director':
      return rows.filter((row) => eventInDirectorScope(row, user))
  }
}

export function scopeMembers<T extends MemberRow>(rows: T[], user: AuthUser): T[] {
  switch (user.role) {
    case 'admin':
      return rows
    case 'member':
      return rows.filter((row) => row.id === user.id)
    case 'trainer': {
      const memberIds = memberIdsInTrainerScope(user)
      return rows.filter((row) => memberIds.has(row.id))
    }
    case 'director': {
      const memberIds = memberIdsInDirectorScope(user)
      return rows.filter((row) => memberIds.has(row.id))
    }
  }
}

export function scopeReport(memberId: string, user: AuthUser): boolean {
  switch (user.role) {
    case 'admin':
      return true
    case 'member':
      return memberId === user.id
    case 'trainer':
      return memberIdsInTrainerScope(user).has(memberId)
    case 'director':
      return memberIdsInDirectorScope(user).has(memberId)
  }
}
