import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

import { getCurrentUser } from '@/features/auth/currentUser'
import { feedbackDetailsById, feedbackSummaryFixtures } from '@/mocks/fixtures'
import { mockOr } from '@/mocks/mockSwitch'
import { scopeFeedback } from '@/mocks/scope'
import { feedbackClient } from './client'
import type { Feedback, FeedbackCreate, FeedbackPartialUpdate, FeedbackSummary } from '../types'

export const feedbackKeys = {
  all: ['feedback'] as const,
  detail: (id: string) => ['feedback', id] as const,
  hello: ['feedback', 'hello'] as const,
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
        () => Promise.resolve(scopeFeedback(feedbackSummaryFixtures, getCurrentUser())),
        () => feedbackClient.get<FeedbackSummary[]>('/').then(r => r.data),
      ),
  })
}

export function useFeedback(id: string) {
  return useQuery<Feedback>({
    queryKey: feedbackKeys.detail(id),
    queryFn: () =>
      mockOr(
        () => {
          const found = feedbackDetailsById[id]
          const scoped = found ? scopeFeedback([found], getCurrentUser()) : []
          if (!scoped[0]) throw new Error('Feedback not found')
          return Promise.resolve(scoped[0])
        },
        () => feedbackClient.get<Feedback>(`/${id}`).then(r => r.data),
      ),
    enabled: !!id,
  })
}

export function useCreateFeedback() {
  const qc = useQueryClient()

  return useMutation<Feedback, Error, FeedbackCreate>({
    mutationFn: data => feedbackClient.post<Feedback>('/', data).then(r => r.data),
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
    mutationFn: id => feedbackClient.delete(`/${id}`).then(() => undefined),
    onSuccess: (_, id) => {
      qc.invalidateQueries({ queryKey: feedbackKeys.all })
      qc.removeQueries({ queryKey: feedbackKeys.detail(id) })
    },
  })
}
