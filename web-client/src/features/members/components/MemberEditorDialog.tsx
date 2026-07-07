import { type FormEvent, useMemo, useState } from 'react'

import { DatePicker } from '@/components/ui/date-picker'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { type DialogStep, DialogStepperFooter, DialogStepperNav } from '@/components/ui/dialog-stepper'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { useAuth } from '@/features/auth'
import { serverErrorFieldMessages, serverErrorMessage } from '@/lib/server-error'
import type { Member } from '@/types'
import { useCreateMember, useMember, useUpdateMember } from '../api/queries'
import {
  buildMemberCreatePayload,
  buildMemberCreatorInitialState,
  buildMemberEditorInitialState,
  buildMemberUpdatePayload,
  type MemberEditorFormState,
  validateMemberCreatorForm,
  validateMemberEditorForm,
} from '../model/memberEditor'
import { type MemberEditorTarget, useMembersUiStore } from '../model/membersUiStore'

export function MemberEditorDialog() {
  const target = useMembersUiStore((state) => state.editorTarget)
  const closeEditor = useMembersUiStore((state) => state.closeEditor)
  const key = target?.mode === 'edit' ? `member-edit-${target.memberId}` : target?.mode ?? 'closed'

  return (
    <Dialog open={target !== null} onOpenChange={(open) => !open && closeEditor()}>
      {target && <MemberEditorForm key={key} target={target} />}
    </Dialog>
  )
}

function MemberEditorForm({ target }: { target: MemberEditorTarget }) {
  const { user } = useAuth()
  const memberQuery = useMember(target.mode === 'edit' ? target.memberId : '')
  const title = target.mode === 'create' ? 'New Member' : 'Edit Member'

  if (user.role !== 'admin') {
    return (
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>
        <p className="border border-destructive/30 bg-destructive/10 px-3 py-2 text-body-sm text-destructive">
          {target.mode === 'create'
            ? 'You are not allowed to create members.'
            : 'You are not allowed to update this member.'}
        </p>
      </DialogContent>
    )
  }

  if (target.mode === 'edit') {
    if (memberQuery.error) {
      return (
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{title}</DialogTitle>
          </DialogHeader>
          <p className="border border-destructive/30 bg-destructive/10 px-3 py-2 text-body-sm text-destructive">
            {serverErrorMessage(memberQuery.error)}
          </p>
        </DialogContent>
      )
    }

    if (memberQuery.isLoading || !memberQuery.data) {
      return (
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{title}</DialogTitle>
          </DialogHeader>
          <p className="border bg-card px-4 py-3 text-body-sm text-text-secondary">
            Loading member form.
          </p>
        </DialogContent>
      )
    }

    return <MemberEditorEditable target={target} member={memberQuery.data} />
  }

  return <MemberEditorEditable target={target} member={null} />
}

