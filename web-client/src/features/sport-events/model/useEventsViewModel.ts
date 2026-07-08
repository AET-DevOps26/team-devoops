import { useMemo } from 'react'

import { useAuth } from '@/features/auth'
import { useSportsList, useTeamsList } from '@/features/organization/api/queries'
import { buildEventSportNamesById } from '@/lib/event-sports'
import { formatDateTime, formatDuration } from '@/lib/format'
import type { AuthUser, EventListItem, Team } from '@/types'
import type { SportEvent } from '../types'
import { useEvent, useEventsList } from '../api/queries'
import type { EventsFilters } from './eventsUiStore'
import { useEventsUiStore } from './eventsUiStore'

export type EventStatus = 'attended' | 'missed' | 'upcoming' | 'past'
type TimelineEventStatus = Extract<EventStatus, 'upcoming' | 'past'>
type AttendanceUser = Pick<AuthUser, 'id'> & {
  teamIds?: ReadonlySet<string>
}
type EventsViewUser = AttendanceUser & Pick<AuthUser, 'role'>

export interface EventRow extends EventListItem {
  status: EventStatus
  formattedWhen: string
  duration: string
  sportNames: string[]
}

export interface EventsView {
  rows: EventRow[]
  totalRows: number
  sportOptions: { value: string; label: string }[]
  stats: {
    upcoming: number
    thisWeek: number
    total: number
  }
  missedCount?: number
}

export interface EventDetailView {
  detail: SportEvent | undefined
  status: EventStatus | undefined
  missed: boolean
  // sports_linked resolved to display names for the detail view.
  sportNames: string[]
  isLoading: boolean
  error: Error | null
}

export function eventAttendanceStatus(
  event: EventListItem | SportEvent,
  user: AttendanceUser,
  now: Date,
): EventStatus {
  if (new Date(event.start_time) >= now) {
    return 'upcoming'
  }

  if (event.attendees?.some((attendee) => attendee.id === user.id)) {
    return 'attended'
  }

  const hasLinkedTeams = event.teams_linked !== undefined
  const hasAttendees = event.attendees !== undefined
  const isEnrolled =
    hasLinkedTeams && event.teams_linked?.some((team) => user.teamIds?.has(team.id)) === true

  if (isEnrolled && hasAttendees) {
    return 'missed'
  }

  return 'past'
}

function eventTimelineStatus(event: EventListItem | SportEvent, now: Date): TimelineEventStatus {
  return new Date(event.start_time) >= now ? 'upcoming' : 'past'
}

export function eventStatusForRole(
  event: EventListItem | SportEvent,
  user: EventsViewUser,
  now: Date,
): EventStatus {
  return user.role === 'member'
    ? eventAttendanceStatus(event, user, now)
    : eventTimelineStatus(event, now)
}

export function userTeamIds(teams: Team[], userId: string): ReadonlySet<string> {
  return new Set(
    teams
      .filter(
        (team) =>
          team.trainees.some((trainee) => trainee.id === userId) ||
          team.trainers.some((trainer) => trainer.id === userId),
      )
      .map((team) => team.id),
  )
}

