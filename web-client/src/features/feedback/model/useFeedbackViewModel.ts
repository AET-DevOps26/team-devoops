import { useMemo } from 'react'

import { useAuth } from '@/features/auth'
import { useMembers } from '@/features/members/api/queries'
import { buildComposableMemberIds } from '@/features/members/model/useMembersViewModel'
import { useSportsList, useTeamsList } from '@/features/organization/api/queries'
import { useEventsList } from '@/features/sport-events/api/queries'
import { formatDateShort, formatDateTime } from '@/lib/format'
import {
  type AuthUser,
  creatorName,
  type EventListItem,
  memberRefName,
  type MemberSummary,
  type Sport,
  type Team,
} from '@/types'
import { useFeedback, useFeedbackList } from '../api/queries'
import type { Feedback, FeedbackSummary } from '../types'
import type { FeedbackFilters, FeedbackRatingFilter } from './feedbackUiStore'
import { useFeedbackUiStore } from './feedbackUiStore'

export interface FeedbackRow {
  id: string
  eventId: string
  coachId: string
  creatorId: string | null
  memberName: string
  creatorName: string
  eventName: string
  createdAt: string
  rating: number
}

export interface FeedbackCoverageTrainee {
  id: string
  name: string
}

export interface FeedbackCoverageEvent {
  id: string
  name: string
  formattedWhen: string
  missing: FeedbackCoverageTrainee[]
}

export interface FeedbackCoverageTeam {
  id: string
  name: string
  events: FeedbackCoverageEvent[]
}

export interface FeedbackCoverageSport {
  name: string
  teams: FeedbackCoverageTeam[]
}

export interface FeedbackCoverage {
  coveredCount: number
  totalCount: number
  sports: FeedbackCoverageSport[]
}

export interface FeedbackView {
  rows: FeedbackRow[]
  totalRows: number
  eventOptions: { value: string; label: string }[]
  coachOptions: { value: string; label: string }[]
  stats: {
    total: number
    avgRatingLabel: string
    latestLabel: string
  }
  coverage: FeedbackCoverage | null
}

export interface FeedbackDetailView {
  detail: Feedback | undefined
  eventName: string | undefined
  memberName: string | undefined
  creatorName: string | undefined
  rating: number | undefined
  isLoading: boolean
  // rating is undefined only while detail is unloaded; every loaded feedback has one.
  error: Error | null
}

function includesSearch(value: string, search: string): boolean {
  return value.toLocaleLowerCase().includes(search)
}

function matchesRating(rating: number, filter: FeedbackRatingFilter): boolean {
  if (filter === 'all') return true
  if (filter === 'high') return rating >= 7
  if (filter === 'medium') return rating >= 4 && rating <= 6
  return rating <= 3
}

export function filterFeedbackRows(
  rows: FeedbackRow[],
  filters: FeedbackFilters,
): FeedbackRow[] {
  const search = filters.search.trim().toLocaleLowerCase()
  const fromTime = filters.fromDate ? new Date(`${filters.fromDate}T00:00:00`).getTime() : null
  const toTime = filters.toDate ? new Date(`${filters.toDate}T23:59:59.999`).getTime() : null

  return rows.filter((feedback) => {
    const feedbackTime = new Date(feedback.createdAt).getTime()
    const matchesText =
      search.length === 0 ||
      includesSearch(feedback.memberName, search) ||
      includesSearch(feedback.creatorName, search) ||
      includesSearch(feedback.eventName, search)

    return (
      matchesText &&
      matchesRating(feedback.rating, filters.rating) &&
      (filters.eventId === 'all' || feedback.eventId === filters.eventId) &&
      (filters.coachId === 'all' || feedback.coachId === filters.coachId) &&
      (fromTime === null || feedbackTime >= fromTime) &&
      (toTime === null || feedbackTime <= toTime)
    )
  })
}

function sortFeedbackRows(rows: FeedbackRow[], sort: FeedbackFilters['sort']): FeedbackRow[] {
  return rows.toSorted((a, b) => {
    if (sort === 'date-asc') {
      return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
    }
    if (sort === 'event-asc') {
      return a.eventName.localeCompare(b.eventName)
    }
    if (sort === 'event-desc') {
      return b.eventName.localeCompare(a.eventName)
    }
    if (sort === 'rating-desc') {
      return b.rating - a.rating
    }
    if (sort === 'rating-asc') {
      return a.rating - b.rating
    }

    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  })
}

