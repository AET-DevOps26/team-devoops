import { useMemo } from 'react'

import { formatDateShort } from '@/lib/format'
import { creatorName, memberRefName } from '@/types'
import { useFeedback, useFeedbackList } from '../api/queries'
import type { Feedback, FeedbackSummary } from '../types'
import type { FeedbackFilters, FeedbackRatingFilter } from './feedbackUiStore'
import { useFeedbackUiStore } from './feedbackUiStore'

export interface FeedbackRow {
  id: string
  eventId: string
  coachId: string
  memberName: string
  creatorName: string
  eventName: string
  createdAt: string
  rating: number
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

export function buildFeedbackView(
  summaries: FeedbackSummary[],
  filters: FeedbackFilters,
): FeedbackView {
  const rows = summaries.map((feedback) => ({
    id: feedback.id,
    eventId: feedback.event.id,
    coachId: feedback.creator?.id ?? 'unknown',
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
  }
}

export function useFeedbackViewModel() {
  const feedbackQuery = useFeedbackList()
  const filters = useFeedbackUiStore((state) => state.filters)

  const view = useMemo(
    () => buildFeedbackView(feedbackQuery.data ?? [], filters),
    [feedbackQuery.data, filters],
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