function MemberEditorEditable({
  target,
  member,
}: {
  target: MemberEditorTarget
  member: Member | null
}) {
  const closeEditor = useMembersUiStore((state) => state.closeEditor)
  const setMutationNotice = useMembersUiStore((state) => state.setMutationNotice)
  const createMember = useCreateMember()
  const updateMember = useUpdateMember()
  const [form, setForm] = useState<MemberEditorFormState>(() =>
    target.mode === 'edit' && member
      ? buildMemberEditorInitialState(member)
      : buildMemberCreatorInitialState(),
  )
  const [stepIndex, setStepIndex] = useState(0)
  const [formError, setFormError] = useState<string | null>(null)
  const [fieldErrors, setFieldErrors] = useState<Record<string, string> | null>(null)
  const isPending = createMember.isPending || updateMember.isPending
  const title = target.mode === 'create' ? 'New Member' : 'Edit Member'
  const steps: DialogStep[] = useMemo(
    () => [
      { id: 'identity', label: 'Identity' },
      { id: 'contact', label: 'Contact' },
      { id: 'notes', label: 'Notes' },
    ],
    [],
  )
  const isFirstStep = stepIndex === 0
  const isLastStep = stepIndex === steps.length - 1

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    if (steps[stepIndex].id === 'identity') {
      const validationError =
        target.mode === 'create' ? validateMemberCreatorForm(form) : validateMemberEditorForm(form)
      if (validationError) {
        setFormError(validationError)
        setFieldErrors(null)
        return
      }
    }

    setFormError(null)
    setFieldErrors(null)

    if (!isLastStep) {
      setStepIndex((current) => current + 1)
      return
    }

    try {
      if (target.mode === 'create') {
        await createMember.mutateAsync(buildMemberCreatePayload(form))
        setMutationNotice('Member created.')
        closeEditor()
        return
      }

      if (!member) return

      const payload = buildMemberUpdatePayload(member, form)
      if (Object.keys(payload).length === 0) {
        closeEditor()
        return
      }

      await updateMember.mutateAsync({ id: member.id, ...payload })
      setMutationNotice('Member updated.')
      closeEditor()
    } catch (error) {
      setFormError(serverErrorMessage(error))
      setFieldErrors(serverErrorFieldMessages(error))
    }
  }

  return (
    <DialogContent className="roost-scroll max-h-[92vh] overflow-y-auto sm:max-w-2xl">
      <DialogHeader>
        <DialogTitle>{title}</DialogTitle>
        {target.mode === 'edit' && member && (
          <DialogDescription>{member.email}</DialogDescription>
        )}
      </DialogHeader>

      <DialogStepperNav steps={steps} currentStep={stepIndex} />

      <form className="space-y-5" onSubmit={handleSubmit}>
        {steps[stepIndex].id === 'identity' && (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="space-y-1.5">
              <Label htmlFor="member-first-name">First name</Label>
              <Input
                id="member-first-name"
                value={form.firstName}
                onChange={(event) => setForm({ ...form, firstName: event.target.value })}
                required
                disabled={isPending}
                aria-invalid={fieldErrors?.first_name !== undefined}
              />
              {fieldErrors?.first_name && (
                <p className="text-caption text-destructive">{fieldErrors.first_name}</p>
              )}
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="member-last-name">Last name</Label>
              <Input
                id="member-last-name"
                value={form.lastName}
                onChange={(event) => setForm({ ...form, lastName: event.target.value })}
                required
                disabled={isPending}
                aria-invalid={fieldErrors?.last_name !== undefined}
              />
              {fieldErrors?.last_name && (
                <p className="text-caption text-destructive">{fieldErrors.last_name}</p>
              )}
            </div>

            <div className="space-y-1.5 sm:col-span-2">
              <Label htmlFor="member-email">Email</Label>
              <Input
                id="member-email"
                type="email"
                value={form.email}
                onChange={(event) => setForm({ ...form, email: event.target.value })}
                required
                disabled={isPending}
                aria-invalid={fieldErrors?.email !== undefined}
              />
              {fieldErrors?.email && (
                <p className="text-caption text-destructive">{fieldErrors.email}</p>
              )}
            </div>

            {target.mode === 'create' && (
              <div className="space-y-1.5 sm:col-span-2">
                <Label htmlFor="member-password">Initial password</Label>
                <Input
                  id="member-password"
                  type="password"
                  autoComplete="new-password"
                  value={form.password}
                  onChange={(event) => setForm({ ...form, password: event.target.value })}
                  required
                  disabled={isPending}
                  aria-invalid={fieldErrors?.password !== undefined}
                />
                {fieldErrors?.password && (
                  <p className="text-caption text-destructive">{fieldErrors.password}</p>
                )}
              </div>
            )}
          </div>
        )}

        {steps[stepIndex].id === 'contact' && (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="space-y-1.5">
              <Label htmlFor="member-birthday">Birthday</Label>
              <DatePicker
                id="member-birthday"
                ariaLabel="Birthday"
                value={form.birthday}
                onChange={(value) => setForm({ ...form, birthday: value })}
                disabled={isPending}
                aria-invalid={fieldErrors?.birthday !== undefined}
              />
              {fieldErrors?.birthday && (
                <p className="text-caption text-destructive">{fieldErrors.birthday}</p>
              )}
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="member-phone">Phone number</Label>
              <Input
                id="member-phone"
                value={form.phoneNumber}
                onChange={(event) => setForm({ ...form, phoneNumber: event.target.value })}
                disabled={isPending}
                aria-invalid={fieldErrors?.phone_number !== undefined}
              />
              {fieldErrors?.phone_number && (
                <p className="text-caption text-destructive">{fieldErrors.phone_number}</p>
              )}
            </div>

            <div className="space-y-1.5 sm:col-span-2">
              <Label htmlFor="member-address">Address</Label>
              <Input
                id="member-address"
                value={form.address}
                onChange={(event) => setForm({ ...form, address: event.target.value })}
                disabled={isPending}
                aria-invalid={fieldErrors?.address !== undefined}
              />
              {fieldErrors?.address && (
                <p className="text-caption text-destructive">{fieldErrors.address}</p>
              )}
            </div>
          </div>
        )}

        {steps[stepIndex].id === 'notes' && (
          <div className="space-y-1.5">
            <Label htmlFor="member-information">Information</Label>
            <Textarea
              id="member-information"
              value={form.information}
              onChange={(event) => setForm({ ...form, information: event.target.value })}
              disabled={isPending}
              className="min-h-24"
            />
          </div>
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
          submitLabel={target.mode === 'create' ? 'Create Member' : 'Save Member'}
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
