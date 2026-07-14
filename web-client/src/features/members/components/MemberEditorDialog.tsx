import { type FormEvent, useMemo, useState } from 'react'
import { toast } from 'sonner'

import { DatePicker } from '@/components/ui/date-picker'
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
import { PasswordInput } from '@/components/ui/password-input'
import { PhoneInput } from '@/components/ui/phone-input'
import { Textarea } from '@/components/ui/textarea'
import { useAuth } from '@/features/auth'
import { formMutationErrorFields } from '@/lib/mutation-feedback'
import { serverErrorMessage } from '@/lib/server-error'
import { fieldError } from '@/lib/validation'
import { mutationFeedbackCopy } from '@/lib/mutation-feedback-copy'
import type { Member } from '@/types'
import { useCreateMember, useMember, useUpdateMember } from '../api/queries'
import {
  buildMemberCreatePayload,
  buildMemberCreatorInitialState,
  buildMemberEditorInitialState,
  buildMemberUpdatePayload,
  type MemberEditorFormState,
  validateMemberCreatorFieldErrors,
  validateMemberEditorFieldErrors,
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
          <DialogDescription className="sr-only">
            {target.mode === 'create' ? 'Create a club member.' : 'Update this club member.'}
          </DialogDescription>
        </DialogHeader>
        <ErrorNotice
          message={
            target.mode === 'create'
              ? 'You are not allowed to create members.'
              : 'You are not allowed to update this member.'
          }
          compact
        />
      </DialogContent>
    )
  }

  if (target.mode === 'edit') {
    if (memberQuery.error) {
      return (
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{title}</DialogTitle>
            <DialogDescription className="sr-only">Update this club member.</DialogDescription>
          </DialogHeader>
          <ErrorNotice
            message={serverErrorMessage(memberQuery.error)}
            onRetry={() => void memberQuery.refetch()}
            compact
          />
        </DialogContent>
      )
    }

    if (memberQuery.isLoading || !memberQuery.data) {
      return (
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{title}</DialogTitle>
            <DialogDescription className="sr-only">Update this club member.</DialogDescription>
          </DialogHeader>
          <DialogFormSkeleton />
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
  const createMember = useCreateMember()
  const updateMember = useUpdateMember()
  const [form, setForm] = useState<MemberEditorFormState>(() =>
    target.mode === 'edit' && member
      ? buildMemberEditorInitialState(member)
      : buildMemberCreatorInitialState(),
  )
  const [stepIndex, setStepIndex] = useState(0)
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
  const currentStepId = steps[stepIndex].id

  const firstNameError = fieldError(fieldErrors, 'firstName', 'first_name')
  const lastNameError = fieldError(fieldErrors, 'lastName', 'last_name')
  const emailError = fieldError(fieldErrors, 'email')
  const passwordError = fieldError(fieldErrors, 'password')
  const birthdayError = fieldError(fieldErrors, 'birthday')
  const phoneNumberError = fieldError(fieldErrors, 'phoneNumber', 'phone_number')
  const addressError = fieldError(fieldErrors, 'address')
  const informationError = fieldError(fieldErrors, 'information')

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setFieldErrors(null)

    const validateForm =
      target.mode === 'create' ? validateMemberCreatorFieldErrors : validateMemberEditorFieldErrors
    const stepFields =
      currentStepId === 'identity'
        ? (['firstName', 'lastName', 'email', 'password'] as const)
        : currentStepId === 'contact'
          ? (['birthday', 'phoneNumber'] as const)
          : undefined
    const validationErrors = isLastStep ? validateForm(form) : validateForm(form, stepFields)

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
        await createMember.mutateAsync(buildMemberCreatePayload(form))
        toast.success('Member created.')
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
      toast.success('Member updated.')
      closeEditor()
    } catch (error) {
      setFieldErrors(
        formMutationErrorFields(
          error,
          target.mode === 'create' ? mutationFeedbackCopy.member.create : mutationFeedbackCopy.member.update,
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
        {target.mode === 'edit' && member && (
          <DialogDescription>{member.email}</DialogDescription>
        )}
        {target.mode === 'create' && (
          <DialogDescription className="sr-only">Create a club member.</DialogDescription>
        )}
      </DialogHeader>

      <DialogStepperNav steps={steps} currentStep={stepIndex} />

      <form className="space-y-5" onSubmit={handleSubmit} noValidate>
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
                aria-invalid={firstNameError !== undefined}
              />
              {firstNameError && (
                <p className="text-caption text-destructive">{firstNameError}</p>
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
                aria-invalid={lastNameError !== undefined}
              />
              {lastNameError && (
                <p className="text-caption text-destructive">{lastNameError}</p>
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
                aria-invalid={emailError !== undefined}
              />
              {emailError && (
                <p className="text-caption text-destructive">{emailError}</p>
              )}
            </div>

            {target.mode === 'create' && (
              <div className="space-y-1.5 sm:col-span-2">
                <Label htmlFor="member-password">Initial password</Label>
                <PasswordInput
                  id="member-password"
                  autoComplete="new-password"
                  value={form.password}
                  onChange={(event) => setForm({ ...form, password: event.target.value })}
                  required
                  disabled={isPending}
                  aria-invalid={passwordError !== undefined}
                />
                {passwordError && (
                  <p className="text-caption text-destructive">{passwordError}</p>
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
                endMonth={new Date()}
                aria-invalid={birthdayError !== undefined}
              />
              {birthdayError && (
                <p className="text-caption text-destructive">{birthdayError}</p>
              )}
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="member-phone">Phone number</Label>
              <PhoneInput
                id="member-phone"
                aria-label="Phone number"
                value={form.phoneNumber}
                onChange={(value) => setForm({ ...form, phoneNumber: value })}
                disabled={isPending}
                aria-invalid={phoneNumberError !== undefined}
              />
              {phoneNumberError && (
                <p className="text-caption text-destructive">{phoneNumberError}</p>
              )}
            </div>

            <div className="space-y-1.5 sm:col-span-2">
              <Label htmlFor="member-address">Address</Label>
              <Input
                id="member-address"
                value={form.address}
                onChange={(event) => setForm({ ...form, address: event.target.value })}
                disabled={isPending}
                aria-invalid={addressError !== undefined}
              />
              {addressError && (
                <p className="text-caption text-destructive">{addressError}</p>
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
              aria-invalid={informationError !== undefined}
              className="min-h-24"
            />
            {informationError && (
              <p className="text-caption text-destructive">{informationError}</p>
            )}
          </div>
        )}

        <DialogStepperFooter
          isFirstStep={isFirstStep}
          isLastStep={isLastStep}
          isPending={isPending}
          submitLabel={target.mode === 'create' ? 'Create Member' : 'Save Member'}
          onCancel={closeEditor}
          onBack={() => {
            setStepIndex((current) => Math.max(current - 1, 0))
          }}
        />
      </form>
    </DialogContent>
  )
}
