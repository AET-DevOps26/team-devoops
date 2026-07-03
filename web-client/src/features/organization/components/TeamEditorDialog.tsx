import { type FormEvent, useMemo, useState } from 'react'

import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
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
import { serverErrorMessage } from '@/lib/server-error'
import type { AuthUser, MemberSummary, Sport, Team } from '@/types'
import { useCreateTeam, useSportsList, useTeamsList, useUpdateTeam } from '../api/queries'
import { MemberSelector } from './MemberSelector'
import {
  buildMemberPickerOptions,
  buildTeamCreatePayload,
  buildTeamCreatorInitialState,
  buildTeamEditorInitialState,
  buildTeamUpdatePayload,
  manageableSportsForUser,
  teamCreatorFieldsForUser,
  teamEditorFieldsForUser,
  type TeamEditorField,
  validateTeamEditorForm,
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
  const teamsQuery = useTeamsList(target.mode === 'edit')
  const sportsQuery = useSportsList()
  const membersQuery = useMembers()
  const queryError =
    sportsQuery.error ?? membersQuery.error ?? (target.mode === 'edit' ? teamsQuery.error : null)
  const teams = teamsQuery.data
  const sports = sportsQuery.data
  const members = membersQuery.data
  const team =
    target.mode === 'edit' ? teams?.find((candidate) => candidate.id === target.teamId) : undefined
  const title = target.mode === 'create' ? 'New Team' : 'Edit Team'
  const isLoading =
    sportsQuery.isLoading ||
    membersQuery.isLoading ||
    (target.mode === 'edit' && teamsQuery.isLoading)

  if (queryError) {
    return (
      <DialogContent className="max-h-[92vh] overflow-y-auto sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>
        <p className="border border-destructive/30 bg-destructive/10 px-3 py-2 text-body-sm text-destructive">
          {serverErrorMessage(queryError)}
        </p>
      </DialogContent>
    )
  }

  if (isLoading || !sports || !members || (target.mode === 'edit' && !teams)) {
    return (
      <DialogContent className="max-h-[92vh] overflow-y-auto sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>
        <p className="border bg-card px-4 py-3 text-body-sm text-text-secondary">
          Loading team form.
        </p>
      </DialogContent>
    )
  }

  if (target.mode === 'edit' && !team) {
    return (
      <DialogContent className="max-h-[92vh] overflow-y-auto sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>Edit Team</DialogTitle>
        </DialogHeader>
        <p className="border border-destructive/30 bg-destructive/10 px-3 py-2 text-body-sm text-destructive">
          Team not found.
        </p>
      </DialogContent>
    )
  }

  return (
    <TeamEditorLoaded
      target={target}
      team={team ?? null}
      sports={sports}
      members={members}
      user={user}
    />
  )
}

function TeamEditorLoaded({
  target,
  team,
  sports,
  members,
  user,
}: {
  target: TeamEditorTarget
  team: Team | null
  sports: Sport[]
  members: MemberSummary[]
  user: AuthUser
}) {
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

  if (editableFields.length === 0) {
    return (
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          {team && <DialogDescription>{team.sport.name}</DialogDescription>}
        </DialogHeader>
        <p className="border border-destructive/30 bg-destructive/10 px-3 py-2 text-body-sm text-destructive">
          {target.mode === 'create'
            ? 'You are not allowed to create teams.'
            : 'You are not allowed to update this team.'}
        </p>
      </DialogContent>
    )
  }

  return (
    <TeamEditorEditable
      target={target}
      team={team}
      sports={sports}
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
  members,
  user,
  editableFields,
}: {
  target: TeamEditorTarget
  team: Team | null
  sports: Sport[]
  members: MemberSummary[]
  user: AuthUser
  editableFields: readonly TeamEditorField[]
}) {
  const closeEditor = useOrganizationUiStore((state) => state.closeEditor)
  const setMutationNotice = useOrganizationUiStore((state) => state.setMutationNotice)
  const createTeam = useCreateTeam()
  const updateTeam = useUpdateTeam()
  const [form, setForm] = useState(() =>
    target.mode === 'edit' && team
      ? buildTeamEditorInitialState(team)
      : buildTeamCreatorInitialState(sports, user),
  )
  const [trainerSearch, setTrainerSearch] = useState('')
  const [traineeSearch, setTraineeSearch] = useState('')
  const [formError, setFormError] = useState<string | null>(null)
  const fields = useMemo(() => new Set(editableFields), [editableFields])
  const availableSports = useMemo(
    () => (fields.has('sport') ? manageableSportsForUser(sports, user) : []),
    [fields, sports, user],
  )
  const trainerOptions = useMemo(
    () => buildMemberPickerOptions(members, team?.trainers ?? []),
    [members, team?.trainers],
  )
  const traineeOptions = useMemo(
    () => buildMemberPickerOptions(members, team?.trainees ?? []),
    [members, team?.trainees],
  )
  const isPending = createTeam.isPending || updateTeam.isPending
  const title = target.mode === 'create' ? 'New Team' : 'Edit Team'

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    const validationError = validateTeamEditorForm(form, editableFields)
    if (validationError) {
      setFormError(validationError)
      return
    }

    setFormError(null)

    try {
      if (target.mode === 'create') {
        await createTeam.mutateAsync(buildTeamCreatePayload(form))
        setMutationNotice('Team created.')
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
      setMutationNotice('Team updated.')
      closeEditor()
    } catch (error) {
      setFormError(serverErrorMessage(error))
    }
  }

  return (
    <DialogContent className="max-h-[92vh] overflow-y-auto sm:max-w-2xl">
      <DialogHeader>
        <DialogTitle>{title}</DialogTitle>
        {target.mode === 'edit' && team && <DialogDescription>{team.sport.name}</DialogDescription>}
      </DialogHeader>

      <form className="space-y-5" onSubmit={handleSubmit}>
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
                aria-invalid={formError !== null && form.name.trim() === ''}
              />
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
                <SelectTrigger id="team-sport" className="w-full">
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
                className="min-h-24"
              />
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
              />
            </div>
          )}
        </div>

        {fields.has('trainers') && (
          <MemberSelector
            label="Coaches"
            searchId="team-trainer-search"
            options={trainerOptions}
            selectedIds={form.trainerIds}
            search={trainerSearch}
            disabled={isPending}
            onSearchChange={setTrainerSearch}
            onToggle={(id) =>
              setForm((current) => ({
                ...current,
                trainerIds: toggleId(current.trainerIds, id),
              }))
            }
          />
        )}

        {fields.has('trainees') && (
          <MemberSelector
            label="Trainees"
            searchId="team-trainee-search"
            options={traineeOptions}
            selectedIds={form.traineeIds}
            search={traineeSearch}
            disabled={isPending}
            onSearchChange={setTraineeSearch}
            onToggle={(id) =>
              setForm((current) => ({
                ...current,
                traineeIds: toggleId(current.traineeIds, id),
              }))
            }
          />
        )}

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
            {isPending ? 'Saving' : target.mode === 'create' ? 'Create Team' : 'Save Team'}
          </Button>
        </DialogFooter>
      </form>
    </DialogContent>
  )
}
