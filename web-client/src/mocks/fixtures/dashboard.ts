import type { AuthUser, Balance, DashboardAggregate, MemberSummary } from '@/types'
import type { MockPersonaKey } from '../personas'
import { MOCK_PERSONAS } from '../personas'
import { scopeEvents, scopeFeedback } from '../scope'
import { eventSummaryFixtures } from './events'
import { feedbackSummaryFixtures } from './feedback'
import { balanceFixtures } from './finance'
import { memberSummaryFixtures } from './members'
import { sportFixtures, teamFixtures } from './organization'
import { reportTextById } from './report'

// Pre-built dashboard responses, one per persona — the object GET /members/dashboard
// would return. Assembled once at module load from the typed fixtures; the page reads
// these verbatim and derives nothing.

const EMPTY_MEMBER: MemberSummary = { id: '', first_name: '', last_name: '', email: '' }

function personaMember(id: string): MemberSummary {
  return memberSummaryFixtures.find((member) => member.id === id) ?? EMPTY_MEMBER
}

function personaBalance(id: string): Balance {
  return (
    balanceFixtures.find((entry) => entry.member.id === id) ?? {
      member: { id, first_name: '', last_name: '' },
      balance_cents: 0,
    }
  )
}

function dashboardFor(key: MockPersonaKey): DashboardAggregate {
  const user = MOCK_PERSONAS[key]
  const isAdmin = user.role === 'admin'

  return {
    member: personaMember(user.id),
    events: scopeEvents(eventSummaryFixtures, user),
    feedback: scopeFeedback(feedbackSummaryFixtures, user),
    balance: personaBalance(user.id),
    report: reportTextById[user.id] ?? '',
    sports: isAdmin ? sportFixtures : [],
    teams: isAdmin ? teamFixtures : [],
  }
}

export const dashboardFixtures: Record<MockPersonaKey, DashboardAggregate> = {
  member: dashboardFor('member'),
  coach: dashboardFor('coach'),
  director: dashboardFor('director'),
  admin: dashboardFor('admin'),
}

// Pick the pre-built dashboard for the current persona (matched by id, role as fallback).
export function dashboardForUser(user: AuthUser): DashboardAggregate {
  const byId = (Object.keys(dashboardFixtures) as MockPersonaKey[]).find(
    (key) => MOCK_PERSONAS[key].id === user.id,
  )
  if (byId) return dashboardFixtures[byId]

  const byRole = (Object.keys(dashboardFixtures) as MockPersonaKey[]).find(
    (key) => MOCK_PERSONAS[key].role === user.role,
  )
  return dashboardFixtures[byRole ?? 'member']
}
