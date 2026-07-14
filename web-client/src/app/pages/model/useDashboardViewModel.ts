import { useMemo } from 'react'

import { useDashboard } from '@/app/pages/api/dashboardQueries'
import { useAuth } from '@/features/auth'
import { useSportsList, useTeamsList } from '@/features/organization/api/queries'
import { useEventsList } from '@/features/sport-events/api/queries'
import { formatCents, formatDateShort, formatTime } from '@/lib/format'
import {
  creatorName,
  memberRefName,
  type AdminDashboard,
  type Dashboard,
  type DirectorDashboard,
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
  totalMembers: number
  totalSports: number
  totalTeams: number
  directors: number
  trainers: number
  totalBalanceFormatted: string
  eventsThisWeek: number
}

export interface DashboardSportDistributionItem {
  id: string
  sportName: string
  teamCount: number
  memberCount: number
  trainerCount: number
  memberSharePercentage: number
  membersPerTeam: number
}

export interface DashboardRoleAssignmentItem {
  label: string
  value: number
  percentage: number
}

export interface DashboardSportHighlight {
  sportName: string
  memberCount: number
  teamCount: number
  membersPerTeam: number
}

export interface DashboardAdminOrganizationSection {
  sportDistribution: DashboardSportDistributionItem[]
  hiddenSports: number
  averageTeamsPerSport: number
  averageMembersPerTeam: number
  busiestSport?: DashboardSportHighlight
  totalRoleAssignments: number
  roleAssignments: DashboardRoleAssignmentItem[]
  totalDistributedMembers: number
}

export interface DashboardDirectorTeam {
  id: string
  name: string
  memberCount: number
  balanceFormatted: string
}

export interface DashboardDirectorSportSection {
  sportName: string
  totalTeams: number
  totalMembers: number
  sportBalanceFormatted: string
  teams: DashboardDirectorTeam[]
  hiddenTeams: number
}

export interface DashboardView {
  role: Role
  userName: string
  myEvents?: DashboardEventsSection
  myBalance?: DashboardBalanceSection
  myFeedback?: DashboardFeedbackSection
  myTeam?: DashboardTeamSection
  mySport?: DashboardDirectorSportSection
  adminCounts?: DashboardAdminCountsSection
  adminOrganization?: DashboardAdminOrganizationSection
}

export interface DashboardSectionState {
  isLoading: boolean
  error: Error | null
  refetch: () => void
}

export interface DashboardViewModel {
  view: DashboardView
  states: {
    myEvents?: DashboardSectionState
    myBalance?: DashboardSectionState
    myTeam?: DashboardSectionState
    mySport?: DashboardSectionState
    myFeedback?: DashboardSectionState
    adminCounts?: DashboardSectionState
    adminOrganization?: DashboardSectionState
  }
  // Set only when the root dashboard call itself failed (not a dependent query like
  // events/sports/teams) — every section state above traces back to this same failure,
  // so the page renders one error instead of one per section.
  rootError: Error | null
  rootRefetch: () => void
}

const RECENT_FEEDBACK_COUNT = 3
const DIRECTOR_TEAM_PREVIEW_COUNT = 5
const ADMIN_SPORT_PREVIEW_COUNT = 5

function eventItem(event: EventSummary): DashboardEventItem {
  return {
    id: event.id,
    name: event.name,
    date: formatDateShort(event.start_time),
    time: formatTime(event.start_time),
  }
}

// The dashboard envelope gives only a COUNT of upcoming events (+ a single next_event for
// trainees), never an array - so the 3-event preview list is sourced separately from the
// server-scoped events query.
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

function hasEventsContent(events: DashboardEventsSection): boolean {
  return Boolean(events.nextEvent) || events.upcomingCount > 0 || events.items.length > 0
}

function hasFeedbackContent(feedback: DashboardFeedbackSection): boolean {
  return feedback.total > 0 || feedback.items.length > 0
}

