import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

import { eventCreateDependentKeys, eventDependentKeys, eventKeys } from '@/lib/query-keys'
import { settleMutation } from '@/lib/query-cache'
import { sportEventsClient } from './client'
import type { EventListItem } from '@/types'
import type { SportEvent, EventCreate, EventPartialUpdate } from '../types'

export { eventKeys }

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
    // Events are ordered by date, not by insertion, so the new row is refetched into position
    // rather than prepended.
    onSuccess: (event) => {
      qc.setQueryData(eventKeys.detail(event.id), event)
      return settleMutation(qc, {
        invalidate: [eventKeys.list(), ...eventCreateDependentKeys],
      })
    },
  })
}

export function useUpdateSportEvent() {
  const qc = useQueryClient()

  return useMutation<SportEvent, Error, { id: string } & EventPartialUpdate>({
    mutationFn: ({ id, ...data }) => sportEventsClient.patch<SportEvent>(`/${id}`, data).then(r => r.data),
    // Rescheduling can move an event in the date-ordered list, so refetch it.
    onSuccess: (event, { id }) => {
      qc.setQueryData(eventKeys.detail(id), event)
      return settleMutation(qc, {
        invalidate: [eventKeys.list(), eventKeys.detail(id), ...eventDependentKeys],
      })
    },
  })
}

export function useDeleteSportEvent() {
  const qc = useQueryClient()

  return useMutation<void, Error, string>({
    mutationFn: id => sportEventsClient.delete(`/${id}`).then(() => undefined),
    onSuccess: (_, id) =>
      settleMutation(qc, {
        remove: [{ key: eventKeys.list(), id }],
        evict: [eventKeys.detail(id)],
        invalidate: [eventKeys.list(), ...eventDependentKeys],
      }),
  })
}
