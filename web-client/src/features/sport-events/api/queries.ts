import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

import { getCurrentUser } from '@/features/auth/currentUser'
import {
  eventDetailsById,
  eventSummaryFixtures,
  memberNamesById,
  sportFixtures,
  teamFixtures,
} from '@/mocks/fixtures'
import { mockOr } from '@/mocks/mockSwitch'
import { scopeEvents } from '@/mocks/scope'
import { sportEventsClient } from './client'
import type { AuthUser, EventListItem, Reference } from '@/types'
import type { SportEvent, EventCreate, EventPartialUpdate } from '../types'

export const eventKeys = {
  hello: ['sport-events', 'hello'] as const,
  all: ['sport-events'] as const,
  list: () => ['sport-events', 'list'] as const,
  detail: (id: string | null | undefined) => ['sport-events', 'detail', id] as const,
}

export const sportEventsKeys = eventKeys

const mockEventDetailsById: Record<string, SportEvent> = { ...eventDetailsById }
let mockEventSummaryRows: EventListItem[] = eventSummaryFixtures.map((event) => ({
  ...event,
  attendees: event.attendees?.map((attendee) => ({ ...attendee })),
  sports_linked: event.sports_linked?.map((sport) => ({ ...sport })),
  teams_linked: event.teams_linked?.map((team) => ({ ...team })),
}))

function mockEventError(message: string): Error {
  return new Error(message)
}

function mockEventId(): string {
  return globalThis.crypto?.randomUUID?.() ?? `eeeeeeee-eeee-4eee-8eee-${Date.now().toString(16).padStart(12, '0').slice(-12)}`
}

function uniqueIds(ids: string[] | undefined): string[] {
  return Array.from(new Set(ids ?? []))
}

function memberRef(id: string): Reference {
  const name = memberNamesById[id]
  if (!name) throw mockEventError('Member not found')
  return { id, name }
}

function sportRef(id: string): Reference {
  const sport = sportFixtures.find((item) => item.id === id)
  if (!sport) throw mockEventError('Sport not found')
  return { id: sport.id, name: sport.name }
}

function teamRef(id: string): Reference {
  const team = teamFixtures.find((item) => item.id === id)
  if (!team) throw mockEventError('Team not found')
  return { id: team.id, name: team.name }
}

function eventSummary(event: SportEvent): EventListItem {
  return {
    id: event.id,
    name: event.name,
    start_time: event.start_time,
    end_time: event.end_time,
    attendees: event.attendees?.map((attendee) => ({ ...attendee })),
    sports_linked: event.sports_linked?.map((sport) => ({ ...sport })),
    teams_linked: event.teams_linked?.map((team) => ({ ...team })),
  }
}

function validateEventTimes(startTime: string, endTime: string): void {
  if (Number.isNaN(new Date(startTime).getTime()) || Number.isNaN(new Date(endTime).getTime())) {
    throw mockEventError('Start and end time are required')
  }

  if (new Date(endTime) <= new Date(startTime)) {
    throw mockEventError('End time must be after start time')
  }
}

function canManageEvent(user: AuthUser, event: SportEvent): boolean {
  return user.role === 'admin' || event.creator?.id === user.id
}

function canCreateMockEvent(user: AuthUser): boolean {
  return user.role === 'trainer' || user.role === 'director' || user.role === 'admin'
}

function upsertMockEvent(event: SportEvent): void {
  mockEventDetailsById[event.id] = event

  const summary = eventSummary(event)
  const index = mockEventSummaryRows.findIndex((row) => row.id === event.id)

  if (index === -1) {
    mockEventSummaryRows = [summary, ...mockEventSummaryRows]
    return
  }

  mockEventSummaryRows = mockEventSummaryRows.map((row) =>
    row.id === event.id ? summary : row,
  )
}

function mockCreateEvent(data: EventCreate): SportEvent {
  const user = getCurrentUser()
  if (!canCreateMockEvent(user)) {
    throw mockEventError('You are not allowed to create events')
  }
  const name = data.name.trim()

  if (!name) throw mockEventError('Name is required')
  validateEventTimes(data.start_time, data.end_time)

  const event: SportEvent = {
    id: mockEventId(),
    name,
    description: data.description?.trim() ?? '',
    start_time: data.start_time,
    end_time: data.end_time,
    attendees: uniqueIds(data.attendees).map(memberRef),
    sports_linked: uniqueIds(data.sports_linked).map(sportRef),
    teams_linked: uniqueIds(data.teams_linked).map(teamRef),
    creator: { id: user.id, name: user.name },
  }

  upsertMockEvent(event)
  return event
}

