import { z } from 'zod'

import { sameIds } from '@/lib/id-selection'
import { type FieldErrors, pickFieldErrors, validateZodSchema } from '@/lib/validation'
import { memberRefName, type AuthUser, type EventCreate, type Reference, type Sport, type Team } from '@/types'
import type { SportEvent } from '../types'
import type { EventEditorTarget } from './eventsUiStore'

export interface EventEditorFormState {
  name: string
  description: string
  startLocal: string
  endLocal: string
  sportIds: string[]
  teamIds: string[]
  attendeeIds: string[]
}

export interface AttendeeOption {
  member: Reference
  teamName: string
}

const eventEditorSchema = z
  .object({
    name: z.string().trim().min(1, { message: 'Name is required.' }),
    description: z.string(),
    startLocal: z
      .string()
      .trim()
      .min(1, { message: 'Start time is required.' })
      .refine(isValidLocalDateTime, { message: 'Start time must be valid.' }),
    endLocal: z
      .string()
      .trim()
      .min(1, { message: 'End time is required.' })
      .refine(isValidLocalDateTime, { message: 'End time must be valid.' }),
    sportIds: z.array(z.string()),
    teamIds: z.array(z.string()),
    attendeeIds: z.array(z.string()),
  })
  .superRefine((value, ctx) => {
    if (
      isValidLocalDateTime(value.startLocal) &&
      isValidLocalDateTime(value.endLocal) &&
      new Date(value.endLocal) <= new Date(value.startLocal)
    ) {
      ctx.addIssue({
        code: 'custom',
        path: ['endLocal'],
        message: 'End time must be after start time.',
      })
    }
  })

export function validateSportEventEditorForm(
  form: EventEditorFormState,
  fields?: readonly (keyof EventEditorFormState)[],
): FieldErrors | null {
  return pickFieldErrors(validateZodSchema(eventEditorSchema, form), fields ?? Object.keys(form))
}

export function buildSportEventEditorInitialState(
  target: EventEditorTarget,
  user: AuthUser,
  teams: Team[],
  sports: Sport[],
  event: SportEvent | undefined,
): EventEditorFormState {
  if (target.mode === 'edit' && event) {
    return {
      name: event.name,
      description: event.description ?? '',
      startLocal: isoToLocalDateTime(event.start_time),
      endLocal: isoToLocalDateTime(event.end_time),
      sportIds: event.sports_linked?.map((sport) => sport.id) ?? [],
      teamIds: event.teams_linked?.map((team) => team.id) ?? [],
      attendeeIds: event.attendees?.map((attendee) => attendee.id) ?? [],
    }
  }

  const startLocal = defaultStartLocal()
  const teamIds =
    user.role === 'trainer'
      ? teams
          .filter((team) => team.trainers.some((trainer) => trainer.id === user.id))
          .map((team) => team.id)
      : []
  const sportIds =
    user.role === 'director'
      ? sports
          .filter((sport) => sport.directors.some((director) => director.id === user.id))
          .map((sport) => sport.id)
      : unique(
          teams
            .filter((team) => teamIds.includes(team.id))
            .map((team) => team.sport.id),
        )

  return {
    name: '',
    description: '',
    startLocal,
    endLocal: addMinutesLocal(startLocal, 90),
    sportIds,
    teamIds,
    attendeeIds: rosterIdsForTeams(teamIds, teams),
  }
}

export function roleScopedSports(user: AuthUser, sports: Sport[], teams: Team[]): Sport[] {
  if (user.role === 'admin') return sports
  if (user.role === 'director') {
    return sports.filter((sport) => sport.directors.some((director) => director.id === user.id))
  }
  if (user.role === 'trainer') {
    const sportIds = new Set(
      teams
        .filter((team) => team.trainers.some((trainer) => trainer.id === user.id))
        .map((team) => team.sport.id),
    )

    return sports.filter((sport) => sportIds.has(sport.id))
  }

  return []
}

export function roleScopedTeams(user: AuthUser, teams: Team[], sports: Sport[]): Team[] {
  if (user.role === 'admin') return teams
  if (user.role === 'director') {
    const sportIds = new Set(
      sports
        .filter((sport) => sport.directors.some((director) => director.id === user.id))
        .map((sport) => sport.id),
    )

    return teams.filter((team) => sportIds.has(team.sport.id))
  }
  if (user.role === 'trainer') {
    return teams.filter((team) => team.trainers.some((trainer) => trainer.id === user.id))
  }

  return []
}

