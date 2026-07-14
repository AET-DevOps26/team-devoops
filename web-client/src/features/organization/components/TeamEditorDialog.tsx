import { type FormEvent, useMemo, useState } from 'react'
import { Plus } from 'lucide-react'
import { toast } from 'sonner'

import { Button } from '@/components/ui/button'
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
import { MultiSelectCombobox } from '@/components/ui/multi-select-combobox'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { useAuth } from '@/features/auth'
import { useMembers } from '@/features/members/api/queries'
import { toggleId } from '@/lib/id-selection'
import { formMutationErrorFields } from '@/lib/mutation-feedback'
import { serverErrorMessage } from '@/lib/server-error'
import { fieldError } from '@/lib/validation'
import { mutationFeedbackCopy } from '@/lib/mutation-feedback-copy'
import type { AuthUser, MemberSummary, Sport, Team } from '@/types'
import { useCreateTeam, useSportsList, useTeamsList, useUpdateTeam } from '../api/queries'
import {
  buildCoachPickerOptions,
  buildMemberPickerOptions,
  buildTeamCreatePayload,
  buildTeamCreatorInitialState,
  buildTeamEditorInitialState,
  buildTeamUpdatePayload,
  manageableSportsForUser,
  teamCreatorFieldsForUser,
  teamEditorFieldsForUser,
  type TeamEditorField,
  validateTeamEditorFieldErrors,
} from '../model/teamEditor'
import { type TeamEditorTarget, useOrganizationUiStore } from '../model/organizationUiStore'

export function TeamEditorDialog() {
  const target = useOrganizationUiStore((state) => state.editorTarget)
  const closeEditor = useOrganizationUiStore((state) => state.closeEditor)
  const key = target?.mode === 'edit' ? `edit-${target.teamId}` : target?.mode ?? 'closed'

  return (
    <Dialog open={target !== null} onOpenChange={(open) => !open && closeEditor()}>
      {target && <TeamEditorForm key={key} target={target} />}
    </Dialog>
  )
}

function TeamEditorForm({ target }: { target: TeamEditorTarget }) {
  const { user } = useAuth()
  const teamsQuery = useTeamsList()
  const sportsQuery = useSportsList()
  const membersQuery = useMembers()
  const queryError = sportsQuery.error ?? membersQuery.error ?? teamsQuery.error
  const teams = teamsQuery.data
  const sports = sportsQuery.data
  const members = membersQuery.data
  const team =
    target.mode === 'edit' ? teams?.find((candidate) => candidate.id === target.teamId) : undefined
  const title = target.mode === 'create' ? 'New Team' : 'Edit Team'
  const isLoading = sportsQuery.isLoading || membersQuery.isLoading || teamsQuery.isLoading

  if (queryError) {
    return (
      <DialogContent className="roost-scroll max-h-[92vh] overflow-y-auto sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription className="sr-only">
            {target.mode === 'create' ? 'Create a team.' : 'Update this team.'}
          </DialogDescription>
        </DialogHeader>
        <ErrorNotice
          message={serverErrorMessage(queryError)}
          onRetry={() => {
            void teamsQuery.refetch()
            void sportsQuery.refetch()
            void membersQuery.refetch()
          }}
          compact
        />
      </DialogContent>
    )
  }

  if (isLoading || !sports || !members || !teams) {
    return (
      <DialogContent className="roost-scroll max-h-[92vh] overflow-y-auto sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription className="sr-only">
            {target.mode === 'create' ? 'Create a team.' : 'Update this team.'}
          </DialogDescription>
        </DialogHeader>
        <DialogFormSkeleton />
      </DialogContent>
    )
  }

  if (target.mode === 'edit' && !team) {
    return (
      <DialogContent className="roost-scroll max-h-[92vh] overflow-y-auto sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>Edit Team</DialogTitle>
          <DialogDescription className="sr-only">Update this team.</DialogDescription>
        </DialogHeader>
        <ErrorNotice message="Team not found." compact />
      </DialogContent>
    )
  }

  return (
    <TeamEditorLoaded
      target={target}
      team={team ?? null}
      sports={sports}
      teams={teams}
      members={members}
      user={user}
    />
  )
}

