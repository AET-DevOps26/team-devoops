import type {
  AuthUser,
  Dashboard,
  EventSummary,
  Reference,
  TeamBalanceSummary,
} from '@/types'
import type { TestPersonaKey } from '../personas'
import { TEST_PERSONAS } from '../personas'
import { scopeEvents, scopeFeedback } from '../scope'
import { eventSummaryFixtures } from './events'
import { feedbackSummaryFixtures } from './feedback'
import { balanceFixtures } from './finance'
import { sportFixtures, teamFixtures } from './organization'
import { memberReportSummaries } from './report'

// Fixed reference time keeps fixture output deterministic.
const DASHBOARD_NOW = new Date('2026-06-19T00:00:00Z')

function upcomingEvents(user: AuthUser): EventSummary[] {
  return scopeEvents(eventSummaryFixtures, user)
    .filter((event) => new Date(event.start_time) >= DASHBOARD_NOW)
    .toSorted((a, b) => new Date(a.start_time).getTime() - new Date(b.start_time).getTime())
}

function balanceCents(memberId: string): number {
  return balanceFixtures.find((entry) => entry.member.id === memberId)?.balance_cents ?? 0
}

function trainerTeams(userId: string) {
  return teamFixtures.filter((team) => team.trainers.some((trainer) => trainer.id === userId))
}

function directorSportIds(userId: string): Set<string> {
  return new Set(
    sportFixtures
      .filter((sport) => sport.directors.some((director) => director.id === userId))
      .map((sport) => sport.id),
  )
}

function teamBalance(team: { trainees: { id: string }[] }): number {
  return team.trainees.reduce((sum, trainee) => sum + balanceCents(trainee.id), 0)
}

function sportRef(id: string): Reference {
  const sport = sportFixtures.find((entry) => entry.id === id)
  return { id, name: sport?.name ?? '' }
}

function dashboardFor(key: TestPersonaKey): Dashboard {
  const user = TEST_PERSONAS[key]

  switch (user.role) {
    case 'member':
      return {
        role: 'trainee',
        balance_cents: balanceCents(user.id),
        next_event: upcomingEvents(user)[0] ?? null,
        upcoming_events: upcomingEvents(user).length,
        recent_feedback: scopeFeedback(feedbackSummaryFixtures, user),
        recent_reports: memberReportSummaries(user.id),
      }

    case 'trainer': {
      const team = trainerTeams(user.id)[0]
      return {
        role: 'trainer',
        team: team ? { id: team.id, name: team.name } : { id: '', name: '' },
        total_members: team ? team.trainees.length : 0,
        upcoming_events: upcomingEvents(user).length,
        recent_feedback: scopeFeedback(feedbackSummaryFixtures, user),
      }
    }

    case 'director': {
      const sportIds = directorSportIds(user.id)
      const firstSportId = [...sportIds][0] ?? ''
      const teams = teamFixtures.filter((team) => team.sport.id === firstSportId)
      const teamSummaries: TeamBalanceSummary[] = teams.map((team) => ({
        team: { id: team.id, name: team.name },
        member_count: team.trainees.length,
        balance_cents: teamBalance(team),
      }))
      return {
        role: 'director',
        sport: sportRef(firstSportId),
        total_teams: teams.length,
        total_members: teams.reduce((sum, t) => sum + t.trainees.length, 0),
        sport_balance_cents: teamSummaries.reduce((sum, t) => sum + t.balance_cents, 0),
        upcoming_events: upcomingEvents(user).length,
        teams: teamSummaries,
      }
    }

    case 'admin':
      return {
        role: 'admin',
        total_members: new Set(teamFixtures.flatMap((team) => team.trainees.map((m) => m.id))).size,
        total_sports: sportFixtures.length,
        total_teams: teamFixtures.length,
        total_directors: new Set(
          sportFixtures.flatMap((sport) => sport.directors.map((d) => d.id)),
        ).size,
        total_trainers: new Set(teamFixtures.flatMap((team) => team.trainers.map((t) => t.id))).size,
        total_balance_cents: balanceFixtures.reduce((sum, b) => sum + b.balance_cents, 0),
        events_this_week: eventSummaryFixtures.filter((event) => {
          const start = new Date(event.start_time).getTime()
          return start >= DASHBOARD_NOW.getTime() && start < DASHBOARD_NOW.getTime() + 7 * 86_400_000
        }).length,
      }
  }
}

export const dashboardFixtures: Record<TestPersonaKey, Dashboard> = {
  member: dashboardFor('member'),
  coach: dashboardFor('coach'),
  director: dashboardFor('director'),
  admin: dashboardFor('admin'),
}

export function dashboardForUser(user: AuthUser): Dashboard {
  const byId = (Object.keys(dashboardFixtures) as TestPersonaKey[]).find(
    (key) => TEST_PERSONAS[key].id === user.id,
  )
  if (byId) return dashboardFixtures[byId]

  const role = user.role
  const byRole = (Object.keys(dashboardFixtures) as TestPersonaKey[]).find(
    (key) => TEST_PERSONAS[key].role === role,
  )
  return dashboardFixtures[byRole ?? 'member']
}
