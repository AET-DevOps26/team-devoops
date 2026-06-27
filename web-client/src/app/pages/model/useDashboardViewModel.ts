import { useMemo } from 'react'

import { useDashboard } from '@/app/pages/api/dashboardQueries'
import { useAuth } from '@/features/auth'
import { formatCents, formatDateShort, formatTime } from '@/lib/format'
import { memberRefName, type Balance, type EventSummary, type FeedbackSummary, type Role, type Sport, type Team } from '@/types'

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

const DASHBOARD_NOW = new Date('2026-06-19T00:00:00Z')

// "Recent" = latest N by created_at, no time window (decision 2026-06-26).
const RECENT_FEEDBACK_COUNT = 3

function shouldShowEvents(role: Role): boolean {
  return role !== 'admin'
}

function shouldShowBalance(role: Role): boolean {
  return role === 'member' || role === 'director'
}

function shouldShowFeedback(role: Role): boolean {
  return role === 'member' || role === 'trainer'
}

function shouldShowSports(role: Role): boolean {
  return role === 'admin'
}

function eventItem(event: EventSummary): DashboardEventItem {
  return {
    id: event.id,
    name: event.name,
    date: formatDateShort(event.start_time),
    time: formatTime(event.start_time),
  }
}

function buildEventsSection(events: EventSummary[]): DashboardEventsSection {
  const upcoming = events
    .filter((event) => new Date(event.start_time) >= DASHBOARD_NOW)
    .toSorted((a, b) => new Date(a.start_time).getTime() - new Date(b.start_time).getTime())

  return {
    upcomingCount: upcoming.length,
    nextEvent: upcoming[0] ? eventItem(upcoming[0]) : undefined,
    items: upcoming.slice(0, 3).map(eventItem),
  }
}

function buildBalanceSection(balance: Balance): DashboardBalanceSection {
  const balanceCents = balance.balance_cents

  return {
    balanceCents,
    balanceFormatted: formatCents(balanceCents),
    status: balanceCents < 0 ? 'overdue' : 'clear',
  }
}

function buildFeedbackSection(
  feedback: FeedbackSummary[],
  events: EventSummary[],
  role: Role,
  memberId: string,
): DashboardFeedbackSection {
  const eventNamesById = new Map(events.map((event) => [event.id, event.name]))
  const scopedFeedback = feedback.filter((entry) =>
    role === 'trainer' ? entry.creator.id === memberId : entry.member.id === memberId,
  )
  const items = scopedFeedback
    .toSorted((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
    .slice(0, RECENT_FEEDBACK_COUNT)
    .map((entry) => ({
      id: entry.id,
      from: memberRefName(entry.creator),
      about: memberRefName(entry.member),
      eventName: eventNamesById.get(entry.event) ?? 'Unknown event',
      date: formatDateShort(entry.created_at),
    }))

  return {
    total: scopedFeedback.length,
    items,
  }
}

function teamSportName(team: Team): string | undefined {
  return team.sport
}

function buildSportsSections(sports: Sport[], teams: Team[]): DashboardSportSection[] {
  const teamsBySport = new Map<string, Team[]>()

  for (const team of teams) {
    const sportName = teamSportName(team)
    if (!sportName) continue

    teamsBySport.set(sportName, [...(teamsBySport.get(sportName) ?? []), team])
  }

  return sports.map((sport) => ({
    name: sport.name,
    description: sport.description,
    directors: sport.directors.map(memberRefName).join(', ') || '--',
    teams: (teamsBySport.get(sport.name) ?? []).map((team) => ({
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

  return useMemo(() => {
    const view: DashboardView = {
      role: user.role,
      userName: user.name,
    }
    const states: DashboardViewModel['states'] = {}
    const data = dashboardQuery.data
    const state: DashboardSectionState = {
      isLoading: dashboardQuery.isLoading,
      error: dashboardQuery.error,
    }

    if (shouldShowEvents(user.role)) {
      view.myEvents = buildEventsSection(data?.events ?? [])
      states.myEvents = state
    }

    if (shouldShowBalance(user.role) && data?.balance) {
      view.myBalance = buildBalanceSection(data.balance)
      states.myBalance = state
    } else if (shouldShowBalance(user.role)) {
      states.myBalance = state
    }

    if (shouldShowFeedback(user.role)) {
      view.myFeedback = buildFeedbackSection(
        data?.feedback ?? [],
        data?.events ?? [],
        user.role,
        user.id,
      )
      states.myFeedback = state
    }

    if (shouldShowSports(user.role)) {
      view.adminCounts = buildAdminCounts(data?.sports ?? [], data?.teams ?? [])
      view.sports = buildSportsSections(data?.sports ?? [], data?.teams ?? [])
      states.adminCounts = state
      states.sports = state
    }

    return { view, states }
  }, [
    dashboardQuery.data,
    dashboardQuery.error,
    dashboardQuery.isLoading,
    user.id,
    user.name,
    user.role,
  ])
}