function mockUpdateEvent({ id, ...data }: { id: string } & EventPartialUpdate): SportEvent {
  const user = getCurrentUser()
  const current = mockEventDetailsById[id]

  if (!current) throw mockEventError('Event not found')
  if (!canManageEvent(user, current)) {
    throw mockEventError('You are not allowed to update this event')
  }

  const name = data.name === undefined ? current.name : data.name.trim()
  if (!name) throw mockEventError('Name is required')

  const startTime = data.start_time ?? current.start_time
  const endTime = data.end_time ?? current.end_time
  validateEventTimes(startTime, endTime)

  const event: SportEvent = {
    ...current,
    name,
    description: data.description === undefined ? current.description : data.description.trim(),
    start_time: startTime,
    end_time: endTime,
    attendees:
      data.attendees === undefined ? current.attendees : uniqueIds(data.attendees).map(memberRef),
    sports_linked:
      data.sports_linked === undefined
        ? current.sports_linked
        : uniqueIds(data.sports_linked).map(sportRef),
    teams_linked:
      data.teams_linked === undefined
        ? current.teams_linked
        : uniqueIds(data.teams_linked).map(teamRef),
  }

  upsertMockEvent(event)
  return event
}

function mockDeleteEvent(id: string): void {
  const user = getCurrentUser()
  const event = mockEventDetailsById[id]

  if (!event) throw mockEventError('Event not found')
  if (!canManageEvent(user, event)) {
    throw mockEventError('You are not allowed to delete this event')
  }

  delete mockEventDetailsById[id]
  mockEventSummaryRows = mockEventSummaryRows.filter((row) => row.id !== id)
}

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
    queryFn: () =>
      mockOr(
        () => Promise.resolve(scopeEvents(mockEventSummaryRows, getCurrentUser())),
        () => sportEventsClient.get<EventListItem[]>('').then(r => r.data),
      ),
  })
}

export function useEvent(id: string | null | undefined) {
  return useQuery<SportEvent>({
    queryKey: eventKeys.detail(id),
    queryFn: () =>
      mockOr(
        () => {
          const found = id ? mockEventDetailsById[id] : undefined
          const scoped = found ? scopeEvents([found], getCurrentUser()) : []
          if (!scoped[0]) {
            throw new Error('Event not found')
          }
          return Promise.resolve(scoped[0])
        },
        () => sportEventsClient.get<SportEvent>(`/${id}`).then(r => r.data),
      ),
    enabled: !!id,
  })
}

export const useSportEvents = useEventsList
export const useSportEvent = useEvent

export function useCreateSportEvent() {
  const qc = useQueryClient()

  return useMutation<SportEvent, Error, EventCreate>({
    mutationFn: data =>
      mockOr(
        () => Promise.resolve(mockCreateEvent(data)),
        () => sportEventsClient.post<SportEvent>('', data).then(r => r.data),
      ),
    onSuccess: (event) => {
      qc.setQueryData(eventKeys.detail(event.id), event)
      qc.invalidateQueries({ queryKey: eventKeys.all })
    },
  })
}

export function useUpdateSportEvent() {
  const qc = useQueryClient()

  return useMutation<SportEvent, Error, { id: string } & EventPartialUpdate>({
    mutationFn: ({ id, ...data }) =>
      mockOr(
        () => Promise.resolve(mockUpdateEvent({ id, ...data })),
        () => sportEventsClient.patch<SportEvent>(`/${id}`, data).then(r => r.data),
      ),
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
    mutationFn: id =>
      mockOr(
        () => {
          mockDeleteEvent(id)
          return Promise.resolve(undefined)
        },
        () => sportEventsClient.delete(`/${id}`).then(() => undefined),
      ),
    onSuccess: (_, id) => {
      qc.invalidateQueries({ queryKey: eventKeys.all })
      qc.removeQueries({ queryKey: eventKeys.detail(id) })
    },
  })
}
