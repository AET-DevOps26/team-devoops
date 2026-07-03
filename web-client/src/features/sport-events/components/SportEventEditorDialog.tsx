import { type FormEvent, useMemo, useState } from 'react'
import { X } from 'lucide-react'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { useAuth } from '@/features/auth'
import { useSportsList, useTeamsList } from '@/features/organization/api/queries'
import { serverErrorMessage } from '@/lib/server-error'
import { cn } from '@/lib/utils'
import { memberRefName, type AuthUser, type Reference, type Sport, type Team } from '@/types'
import {
  useCreateSportEvent,
  useEvent,
  useUpdateSportEvent,
} from '../api/queries'
import type { SportEvent } from '../types'
import { type EventEditorTarget, useEventsUiStore } from '../model/eventsUiStore'

interface EventFormState {
  name: string
  description: string
  startLocal: string
  endLocal: string
  sportIds: string[]
  teamIds: string[]
  attendeeIds: string[]
}

interface Option {
  id: string
  label: string
  meta?: string
}

export function SportEventEditorDialog() {
  const target = useEventsUiStore((state) => state.editorTarget)
  const closeEditor = useEventsUiStore((state) => state.closeEditor)
  const key = target?.mode === 'edit' ? `edit-${target.eventId}` : target?.mode ?? 'closed'

  return (
    <Dialog open={target !== null} onOpenChange={(open) => !open && closeEditor()}>
      {target && <SportEventEditorForm key={key} target={target} />}
    </Dialog>
  )
}

function SportEventEditorForm({ target }: { target: EventEditorTarget }) {
  const { user } = useAuth()
  const eventQuery = useEvent(target.mode === 'edit' ? target.eventId : null)
  const teamsQuery = useTeamsList()
  const sportsQuery = useSportsList()
  const queryError = teamsQuery.error ?? sportsQuery.error ?? eventQuery.error
  const teams = teamsQuery.data
  const sports = sportsQuery.data
  const event = target.mode === 'edit' ? eventQuery.data : undefined
  const isLoading =
    teamsQuery.isLoading ||
    sportsQuery.isLoading ||
    (target.mode === 'edit' && eventQuery.isLoading)

  if (queryError) {
    return (
      <DialogContent className="max-h-[92vh] overflow-y-auto sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>{target.mode === 'create' ? 'New Event' : 'Edit Event'}</DialogTitle>
        </DialogHeader>
        <p className="border border-destructive/30 bg-destructive/10 px-3 py-2 text-body-sm text-destructive">
          {serverErrorMessage(queryError)}
        </p>
      </DialogContent>
    )
  }

  if (isLoading || !teams || !sports) {
    return (
      <DialogContent className="max-h-[92vh] overflow-y-auto sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>{target.mode === 'create' ? 'New Event' : 'Edit Event'}</DialogTitle>
        </DialogHeader>
        <p className="border bg-card px-4 py-3 text-body-sm text-text-secondary">
          Loading event form.
        </p>
      </DialogContent>
    )
  }

  if (target.mode === 'edit' && !event) {
    return (
      <DialogContent className="max-h-[92vh] overflow-y-auto sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>Edit Event</DialogTitle>
        </DialogHeader>
        <p className="border border-destructive/30 bg-destructive/10 px-3 py-2 text-body-sm text-destructive">
          Event not found.
        </p>
      </DialogContent>
    )
  }

  return (
    <SportEventEditorLoaded
      target={target}
      user={user}
      teams={teams}
      sports={sports}
      event={event}
    />
  )
}

