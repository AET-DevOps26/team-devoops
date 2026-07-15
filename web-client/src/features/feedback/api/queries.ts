import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

import { feedbackDependentKeys, feedbackKeys } from '@/lib/query-keys'
import { settleMutation } from '@/lib/query-cache'
import { feedbackClient } from './client'
import type { Feedback, FeedbackCreate, FeedbackPartialUpdate, FeedbackSummary } from '../types'

export { feedbackKeys }

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
    queryFn: () => feedbackClient.get<FeedbackSummary[]>('').then(r => r.data),
  })
}

export function useFeedback(id: string) {
  return useQuery<Feedback>({
    queryKey: feedbackKeys.detail(id),
    staleTime: 30_000,
    queryFn: () => feedbackClient.get<Feedback>(`/${id}`).then(r => r.data),
    enabled: !!id,
  })
}

export function useCreateFeedback() {
  const qc = useQueryClient()

  return useMutation<Feedback, Error, FeedbackCreate>({
    mutationFn: data => feedbackClient.post<Feedback>('', data).then(r => r.data),
    // The list is server-ordered (newest first) and role-scoped, so the new row is refetched.
    onSuccess: (created) => {
      qc.setQueryData(feedbackKeys.detail(created.id), created)
      return settleMutation(qc, {
        invalidate: [feedbackKeys.all, ...feedbackDependentKeys],
      })
    },
  })
}

export function useUpdateFeedback() {
  const qc = useQueryClient()

  return useMutation<Feedback, Error, { id: string } & FeedbackPartialUpdate>({
    mutationFn: ({ id, ...data }) => feedbackClient.patch<Feedback>(`/${id}`, data).then(r => r.data),
    onSuccess: (updated, { id }) => {
      qc.setQueryData(feedbackKeys.detail(id), updated)
      return settleMutation(qc, {
        invalidate: [feedbackKeys.all, feedbackKeys.detail(id), ...feedbackDependentKeys],
      })
    },
  })
}

export function useDeleteFeedback() {
  const qc = useQueryClient()

  return useMutation<void, Error, string>({
    mutationFn: id => feedbackClient.delete(`/${id}`).then(() => undefined),
    onSuccess: (_, id) =>
      settleMutation(qc, {
        remove: [{ key: feedbackKeys.all, id }],
        evict: [feedbackKeys.detail(id)],
        invalidate: [feedbackKeys.all, ...feedbackDependentKeys],
      }),
  })
}