function buildFeedbackCoverage(
  summaries: FeedbackSummary[],
  members: MemberSummary[],
  teams: Team[],
  sports: Sport[],
  events: EventListItem[],
  user: AuthUser,
): FeedbackCoverage | null {
  if (user.role !== 'trainer') return null

  const composableMemberIds = buildComposableMemberIds(members, teams, user)
  if (composableMemberIds.size === 0) return null

  const membersById = new Map(members.map((member) => [member.id, member]))
  const traineeName = (id: string) => {
    const member = membersById.get(id)
    return member ? `${member.first_name} ${member.last_name}` : id
  }

  // Feedback already given by this coach, keyed by `${eventId}:${memberId}`.
  const covered = new Set(
    summaries
      .filter((feedback) => feedback.creator?.id === user.id)
      .map((feedback) => `${feedback.event.id}:${feedback.member?.id ?? ''}`),
  )

  const coachedTeams = teams.filter((team) => team.trainers.some((t) => t.id === user.id))
  const teamsBySportId = new Map<string, Team[]>()
  for (const team of coachedTeams) {
    const sportTeams = teamsBySportId.get(team.sport.id) ?? []
    sportTeams.push(team)
    teamsBySportId.set(team.sport.id, sportTeams)
  }

  let coveredCount = 0
  let totalCount = 0

  const coverageSports: FeedbackCoverageSport[] = sports
    .filter((sport) => teamsBySportId.has(sport.id))
    .map((sport) => {
      const sportTeams = teamsBySportId.get(sport.id) ?? []

      const coverageTeams: FeedbackCoverageTeam[] = sportTeams.map((team) => {
        const teamEvents = events.filter((event) =>
          event.teams_linked?.some((linked) => linked.id === team.id),
        )

        const coverageEvents: FeedbackCoverageEvent[] = teamEvents
          .map((event) => {
            const scoped = (event.attendees ?? []).filter((attendee) =>
              team.trainees.some((trainee) => trainee.id === attendee.id),
            )
            const missing = scoped
              .filter((attendee) => !covered.has(`${event.id}:${attendee.id}`))
              .map((attendee) => ({ id: attendee.id, name: traineeName(attendee.id) }))
              .toSorted((a, b) => a.name.localeCompare(b.name))

            totalCount += scoped.length
            coveredCount += scoped.length - missing.length

            return {
              id: event.id,
              name: event.name,
              formattedWhen: formatDateTime(event.start_time),
              missing,
            }
          })
          .filter((event) => event.missing.length > 0)
          .toSorted((a, b) => a.name.localeCompare(b.name))

        return { id: team.id, name: team.name, events: coverageEvents }
      }).filter((team) => team.events.length > 0)

      return { name: sport.name, teams: coverageTeams }
    })
    .filter((sport) => sport.teams.length > 0)

  return {
    coveredCount,
    totalCount,
    sports: coverageSports,
  }
}

export function buildFeedbackView(
  summaries: FeedbackSummary[],
  filters: FeedbackFilters,
  members: MemberSummary[] = [],
  teams: Team[] = [],
  sports: Sport[] = [],
  events: EventListItem[] = [],
  user?: AuthUser,
): FeedbackView {
  const rows = summaries.map((feedback) => ({
    id: feedback.id,
    eventId: feedback.event.id,
    coachId: feedback.creator?.id ?? 'unknown',
    creatorId: feedback.creator?.id ?? null,
    memberName: memberRefName(feedback.member),
    creatorName: creatorName(feedback.creator),
    eventName: feedback.event.name,
    createdAt: feedback.created_at,
    rating: feedback.rating,
  }))
  const eventOptions = Array.from(
    new Map(rows.map((row) => [row.eventId, row.eventName])).entries(),
    ([value, label]) => ({ value, label }),
  ).toSorted((a, b) => a.label.localeCompare(b.label))
  const coachOptions = Array.from(
    new Map(rows.map((row) => [row.coachId, row.creatorName])).entries(),
    ([value, label]) => ({ value, label }),
  ).toSorted((a, b) => a.label.localeCompare(b.label))
  const filteredRows = sortFeedbackRows(filterFeedbackRows(rows, filters), filters.sort)

  const avgRating =
    rows.length === 0
      ? null
      : rows.reduce((sum, feedback) => sum + feedback.rating, 0) / rows.length
  const latestCreatedAt = rows.reduce<string | null>(
    (latest, feedback) =>
      latest === null || new Date(feedback.createdAt).getTime() > new Date(latest).getTime()
        ? feedback.createdAt
        : latest,
    null,
  )

  return {
    rows: filteredRows,
    totalRows: rows.length,
    eventOptions,
    coachOptions,
    stats: {
      total: rows.length,
      avgRatingLabel: avgRating === null ? '--' : `${avgRating.toFixed(1)} / 10`,
      latestLabel: latestCreatedAt === null ? '--' : formatDateShort(latestCreatedAt),
    },
    coverage: user
      ? buildFeedbackCoverage(summaries, members, teams, sports, events, user)
      : null,
  }
}

export function useFeedbackViewModel() {
  const { user } = useAuth()
  const feedbackQuery = useFeedbackList()
  const membersQuery = useMembers()
  const teamsQuery = useTeamsList()
  const sportsQuery = useSportsList(user.role === 'trainer')
  const eventsQuery = useEventsList(user.role === 'trainer')
  const filters = useFeedbackUiStore((state) => state.filters)

  const view = useMemo(
    () =>
      buildFeedbackView(
        feedbackQuery.data ?? [],
        filters,
        membersQuery.data ?? [],
        teamsQuery.data ?? [],
        sportsQuery.data ?? [],
        eventsQuery.data ?? [],
        user,
      ),
    [
      feedbackQuery.data,
      filters,
      membersQuery.data,
      teamsQuery.data,
      sportsQuery.data,
      eventsQuery.data,
      user,
    ],
  )

  return {
    view,
    isLoading: feedbackQuery.isLoading,
    error: feedbackQuery.error,
  }
}

export function useFeedbackDetailView(id: string | null): FeedbackDetailView {
  const feedbackQuery = useFeedback(id ?? '')
  const detail = feedbackQuery.data

  return {
    detail,
    eventName: detail?.event.name,
    memberName: detail ? memberRefName(detail.member) : undefined,
    creatorName: detail ? creatorName(detail.creator) : undefined,
    rating: detail ? detail.rating : undefined,
    isLoading: feedbackQuery.isLoading,
    error: feedbackQuery.error,
  }
}