function SportEventEditorLoaded({
  target,
  user,
  teams,
  sports,
  event,
}: {
  target: EventEditorTarget
  user: AuthUser
  teams: Team[]
  sports: Sport[]
  event: SportEvent | undefined
}) {
  const closeEditor = useEventsUiStore((state) => state.closeEditor)
  const openEvent = useEventsUiStore((state) => state.open)
  const setMutationNotice = useEventsUiStore((state) => state.setMutationNotice)
  const createEvent = useCreateSportEvent()
  const updateEvent = useUpdateSportEvent()
  const [form, setForm] = useState<EventFormState>(() =>
    buildInitialForm(target, user, teams, sports, event),
  )
  const [formError, setFormError] = useState<string | null>(null)
  const isPending = createEvent.isPending || updateEvent.isPending
  const isPastEvent = target.mode === 'edit' && event ? new Date(event.end_time) < new Date() : false

  const scopedSports = useMemo(
    () => roleScopedSports(user, sports, teams),
    [sports, teams, user],
  )
  const scopedTeams = useMemo(
    () => roleScopedTeams(user, teams, sports),
    [sports, teams, user],
  )
  const visibleTeams = useMemo(() => {
    if (form.sportIds.length === 0) return scopedTeams
    const selectedSports = new Set(form.sportIds)
    return scopedTeams.filter((team) => selectedSports.has(team.sport.id))
  }, [form, scopedTeams])
  const sportOptions = useMemo(
    () =>
      scopedSports.map((sport) => ({
        id: sport.id,
        label: sport.name,
        meta: `${teams.filter((team) => team.sport.id === sport.id).length} teams`,
      })),
    [scopedSports, teams],
  )
  const teamOptions = useMemo(
    () =>
      visibleTeams.map((team) => ({
        id: team.id,
        label: team.name,
        meta: `${team.sport.name} - ${team.trainees.length} trainees`,
      })),
    [visibleTeams],
  )
  const attendeeOptions = useMemo(
    () => buildAttendeeOptions(form.teamIds, teams, event),
    [event, form.teamIds, teams],
  )

  const handleSportToggle = (sportId: string) => {
    setForm((current) => ({ ...current, sportIds: toggleId(current.sportIds, sportId) }))
  }

  const handleTeamToggle = (teamId: string) => {
    setForm((current) => {
      const nextTeamIds = toggleId(current.teamIds, teamId)
      const nextSportIds = unique([
        ...current.sportIds,
        ...teams
          .filter((team) => nextTeamIds.includes(team.id))
          .map((team) => team.sport.id),
      ])

      return {
        ...current,
        teamIds: nextTeamIds,
        sportIds: nextSportIds,
        attendeeIds: syncAttendeesForTeams(current.teamIds, nextTeamIds, current.attendeeIds, teams),
      }
    })
  }

  const handleAttendeeToggle = (attendeeId: string) => {
    setForm((current) => ({
      ...current,
      attendeeIds: toggleId(current.attendeeIds, attendeeId),
    }))
  }

  const handleSubmit = async (submitEvent: FormEvent<HTMLFormElement>) => {
    submitEvent.preventDefault()

    const validationError = validateForm(form)
    if (validationError) {
      setFormError(validationError)
      return
    }

    setFormError(null)

    try {
      if (target.mode === 'create') {
        const created = await createEvent.mutateAsync({
          name: form.name.trim(),
          description: cleanedDescription(form.description),
          start_time: localDateTimeToIso(form.startLocal),
          end_time: localDateTimeToIso(form.endLocal),
          sports_linked: resolvedSportIds(form, teams),
          teams_linked: form.teamIds,
          attendees: form.attendeeIds,
        })

        setMutationNotice('Event created.')
        openEvent(created.id)
        closeEditor()
        return
      }

      if (!event) return

      const payload = buildUpdatePayload(event, form, teams)
      if (Object.keys(payload).length > 0) {
        await updateEvent.mutateAsync({ id: event.id, ...payload })
        setMutationNotice('Event updated.')
      }
      closeEditor()
    } catch (error) {
      setFormError(serverErrorMessage(error))
    }
  }

  return (
    <DialogContent className="max-h-[92vh] overflow-y-auto sm:max-w-2xl">
      <DialogHeader>
        <DialogTitle>{target.mode === 'create' ? 'New Event' : 'Edit Event'}</DialogTitle>
      </DialogHeader>

      <form className="space-y-5" onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="space-y-1.5 sm:col-span-2">
              <Label htmlFor="event-name">Name</Label>
              <Input
                id="event-name"
                value={form.name}
                onChange={(inputEvent) =>
                  setForm({ ...form, name: inputEvent.target.value })
                }
                required
                disabled={isPending}
                aria-invalid={formError !== null && form.name.trim() === ''}
              />
            </div>

            <div className="space-y-1.5 sm:col-span-2">
              <Label htmlFor="event-description">Description</Label>
              <Textarea
                id="event-description"
                value={form.description}
                onChange={(inputEvent) =>
                  setForm({ ...form, description: inputEvent.target.value })
                }
                disabled={isPending}
                className="min-h-24"
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="event-start">Start</Label>
              <Input
                id="event-start"
                type="datetime-local"
                value={form.startLocal}
                onChange={(inputEvent) =>
                  setForm({ ...form, startLocal: inputEvent.target.value })
                }
                required
                disabled={isPending}
                aria-invalid={formError !== null && form.startLocal === ''}
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="event-end">End</Label>
              <Input
                id="event-end"
                type="datetime-local"
                value={form.endLocal}
                onChange={(inputEvent) =>
                  setForm({ ...form, endLocal: inputEvent.target.value })
                }
                required
                disabled={isPending}
                aria-invalid={formError !== null && form.endLocal === ''}
              />
            </div>
          </div>

          <SelectableGroup
            label="Sports"
            options={sportOptions}
            selectedIds={form.sportIds}
            emptyLabel="No sports available."
            disabled={isPending}
            onToggle={handleSportToggle}
          />

          <SelectableGroup
            label="Teams"
            options={teamOptions}
            selectedIds={form.teamIds}
            emptyLabel="No teams available."
            disabled={isPending}
            onToggle={handleTeamToggle}
          />

          <AttendeeSelector
            isPastEvent={isPastEvent}
            options={attendeeOptions}
            selectedIds={form.attendeeIds}
            disabled={isPending}
            onToggle={handleAttendeeToggle}
          />

          {formError && (
            <p className="border border-destructive/30 bg-destructive/10 px-3 py-2 text-body-sm text-destructive">
              {formError}
            </p>
          )}

          <DialogFooter>
            <Button type="button" variant="outline" onClick={closeEditor} disabled={isPending}>
              Cancel
            </Button>
            <Button type="submit" disabled={isPending}>
              {isPending ? 'Saving' : target.mode === 'create' ? 'Create Event' : 'Save Event'}
            </Button>
          </DialogFooter>
      </form>
    </DialogContent>
  )
}

