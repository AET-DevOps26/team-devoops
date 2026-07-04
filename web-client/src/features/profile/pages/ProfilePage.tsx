import { type FormEvent, type ReactNode, useMemo, useState } from 'react'
import { Save, Undo2 } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { DatePicker } from '@/components/ui/date-picker'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { PageHeader } from '@/components/ui/page-header'
import { Skeleton } from '@/components/ui/skeleton'
import { Textarea } from '@/components/ui/textarea'
import { getCurrentUser } from '@/features/auth/currentUser'
import { useMember, useUpdateMember } from '@/features/members/api/queries'
import {
  buildMemberEditorInitialState,
  buildMemberProfileUpdatePayload,
  type MemberEditorFormState,
} from '@/features/members/model/memberEditor'
import { serverErrorFieldMessages, serverErrorMessage } from '@/lib/server-error'
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

  if (memberQuery.error || !memberQuery.data) {
    return (
      <ProfilePageFrame>
        <p className="border bg-card px-5 py-4 text-body-sm text-destructive">
          {memberQuery.error
            ? serverErrorMessage(memberQuery.error)
            : 'Your profile could not be loaded.'}
        </p>
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
  const [notice, setNotice] = useState<string | null>(null)
  const [formError, setFormError] = useState<string | null>(null)
  const [fieldErrors, setFieldErrors] = useState<Record<string, string> | null>(null)
  const payload = useMemo(() => buildMemberProfileUpdatePayload(member, form), [form, member])
  const hasChanges = Object.keys(payload).length > 0
  const isPending = updateMember.isPending

  const handleCancel = () => {
    setForm(buildMemberEditorInitialState(member))
    setNotice(null)
    setFormError(null)
    setFieldErrors(null)
  }

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    if (!hasChanges) {
      setNotice('No profile changes to save.')
      setFormError(null)
      setFieldErrors(null)
      return
    }

    try {
      setNotice(null)
      setFormError(null)
      setFieldErrors(null)

      const updated = await updateMember.mutateAsync({ id: currentUserId, ...payload })
      setForm(buildMemberEditorInitialState(updated))
      setNotice('Profile updated.')
    } catch (error) {
      setFormError(serverErrorMessage(error))
      setFieldErrors(serverErrorFieldMessages(error))
    }
  }

  return (
    <>
      {notice && (
        <p
          role="status"
          className="border border-primary/25 bg-primary/8 px-4 py-3 text-body-sm text-text-primary"
        >
          {notice}
        </p>
      )}

      <form className="border bg-card" onSubmit={handleSubmit}>
        <section className="border-b px-5 py-5">
          <div className="mb-4">
            <h2 className="text-h3 font-semibold text-text-primary">Identity</h2>
            <p className="mt-1 text-body-sm text-text-tertiary">
              Name and email are managed by your account identity.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <ReadOnlyField id="profile-first-name" label="First name" value={form.firstName} />
            <ReadOnlyField id="profile-last-name" label="Last name" value={form.lastName} />
            <div className="space-y-1.5 sm:col-span-2">
              <Label htmlFor="profile-email">Email</Label>
              <Input
                id="profile-email"
                type="email"
                value={form.email}
                readOnly
                aria-readonly="true"
                className="bg-muted/30 text-text-secondary"
              />
              <p className="text-caption text-text-tertiary">Managed in your account.</p>
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
                aria-invalid={fieldErrors?.birthday !== undefined}
              />
              {fieldErrors?.birthday && (
                <p className="text-caption text-destructive">{fieldErrors.birthday}</p>
              )}
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="profile-phone">Phone number</Label>
              <Input
                id="profile-phone"
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
              <Label htmlFor="profile-address">Address</Label>
              <Input
                id="profile-address"
                value={form.address}
                onChange={(event) => setForm({ ...form, address: event.target.value })}
                disabled={isPending}
                aria-invalid={fieldErrors?.address !== undefined}
              />
              {fieldErrors?.address && (
                <p className="text-caption text-destructive">{fieldErrors.address}</p>
              )}
            </div>

            <div className="space-y-1.5 sm:col-span-2">
              <Label htmlFor="profile-information">Information</Label>
              <Textarea
                id="profile-information"
                value={form.information}
                onChange={(event) => setForm({ ...form, information: event.target.value })}
                disabled={isPending}
                aria-invalid={fieldErrors?.information !== undefined}
                className="min-h-28"
              />
              {fieldErrors?.information && (
                <p className="text-caption text-destructive">{fieldErrors.information}</p>
              )}
            </div>
          </div>
        </section>

        {formError && (
          <p className="mx-5 mb-5 border border-destructive/30 bg-destructive/10 px-3 py-2 text-body-sm text-destructive">
            {formError}
          </p>
        )}

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
          <Button type="submit" disabled={isPending || !hasChanges}>
            <Save data-icon="inline-start" />
            {isPending ? 'Saving' : 'Save profile'}
          </Button>
        </div>
      </form>
    </>
  )
}

function ReadOnlyField({ id, label, value }: { id: string; label: string; value: string }) {
  return (
    <div className="space-y-1.5">
      <Label htmlFor={id}>{label}</Label>
      <Input
        id={id}
        value={value}
        readOnly
        aria-readonly="true"
        className="bg-muted/30 text-text-secondary"
      />
    </div>
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
