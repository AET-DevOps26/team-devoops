import { useMemo } from 'react'

import { useAuth } from '@/features/auth'
import { useTeamsList } from '@/features/organization/api/queries'
import { formatDateTime, formatDuration } from '@/lib/format'
import type { AuthUser, Team } from '@/types'
import type { EventSummary, SportEvent } from '../types'
import { useEvent, useEventsList } from '../api/queries'
import type { EventsFilters } from './eventsUiStore'
import { useEventsUiStore } from './eventsUiStore'

export type EventStatus = 'attended' | 'missed' | 'upcoming' | 'past'
type AttendanceUser = Pick<AuthUser, 'id'> & {
  teamIds?: ReadonlySet<string>
}

export interface EventRow extends EventSummary {
  status: EventStatus
  formattedWhen: string
  duration: string
}

export interface EventsView {
  rows: EventRow[]
  totalRows: number
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
  isLoading: boolean
  error: Error | null
}

export function eventAttendanceStatus(
  event: EventSummary | SportEvent,
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
  summaries: EventSummary[],
  now: Date,
  user: AttendanceUser,
  filters: EventsFilters = {
    search: '',
    status: 'all',
    fromDate: '',
    toDate: '',
    sort: 'date-asc',
  },
): EventsView {
  const weekEnd = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000)
  const rows = summaries.map((event) => {
      const status = eventAttendanceStatus(event, user, now)

      return {
        ...event,
        status,
        formattedWhen: formatDateTime(event.start_time),
        duration: formatDuration(event.start_time, event.end_time),
      }
    })
  const search = filters.search.trim().toLocaleLowerCase()
  const fromTime = filters.fromDate ? new Date(`${filters.fromDate}T00:00:00`).getTime() : null
  const toTime = filters.toDate ? new Date(`${filters.toDate}T23:59:59.999`).getTime() : null
  const filteredRows = rows
    .filter((event) => {
      const eventTime = new Date(event.start_time).getTime()
      const matchesText = search.length === 0 || event.name.toLocaleLowerCase().includes(search)
      const matchesStatus = filters.status === 'all' || event.status === filters.status

      return (
        matchesText &&
        matchesStatus &&
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
      buildEventsView(eventsQuery.data ?? [], new Date(nowTime), {
        id: user.id,
        teamIds: userTeamIds(teamsQuery.data ?? [], user.id),
      }, filters),
    [eventsQuery.data, nowTime, teamsQuery.data, user.id, filters],
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
  const detail = eventQuery.data
  const status = detail
    ? eventAttendanceStatus(
        detail,
        {
          id: user.id,
          teamIds: userTeamIds(teamsQuery.data ?? [], user.id),
        },
        now,
      )
    : undefined
  const missed = status === 'missed'

  return {
    detail,
    status,
    missed,
    isLoading: eventQuery.isLoading || teamsQuery.isLoading,
    error: eventQuery.error ?? teamsQuery.error,
  }
}