function SelectableGroup({
  label,
  options,
  selectedIds,
  emptyLabel,
  disabled,
  onToggle,
}: {
  label: string
  options: Option[]
  selectedIds: string[]
  emptyLabel: string
  disabled: boolean
  onToggle: (id: string) => void
}) {
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between gap-3">
        <Label>{label}</Label>
        <Badge size="sm">{selectedIds.length}</Badge>
      </div>
      {options.length === 0 ? (
        <p className="border bg-card px-3 py-2 text-body-sm text-text-secondary">{emptyLabel}</p>
      ) : (
        <div className="grid max-h-48 grid-cols-1 gap-2 overflow-y-auto sm:grid-cols-2">
          {options.map((option) => {
            const selected = selectedIds.includes(option.id)

            return (
              <button
                key={option.id}
                type="button"
                aria-pressed={selected}
                disabled={disabled}
                onClick={() => onToggle(option.id)}
                className={cn(
                  'min-h-12 border px-3 py-2 text-left transition-colors disabled:pointer-events-none disabled:opacity-50',
                  selected
                    ? 'border-primary bg-primary/10 text-text-primary'
                    : 'border-border bg-card hover:bg-muted/60',
                )}
              >
                <span className="block text-body-sm font-medium">{option.label}</span>
                {option.meta && (
                  <span className="mt-0.5 block text-caption text-text-tertiary">
                    {option.meta}
                  </span>
                )}
              </button>
            )
          })}
        </div>
      )}
    </div>
  )
}

