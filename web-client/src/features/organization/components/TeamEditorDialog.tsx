import { type FormEvent, useMemo, useState } from 'react'
import { X } from 'lucide-react'

import { Badge } from '@/components/ui/badge'
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
import { Textarea } from '@/components/ui/textarea'
import { useAuth } from '@/features/auth'
import { useMembers } from '@/features/members/api/queries'
import { toggleId } from '@/lib/id-selection'
import { serverErrorMessage } from '@/lib/server-error'
import { cn } from '@/lib/utils'
import type { AuthUser, Sport } from '@/types'
import { useSportsList, useTeamsList, useUpdateTeam } from '../api/queries'
import {
  buildMemberPickerOptions,
  buildTeamEditorInitialState,
  buildTeamUpdatePayload,
  teamEditorFieldsForUser,
  type TeamEditorField,
  validateTeamEditorForm,
  type MemberPickerOption,
} from '../model/teamEditor'
import { type TeamEditorTarget, useOrganizationUiStore } from '../model/organizationUiStore'

export function TeamEditorDialog() {
  const target = useOrganizationUiStore((state) => state.editorTarget)
  const closeEditor = useOrganizationUiStore((state) => state.closeEditor)
  const key = target?.teamId ?? 'closed'

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
  const queryError = teamsQuery.error ?? sportsQuery.error ?? membersQuery.error
  const team = teamsQuery.data?.find((candidate) => candidate.id === target.teamId)

  if (queryError) {
    return (
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Team</DialogTitle>
        </DialogHeader>
        <p className="border border-destructive/30 bg-destructive/10 px-3 py-2 text-body-sm text-destructive">
          {serverErrorMessage(queryError)}
        </p>
      </DialogContent>
    )
  }

  if (
    teamsQuery.isLoading ||
    sportsQuery.isLoading ||
    membersQuery.isLoading ||
    !teamsQuery.data ||
    !sportsQuery.data ||
    !membersQuery.data
  ) {
    return (
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Team</DialogTitle>
        </DialogHeader>
        <p className="border bg-card px-4 py-3 text-body-sm text-text-secondary">
          Loading team form.
        </p>
      </DialogContent>
    )
  }

  if (!team) {
    return (
      <DialogContent>
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
      team={team}
      sports={sportsQuery.data}
      members={membersQuery.data}
      user={user}
    />
  )
}

function TeamEditorLoaded({
  team,
  sports,
  members,
  user,
}: {
  team: NonNullable<ReturnType<typeof useTeamsList>['data']>[number]
  sports: Sport[]
  members: NonNullable<ReturnType<typeof useMembers>['data']>
  user: AuthUser
}) {
  const editableFields = useMemo(
    () => teamEditorFieldsForUser(team, sports, user),
    [sports, team, user],
  )

  if (editableFields.length === 0) {
    return (
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Team</DialogTitle>
          <DialogDescription>{team.sport.name}</DialogDescription>
        </DialogHeader>
        <p className="border border-destructive/30 bg-destructive/10 px-3 py-2 text-body-sm text-destructive">
          You are not allowed to update this team.
        </p>
      </DialogContent>
    )
  }

  return <TeamEditorEditable team={team} members={members} editableFields={editableFields} />
}

function TeamEditorEditable({
  team,
  members,
  editableFields,
}: {
  team: NonNullable<ReturnType<typeof useTeamsList>['data']>[number]
  members: NonNullable<ReturnType<typeof useMembers>['data']>
  editableFields: readonly TeamEditorField[]
}) {
  const closeEditor = useOrganizationUiStore((state) => state.closeEditor)
  const setMutationNotice = useOrganizationUiStore((state) => state.setMutationNotice)
  const updateTeam = useUpdateTeam()
  const [form, setForm] = useState(() => buildTeamEditorInitialState(team))
  const [traineeSearch, setTraineeSearch] = useState('')
  const [formError, setFormError] = useState<string | null>(null)
  const fields = useMemo(() => new Set(editableFields), [editableFields])
  const memberOptions = useMemo(
    () => buildMemberPickerOptions(members, team.trainees),
    [members, team.trainees],
  )
  const isPending = updateTeam.isPending

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    const validationError = validateTeamEditorForm(form, editableFields)
    if (validationError) {
      setFormError(validationError)
      return
    }

    const payload = buildTeamUpdatePayload(team, form, editableFields)
    setFormError(null)

    if (Object.keys(payload).length === 0) {
      closeEditor()
      return
    }

    try {
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
        <DialogTitle>Edit Team</DialogTitle>
        <DialogDescription>{team.sport.name}</DialogDescription>
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

        {fields.has('trainees') && (
          <TraineeSelector
            options={memberOptions}
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
            {isPending ? 'Saving' : 'Save Team'}
          </Button>
        </DialogFooter>
      </form>
    </DialogContent>
  )
}

function TraineeSelector({
  options,
  selectedIds,
  search,
  disabled,
  onSearchChange,
  onToggle,
}: {
  options: MemberPickerOption[]
  selectedIds: string[]
  search: string
  disabled: boolean
  onSearchChange: (search: string) => void
  onToggle: (id: string) => void
}) {
  const normalizedSearch = search.trim().toLowerCase()
  const visibleOptions = normalizedSearch
    ? options.filter((option) =>
        `${option.name} ${option.meta ?? ''}`.toLowerCase().includes(normalizedSearch),
      )
    : options
  const selectedOptions = selectedIds
    .map((id) => options.find((option) => option.id === id))
    .filter((option): option is MemberPickerOption => option !== undefined)

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between gap-3">
        <Label htmlFor="team-trainee-search">Trainees</Label>
        <Badge size="sm">{selectedIds.length}</Badge>
      </div>

      {selectedOptions.length > 0 && (
        <div className="flex max-h-28 flex-wrap gap-1.5 overflow-y-auto border bg-card p-2">
          {selectedOptions.map((option) => (
            <Badge key={option.id} className="gap-1">
              {option.name}
              <button
                type="button"
                className="inline-flex size-4 items-center justify-center text-text-tertiary hover:text-destructive disabled:pointer-events-none disabled:opacity-50"
                disabled={disabled}
                onClick={() => onToggle(option.id)}
              >
                <X className="size-3" />
                <span className="sr-only">Remove {option.name}</span>
              </button>
            </Badge>
          ))}
        </div>
      )}

      <Input
        id="team-trainee-search"
        value={search}
        onChange={(event) => onSearchChange(event.target.value)}
        placeholder="Search members"
        disabled={disabled}
      />

      {options.length === 0 ? (
        <p className="border bg-card px-3 py-2 text-body-sm text-text-secondary">
          No members available.
        </p>
      ) : visibleOptions.length === 0 ? (
        <p className="border bg-card px-3 py-2 text-body-sm text-text-secondary">
          No members match that search.
        </p>
      ) : (
        <div className="grid max-h-56 grid-cols-1 gap-2 overflow-y-auto sm:grid-cols-2">
          {visibleOptions.map((option) => {
            const selected = selectedIds.includes(option.id)

            return (
              <button
                key={option.id}
                type="button"
                aria-pressed={selected}
                disabled={disabled}
                onClick={() => onToggle(option.id)}
                className={cn(
                  'flex min-h-12 items-center justify-between gap-3 border px-3 py-2 text-left transition-colors disabled:pointer-events-none disabled:opacity-50',
                  selected
                    ? 'border-primary bg-primary/10 text-text-primary'
                    : 'border-border bg-card hover:bg-muted/60',
                )}
              >
                <span className="min-w-0">
                  <span className="block truncate text-body-sm font-medium">{option.name}</span>
                  {option.meta && (
                    <span className="mt-0.5 block truncate text-caption text-text-tertiary">
                      {option.meta}
                    </span>
                  )}
                </span>
                <span
                  className={cn(
                    'size-3 shrink-0 border',
                    selected ? 'border-primary bg-primary' : 'border-border',
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
