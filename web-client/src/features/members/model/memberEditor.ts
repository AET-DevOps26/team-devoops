import type { Member, MemberCreate, MemberPartialUpdate } from '@/types'

export interface MemberEditorFormState {
  firstName: string
  lastName: string
  email: string
  password: string
  birthday: string
  phoneNumber: string
  address: string
  information: string
}

export function buildMemberCreatorInitialState(): MemberEditorFormState {
  return {
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    birthday: '',
    phoneNumber: '',
    address: '',
    information: '',
  }
}

export function buildMemberEditorInitialState(member: Member): MemberEditorFormState {
  return {
    firstName: member.first_name,
    lastName: member.last_name,
    email: member.email,
    password: '',
    birthday: member.birthday ?? '',
    phoneNumber: member.phone_number ?? '',
    address: member.address ?? '',
    information: member.information ?? '',
  }
}

export function validateMemberCreatorForm(form: MemberEditorFormState): string | null {
  if (form.firstName.trim() === '') return 'First name is required.'
  if (form.lastName.trim() === '') return 'Last name is required.'
  if (!isValidEmail(form.email)) return 'A valid email is required.'
  if (form.password.trim() === '') return 'Password is required.'

  return null
}

export function validateMemberEditorForm(form: MemberEditorFormState): string | null {
  if (form.firstName.trim() === '') return 'First name is required.'
  if (form.lastName.trim() === '') return 'Last name is required.'
  if (!isValidEmail(form.email)) return 'A valid email is required.'

  return null
}

export function buildMemberCreatePayload(form: MemberEditorFormState): MemberCreate {
  const payload: MemberCreate = {
    first_name: form.firstName.trim(),
    last_name: form.lastName.trim(),
    email: form.email.trim(),
    password: form.password,
  }

  const birthday = cleanOptionalText(form.birthday)
  const phoneNumber = cleanOptionalText(form.phoneNumber)
  const address = cleanOptionalText(form.address)
  const information = cleanOptionalText(form.information)

  if (birthday !== undefined) payload.birthday = birthday
  if (phoneNumber !== undefined) payload.phone_number = phoneNumber
  if (address !== undefined) payload.address = address
  if (information !== undefined) payload.information = information

  return payload
}

export function buildMemberUpdatePayload(
  member: Member,
  form: MemberEditorFormState,
): MemberPartialUpdate {
  const payload: MemberPartialUpdate = {}

  if (form.firstName.trim() !== member.first_name) payload.first_name = form.firstName.trim()
  if (form.lastName.trim() !== member.last_name) payload.last_name = form.lastName.trim()
  if (form.email.trim() !== member.email) payload.email = form.email.trim()
  // Birthday cannot currently be cleared via PATCH: the contract allows only dates,
  // and the service treats null like omission. Never send an empty string for a date.
  if (form.birthday !== (member.birthday ?? '') && form.birthday !== '') {
    payload.birthday = form.birthday
  }
  const phoneNumber = form.phoneNumber.trim()
  if (phoneNumber !== (member.phone_number ?? '')) payload.phone_number = phoneNumber

  const address = form.address.trim()
  if (address !== (member.address ?? '')) payload.address = address

  const information = form.information.trim()
  if (information !== (member.information ?? '')) payload.information = information

  return payload
}

export function buildMemberProfileUpdatePayload(
  member: Member,
  form: MemberEditorFormState,
): MemberPartialUpdate {
  const payload: MemberPartialUpdate = {}

  // Birthday cannot currently be cleared via PATCH: the contract allows only dates,
  // and the service treats null like omission. Never send an empty string for a date.
  if (form.birthday !== (member.birthday ?? '') && form.birthday !== '') {
    payload.birthday = form.birthday
  }

  const phoneNumber = form.phoneNumber.trim()
  if (phoneNumber !== (member.phone_number ?? '')) payload.phone_number = phoneNumber

  const address = form.address.trim()
  if (address !== (member.address ?? '')) payload.address = address

  const information = form.information.trim()
  if (information !== (member.information ?? '')) payload.information = information

  return payload
}

function isValidEmail(value: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim())
}

function cleanOptionalText(value: string): string | undefined {
  const cleaned = value.trim()
  return cleaned.length > 0 ? cleaned : undefined
}