function AttendeeSelector({
  isPastEvent,
  options,
  selectedIds,
  disabled,
  onToggle,
}: {
  isPastEvent: boolean
  options: Reference[]
  selectedIds: string[]
  disabled: boolean
  onToggle: (id: string) => void
}) {
  const selected = options.filter((option) => selectedIds.includes(option.id))

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between gap-3">
        <Label>{isPastEvent ? 'Attendance Upkeep' : 'Attendees'}</Label>
        <Badge size="sm">{selectedIds.length}</Badge>
      </div>

      {selected.length > 0 && (
        <div className="flex max-h-28 flex-wrap gap-1.5 overflow-y-auto border bg-card p-2">
          {selected.map((attendee) => (
            <Badge key={attendee.id} className="gap-1">
              {memberRefName(attendee)}
              <button
                type="button"
                className="inline-flex size-4 items-center justify-center text-text-tertiary hover:text-destructive disabled:pointer-events-none disabled:opacity-50"
                disabled={disabled}
                onClick={() => onToggle(attendee.id)}
              >
                <X className="size-3" />
                <span className="sr-only">Remove {memberRefName(attendee)}</span>
              </button>
            </Badge>
          ))}
        </div>
      )}

      {options.length === 0 ? (
        <p className="border bg-card px-3 py-2 text-body-sm text-text-secondary">
          No roster attendees available.
        </p>
      ) : (
        <div className="grid max-h-44 grid-cols-1 gap-2 overflow-y-auto sm:grid-cols-2">
          {options.map((option) => {
            const checked = selectedIds.includes(option.id)

            return (
              <button
                key={option.id}
                type="button"
                aria-pressed={checked}
                disabled={disabled}
                onClick={() => onToggle(option.id)}
                className={cn(
                  'flex min-h-10 items-center justify-between gap-3 border px-3 py-2 text-left text-body-sm transition-colors disabled:pointer-events-none disabled:opacity-50',
                  checked
                    ? 'border-primary bg-primary/10 text-text-primary'
                    : 'border-border bg-card hover:bg-muted/60',
                )}
              >
                <span>{memberRefName(option)}</span>
                <span
                  className={cn(
                    'size-3 shrink-0 border',
                    checked ? 'border-primary bg-primary' : 'border-border',
                  )}
                  aria-hidden="true"
                />
              </button>
            )
          })}
        </div>
      )}
    </div>
  )
}

function buildInitialForm(
  target: EventEditorTarget,
  user: AuthUser,
  teams: Team[],
  sports: Sport[],
  event: SportEvent | undefined,
): EventFormState {
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

function roleScopedSports(user: AuthUser, sports: Sport[], teams: Team[]): Sport[] {
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

function roleScopedTeams(user: AuthUser, teams: Team[], sports: Sport[]): Team[] {
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

function buildAttendeeOptions(
  teamIds: string[],
  teams: Team[],
  event: SportEvent | undefined,
): Reference[] {
  const refs = new Map<string, Reference>()

  teams
    .filter((team) => teamIds.includes(team.id))
    .flatMap((team) => team.trainees)
    .forEach((member) => refs.set(member.id, member))

  event?.attendees?.forEach((attendee) => refs.set(attendee.id, attendee))

  return Array.from(refs.values()).toSorted((a, b) => memberRefName(a).localeCompare(memberRefName(b)))
}

function syncAttendeesForTeams(
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

function rosterIdsForTeams(teamIds: string[], teams: Team[]): string[] {
  const selectedTeams = new Set(teamIds)
  return unique(
    teams
      .filter((team) => selectedTeams.has(team.id))
      .flatMap((team) => team.trainees.map((trainee) => trainee.id)),
  )
}

function validateForm(form: EventFormState): string | null {
  if (!form.name.trim()) return 'Name is required.'
  if (!form.startLocal || !form.endLocal) return 'Start and end time are required.'
  if (new Date(form.endLocal) <= new Date(form.startLocal)) {
    return 'End time must be after start time.'
  }

  return null
}

function buildUpdatePayload(event: SportEvent, form: EventFormState, teams: Team[]) {
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

function resolvedSportIds(form: EventFormState, teams: Team[]): string[] {
  const teamSports = teams
    .filter((team) => form.teamIds.includes(team.id))
    .map((team) => team.sport.id)

  return unique([...form.sportIds, ...teamSports])
}

function cleanedDescription(description: string): string | undefined {
  const cleaned = description.trim()
  return cleaned.length > 0 ? cleaned : undefined
}

function toggleId(ids: string[], id: string): string[] {
  return ids.includes(id) ? ids.filter((item) => item !== id) : [...ids, id]
}

function unique(ids: string[]): string[] {
  return Array.from(new Set(ids))
}

function sameIds(a: string[], b: string[]): boolean {
  if (a.length !== b.length) return false

  const sortedA = [...a].sort()
  const sortedB = [...b].sort()
  return sortedA.every((id, index) => id === sortedB[index])
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

function localDateTimeToIso(localValue: string): string {
  return new Date(localValue).toISOString()
}
