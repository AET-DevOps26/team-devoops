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
import { Textarea } from '@/components/ui/textarea'
import { useAuth } from '@/features/auth'
import { useMembers } from '@/features/members/api/queries'
import { toggleId } from '@/lib/id-selection'
import { serverErrorMessage } from '@/lib/server-error'
import type { AuthUser, MemberSummary, Sport } from '@/types'
import { useCreateSport, useSportsList, useUpdateSport } from '../api/queries'
import { MemberSelector } from './MemberSelector'
import { type SportEditorTarget, useOrganizationUiStore } from '../model/organizationUiStore'
import {
  buildSportCreatePayload,
  buildSportCreatorInitialState,
  buildSportDirectorPickerOptions,
  buildSportEditorInitialState,
  buildSportUpdatePayload,
  sportCreatorFieldsForUser,
  sportEditorFieldsForUser,
  type SportEditorField,
  validateSportEditorForm,
} from '../model/sportEditor'

export function SportEditorDialog() {
  const target = useOrganizationUiStore((state) => state.sportEditorTarget)
  const closeSportEditor = useOrganizationUiStore((state) => state.closeSportEditor)
  const key = target?.mode === 'edit' ? `sport-edit-${target.sportId}` : target?.mode ?? 'closed'

  return (
    <Dialog open={target !== null} onOpenChange={(open) => !open && closeSportEditor()}>
      {target && <SportEditorForm key={key} target={target} />}
    </Dialog>
  )
}

function SportEditorForm({ target }: { target: SportEditorTarget }) {
  const { user } = useAuth()
  const sportsQuery = useSportsList(target.mode === 'edit')
  const membersQuery = useMembers()
  const queryError = membersQuery.error ?? (target.mode === 'edit' ? sportsQuery.error : null)
  const sports = sportsQuery.data
  const members = membersQuery.data
  const sport =
    target.mode === 'edit' ? sports?.find((candidate) => candidate.id === target.sportId) : undefined
  const title = target.mode === 'create' ? 'New Sport' : 'Edit Sport'
  const isLoading = membersQuery.isLoading || (target.mode === 'edit' && sportsQuery.isLoading)

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

  if (isLoading || !members || (target.mode === 'edit' && !sports)) {
    return (
      <DialogContent className="max-h-[92vh] overflow-y-auto sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>
        <p className="border bg-card px-4 py-3 text-body-sm text-text-secondary">
          Loading sport form.
        </p>
      </DialogContent>
    )
  }

  if (target.mode === 'edit' && !sport) {
    return (
      <DialogContent className="max-h-[92vh] overflow-y-auto sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>Edit Sport</DialogTitle>
        </DialogHeader>
        <p className="border border-destructive/30 bg-destructive/10 px-3 py-2 text-body-sm text-destructive">
          Sport not found.
        </p>
      </DialogContent>
    )
  }

  return (
    <SportEditorLoaded
      target={target}
      sport={sport ?? null}
      members={members}
      user={user}
    />
  )
}

function SportEditorLoaded({
  target,
  sport,
  members,
  user,
}: {
  target: SportEditorTarget
  sport: Sport | null
  members: MemberSummary[]
  user: AuthUser
}) {
  const editableFields = useMemo(
    () =>
      target.mode === 'create'
        ? sportCreatorFieldsForUser(user)
        : sport
          ? sportEditorFieldsForUser(sport, user)
          : [],
    [target.mode, sport, user],
  )
  const title = target.mode === 'create' ? 'New Sport' : 'Edit Sport'

  if (editableFields.length === 0) {
    return (
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          {sport && <DialogDescription>{sport.name}</DialogDescription>}
        </DialogHeader>
        <p className="border border-destructive/30 bg-destructive/10 px-3 py-2 text-body-sm text-destructive">
          {target.mode === 'create'
            ? 'You are not allowed to create sports.'
            : 'You are not allowed to update this sport.'}
        </p>
      </DialogContent>
    )
  }

  return (
    <SportEditorEditable
      target={target}
      sport={sport}
      members={members}
      editableFields={editableFields}
    />
  )
}

function SportEditorEditable({
  target,
  sport,
  members,
  editableFields,
}: {
  target: SportEditorTarget
  sport: Sport | null
  members: MemberSummary[]
  editableFields: readonly SportEditorField[]
}) {
  const closeSportEditor = useOrganizationUiStore((state) => state.closeSportEditor)
  const setMutationNotice = useOrganizationUiStore((state) => state.setMutationNotice)
  const createSport = useCreateSport()
  const updateSport = useUpdateSport()
  const [form, setForm] = useState(() =>
    target.mode === 'edit' && sport
      ? buildSportEditorInitialState(sport)
      : buildSportCreatorInitialState(),
  )
  const [directorSearch, setDirectorSearch] = useState('')
  const [formError, setFormError] = useState<string | null>(null)
  const fields = useMemo(() => new Set(editableFields), [editableFields])
  const directorOptions = useMemo(() => buildSportDirectorPickerOptions(members), [members])
  const isPending = createSport.isPending || updateSport.isPending
  const title = target.mode === 'create' ? 'New Sport' : 'Edit Sport'

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    const validationError = validateSportEditorForm(form, editableFields)
    if (validationError) {
      setFormError(validationError)
      return
    }

    setFormError(null)

    try {
      if (target.mode === 'create') {
        await createSport.mutateAsync(buildSportCreatePayload(form, editableFields))
        setMutationNotice('Sport created.')
        closeSportEditor()
        return
      }

      if (!sport) return

      const payload = buildSportUpdatePayload(sport, form, editableFields)
      if (Object.keys(payload).length === 0) {
        closeSportEditor()
        return
      }

      await updateSport.mutateAsync({ id: sport.id, ...payload })
      setMutationNotice('Sport updated.')
      closeSportEditor()
    } catch (error) {
      setFormError(serverErrorMessage(error))
    }
  }

  return (
    <DialogContent className="max-h-[92vh] overflow-y-auto sm:max-w-2xl">
      <DialogHeader>
        <DialogTitle>{title}</DialogTitle>
        {target.mode === 'edit' && sport && (
          <DialogDescription>{sport.directors.length} directors assigned</DialogDescription>
        )}
      </DialogHeader>

      <form className="space-y-5" onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {fields.has('name') && (
            <div className="space-y-1.5 sm:col-span-2">
              <Label htmlFor="sport-name">Name</Label>
              <Input
                id="sport-name"
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
              <Label htmlFor="sport-description">Description</Label>
              <Textarea
                id="sport-description"
                value={form.description}
                onChange={(event) => setForm({ ...form, description: event.target.value })}
                disabled={isPending}
                className="min-h-24"
              />
            </div>
          )}
        </div>

        {fields.has('directors') && (
          <MemberSelector
            label="Directors"
            searchId="sport-director-search"
            options={directorOptions}
            selectedIds={form.directorIds}
            search={directorSearch}
            disabled={isPending}
            onSearchChange={setDirectorSearch}
            onToggle={(id) =>
              setForm((current) => ({
                ...current,
                directorIds: toggleId(current.directorIds, id),
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
          <Button type="button" variant="outline" onClick={closeSportEditor} disabled={isPending}>
            Cancel
          </Button>
          <Button type="submit" disabled={isPending}>
            {isPending ? 'Saving' : target.mode === 'create' ? 'Create Sport' : 'Save Sport'}
          </Button>
        </DialogFooter>
      </form>
    </DialogContent>
  )
}
