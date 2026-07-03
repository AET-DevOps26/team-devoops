import { useMemo } from 'react'

import { useDashboard } from '@/app/pages/api/dashboardQueries'
import { useAuth } from '@/features/auth'
import { useSportsList, useTeamsList } from '@/features/organization/api/queries'
import { useEventsList } from '@/features/sport-events/api/queries'
import { formatCents, formatDateShort, formatTime } from '@/lib/format'
import {
  creatorName,
  memberRefName,
  type Dashboard,
  type EventSummary,
  type FeedbackSummary,
  type Role,
  type Sport,
  type Team,
} from '@/types'

export interface DashboardEventItem {
  id: string
  name: string
  date: string
  time: string
}

export interface DashboardEventsSection {
  upcomingCount: number
  nextEvent?: DashboardEventItem
  items: DashboardEventItem[]
}

export interface DashboardBalanceSection {
  balanceCents: number
  balanceFormatted: string
  status: 'clear' | 'overdue'
}

export interface DashboardFeedbackItem {
  id: string
  from: string
  about: string
  eventName: string
  date: string
}

export interface DashboardFeedbackSection {
  total: number
  items: DashboardFeedbackItem[]
}

export interface DashboardTeamSection {
  teamName: string
  totalMembers: number
}

export interface DashboardAdminCountsSection {
  totalTeams: number
  directors: number
  trainers: number
}

export interface DashboardSportTeam {
  id: string
  name: string
  trainers: string
  members: number
}

export interface DashboardSportSection {
  name: string
  description: string
  directors: string
  teams: DashboardSportTeam[]
}

export interface DashboardView {
  role: Role
  userName: string
  myEvents?: DashboardEventsSection
  myBalance?: DashboardBalanceSection
  myFeedback?: DashboardFeedbackSection
  myTeam?: DashboardTeamSection
  adminCounts?: DashboardAdminCountsSection
  sports?: DashboardSportSection[]
}

export interface DashboardSectionState {
  isLoading: boolean
  error: Error | null
}

export interface DashboardViewModel {
  view: DashboardView
  states: {
    myEvents?: DashboardSectionState
    myBalance?: DashboardSectionState
    myFeedback?: DashboardSectionState
    adminCounts?: DashboardSectionState
    sports?: DashboardSectionState
  }
}

// "Recent" = latest N by created_at, no time window (decision 2026-06-26).
const RECENT_FEEDBACK_COUNT = 3

function eventItem(event: EventSummary): DashboardEventItem {
  return {
    id: event.id,
    name: event.name,
    date: formatDateShort(event.start_time),
    time: formatTime(event.start_time),
  }
}

// The dashboard envelope gives only a COUNT of upcoming events (+ a single next_event for
// trainees), never an array — so the 3-event preview list is sourced separately from the
// server-scoped events query (Option A), mirroring how the admin branch pulls /sports + /teams.
function buildEventsSection(
  upcomingCount: number,
  next: EventSummary | null,
  preview: EventSummary[],
): DashboardEventsSection {
  const now = new Date()
  const sorted = preview
    .filter((event) => new Date(event.start_time).getTime() >= now.getTime())
    .toSorted(
      (a, b) => new Date(a.start_time).getTime() - new Date(b.start_time).getTime(),
    )
  const nextEvent =
    next && new Date(next.start_time).getTime() >= now.getTime()
      ? next
      : sorted[0] ?? null

  return {
    upcomingCount,
    nextEvent: nextEvent ? eventItem(nextEvent) : undefined,
    items: sorted.slice(0, 3).map(eventItem),
  }
}

function buildBalanceSection(balanceCents: number): DashboardBalanceSection {
  return {
    balanceCents,
    balanceFormatted: formatCents(balanceCents),
    status: balanceCents < 0 ? 'overdue' : 'clear',
  }
}

function shouldShowBalance(role: Role): boolean {
  return role === 'member'
}

