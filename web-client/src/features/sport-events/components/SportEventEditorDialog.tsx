import { type FormEvent, useMemo, useState } from 'react'
import { toast } from 'sonner'

import { DateTimePicker } from '@/components/ui/date-picker'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { DialogFormSkeleton } from '@/components/ui/dialog-form-skeleton'
import { type DialogStep, DialogStepperFooter, DialogStepperNav } from '@/components/ui/dialog-stepper'
import { ErrorNotice } from '@/components/ui/ErrorNotice'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { MultiSelectCombobox, type MultiSelectOption } from '@/components/ui/multi-select-combobox'
import { Textarea } from '@/components/ui/textarea'
import { useAuth } from '@/features/auth'
import { useSportsList, useTeamsList } from '@/features/organization/api/queries'
import { toggleId } from '@/lib/id-selection'
import { formMutationErrorFields } from '@/lib/mutation-feedback'
import { serverErrorMessage } from '@/lib/server-error'
import { fieldError } from '@/lib/validation'
import { mutationFeedbackCopy } from '@/lib/mutation-feedback-copy'
import { memberRefName, type AuthUser, type Sport, type Team } from '@/types'
import {
  useCreateSportEvent,
  useEvent,
  useUpdateSportEvent,
} from '../api/queries'
import type { SportEvent } from '../types'
import {
  buildAttendeeOptions,
  buildSportEventCreatePayload,
  buildSportEventEditorInitialState,
  buildSportEventUpdatePayload,
  roleScopedSports,
  roleScopedTeams,
  syncAttendeesForTeams,
  type EventEditorFormState,
  validateSportEventEditorForm,
} from '../model/eventEditor'
import { type EventEditorTarget, useEventsUiStore } from '../model/eventsUiStore'

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
          <DialogDescription className="sr-only">
            {target.mode === 'create' ? 'Create a sport event.' : 'Update this sport event.'}
          </DialogDescription>
        </DialogHeader>
        <ErrorNotice
          message={serverErrorMessage(queryError)}
          onRetry={() => {
            void teamsQuery.refetch()
            void sportsQuery.refetch()
            if (target.mode === 'edit') void eventQuery.refetch()
          }}
          compact
        />
      </DialogContent>
    )
  }

  if (isLoading || !teams || !sports) {
    return (
      <DialogContent className="roost-scroll max-h-[92vh] overflow-y-auto sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>{target.mode === 'create' ? 'New Event' : 'Edit Event'}</DialogTitle>
          <DialogDescription className="sr-only">
            {target.mode === 'create' ? 'Create a sport event.' : 'Update this sport event.'}
          </DialogDescription>
        </DialogHeader>
        <DialogFormSkeleton />
      </DialogContent>
    )
  }

  if (target.mode === 'edit' && !event) {
    return (
      <DialogContent className="roost-scroll max-h-[92vh] overflow-y-auto sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>Edit Event</DialogTitle>
          <DialogDescription className="sr-only">Update this sport event.</DialogDescription>
        </DialogHeader>
        <ErrorNotice message="Event not found." compact />
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
  const createEvent = useCreateSportEvent()
  const updateEvent = useUpdateSportEvent()
  const [form, setForm] = useState<EventEditorFormState>(() =>
    buildSportEventEditorInitialState(target, user, teams, sports, event),
  )
  const [stepIndex, setStepIndex] = useState(0)
  const [fieldErrors, setFieldErrors] = useState<Record<string, string> | null>(null)
  const isPending = createEvent.isPending || updateEvent.isPending
  const isPastEvent = target.mode === 'edit' && event ? new Date(event.end_time) < new Date() : false
  const isFirstStep = stepIndex === 0
  const isLastStep = stepIndex === eventSteps.length - 1
  const currentStepId = eventSteps[stepIndex].id
  const nameError = fieldError(fieldErrors, 'name')
  const startError = fieldError(fieldErrors, 'startLocal', 'start_time')
  const endError = fieldError(fieldErrors, 'endLocal', 'end_time')
  const sportsError = fieldError(fieldErrors, 'sportIds', 'sports_linked')
  const teamsError = fieldError(fieldErrors, 'teamIds', 'teams_linked')
  const attendeesError = fieldError(fieldErrors, 'attendeeIds', 'attendees')

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
        sportIds: Array.from(new Set([...nextSportIds, ...addedSportIds])),
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
    setFieldErrors(null)

    const stepFields =
      currentStepId === 'details'
        ? (['name'] as const)
        : currentStepId === 'schedule'
          ? (['startLocal', 'endLocal'] as const)
          : null
    const validationErrors = isLastStep
      ? validateSportEventEditorForm(form)
      : stepFields
        ? validateSportEventEditorForm(form, stepFields)
        : null

    if (validationErrors) {
      setFieldErrors(validationErrors)
      return
    }

    if (!isLastStep) {
      setStepIndex((current) => current + 1)
      return
    }

    try {
      if (target.mode === 'create') {
        const created = await createEvent.mutateAsync(buildSportEventCreatePayload(form, teams))

        toast.success('Event created.')
        openEvent(created.id)
        closeEditor()
        return
      }

      if (!event) return

      const payload = buildSportEventUpdatePayload(event, form, teams)
      if (Object.keys(payload).length > 0) {
        await updateEvent.mutateAsync({ id: event.id, ...payload })
        toast.success('Event updated.')
      }
      closeEditor()
    } catch (error) {
      setFieldErrors(
        formMutationErrorFields(
          error,
          target.mode === 'create' ? mutationFeedbackCopy.event.create : mutationFeedbackCopy.event.update,
        ),
      )
    }
  }

  return (
    <DialogContent
      className="roost-scroll max-h-[92vh] overflow-y-auto sm:max-w-2xl"
      dismissOnInteractOutside={false}
    >
      <DialogHeader>
        <DialogTitle>{target.mode === 'create' ? 'New Event' : 'Edit Event'}</DialogTitle>
        <DialogDescription className="sr-only">
          {target.mode === 'create' ? 'Create a sport event.' : 'Update this sport event.'}
        </DialogDescription>
      </DialogHeader>

      <DialogStepperNav steps={eventSteps} currentStep={stepIndex} />

      <form className="space-y-5" onSubmit={handleSubmit} noValidate>
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
                  aria-invalid={nameError !== undefined}
                />
                {nameError && (
                  <p className="text-caption text-destructive">{nameError}</p>
                )}
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
                  aria-invalid={startError !== undefined}
                />
                {startError && (
                  <p className="text-caption text-destructive">{startError}</p>
                )}
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
                  aria-invalid={endError !== undefined}
                />
                {endError && (
                  <p className="text-caption text-destructive">{endError}</p>
                )}
              </div>
            </div>
          )}

          {eventSteps[stepIndex].id === 'sports-teams' && (
            <div className="space-y-5">
              <div className="space-y-1.5">
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
                {sportsError && (
                  <p className="text-caption text-destructive">{sportsError}</p>
                )}
              </div>

              <div className="space-y-1.5">
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
                {teamsError && (
                  <p className="text-caption text-destructive">{teamsError}</p>
                )}
              </div>
            </div>
          )}

          {eventSteps[stepIndex].id === 'attendees' && (
            <div className="space-y-1.5">
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
              {attendeesError && (
                <p className="text-caption text-destructive">{attendeesError}</p>
              )}
            </div>
          )}

          <DialogStepperFooter
            isFirstStep={isFirstStep}
            isLastStep={isLastStep}
            isPending={isPending}
            submitLabel={target.mode === 'create' ? 'Create Event' : 'Save Event'}
            onCancel={closeEditor}
            onBack={() => {
              setStepIndex((current) => Math.max(current - 1, 0))
            }}
          />
      </form>
    </DialogContent>
  )
}