function TeamEditorLoaded({
  target,
  team,
  sports,
  teams,
  members,
  user,
}: {
  target: TeamEditorTarget
  team: Team | null
  sports: Sport[]
  teams: Team[]
  members: MemberSummary[]
  user: AuthUser
}) {
  const closeEditor = useOrganizationUiStore((state) => state.closeEditor)
  const openCreateSport = useOrganizationUiStore((state) => state.openCreateSport)
  const manageableSports = useMemo(() => manageableSportsForUser(sports, user), [sports, user])
  const editableFields = useMemo(
    () =>
      target.mode === 'create'
        ? teamCreatorFieldsForUser(sports, user)
        : team
          ? teamEditorFieldsForUser(team, sports, user)
          : [],
    [sports, target.mode, team, user],
  )
  const title = target.mode === 'create' ? 'New Team' : 'Edit Team'
  const isMissingCreateParent =
    target.mode === 'create' &&
    (user.role === 'admin' || user.role === 'director') &&
    manageableSports.length === 0

  if (editableFields.length === 0) {
    if (isMissingCreateParent) {
      return (
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{title}</DialogTitle>
            <DialogDescription className="sr-only">
              {user.role === 'admin'
                ? 'A sport must exist before a team can be created.'
                : 'A director must direct a sport before creating teams.'}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-3 border bg-card px-4 py-3 text-body-sm text-text-secondary">
            <p>
              {user.role === 'admin'
                ? 'No sports yet. Create a sport first, then add teams to it.'
                : "You don't direct any sport yet. Ask an admin to add you as a director of a sport."}
            </p>
            {user.role === 'admin' && (
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => {
                  closeEditor()
                  openCreateSport()
                }}
              >
                <Plus />
                Create sport
              </Button>
            )}
          </div>
        </DialogContent>
      )
    }

    return (
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          {team ? (
            <DialogDescription>{team.sport.name}</DialogDescription>
          ) : (
            <DialogDescription className="sr-only">
              {target.mode === 'create'
                ? 'This role cannot create teams.'
                : 'This team cannot be updated by the current user.'}
            </DialogDescription>
          )}
        </DialogHeader>
        <ErrorNotice
          message={
            target.mode === 'create'
              ? 'You are not allowed to create teams.'
              : 'You are not allowed to update this team.'
          }
          compact
        />
      </DialogContent>
    )
  }

  return (
    <TeamEditorEditable
      target={target}
      team={team}
      sports={sports}
      teams={teams}
      members={members}
      user={user}
      editableFields={editableFields}
    />
  )
}

