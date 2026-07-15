import { type FormEvent, useMemo, useState } from 'react'
import { toast } from 'sonner'

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
import { Textarea } from '@/components/ui/textarea'
import { useAuth } from '@/features/auth'
import { useMembers } from '@/features/members/api/queries'
import { toggleId } from '@/lib/id-selection'
import { formMutationErrorFields } from '@/lib/mutation-feedback'
import { serverErrorMessage } from '@/lib/server-error'
import { fieldError } from '@/lib/validation'
import { mutationFeedbackCopy } from '@/lib/mutation-feedback-copy'
import type { AuthUser, MemberSummary, Sport } from '@/types'
import { useCreateSport, useSportsList, useUpdateSport } from '../api/queries'
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
  validateSportEditorFieldErrors,
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
  const sportsQuery = useSportsList()
  const membersQuery = useMembers()
  const queryError = membersQuery.error ?? sportsQuery.error
  const sports = sportsQuery.data
  const members = membersQuery.data
  const sport =
    target.mode === 'edit' ? sports?.find((candidate) => candidate.id === target.sportId) : undefined
  const title = target.mode === 'create' ? 'New Sport' : 'Edit Sport'
  const isLoading = membersQuery.isLoading || sportsQuery.isLoading

  if (queryError) {
    return (
      <DialogContent className="roost-scroll max-h-[92vh] overflow-y-auto sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription className="sr-only">
            {target.mode === 'create' ? 'Create a sport.' : 'Update this sport.'}
          </DialogDescription>
        </DialogHeader>
        <ErrorNotice
          message={serverErrorMessage(queryError)}
          onRetry={() => {
            void membersQuery.refetch()
            void sportsQuery.refetch()
          }}
          compact
        />
      </DialogContent>
    )
  }

  if (isLoading || !members || !sports) {
    return (
      <DialogContent className="roost-scroll max-h-[92vh] overflow-y-auto sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription className="sr-only">
            {target.mode === 'create' ? 'Create a sport.' : 'Update this sport.'}
          </DialogDescription>
        </DialogHeader>
        <DialogFormSkeleton />
      </DialogContent>
    )
  }

  if (target.mode === 'edit' && !sport) {
    return (
      <DialogContent className="roost-scroll max-h-[92vh] overflow-y-auto sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>Edit Sport</DialogTitle>
          <DialogDescription className="sr-only">Update this sport.</DialogDescription>
        </DialogHeader>
        <ErrorNotice message="Sport not found." compact />
      </DialogContent>
    )
  }

  return (
    <SportEditorLoaded
      target={target}
      sport={sport ?? null}
      sports={sports}
      members={members}
      user={user}
    />
  )
}

function SportEditorLoaded({
  target,
  sport,
  sports,
  members,
  user,
}: {
  target: SportEditorTarget
  sport: Sport | null
  sports: Sport[]
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
          {!sport && <DialogDescription className="sr-only">Create a sport.</DialogDescription>}
        </DialogHeader>
        <ErrorNotice
          message={
            target.mode === 'create'
              ? 'You are not allowed to create sports.'
              : 'You are not allowed to update this sport.'
          }
          compact
        />
      </DialogContent>
    )
  }

  return (
    <SportEditorEditable
      target={target}
      sport={sport}
      sports={sports}
      members={members}
      editableFields={editableFields}
    />
  )
}

function SportEditorEditable({
  target,
  sport,
  sports,
  members,
  editableFields,
}: {
  target: SportEditorTarget
  sport: Sport | null
  sports: Sport[]
  members: MemberSummary[]
  editableFields: readonly SportEditorField[]
}) {
  const closeSportEditor = useOrganizationUiStore((state) => state.closeSportEditor)
  const createSport = useCreateSport()
  const updateSport = useUpdateSport()
  const [form, setForm] = useState(() =>
    target.mode === 'edit' && sport
      ? buildSportEditorInitialState(sport)
      : buildSportCreatorInitialState(),
  )
  const [stepIndex, setStepIndex] = useState(0)
  const [fieldErrors, setFieldErrors] = useState<Record<string, string> | null>(null)
  const fields = useMemo(() => new Set(editableFields), [editableFields])
  const directorOptions = useMemo(
    () => buildSportDirectorPickerOptions(members, sports, sport?.directors ?? []),
    [members, sports, sport?.directors],
  )
  const isPending = createSport.isPending || updateSport.isPending
  const title = target.mode === 'create' ? 'New Sport' : 'Edit Sport'
  const steps: DialogStep[] = useMemo(() => {
    const stepList: DialogStep[] = [{ id: 'details', label: 'Details' }]
    if (fields.has('directors')) stepList.push({ id: 'directors', label: 'Directors' })
    return stepList
  }, [fields])
  const isFirstStep = stepIndex === 0
  const isLastStep = stepIndex === steps.length - 1
  const nameError = fieldError(fieldErrors, 'name')
  const descriptionError = fieldError(fieldErrors, 'description')
  const directorsError = fieldError(fieldErrors, 'directorIds', 'directors')

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setFieldErrors(null)

    if (steps[stepIndex].id === 'details') {
      const validationErrors = validateSportEditorFieldErrors(form, editableFields)
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
        await createSport.mutateAsync(buildSportCreatePayload(form, editableFields))
        toast.success('Sport created.')
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
      toast.success('Sport updated.')
      closeSportEditor()
    } catch (error) {
      setFieldErrors(
        formMutationErrorFields(
          error,
          target.mode === 'create' ? mutationFeedbackCopy.sport.create : mutationFeedbackCopy.sport.update,
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
        {target.mode === 'edit' && sport && (
          <DialogDescription>{sport.directors.length} directors assigned</DialogDescription>
        )}
        {target.mode === 'create' && (
          <DialogDescription className="sr-only">Create a sport.</DialogDescription>
        )}
      </DialogHeader>

      {steps.length > 1 && <DialogStepperNav steps={steps} currentStep={stepIndex} />}

      <form className="space-y-5" onSubmit={handleSubmit} noValidate>
        {steps[stepIndex].id === 'details' && (
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
                  aria-invalid={nameError !== undefined}
                />
                {nameError && (
                  <p className="text-caption text-destructive">{nameError}</p>
                )}
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
                  aria-invalid={descriptionError !== undefined}
                  className="min-h-24"
                />
                {descriptionError && (
                  <p className="text-caption text-destructive">{descriptionError}</p>
                )}
              </div>
            )}
          </div>
        )}

        {steps[stepIndex].id === 'directors' && (
          <div className="space-y-1.5">
            <MultiSelectCombobox
              label="Directors"
              placeholder="Search and select directors..."
              emptyLabel="No members available."
              emptySearchLabel="No directors match that search."
              options={directorOptions.map((option) => ({ ...option, label: option.name }))}
              selectedIds={form.directorIds}
              disabled={isPending}
              onToggle={(id) =>
                setForm((current) => ({
                  ...current,
                  directorIds: toggleId(current.directorIds, id),
                }))
              }
            />
            {directorsError && (
              <p className="text-caption text-destructive">{directorsError}</p>
            )}
          </div>
        )}

        <DialogStepperFooter
          isFirstStep={isFirstStep}
          isLastStep={isLastStep}
          isPending={isPending}
          submitLabel={target.mode === 'create' ? 'Create Sport' : 'Save Sport'}
          onCancel={closeSportEditor}
          onBack={() => {
            setStepIndex((current) => Math.max(current - 1, 0))
          }}
        />
      </form>
    </DialogContent>
  )
}
