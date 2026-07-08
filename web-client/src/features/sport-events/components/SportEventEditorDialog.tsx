import { type FormEvent, useMemo, useState } from 'react'

import { DateTimePicker } from '@/components/ui/date-picker'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { type DialogStep, DialogStepperFooter, DialogStepperNav } from '@/components/ui/dialog-stepper'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { MultiSelectCombobox, type MultiSelectOption } from '@/components/ui/multi-select-combobox'
import { Textarea } from '@/components/ui/textarea'
import { useAuth } from '@/features/auth'
import { useSportsList, useTeamsList } from '@/features/organization/api/queries'
import { sameIds, toggleId } from '@/lib/id-selection'
import { serverErrorMessage } from '@/lib/server-error'
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

const eventSteps: DialogStep[] = [
  { id: 'details', label: 'Details' },
  { id: 'schedule', label: 'Schedule' },
  { id: 'sports-teams', label: 'Sports & Teams' },
  { id: 'attendees', label: 'Attendees' },
]

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
      <DialogContent className="roost-scroll max-h-[92vh] overflow-y-auto sm:max-w-2xl">
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
      <DialogContent className="roost-scroll max-h-[92vh] overflow-y-auto sm:max-w-2xl">
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
      <DialogContent className="roost-scroll max-h-[92vh] overflow-y-auto sm:max-w-2xl">
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
  const [stepIndex, setStepIndex] = useState(0)
  const [formError, setFormError] = useState<string | null>(null)
  const isPending = createEvent.isPending || updateEvent.isPending
  const isPastEvent = target.mode === 'edit' && event ? new Date(event.end_time) < new Date() : false
  const isFirstStep = stepIndex === 0
  const isLastStep = stepIndex === eventSteps.length - 1

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
  const attendeeSelectOptions = useMemo(
    (): MultiSelectOption[] =>
      attendeeOptions.map((option) => ({
        id: option.member.id,
        label: memberRefName(option.member),
        group: option.teamName,
      })),
    [attendeeOptions],
  )

  const handleSportToggle = (sportId: string) => {
    setForm((current) => ({ ...current, sportIds: toggleId(current.sportIds, sportId) }))
  }

  const handleTeamToggle = (teamId: string) => {
    setForm((current) => {
      const nextTeamIds = toggleId(current.teamIds, teamId)
      const teamSportIds = new Set(teams.map((team) => team.sport.id))
      const selectedTeamSportIds = new Set(
        teams.filter((team) => nextTeamIds.includes(team.id)).map((team) => team.sport.id),
      )
      // Keep sports with no backing team at all (e.g. a director's explicit pick) plus
      // sports still backed by a currently selected team; drop team-derived sports whose
      // only selected team was just deselected.
      const nextSportIds = current.sportIds.filter(
        (sportId) => !teamSportIds.has(sportId) || selectedTeamSportIds.has(sportId),
      )
      const addedSportIds = teams
        .filter((team) => nextTeamIds.includes(team.id))
        .map((team) => team.sport.id)

      return {
        ...current,
        teamIds: nextTeamIds,
        sportIds: unique([...nextSportIds, ...addedSportIds]),
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

    const stepError = validateStep(eventSteps[stepIndex].id, form)
    if (stepError) {
      setFormError(stepError)
      return
    }

    setFormError(null)

    if (!isLastStep) {
      setStepIndex((current) => current + 1)
      return
    }

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
    <DialogContent className="roost-scroll max-h-[92vh] overflow-y-auto sm:max-w-2xl">
      <DialogHeader>
        <DialogTitle>{target.mode === 'create' ? 'New Event' : 'Edit Event'}</DialogTitle>
      </DialogHeader>

      <DialogStepperNav steps={eventSteps} currentStep={stepIndex} />

      <form className="space-y-5" onSubmit={handleSubmit}>
          {eventSteps[stepIndex].id === 'details' && (
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
            </div>
          )}

          {eventSteps[stepIndex].id === 'schedule' && (
            <div className="space-y-4">
              <div className="space-y-1.5">
                <Label htmlFor="event-start">Start</Label>
                <DateTimePicker
                  id="event-start"
                  ariaLabel="Start"
                  value={form.startLocal}
                  onChange={(value) => setForm({ ...form, startLocal: value })}
                  required
                  disabled={isPending}
                  aria-invalid={formError !== null && form.startLocal === ''}
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="event-end">End</Label>
                <DateTimePicker
                  id="event-end"
                  ariaLabel="End"
                  value={form.endLocal}
                  onChange={(value) => setForm({ ...form, endLocal: value })}
                  required
                  disabled={isPending}
                  aria-invalid={formError !== null && form.endLocal === ''}
                />
              </div>
            </div>
          )}

          {eventSteps[stepIndex].id === 'sports-teams' && (
            <div className="space-y-5">
              <MultiSelectCombobox
                label="Sports"
                placeholder="Search and select sports..."
                emptyLabel="No sports available."
                emptySearchLabel="No sports match your search."
                options={sportOptions}
                selectedIds={form.sportIds}
                disabled={isPending}
                onToggle={handleSportToggle}
              />

              <MultiSelectCombobox
                label="Teams"
                placeholder="Search and select teams..."
                emptyLabel="No teams available."
                emptySearchLabel="No teams match your search."
                options={teamOptions}
                selectedIds={form.teamIds}
                disabled={isPending}
                onToggle={handleTeamToggle}
              />
            </div>
          )}

          {eventSteps[stepIndex].id === 'attendees' && (
            <MultiSelectCombobox
              label={isPastEvent ? 'Attendance Upkeep' : 'Attendees'}
              placeholder="Search and add attendees..."
              emptyLabel="No team attendees available"
              emptySearchLabel="No attendees match your search."
              options={attendeeSelectOptions}
              selectedIds={form.attendeeIds}
              disabled={isPending}
              onToggle={handleAttendeeToggle}
            />
          )}

          {formError && (
            <p className="border border-destructive/30 bg-destructive/10 px-3 py-2 text-body-sm text-destructive">
              {formError}
            </p>
          )}

          <DialogStepperFooter
            isFirstStep={isFirstStep}
            isLastStep={isLastStep}
            isPending={isPending}
            submitLabel={target.mode === 'create' ? 'Create Event' : 'Save Event'}
            onCancel={closeEditor}
            onBack={() => {
              setFormError(null)
              setStepIndex((current) => Math.max(current - 1, 0))
            }}
          />
      </form>
    </DialogContent>
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

interface AttendeeOption {
  member: Reference
  teamName: string
}

function buildAttendeeOptions(
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

function validateStep(stepId: string, form: EventFormState): string | null {
  if (stepId === 'details') {
    if (!form.name.trim()) return 'Name is required.'
    return null
  }

  if (stepId === 'schedule') {
    if (!form.startLocal || !form.endLocal) return 'Start and end time are required.'
    if (new Date(form.endLocal) <= new Date(form.startLocal)) {
      return 'End time must be after start time.'
    }
    return null
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

function localDateTimeToIso(localValue: string): string {
  return new Date(localValue).toISOString()
}
