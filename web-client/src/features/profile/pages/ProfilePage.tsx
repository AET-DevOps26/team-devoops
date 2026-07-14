import { type FormEvent, type ReactNode, useMemo, useState } from 'react'
import { Save, Undo2 } from 'lucide-react'
import { toast } from 'sonner'

import { Button } from '@/components/ui/button'
import { DatePicker } from '@/components/ui/date-picker'
import { ErrorNotice } from '@/components/ui/ErrorNotice'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { PageHeader } from '@/components/ui/page-header'
import { PendingButton } from '@/components/ui/pending-button'
import { Skeleton } from '@/components/ui/skeleton'
import { Textarea } from '@/components/ui/textarea'
import { getCurrentUser } from '@/features/auth/currentUser'
import { useMember, useUpdateMember } from '@/features/members/api/queries'
import {
  buildMemberEditorInitialState,
  buildMemberProfileUpdatePayload,
  type MemberEditorFormState,
  validateMemberEditorFieldErrors,
} from '@/features/members/model/memberEditor'
import keycloak from '@/lib/keycloak'
import { formMutationErrorFields } from '@/lib/mutation-feedback'
import { serverErrorMessage } from '@/lib/server-error'
import { mutationFeedbackCopy } from '@/lib/mutation-feedback-copy'
import { fieldError } from '@/lib/validation'
import type { Member } from '@/types'

export function ProfilePage() {
  const currentUser = getCurrentUser()
  const memberQuery = useMember(currentUser.id)

  if (!currentUser.id) {
    return (
      <ProfilePageFrame>
        <p className="border bg-card px-5 py-4 text-body-sm text-destructive">
          Your account is missing a member id.
        </p>
      </ProfilePageFrame>
    )
  }

  if (memberQuery.isLoading) {
    return (
      <ProfilePageFrame>
        <ProfileFormSkeleton />
      </ProfilePageFrame>
    )
  }

  if (memberQuery.error) {
    return (
      <ProfilePageFrame>
        <ErrorNotice message={serverErrorMessage(memberQuery.error)} onRetry={memberQuery.refetch} />
      </ProfilePageFrame>
    )
  }

  if (!memberQuery.data) {
    return (
      <ProfilePageFrame>
        <ErrorNotice message="Your profile could not be loaded." onRetry={memberQuery.refetch} />
      </ProfilePageFrame>
    )
  }

  return (
    <ProfilePageFrame>
      <ProfileForm key={currentUser.id} currentUserId={currentUser.id} member={memberQuery.data} />
    </ProfilePageFrame>
  )
}

function ProfilePageFrame({ children }: { children: ReactNode }) {
  return (
    <div className="mx-auto flex w-full max-w-content flex-col gap-6">
      <PageHeader
        eyebrow="Account"
        title="Profile"
        subtitle="Your club profile details."
      />
      {children}
    </div>
  )
}