export function buildDirectorSportSection(
  dashboard: DirectorDashboard,
): DashboardDirectorSportSection {
  const teams = dashboard.teams.slice(0, DIRECTOR_TEAM_PREVIEW_COUNT)

  return {
    sportName: dashboard.sport.name,
    totalTeams: dashboard.total_teams,
    totalMembers: dashboard.total_members,
    sportBalanceFormatted: formatCents(dashboard.sport_balance_cents),
    teams: teams.map((entry) => ({
      id: entry.team.id,
      name: entry.team.name,
      memberCount: entry.member_count,
      balanceFormatted: formatCents(entry.balance_cents),
    })),
    hiddenTeams: Math.max(0, dashboard.total_teams - teams.length),
  }
}

export function buildAdminCounts(
  dashboard: AdminDashboard,
): DashboardAdminCountsSection {
  return {
    totalMembers: dashboard.total_members,
    totalSports: dashboard.total_sports,
    totalTeams: dashboard.total_teams,
    directors: dashboard.total_directors,
    trainers: dashboard.total_trainers,
    totalBalanceFormatted: formatCents(dashboard.total_balance_cents),
    eventsThisWeek: dashboard.events_this_week,
  }
}

export function buildAdminOrganizationSection(
  dashboard: AdminDashboard,
  sports: Sport[],
  teams: Team[],
): DashboardAdminOrganizationSection {
  const distribution = sports
    .map((sport) => {
      const sportTeams = teams.filter((team) => team.sport.id === sport.id)
      const memberIds = new Set<string>()
      const trainerIds = new Set<string>()

      sportTeams.forEach((team) => {
        team.trainees.forEach((member) => memberIds.add(member.id))
        team.trainers.forEach((trainer) => trainerIds.add(trainer.id))
      })

      return {
        id: sport.id,
        sportName: sport.name,
        teamCount: sportTeams.length,
        memberCount: memberIds.size,
        trainerCount: trainerIds.size,
        membersPerTeam: sportTeams.length === 0 ? 0 : memberIds.size / sportTeams.length,
      }
    })
    .toSorted((a, b) => {
      if (b.memberCount !== a.memberCount) return b.memberCount - a.memberCount
      return a.sportName.localeCompare(b.sportName)
    })

  const totalDistributedMembers = Math.max(
    1,
    distribution.reduce((sum, item) => sum + item.memberCount, 0),
  )
  const sportDistribution = distribution
    .slice(0, ADMIN_SPORT_PREVIEW_COUNT)
    .map((item) => ({
      ...item,
      memberSharePercentage: Math.round((item.memberCount / totalDistributedMembers) * 100),
    }))

  const totalTeamMemberships = teams.reduce((sum, team) => sum + team.trainees.length, 0)
  const roleTotal = dashboard.total_directors + dashboard.total_trainers
  const roleAssignments = [
    { label: 'Directors', value: dashboard.total_directors },
    { label: 'Coaches', value: dashboard.total_trainers },
  ].map((item) => ({
    ...item,
    percentage: roleTotal === 0 ? 0 : Math.round((item.value / roleTotal) * 100),
  }))
  const busiestSport = distribution[0]

  return {
    sportDistribution,
    hiddenSports: Math.max(0, distribution.length - sportDistribution.length),
    averageTeamsPerSport: sports.length === 0 ? 0 : teams.length / sports.length,
    averageMembersPerTeam: teams.length === 0 ? 0 : totalTeamMemberships / teams.length,
    busiestSport: busiestSport
      ? {
          sportName: busiestSport.sportName,
          memberCount: busiestSport.memberCount,
          teamCount: busiestSport.teamCount,
          membersPerTeam: busiestSport.membersPerTeam,
        }
      : undefined,
    totalRoleAssignments: roleTotal,
    roleAssignments,
    totalDistributedMembers,
  }
}

