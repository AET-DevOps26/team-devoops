import {
  eventDetailsById,
  eventSummaryFixtures,
  feedbackDetailsById,
  feedbackSummaryFixtures,
  memberNamesById,
} from '@/testing/fixtures'
import { httpError } from '@/testing/httpError'
import { scopeFeedback, trainerManagesMember } from '@/testing/scope'
import type { AuthUser, Reference } from '@/types'
import type {
  Feedback,
  FeedbackCreate,
  FeedbackPartialUpdate,
  FeedbackSummary,
} from '@/features/feedback/types'

// In-memory feedback resource; reset() restores the module-level state per test.

let feedbackDetailsState: Record<string, Feedback> = {}
let feedbackSummaryState: FeedbackSummary[] = []

export function reset(): void {
  feedbackDetailsState = { ...feedbackDetailsById }
  feedbackSummaryState = [...feedbackSummaryFixtures]
}

reset()

function feedbackSummary(feedback: Feedback): FeedbackSummary {
  const { id, event, member, creator, created_at, rating } = feedback
  return { id, event, member, creator, created_at, rating }
}

function upsertMockFeedback(feedback: Feedback): void {
  feedbackDetailsState[feedback.id] = feedback

  const summary = feedbackSummary(feedback)
  const index = feedbackSummaryState.findIndex((row) => row.id === feedback.id)

  if (index === -1) {
    feedbackSummaryState = [summary, ...feedbackSummaryState]
    return
  }

  feedbackSummaryState = feedbackSummaryState.map((row) =>
    row.id === feedback.id ? summary : row,
  )
}

function isFeedbackRating(rating: number): boolean {
  return Number.isInteger(rating) && rating >= 0 && rating <= 10
}

function memberRef(memberId: string): Reference | null {
  const name = memberNamesById[memberId]
  return name ? { id: memberId, name } : null
}

function eventRef(eventId: string): Reference | null {
  const event = eventDetailsById[eventId] ?? eventSummaryFixtures.find((row) => row.id === eventId)
  return event ? { id: event.id, name: event.name } : null
}

function canCreateFeedback(user: AuthUser, memberId: string): boolean {
  return user.role === 'admin' || (user.role === 'trainer' && trainerManagesMember(user.id, memberId))
}

function newFeedbackId(): string {
  return globalThis.crypto?.randomUUID?.() ?? `ffffffff-ffff-4fff-8fff-${Date.now().toString(16).padStart(12, '0').slice(-12)}`
}

export function listFeedback(user: AuthUser): FeedbackSummary[] {
  return scopeFeedback(feedbackSummaryState, user)
}

export function getFeedback(id: string, user: AuthUser): Feedback {
  const found = feedbackDetailsState[id]
  const scoped = found ? scopeFeedback([found], user) : []
  if (!scoped[0]) throw httpError(404, 'Feedback not found')
  return scoped[0]
}

export function createFeedback(data: FeedbackCreate, user: AuthUser): Feedback {
  const event = eventRef(data.event)
  const member = memberRef(data.member)

  if (!event) throw httpError(404, 'Event not found')
  if (!member) throw httpError(404, 'Member not found')
  if (!data.feedback.trim()) throw httpError(400, 'Feedback is required')
  if (!isFeedbackRating(data.rating)) {
    throw httpError(400, 'Rating must be an integer between 0 and 10')
  }
  if (!canCreateFeedback(user, data.member)) {
    throw httpError(403, 'You are not allowed to create feedback for this member')
  }

  const created: Feedback = {
    id: newFeedbackId(),
    event,
    member,
    creator: { id: user.id, name: user.name },
    created_at: new Date().toISOString(),
    feedback: data.feedback,
    rating: data.rating,
  }

  upsertMockFeedback(created)
  return created
}

export function updateFeedback(
  id: string,
  data: FeedbackPartialUpdate,
  user: AuthUser,
): Feedback {
  const existing = feedbackDetailsState[id]

  if (!existing) throw httpError(404, 'Feedback not found')
  if (user.role !== 'admin' && existing.creator?.id !== user.id) {
    throw httpError(403, 'You are not allowed to update this feedback')
  }
  if (data.feedback !== undefined && !data.feedback.trim()) {
    throw httpError(400, 'Feedback is required')
  }
  if (data.rating !== undefined && !isFeedbackRating(data.rating)) {
    throw httpError(400, 'Rating must be an integer between 0 and 10')
  }

  const updated: Feedback = {
    ...existing,
    ...(data.feedback !== undefined ? { feedback: data.feedback } : {}),
    ...(data.rating !== undefined ? { rating: data.rating } : {}),
  }

  upsertMockFeedback(updated)
  return updated
}

export function deleteFeedback(id: string, user: AuthUser): void {
  const existing = feedbackDetailsState[id] ?? feedbackSummaryState.find((row) => row.id === id)

  if (!existing) throw httpError(404, 'Feedback not found')
  if (user.role !== 'admin' && existing.creator?.id !== user.id) {
    throw httpError(403, 'You are not allowed to delete this feedback')
  }

  delete feedbackDetailsState[id]
  feedbackSummaryState = feedbackSummaryState.filter((row) => row.id !== id)
}
