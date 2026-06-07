import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

import { sportEventsClient } from './client'
import type { SportEvent, EventCreate, EventPartialUpdate, EventSummary } from '../types'

export const sportEventsKeys = {
  all: ['sport-events'] as const,
  detail: (id: string) => ['sport-events', id] as const,
}

export function useSportEvents() {
  return useQuery<EventSummary[]>({
    queryKey: sportEventsKeys.all,
    queryFn: () => sportEventsClient.get<EventSummary[]>('/').then(r => r.data),
  })
}

export function useSportEvent(id: string) {
  return useQuery<SportEvent>({
    queryKey: sportEventsKeys.detail(id),
    queryFn: () => sportEventsClient.get<SportEvent>(`/${id}`).then(r => r.data),
    enabled: !!id,
  })
}

export function useCreateSportEvent() {
  const qc = useQueryClient()

  return useMutation<SportEvent, Error, EventCreate>({
    mutationFn: data => sportEventsClient.post<SportEvent>('/', data).then(r => r.data),
    onSuccess: () => qc.invalidateQueries({ queryKey: sportEventsKeys.all }),
  })
}

export function useUpdateSportEvent() {
  const qc = useQueryClient()

  return useMutation<SportEvent, Error, { id: string } & EventPartialUpdate>({
    mutationFn: ({ id, ...data }) => sportEventsClient.patch<SportEvent>(`/${id}`, data).then(r => r.data),
    onSuccess: (_, { id }) => {
      qc.invalidateQueries({ queryKey: sportEventsKeys.all })
      qc.invalidateQueries({ queryKey: sportEventsKeys.detail(id) })
    },
  })
}

export function useDeleteSportEvent() {
  const qc = useQueryClient()

  return useMutation<void, Error, string>({
    mutationFn: id => sportEventsClient.delete(`/${id}`).then(() => undefined),
    onSuccess: (_, id) => {
      qc.invalidateQueries({ queryKey: sportEventsKeys.all })
      qc.removeQueries({ queryKey: sportEventsKeys.detail(id) })
    },
  })
}