function TeamEditorEditable({
  target,
  team,
  sports,
  teams,
  members,
  user,
  editableFields,
}: {
  target: TeamEditorTarget
  team: Team | null
  sports: Sport[]
  teams: Team[]
  members: MemberSummary[]
  user: AuthUser
  editableFields: readonly TeamEditorField[]
}) {
  const closeEditor = useOrganizationUiStore((state) => state.closeEditor)
  const createTeam = useCreateTeam()
  const updateTeam = useUpdateTeam()
  const [form, setForm] = useState(() =>
    target.mode === 'edit' && team
      ? buildTeamEditorInitialState(team)
      : buildTeamCreatorInitialState(sports, user),
  )
  const [stepIndex, setStepIndex] = useState(0)
  const [fieldErrors, setFieldErrors] = useState<Record<string, string> | null>(null)
  const fields = useMemo(() => new Set(editableFields), [editableFields])
  const availableSports = useMemo(
    () => (fields.has('sport') ? manageableSportsForUser(sports, user) : []),
    [fields, sports, user],
  )
  const trainerOptions = useMemo(
    () => buildCoachPickerOptions(members, teams, team?.trainers ?? []),
    [members, teams, team?.trainers],
  )
  const traineeOptions = useMemo(
    () => buildMemberPickerOptions(members, team?.trainees ?? []),
    [members, team?.trainees],
  )
  const isPending = createTeam.isPending || updateTeam.isPending
  const title = target.mode === 'create' ? 'New Team' : 'Edit Team'
  const steps: DialogStep[] = useMemo(() => {
    const stepList: DialogStep[] = [{ id: 'details', label: 'Details' }]
    if (fields.has('trainers') || fields.has('trainees')) stepList.push({ id: 'members', label: 'Members' })
    return stepList
  }, [fields])
  const isFirstStep = stepIndex === 0
  const isLastStep = stepIndex === steps.length - 1
  const nameError = fieldError(fieldErrors, 'name')
  const sportError = fieldError(fieldErrors, 'sportId', 'sport')
  const descriptionError = fieldError(fieldErrors, 'description')
  const addressError = fieldError(fieldErrors, 'address')
  const trainersError = fieldError(fieldErrors, 'trainerIds', 'trainers')
  const traineesError = fieldError(fieldErrors, 'traineeIds', 'trainees')

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setFieldErrors(null)

    if (steps[stepIndex].id === 'details') {
      const validationErrors = validateTeamEditorFieldErrors(form, editableFields)
      if (validationErrors) {
        setFieldErrors(validationErrors)
        return
      }
    }

    if (!isLastStep) {
      setStepIndex((current) => current + 1)
      return
    }

    try {
      if (target.mode === 'create') {
        await createTeam.mutateAsync(buildTeamCreatePayload(form))
        toast.success('Team created.')
        closeEditor()
        return
      }

      if (!team) return

      const payload = buildTeamUpdatePayload(team, form, editableFields)
      if (Object.keys(payload).length === 0) {
        closeEditor()
        return
      }

      await updateTeam.mutateAsync({ id: team.id, ...payload })
      toast.success('Team updated.')
      closeEditor()
    } catch (error) {
      setFieldErrors(
        formMutationErrorFields(
          error,
          target.mode === 'create' ? mutationFeedbackCopy.team.create : mutationFeedbackCopy.team.update,
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
        <DialogTitle>{title}</DialogTitle>
        {target.mode === 'edit' && team && <DialogDescription>{team.sport.name}</DialogDescription>}
        {target.mode === 'create' && (
          <DialogDescription className="sr-only">Create a team.</DialogDescription>
        )}
      </DialogHeader>

      {steps.length > 1 && <DialogStepperNav steps={steps} currentStep={stepIndex} />}

      <form className="space-y-5" onSubmit={handleSubmit} noValidate>
        {steps[stepIndex].id === 'details' && (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {fields.has('name') && (
              <div className="space-y-1.5 sm:col-span-2">
                <Label htmlFor="team-name">Name</Label>
                <Input
                  id="team-name"
                  value={form.name}
                  onChange={(event) => setForm({ ...form, name: event.target.value })}
                  required
                  disabled={isPending}
                  aria-invalid={nameError !== undefined}
                />
                {nameError && (
                  <p className="text-caption text-destructive">{nameError}</p>
                )}
              </div>
            )}

            {fields.has('sport') && (
              <div className="space-y-1.5 sm:col-span-2">
                <Label htmlFor="team-sport">Sport</Label>
                <Select
                  value={form.sportId}
                  onValueChange={(sportId) => setForm({ ...form, sportId })}
                  disabled={isPending || availableSports.length === 0}
                >
                  <SelectTrigger
                    id="team-sport"
                    className="w-full"
                    aria-invalid={sportError !== undefined}
                  >
                    <SelectValue placeholder="Select sport" />
                  </SelectTrigger>
                  <SelectContent>
                    {availableSports.map((sport) => (
                      <SelectItem key={sport.id} value={sport.id}>
                        {sport.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {sportError && (
                  <p className="text-caption text-destructive">{sportError}</p>
                )}
              </div>
            )}

            {fields.has('description') && (
              <div className="space-y-1.5 sm:col-span-2">
                <Label htmlFor="team-description">Description</Label>
                <Textarea
                  id="team-description"
                  value={form.description}
                  onChange={(event) => setForm({ ...form, description: event.target.value })}
                  disabled={isPending}
                  aria-invalid={descriptionError !== undefined}
                  className="min-h-24"
                />
                {descriptionError && (
                  <p className="text-caption text-destructive">{descriptionError}</p>
                )}
              </div>
            )}

            {fields.has('address') && (
              <div className="space-y-1.5 sm:col-span-2">
                <Label htmlFor="team-address">Address</Label>
                <Input
                  id="team-address"
                  value={form.address}
                  onChange={(event) => setForm({ ...form, address: event.target.value })}
                  disabled={isPending}
                  aria-invalid={addressError !== undefined}
                />
                {addressError && (
                  <p className="text-caption text-destructive">{addressError}</p>
                )}
              </div>
            )}
          </div>
        )}

        {steps[stepIndex].id === 'members' && (
          <div className="space-y-5">
            {fields.has('trainers') && (
              <div className="space-y-1.5">
                <MultiSelectCombobox
                  label="Coaches"
                  placeholder="Search and select coaches..."
                  emptyLabel="No members available."
                  emptySearchLabel="No coaches match that search."
                  options={trainerOptions.map((option) => ({ ...option, label: option.name }))}
                  selectedIds={form.trainerIds}
                  disabled={isPending}
                  onToggle={(id) =>
                    setForm((current) => ({
                      ...current,
                      trainerIds: toggleId(current.trainerIds, id),
                    }))
                  }
                />
                {trainersError && (
                  <p className="text-caption text-destructive">{trainersError}</p>
                )}
              </div>
            )}

            {fields.has('trainees') && (
              <div className="space-y-1.5">
                <MultiSelectCombobox
                  label="Trainees"
                  placeholder="Search and select trainees..."
                  emptyLabel="No members available."
                  emptySearchLabel="No members match that search."
                  options={traineeOptions.map((option) => ({ ...option, label: option.name }))}
                  selectedIds={form.traineeIds}
                  disabled={isPending}
                  onToggle={(id) =>
                    setForm((current) => ({
                      ...current,
                      traineeIds: toggleId(current.traineeIds, id),
                    }))
                  }
                />
                {traineesError && (
                  <p className="text-caption text-destructive">{traineesError}</p>
                )}
              </div>
            )}
          </div>
        )}

        <DialogStepperFooter
          isFirstStep={isFirstStep}
          isLastStep={isLastStep}
          isPending={isPending}
          submitLabel={target.mode === 'create' ? 'Create Team' : 'Save Team'}
          onCancel={closeEditor}
          onBack={() => {
            setStepIndex((current) => Math.max(current - 1, 0))
          }}
        />
      </form>
    </DialogContent>
  )
}