export function buildAttendeeOptions(
  teamIds: string[],
  teams: Team[],
  event: SportEvent | undefined,
): AttendeeOption[] {
  const selectedTeams = new Set(teamIds)
  const options = new Map<string, AttendeeOption>()

  teams
    .filter((team) => selectedTeams.has(team.id))
    .forEach((team) => {
      team.trainees.forEach((member) => {
        options.set(member.id, { member, teamName: team.name })
      })
    })

  event?.attendees?.forEach((attendee) => {
    if (!options.has(attendee.id)) {
      options.set(attendee.id, { member: attendee, teamName: 'Other' })
    }
  })

  return Array.from(options.values()).toSorted((a, b) =>
    memberRefName(a.member).localeCompare(memberRefName(b.member)),
  )
}

export function syncAttendeesForTeams(
  currentTeamIds: string[],
  nextTeamIds: string[],
  currentAttendeeIds: string[],
  teams: Team[],
): string[] {
  const currentTeams = new Set(currentTeamIds)
  const nextTeams = new Set(nextTeamIds)
  const addedTeamIds = nextTeamIds.filter((id) => !currentTeams.has(id))
  const removedTeamIds = currentTeamIds.filter((id) => !nextTeams.has(id))
  const nextRoster = new Set(rosterIdsForTeams(nextTeamIds, teams))
  const nextAttendees = new Set(currentAttendeeIds)

  rosterIdsForTeams(addedTeamIds, teams).forEach((id) => nextAttendees.add(id))
  rosterIdsForTeams(removedTeamIds, teams).forEach((id) => {
    if (!nextRoster.has(id)) nextAttendees.delete(id)
  })

  return Array.from(nextAttendees)
}

export function buildSportEventCreatePayload(
  form: EventEditorFormState,
  teams: Team[],
): EventCreate {
  return {
    name: form.name.trim(),
    description: cleanedDescription(form.description),
    start_time: localDateTimeToIso(form.startLocal),
    end_time: localDateTimeToIso(form.endLocal),
    sports_linked: resolvedSportIds(form, teams),
    teams_linked: form.teamIds,
    attendees: form.attendeeIds,
  }
}

export function buildSportEventUpdatePayload(
  event: SportEvent,
  form: EventEditorFormState,
  teams: Team[],
) {
  const payload: Partial<Pick<SportEvent, 'name' | 'description' | 'start_time' | 'end_time'>> & {
    attendees?: string[]
    sports_linked?: string[]
    teams_linked?: string[]
  } = {}
  const name = form.name.trim()
  const description = cleanedDescription(form.description) ?? ''
  const startTime = localDateTimeToIso(form.startLocal)
  const endTime = localDateTimeToIso(form.endLocal)
  const sportIds = resolvedSportIds(form, teams)

  if (name !== event.name) payload.name = name
  if (description !== (event.description ?? '')) payload.description = description
  if (startTime !== event.start_time) payload.start_time = startTime
  if (endTime !== event.end_time) payload.end_time = endTime
  if (!sameIds(sportIds, event.sports_linked?.map((sport) => sport.id) ?? [])) {
    payload.sports_linked = sportIds
  }
  if (!sameIds(form.teamIds, event.teams_linked?.map((team) => team.id) ?? [])) {
    payload.teams_linked = form.teamIds
  }
  if (!sameIds(form.attendeeIds, event.attendees?.map((attendee) => attendee.id) ?? [])) {
    payload.attendees = form.attendeeIds
  }

  return payload
}

export function resolvedSportIds(form: EventEditorFormState, teams: Team[]): string[] {
  const teamSports = teams
    .filter((team) => form.teamIds.includes(team.id))
    .map((team) => team.sport.id)

  return unique([...form.sportIds, ...teamSports])
}

export function cleanedDescription(description: string): string | undefined {
  const cleaned = description.trim()
  return cleaned.length > 0 ? cleaned : undefined
}

export function localDateTimeToIso(localValue: string): string {
  return new Date(localValue).toISOString()
}

function rosterIdsForTeams(teamIds: string[], teams: Team[]): string[] {
  const selectedTeams = new Set(teamIds)
  return unique(
    teams
      .filter((team) => selectedTeams.has(team.id))
      .flatMap((team) => team.trainees.map((trainee) => trainee.id)),
  )
}

function unique(ids: string[]): string[] {
  return Array.from(new Set(ids))
}

function isoToLocalDateTime(iso: string): string {
  return dateToLocalDateTime(new Date(iso))
}

function defaultStartLocal(): string {
  const start = new Date()
  start.setHours(start.getHours() + 1, 0, 0, 0)
  return dateToLocalDateTime(start)
}

function addMinutesLocal(localValue: string, minutes: number): string {
  const date = new Date(localValue)
  date.setMinutes(date.getMinutes() + minutes)
  return dateToLocalDateTime(date)
}

function dateToLocalDateTime(date: Date): string {
  const local = new Date(date.getTime() - date.getTimezoneOffset() * 60_000)
  return local.toISOString().slice(0, 16)
}

function isValidLocalDateTime(value: string): boolean {
  const cleaned = value.trim()
  return cleaned !== '' && !Number.isNaN(new Date(cleaned).getTime())
}
