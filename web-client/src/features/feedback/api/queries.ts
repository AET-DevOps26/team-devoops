import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

import { getCurrentUser } from '@/features/auth/currentUser'
import {
  eventDetailsById,
  eventSummaryFixtures,
  feedbackDetailsById,
  feedbackSummaryFixtures,
  memberNamesById,
  teamFixtures,
} from '@/mocks/fixtures'
import { mockOr } from '@/mocks/mockSwitch'
import { scopeFeedback } from '@/mocks/scope'
import type { AuthUser, Reference } from '@/types'
import { feedbackClient } from './client'
import type { Feedback, FeedbackCreate, FeedbackPartialUpdate, FeedbackSummary } from '../types'

export const feedbackKeys = {
  all: ['feedback'] as const,
  detail: (id: string) => ['feedback', id] as const,
  hello: ['feedback', 'hello'] as const,
}

// Mutable mock state (mirrors sport-events' pattern) so create/delete are visible in the demo
// instead of always re-reading the frozen fixture arrays.
const mockFeedbackDetailsById: Record<string, Feedback> = { ...feedbackDetailsById }
let mockFeedbackSummaryRows: FeedbackSummary[] = [...feedbackSummaryFixtures]

function feedbackSummary(feedback: Feedback): FeedbackSummary {
  const { id, event, member, creator, created_at, rating } = feedback
  return { id, event, member, creator, created_at, rating }
}

function upsertMockFeedback(feedback: Feedback): void {
  mockFeedbackDetailsById[feedback.id] = feedback

  const summary = feedbackSummary(feedback)
  const index = mockFeedbackSummaryRows.findIndex((row) => row.id === feedback.id)

  if (index === -1) {
    mockFeedbackSummaryRows = [summary, ...mockFeedbackSummaryRows]
    return
  }

  mockFeedbackSummaryRows = mockFeedbackSummaryRows.map((row) =>
    row.id === feedback.id ? summary : row,
  )
}

export function useFeedbackHello() {
  return useQuery<string>({
    queryKey: feedbackKeys.hello,
    queryFn: () => feedbackClient.get<string>('/hello').then(r => r.data),
  })
}

export function useFeedbackList(enabled = true) {
  return useQuery<FeedbackSummary[]>({
    queryKey: feedbackKeys.all,
    staleTime: 30_000,
    enabled,
    queryFn: () =>
      mockOr(
        () => Promise.resolve(scopeFeedback(mockFeedbackSummaryRows, getCurrentUser())),
        () => feedbackClient.get<FeedbackSummary[]>('').then(r => r.data),
      ),
  })
}

export function useFeedback(id: string) {
  return useQuery<Feedback>({
    queryKey: feedbackKeys.detail(id),
    staleTime: 30_000,
    queryFn: () =>
      mockOr(
        () => {
          const found = mockFeedbackDetailsById[id]
          const scoped = found ? scopeFeedback([found], getCurrentUser()) : []
          if (!scoped[0]) throw new Error('Feedback not found')
          return Promise.resolve(scoped[0])
        },
        () => feedbackClient.get<Feedback>(`/${id}`).then(r => r.data),
      ),
    enabled: !!id,
  })
}

function mockFeedbackError(message: string): Error {
  return new Error(message)
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

function trainsMember(userId: string, memberId: string): boolean {
  return teamFixtures.some(
    (team) =>
      team.trainers.some((trainer) => trainer.id === userId) &&
      team.trainees.some((trainee) => trainee.id === memberId),
  )
}

function canCreateFeedback(user: AuthUser, memberId: string): boolean {
  return user.role === 'admin' || (user.role === 'trainer' && trainsMember(user.id, memberId))
}

function mockFeedbackId(): string {
  return globalThis.crypto?.randomUUID?.() ?? `ffffffff-ffff-4fff-8fff-${Date.now().toString(16).padStart(12, '0').slice(-12)}`
}

function mockCreateFeedback(data: FeedbackCreate): Feedback {
  const user = getCurrentUser()
  const event = eventRef(data.event)
  const member = memberRef(data.member)

  if (!event) throw mockFeedbackError('Event not found')
  if (!member) throw mockFeedbackError('Member not found')
  if (!data.feedback.trim()) throw mockFeedbackError('Feedback is required')
  if (!isFeedbackRating(data.rating)) {
    throw mockFeedbackError('Rating must be an integer between 0 and 10')
  }
  if (!canCreateFeedback(user, data.member)) {
    throw mockFeedbackError('You are not allowed to create feedback for this member')
  }

  const created: Feedback = {
    id: mockFeedbackId(),
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

function mockDeleteFeedback(id: string): void {
  const user = getCurrentUser()
  const existing = mockFeedbackDetailsById[id] ?? mockFeedbackSummaryRows.find((row) => row.id === id)

  if (!existing) throw mockFeedbackError('Feedback not found')
  if (user.role !== 'admin' && existing.creator?.id !== user.id) {
    throw mockFeedbackError('You are not allowed to delete this feedback')
  }

  delete mockFeedbackDetailsById[id]
  mockFeedbackSummaryRows = mockFeedbackSummaryRows.filter((row) => row.id !== id)
}

export function useCreateFeedback() {
  const qc = useQueryClient()

  return useMutation<Feedback, Error, FeedbackCreate>({
    mutationFn: data =>
      mockOr(
        () => Promise.resolve(mockCreateFeedback(data)),
        () => feedbackClient.post<Feedback>('', data).then(r => r.data),
      ),
    onSuccess: () => qc.invalidateQueries({ queryKey: feedbackKeys.all }),
  })
}

export function useUpdateFeedback() {
  const qc = useQueryClient()

  return useMutation<Feedback, Error, { id: string } & FeedbackPartialUpdate>({
    mutationFn: ({ id, ...data }) => feedbackClient.patch<Feedback>(`/${id}`, data).then(r => r.data),
    onSuccess: (_, { id }) => {
      qc.invalidateQueries({ queryKey: feedbackKeys.all })
      qc.invalidateQueries({ queryKey: feedbackKeys.detail(id) })
    },
  })
}

export function useDeleteFeedback() {
  const qc = useQueryClient()

  return useMutation<void, Error, string>({
    mutationFn: id =>
      mockOr(
        () => {
          mockDeleteFeedback(id)
          return Promise.resolve(undefined)
        },
        () => feedbackClient.delete(`/${id}`).then(() => undefined),
      ),
    onSuccess: (_, id) => {
      qc.invalidateQueries({ queryKey: feedbackKeys.all })
      qc.removeQueries({ queryKey: feedbackKeys.detail(id) })
    },
  })
}
