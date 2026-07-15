import {
  eventDetailsById,
  eventSummaryFixtures,
  memberNamesById,
  sportFixtures,
  teamFixtures,
} from '@/testing/fixtures'
import { httpError } from '@/testing/httpError'
import { scopeEvents } from '@/testing/scope'
import type { AuthUser, EventListItem, Reference } from '@/types'
import type { SportEvent, EventCreate, EventPartialUpdate } from '@/features/sport-events/types'


let eventDetailsState: Record<string, SportEvent> = {}
let eventSummaryState: EventListItem[] = []

export function reset(): void {
  eventDetailsState = structuredClone(eventDetailsById)
  eventSummaryState = structuredClone(eventSummaryFixtures)
}

reset()

function eventError(message: string): Error {
  return new Error(message)
}

function newEventId(): string {
  return globalThis.crypto?.randomUUID?.() ?? `eeeeeeee-eeee-4eee-8eee-${Date.now().toString(16).padStart(12, '0').slice(-12)}`
}

function uniqueIds(ids: string[] | undefined): string[] {
  return Array.from(new Set(ids ?? []))
}

function memberRef(id: string): Reference {
  const name = memberNamesById[id]
  if (!name) throw eventError('Member not found')
  return { id, name }
}

function sportRef(id: string): Reference {
  const sport = sportFixtures.find((item) => item.id === id)
  if (!sport) throw eventError('Sport not found')
  return { id: sport.id, name: sport.name }
}

function teamRef(id: string): Reference {
  const team = teamFixtures.find((item) => item.id === id)
  if (!team) throw eventError('Team not found')
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
    throw eventError('Start and end time are required')
  }

  if (new Date(endTime) <= new Date(startTime)) {
    throw eventError('End time must be after start time')
  }
}

function canManageEvent(user: AuthUser, event: SportEvent): boolean {
  return user.role === 'admin' || event.creator?.id === user.id
}

// Mirrors EventService.canCreateEvent: admins bypass; otherwise the requester must be a
// trainer of a linked team, or a director of a linked sport (linked directly via
// sports_linked, or derived from a linked team's sport). No links => 403, like the server.
function canCreateMockEvent(user: AuthUser, data: EventCreate): boolean {
  if (user.role === 'admin') return true

  const teamIds = uniqueIds(data.teams_linked)
  const linkedTeams = teamFixtures.filter((team) => teamIds.includes(team.id))
  if (linkedTeams.some((team) => team.trainers.some((trainer) => trainer.id === user.id))) {
    return true
  }

  const sportIds = new Set(uniqueIds(data.sports_linked))
  for (const team of linkedTeams) sportIds.add(team.sport.id)
  return sportFixtures.some(
    (sport) => sportIds.has(sport.id) && sport.directors.some((director) => director.id === user.id),
  )
}

function upsertMockEvent(event: SportEvent): void {
  eventDetailsState[event.id] = event

  const summary = eventSummary(event)
  const index = eventSummaryState.findIndex((row) => row.id === event.id)

  if (index === -1) {
    eventSummaryState = [summary, ...eventSummaryState]
    return
  }

  eventSummaryState = eventSummaryState.map((row) =>
    row.id === event.id ? summary : row,
  )
}

export function listEvents(user: AuthUser): EventListItem[] {
  return scopeEvents(eventSummaryState, user)
}

export function getEvent(id: string, user: AuthUser): SportEvent {
  const found = id ? eventDetailsState[id] : undefined
  const scoped = found ? scopeEvents([found], user) : []
  if (!scoped[0]) throw httpError(404, 'Event not found')
  return scoped[0]
}

export function createEvent(data: EventCreate, user: AuthUser): SportEvent {
  const name = data.name.trim()

  if (!name) throw eventError('Name is required')
  validateEventTimes(data.start_time, data.end_time)
  if (!canCreateMockEvent(user, data)) {
    throw httpError(403, 'Access denied')
  }

  const event: SportEvent = {
    id: newEventId(),
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

export function updateEvent(
  id: string,
  data: EventPartialUpdate,
  user: AuthUser,
): SportEvent {
  const current = eventDetailsState[id]

  if (!current) throw eventError('Event not found')
  if (!canManageEvent(user, current)) {
    throw eventError('You are not allowed to update this event')
  }

  const name = data.name === undefined ? current.name : data.name.trim()
  if (!name) throw eventError('Name is required')

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

export function deleteEvent(id: string, user: AuthUser): void {
  const event = eventDetailsState[id]

  if (!event) throw eventError('Event not found')
  if (!canManageEvent(user, event)) {
    throw eventError('You are not allowed to delete this event')
  }

  delete eventDetailsState[id]
  eventSummaryState = eventSummaryState.filter((row) => row.id !== id)
}

export function renameMemberInEvents(memberId: string, name: string): void {
  const rename = (ref: Reference) => (ref.id === memberId ? { ...ref, name } : ref)
  for (const event of Object.values(eventDetailsState)) {
    event.attendees = event.attendees?.map(rename)
    event.creator = event.creator ? rename(event.creator) : null
  }
  eventSummaryState = eventSummaryState.map((event) => ({
    ...event,
    attendees: event.attendees?.map(rename),
  }))
}

export function removeMemberFromEvents(memberId: string): void {
  for (const event of Object.values(eventDetailsState)) {
    event.attendees = event.attendees?.filter((attendee) => attendee.id !== memberId)
    if (event.creator?.id === memberId) event.creator = null
  }
  eventSummaryState = eventSummaryState.map((event) => ({
    ...event,
    attendees: event.attendees?.filter((attendee) => attendee.id !== memberId),
  }))
}

export function renameSportInEvents(sportId: string, name: string): void {
  for (const event of Object.values(eventDetailsState)) {
    event.sports_linked = event.sports_linked?.map((sport) =>
      sport.id === sportId ? { ...sport, name } : sport,
    )
  }
  eventSummaryState = eventSummaryState.map((event) => ({
    ...event,
    sports_linked: event.sports_linked?.map((sport) =>
      sport.id === sportId ? { ...sport, name } : sport,
    ),
  }))
}

export function removeSportFromEvents(sportId: string): void {
  for (const event of Object.values(eventDetailsState)) {
    event.sports_linked = event.sports_linked?.filter((sport) => sport.id !== sportId)
  }
  eventSummaryState = eventSummaryState.map((event) => ({
    ...event,
    sports_linked: event.sports_linked?.filter((sport) => sport.id !== sportId),
  }))
}

export function renameTeamInEvents(teamId: string, name: string): void {
  for (const event of Object.values(eventDetailsState)) {
    event.teams_linked = event.teams_linked?.map((team) =>
      team.id === teamId ? { ...team, name } : team,
    )
  }
  eventSummaryState = eventSummaryState.map((event) => ({
    ...event,
    teams_linked: event.teams_linked?.map((team) =>
      team.id === teamId ? { ...team, name } : team,
    ),
  }))
}

export function removeTeamFromEvents(teamId: string): void {
  for (const event of Object.values(eventDetailsState)) {
    event.teams_linked = event.teams_linked?.filter((team) => team.id !== teamId)
  }
  eventSummaryState = eventSummaryState.map((event) => ({
    ...event,
    teams_linked: event.teams_linked?.filter((team) => team.id !== teamId),
  }))
}