function ProfileForm({ currentUserId, member }: { currentUserId: string; member: Member }) {
  const updateMember = useUpdateMember()
  const [form, setForm] = useState<MemberEditorFormState>(() =>
    buildMemberEditorInitialState(member),
  )
  const [fieldErrors, setFieldErrors] = useState<Record<string, string> | null>(null)
  const payload = useMemo(() => buildMemberProfileUpdatePayload(member, form), [form, member])
  const hasChanges = Object.keys(payload).length > 0
  const isPending = updateMember.isPending
  const firstNameError = fieldError(fieldErrors, 'firstName', 'first_name')
  const lastNameError = fieldError(fieldErrors, 'lastName', 'last_name')
  const birthdayError = fieldError(fieldErrors, 'birthday')
  const phoneNumberError = fieldError(fieldErrors, 'phoneNumber', 'phone_number')
  const addressError = fieldError(fieldErrors, 'address')
  const informationError = fieldError(fieldErrors, 'information')

  const handleCancel = () => {
    setForm(buildMemberEditorInitialState(member))
    setFieldErrors(null)
  }

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setFieldErrors(null)

    const validationErrors = validateMemberEditorFieldErrors(form)
    if (validationErrors) {
      setFieldErrors(validationErrors)
      return
    }

    if (!hasChanges) {
      toast.info('No profile changes to save.')
      return
    }

    try {
      const updated = await updateMember.mutateAsync({ id: currentUserId, ...payload })
      setForm(buildMemberEditorInitialState(updated))
      // The token's name claim is a login-time snapshot; force a refresh so the sidebar
      // and dashboard greeting (both sourced from getCurrentUser()) pick up the new name.
      await keycloak.updateToken(-1).catch(() => undefined)
      toast.success('Profile updated.')
    } catch (error) {
      setFieldErrors(formMutationErrorFields(error, mutationFeedbackCopy.profile.update))
    }
  }

  return (
    <>
      <form className="border bg-card" onSubmit={handleSubmit} noValidate>
        <section className="border-b px-5 py-5">
          <div className="mb-4">
            <h2 className="text-h3 font-semibold text-text-primary">Identity</h2>
            <p className="mt-1 text-body-sm text-text-tertiary">
              Your name and sign-in email.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="space-y-1.5">
              <Label htmlFor="profile-first-name">First name</Label>
              <Input
                id="profile-first-name"
                value={form.firstName}
                onChange={(event) => setForm({ ...form, firstName: event.target.value })}
                disabled={isPending}
                aria-invalid={firstNameError !== undefined}
              />
              {firstNameError && (
                <p className="text-caption text-destructive">{firstNameError}</p>
              )}
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="profile-last-name">Last name</Label>
              <Input
                id="profile-last-name"
                value={form.lastName}
                onChange={(event) => setForm({ ...form, lastName: event.target.value })}
                disabled={isPending}
                aria-invalid={lastNameError !== undefined}
              />
              {lastNameError && (
                <p className="text-caption text-destructive">{lastNameError}</p>
              )}
            </div>

            <div className="space-y-1.5 sm:col-span-2">
              <Label htmlFor="profile-email">Email</Label>
              <Input id="profile-email" type="email" value={form.email} readOnly disabled />
            </div>
          </div>
        </section>

        <section className="px-5 py-5">
          <div className="mb-4">
            <h2 className="text-h3 font-semibold text-text-primary">Club details</h2>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="space-y-1.5">
              <Label htmlFor="profile-birthday">Birthday</Label>
              <DatePicker
                id="profile-birthday"
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
              <Label htmlFor="profile-phone">Phone number</Label>
              <Input
                id="profile-phone"
                value={form.phoneNumber}
                onChange={(event) => setForm({ ...form, phoneNumber: event.target.value })}
                disabled={isPending}
                aria-invalid={phoneNumberError !== undefined}
              />
              {phoneNumberError && (
                <p className="text-caption text-destructive">{phoneNumberError}</p>
              )}
            </div>

            <div className="space-y-1.5 sm:col-span-2">
              <Label htmlFor="profile-address">Address</Label>
              <Input
                id="profile-address"
                value={form.address}
                onChange={(event) => setForm({ ...form, address: event.target.value })}
                disabled={isPending}
                aria-invalid={addressError !== undefined}
              />
              {addressError && (
                <p className="text-caption text-destructive">{addressError}</p>
              )}
            </div>

            <div className="space-y-1.5 sm:col-span-2">
              <Label htmlFor="profile-information">Information</Label>
              <Textarea
                id="profile-information"
                value={form.information}
                onChange={(event) => setForm({ ...form, information: event.target.value })}
                disabled={isPending}
                aria-invalid={informationError !== undefined}
                className="min-h-28"
              />
              {informationError && (
                <p className="text-caption text-destructive">{informationError}</p>
              )}
            </div>
          </div>
        </section>

        <div className="flex flex-col-reverse gap-2 border-t px-5 py-4 sm:flex-row sm:justify-end">
          <Button
            type="button"
            variant="outline"
            onClick={handleCancel}
            disabled={isPending || !hasChanges}
          >
            <Undo2 data-icon="inline-start" />
            Cancel
          </Button>
          <PendingButton
            type="submit"
            disabled={!hasChanges}
            isPending={isPending}
            pendingLabel="Saving…"
          >
            <Save data-icon="inline-start" />
            Save profile
          </PendingButton>
        </div>
      </form>
    </>
  )
}

function ProfileFormSkeleton() {
  return (
    <div className="border bg-card p-5">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {Array.from({ length: 6 }).map((_, index) => (
          <Skeleton key={index} className="h-10 w-full" />
        ))}
      </div>
    </div>
  )
}
