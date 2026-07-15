import { z } from 'zod'

import { pickFieldErrors, type FieldErrors, validateZodSchema } from '@/lib/validation'
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

const PHONE_NUMBER_PATTERN = /^\+?[0-9 ]+$/

const memberEditorFormSchema = z.object({
  firstName: z.string().trim().min(1, { message: 'First name is required.' }),
  lastName: z.string().trim().min(1, { message: 'Last name is required.' }),
  email: z.string().refine(isValidEmail, { message: 'A valid email is required.' }),
  password: z.string(),
  birthday: z
    .string()
    .refine(isValidOptionalDateOnly, { message: 'Birthday must be a valid date.' })
    .refine(isNotFutureOptionalDateOnly, {
      message: 'Birthday cannot be in the future.',
    }),
  phoneNumber: z.string().refine(isValidOptionalPhoneNumber, {
    message: 'Phone number can contain +, digits, and spaces only.',
  }),
  address: z.string(),
  information: z.string(),
})

const memberCreatorFormSchema = memberEditorFormSchema.extend({
  password: z.string().min(8, { message: 'Password must be at least 8 characters.' }),
})

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

export function validateMemberCreatorFieldErrors(
  form: MemberEditorFormState,
  fields?: readonly (keyof MemberEditorFormState)[],
): FieldErrors | null {
  return pickFieldErrors(validateZodSchema(memberCreatorFormSchema, form), fields ?? Object.keys(form))
}

export function validateMemberEditorFieldErrors(
  form: MemberEditorFormState,
  fields?: readonly (keyof MemberEditorFormState)[],
): FieldErrors | null {
  return pickFieldErrors(validateZodSchema(memberEditorFormSchema, form), fields ?? Object.keys(form))
}

export function validateMemberCreatorForm(form: MemberEditorFormState): string | null {
  return Object.values(validateMemberCreatorFieldErrors(form) ?? {})[0] ?? null
}

export function validateMemberEditorForm(form: MemberEditorFormState): string | null {
  return Object.values(validateMemberEditorFieldErrors(form) ?? {})[0] ?? null
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

// Members cannot change their own login identity.
export function buildMemberProfileUpdatePayload(
  member: Member,
  form: MemberEditorFormState,
): MemberPartialUpdate {
  const payload = buildMemberUpdatePayload(member, form)
  delete payload.email
  return payload
}

function isValidEmail(value: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim())
}

function isValidOptionalPhoneNumber(value: string): boolean {
  const cleaned = value.trim()
  return cleaned === '' || PHONE_NUMBER_PATTERN.test(cleaned)
}

function isValidOptionalDateOnly(value: string): boolean {
  const cleaned = value.trim()
  return cleaned === '' || parseDateOnly(cleaned) !== null
}

function isNotFutureOptionalDateOnly(value: string): boolean {
  const date = parseDateOnly(value.trim())
  if (!date) return true

  const today = new Date()
  today.setHours(0, 0, 0, 0)
  return date.getTime() <= today.getTime()
}

function parseDateOnly(value: string): Date | null {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value)
  if (!match) return null

  const year = Number(match[1])
  const month = Number(match[2])
  const day = Number(match[3])
  const date = new Date(year, month - 1, day)

  if (
    date.getFullYear() !== year ||
    date.getMonth() !== month - 1 ||
    date.getDate() !== day
  ) {
    return null
  }

  return date
}

function cleanOptionalText(value: string): string | undefined {
  const cleaned = value.trim()
  return cleaned.length > 0 ? cleaned : undefined
}
