import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

import { sportEventsClient } from './client'
import type { EventListItem } from '@/types'
import type { SportEvent, EventCreate, EventPartialUpdate } from '../types'

export const eventKeys = {
  hello: ['sport-events', 'hello'] as const,
  all: ['sport-events'] as const,
  list: () => ['sport-events', 'list'] as const,
  detail: (id: string | null | undefined) => ['sport-events', 'detail', id] as const,
}

export const sportEventsKeys = eventKeys

export function useSportEventsHello() {
  return useQuery<string>({
    queryKey: eventKeys.hello,
    queryFn: () => sportEventsClient.get<string>('/hello').then(r => r.data),
  })
}

export function useEventsList(enabled = true) {
  return useQuery<EventListItem[]>({
    queryKey: eventKeys.list(),
    staleTime: 30_000,
    enabled,
    queryFn: () => sportEventsClient.get<EventListItem[]>('').then(r => r.data),
  })
}

export function useEvent(id: string | null | undefined) {
  return useQuery<SportEvent>({
    queryKey: eventKeys.detail(id),
    queryFn: () => sportEventsClient.get<SportEvent>(`/${id}`).then(r => r.data),
    enabled: !!id,
  })
}

export const useSportEvents = useEventsList
export const useSportEvent = useEvent

export function useCreateSportEvent() {
  const qc = useQueryClient()

  return useMutation<SportEvent, Error, EventCreate>({
    mutationFn: data => sportEventsClient.post<SportEvent>('', data).then(r => r.data),
    onSuccess: (event) => {
      qc.setQueryData(eventKeys.detail(event.id), event)
      qc.invalidateQueries({ queryKey: eventKeys.all })
    },
  })
}

export function useUpdateSportEvent() {
  const qc = useQueryClient()

  return useMutation<SportEvent, Error, { id: string } & EventPartialUpdate>({
    mutationFn: ({ id, ...data }) => sportEventsClient.patch<SportEvent>(`/${id}`, data).then(r => r.data),
    onSuccess: (event, { id }) => {
      qc.setQueryData(eventKeys.detail(id), event)
      qc.invalidateQueries({ queryKey: eventKeys.all })
      qc.invalidateQueries({ queryKey: eventKeys.detail(id) })
    },
  })
}

export function useDeleteSportEvent() {
  const qc = useQueryClient()

  return useMutation<void, Error, string>({
    mutationFn: id => sportEventsClient.delete(`/${id}`).then(() => undefined),
    onSuccess: (_, id) => {
      qc.invalidateQueries({ queryKey: eventKeys.all })
      qc.removeQueries({ queryKey: eventKeys.detail(id) })
    },
  })
}