export function useDashboardViewModel(): DashboardViewModel {
  const { user } = useAuth()
  const dashboardQuery = useDashboard()
  const data = dashboardQuery.data

  // The dashboard payload carries only an upcoming-events count, so the preview list for the
  // trainee/trainer/director branches comes from the server-scoped events query.
  const isNonAdmin = !!data && data.role !== 'admin'
  const eventsQuery = useEventsList(isNonAdmin)
  const shouldLoadOrganizationInsights = data ? data.role === 'admin' : user.role === 'admin'
  const sportsQuery = useSportsList(shouldLoadOrganizationInsights)
  const teamsQuery = useTeamsList(shouldLoadOrganizationInsights)
  const dashboardRefetch = dashboardQuery.refetch
  const eventsRefetch = eventsQuery.refetch
  const sportsRefetch = sportsQuery.refetch
  const teamsRefetch = teamsQuery.refetch

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
      refetch: () => void dashboardRefetch(),
    }

    fillSections(view, states, data, state, {
      events: eventsQuery.data ?? [],
      eventsState: {
        isLoading: dashboardQuery.isLoading || eventsQuery.isLoading,
        error: dashboardQuery.error ?? eventsQuery.error,
        refetch: () => {
          void dashboardRefetch()
          void eventsRefetch()
        },
      },
      sports: sportsQuery.data ?? [],
      teams: teamsQuery.data ?? [],
      organizationState: {
        isLoading: dashboardQuery.isLoading || sportsQuery.isLoading || teamsQuery.isLoading,
        error: dashboardQuery.error ?? sportsQuery.error ?? teamsQuery.error,
        refetch: () => {
          void dashboardRefetch()
          void sportsRefetch()
          void teamsRefetch()
        },
      },
    })

    return {
      view,
      states,
      rootError: dashboardQuery.error,
      rootRefetch: () => void dashboardRefetch(),
    }
  }, [
    data,
    dashboardRefetch,
    dashboardQuery.error,
    dashboardQuery.isLoading,
    eventsRefetch,
    eventsQuery.data,
    eventsQuery.error,
    eventsQuery.isLoading,
    sportsRefetch,
    sportsQuery.data,
    sportsQuery.error,
    sportsQuery.isLoading,
    teamsRefetch,
    teamsQuery.data,
    teamsQuery.error,
    teamsQuery.isLoading,
    user.name,
    role,
  ])
}

interface OrgData {
  events: EventSummary[]
  eventsState: DashboardSectionState
  sports: Sport[]
  teams: Team[]
  organizationState: DashboardSectionState
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
      states.adminCounts = state
    } else {
      if (shouldShowBalance(view.role)) {
        states.myBalance = state
      }
      if (view.role === 'trainer') {
        states.myTeam = state
      }
      if (view.role === 'director') {
        states.mySport = state
      }
      states.myEvents = state
    }
    return
  }

  switch (data.role) {
    case 'trainee': {
      const events = buildEventsSection(data.upcoming_events, data.next_event, org.events)
      const feedback = buildFeedbackSection(data.recent_feedback)

      // Always shown: a zero balance is the "settled up" state (status: 'clear'), not an
      // empty section, so it must not be gated on the amount being non-zero.
      view.myBalance = buildBalanceSection(data.balance_cents)
      if (hasEventsContent(events)) {
        view.myEvents = events
      }
      if (hasFeedbackContent(feedback)) {
        view.myFeedback = feedback
      }
      states.myBalance = state
      states.myEvents = org.eventsState
      states.myFeedback = state
      break
    }

    case 'trainer': {
      const events = buildEventsSection(data.upcoming_events, null, org.events)
      const feedback = buildFeedbackSection(data.recent_feedback)

      view.myTeam = {
        teamName: data.team.name,
        totalMembers: data.total_members,
      }
      if (hasEventsContent(events)) {
        view.myEvents = events
      }
      if (hasFeedbackContent(feedback)) {
        view.myFeedback = feedback
      }
      states.myTeam = state
      states.myEvents = org.eventsState
      states.myFeedback = state
      break
    }

    case 'director': {
      const events = buildEventsSection(data.upcoming_events, null, org.events)

      view.mySport = buildDirectorSportSection(data)
      if (hasEventsContent(events)) {
        view.myEvents = events
      }
      states.mySport = state
      states.myEvents = org.eventsState
      break
    }

    case 'admin':
      view.adminCounts = buildAdminCounts(data)
      view.adminOrganization = buildAdminOrganizationSection(data, org.sports, org.teams)
      states.adminCounts = state
      states.adminOrganization = org.organizationState
      break
  }
}