// recent_feedback arrives already scoped to the caller; render the latest N by created_at.
function buildFeedbackSection(feedback: FeedbackSummary[]): DashboardFeedbackSection {
  const items = feedback
    .toSorted((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
    .slice(0, RECENT_FEEDBACK_COUNT)
    .map((entry) => ({
      id: entry.id,
      from: creatorName(entry.creator),
      about: memberRefName(entry.member),
      eventName: entry.event.name,
      date: formatDateShort(entry.created_at),
    }))

  return {
    total: feedback.length,
    items,
  }
}

function buildSportsSections(sports: Sport[], teams: Team[]): DashboardSportSection[] {
  const teamsBySport = new Map<string, Team[]>()

  for (const team of teams) {
    const sportId = team.sport.id
    if (!sportId) continue

    teamsBySport.set(sportId, [...(teamsBySport.get(sportId) ?? []), team])
  }

  return sports.map((sport) => ({
    name: sport.name,
    description: sport.description,
    directors: sport.directors.map(memberRefName).join(', ') || '--',
    teams: (teamsBySport.get(sport.id) ?? []).map((team) => ({
      id: team.id,
      name: team.name,
      trainers: team.trainers.map(memberRefName).join(', ') || '--',
      members: team.trainees.length,
    })),
  }))
}

function buildAdminCounts(sports: Sport[], teams: Team[]): DashboardAdminCountsSection {
  return {
    totalTeams: teams.length,
    directors: new Set(sports.flatMap((sport) => sport.directors.map((director) => director.id))).size,
    trainers: new Set(teams.flatMap((team) => team.trainers.map((trainer) => trainer.id))).size,
  }
}

export function useDashboardViewModel(): DashboardViewModel {
  const { user } = useAuth()
  const dashboardQuery = useDashboard()
  const data = dashboardQuery.data

  // The admin envelope is counts-only; the sports-with-teams breakdown comes from the real
  // organization queries (§9.3). Fetch only when the caller is an admin.
  const isAdmin = data?.role === 'admin'
  const sportsQuery = useSportsList(isAdmin)
  const teamsQuery = useTeamsList(isAdmin)

  // The dashboard payload carries only an upcoming-events count, so the preview list for the
  // trainee/trainer/director branches comes from the server-scoped events query (Option A).
  const isNonAdmin = !!data && data.role !== 'admin'
  const eventsQuery = useEventsList(isNonAdmin)

  const role = user.role

  return useMemo(() => {
    const view: DashboardView = {
      role,
      userName: user.name,
    }
    const states: DashboardViewModel['states'] = {}
    const state: DashboardSectionState = {
      isLoading: dashboardQuery.isLoading,
      error: dashboardQuery.error,
    }

    fillSections(view, states, data, state, {
      sports: sportsQuery.data ?? [],
      teams: teamsQuery.data ?? [],
      orgState: {
        isLoading: dashboardQuery.isLoading || sportsQuery.isLoading || teamsQuery.isLoading,
        error: dashboardQuery.error ?? sportsQuery.error ?? teamsQuery.error,
      },
      events: eventsQuery.data ?? [],
      eventsState: {
        isLoading: dashboardQuery.isLoading || eventsQuery.isLoading,
        error: dashboardQuery.error ?? eventsQuery.error,
      },
    })

    return { view, states }
  }, [
    data,
    dashboardQuery.error,
    dashboardQuery.isLoading,
    sportsQuery.data,
    sportsQuery.error,
    sportsQuery.isLoading,
    teamsQuery.data,
    teamsQuery.error,
    teamsQuery.isLoading,
    eventsQuery.data,
    eventsQuery.error,
    eventsQuery.isLoading,
    user.name,
    role,
  ])
}

interface OrgData {
  sports: Sport[]
  teams: Team[]
  orgState: DashboardSectionState
  events: EventSummary[]
  eventsState: DashboardSectionState
}

// The envelope's `role` is authoritative for which sections show — not the token role.
function fillSections(
  view: DashboardView,
  states: DashboardViewModel['states'],
  data: Dashboard | undefined,
  state: DashboardSectionState,
  org: OrgData,
): void {
  if (!data) {
    // Still loading/errored: wire the sections the token role expects so skeletons render.
    if (view.role === 'admin') {
      states.adminCounts = org.orgState
      states.sports = org.orgState
    } else {
      if (shouldShowBalance(view.role)) {
        states.myBalance = state
      }
      states.myEvents = state
    }
    return
  }

  switch (data.role) {
    case 'trainee':
      view.myBalance = buildBalanceSection(data.balance_cents)
      view.myEvents = buildEventsSection(data.upcoming_events, data.next_event, org.events)
      view.myFeedback = buildFeedbackSection(data.recent_feedback)
      states.myBalance = state
      states.myEvents = org.eventsState
      states.myFeedback = state
      break

    case 'trainer':
      view.myTeam = {
        teamName: data.team.name,
        totalMembers: data.total_members,
      }
      view.myEvents = buildEventsSection(data.upcoming_events, null, org.events)
      view.myFeedback = buildFeedbackSection(data.recent_feedback)
      states.myEvents = org.eventsState
      states.myFeedback = state
      break

    case 'director':
      view.myEvents = buildEventsSection(data.upcoming_events, null, org.events)
      states.myEvents = org.eventsState
      break

    case 'admin':
      view.adminCounts = buildAdminCounts(org.sports, org.teams)
      view.sports = buildSportsSections(org.sports, org.teams)
      states.adminCounts = org.orgState
      states.sports = org.orgState
      break
  }
}