export function buildEventsView(
  summaries: EventListItem[],
  now: Date,
  user: EventsViewUser,
  teams: Team[] = [],
  filters: EventsFilters = {
    search: '',
    status: 'all',
    sport: 'all',
    fromDate: '',
    toDate: '',
    sort: 'date-asc',
  },
): EventsView {
  const weekEnd = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000)
  const sportNamesByEventId = buildEventSportNamesById(summaries, teams)
  const rows = summaries.map((event) => {
    const status = eventStatusForRole(event, user, now)

    return {
      ...event,
      status,
      formattedWhen: formatDateTime(event.start_time),
      duration: formatDuration(event.start_time, event.end_time),
      sportNames: sportNamesByEventId.get(event.id) ?? [],
    }
  })
  const sportOptions = Array.from(new Set(rows.flatMap((event) => event.sportNames)), (sport) => ({
    value: sport,
    label: sport,
  })).toSorted((a, b) => a.label.localeCompare(b.label))
  const search = filters.search.trim().toLocaleLowerCase()
  const statusFilter =
    user.role === 'member' || (filters.status !== 'attended' && filters.status !== 'missed')
      ? filters.status
      : 'all'
  const fromTime = filters.fromDate ? new Date(`${filters.fromDate}T00:00:00`).getTime() : null
  const toTime = filters.toDate ? new Date(`${filters.toDate}T23:59:59.999`).getTime() : null
  const filteredRows = rows
    .filter((event) => {
      const eventTime = new Date(event.start_time).getTime()
      const matchesText =
        search.length === 0 ||
        event.name.toLocaleLowerCase().includes(search) ||
        event.sportNames.some((sport) => sport.toLocaleLowerCase().includes(search))
      const matchesStatus = statusFilter === 'all' || event.status === statusFilter
      const matchesSport = filters.sport === 'all' || event.sportNames.includes(filters.sport)

      return (
        matchesText &&
        matchesStatus &&
        matchesSport &&
        (fromTime === null || eventTime >= fromTime) &&
        (toTime === null || eventTime <= toTime)
      )
    })
    .toSorted((a, b) => {
      if (filters.sort === 'duration-asc' || filters.sort === 'duration-desc') {
        const aDuration = new Date(a.end_time).getTime() - new Date(a.start_time).getTime()
        const bDuration = new Date(b.end_time).getTime() - new Date(b.start_time).getTime()

        return filters.sort === 'duration-asc' ? aDuration - bDuration : bDuration - aDuration
      }

      const aStart = new Date(a.start_time).getTime()
      const bStart = new Date(b.start_time).getTime()

      return filters.sort === 'date-desc' ? bStart - aStart : aStart - bStart
    })
  const upcoming = rows.filter((event) => event.status === 'upcoming')
  const thisWeek = upcoming.filter((event) => new Date(event.start_time) < weekEnd)

  return {
    rows: filteredRows,
    totalRows: rows.length,
    sportOptions,
    stats: {
      upcoming: upcoming.length,
      thisWeek: thisWeek.length,
      total: summaries.length,
    },
  }
}

export function useEventsViewModel(now = new Date()) {
  const { user } = useAuth()
  const eventsQuery = useEventsList()
  const teamsQuery = useTeamsList()
  const filters = useEventsUiStore((state) => state.filters)
  const nowTime = now.getTime()

  const view = useMemo(
    () =>
      buildEventsView(
        eventsQuery.data ?? [],
        new Date(nowTime),
        {
          id: user.id,
          role: user.role,
          teamIds: userTeamIds(teamsQuery.data ?? [], user.id),
        },
        teamsQuery.data ?? [],
        filters,
      ),
    [eventsQuery.data, nowTime, teamsQuery.data, user.id, user.role, filters],
  )

  return {
    view,
    isLoading: eventsQuery.isLoading || teamsQuery.isLoading,
    error: eventsQuery.error ?? teamsQuery.error,
  }
}

export function useEventDetailView(id: string | null, now = new Date()): EventDetailView {
  const { user } = useAuth()
  const eventQuery = useEvent(id)
  const teamsQuery = useTeamsList()
  const sportsQuery = useSportsList()
  const detail = eventQuery.data
  const status = detail
    ? eventStatusForRole(
        detail,
        {
          id: user.id,
          role: user.role,
          teamIds: userTeamIds(teamsQuery.data ?? [], user.id),
        },
        now,
      )
    : undefined
  const missed = status === 'missed'
  // sports_linked are resolved refs { id, name }; fall back to the sports list if a name is missing.
  const sportNamesById = new Map((sportsQuery.data ?? []).map((sport) => [sport.id, sport.name]))
  const sportNames = (detail?.sports_linked ?? []).map(
    (sport) => sport.name || sportNamesById.get(sport.id) || sport.id,
  )

  return {
    detail,
    status,
    missed,
    sportNames,
    isLoading: eventQuery.isLoading || teamsQuery.isLoading,
    error: eventQuery.error ?? teamsQuery.error,
  }
}
