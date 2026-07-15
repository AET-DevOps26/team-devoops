import { z } from 'zod'

import { sameIds } from '@/lib/id-selection'
import { memberSummaryName } from '@/lib/format'
import { type FieldErrors, validateZodSchema } from '@/lib/validation'
import { roleMeta, roleSort } from './rolePickerOptions'
import type {
  AuthUser,
  MemberRef,
  MemberSummary,
  Sport,
  SportCreate,
  SportPartialUpdate,
} from '@/types'

export type SportEditorField = 'name' | 'description' | 'directors'

export const directorSportEditorFields = [
  'name',
  'description',
] as const satisfies readonly SportEditorField[]

export const adminSportEditorFields = [
  'name',
  'description',
  'directors',
] as const satisfies readonly SportEditorField[]

export const sportCreatorFields = [
  'name',
  'description',
  'directors',
] as const satisfies readonly SportEditorField[]

export interface SportEditorFormState {
  name: string
  description: string
  directorIds: string[]
}

export interface SportDirectorPickerOption {
  id: string
  name: string
  meta?: string
}

export function buildSportEditorInitialState(sport: Sport): SportEditorFormState {
  return {
    name: sport.name,
    description: sport.description ?? '',
    directorIds: sport.directors.map((member) => member.id),
  }
}

export function buildSportCreatorInitialState(): SportEditorFormState {
  return {
    name: '',
    description: '',
    directorIds: [],
  }
}

export function validateSportEditorFieldErrors(
  form: SportEditorFormState,
  fields: readonly SportEditorField[],
): FieldErrors | null {
  const enabledFields = new Set(fields)
  const schema = z.object({
    name: z.string(),
    description: z.string(),
    directorIds: z.array(z.string()),
  }).superRefine((value, ctx) => {
    if (enabledFields.has('name') && value.name.trim() === '') {
      ctx.addIssue({ code: 'custom', path: ['name'], message: 'Name is required.' })
    }
  })

  return validateZodSchema(schema, form)
}

export function validateSportEditorForm(
  form: SportEditorFormState,
  fields: readonly SportEditorField[],
): string | null {
  return Object.values(validateSportEditorFieldErrors(form, fields) ?? {})[0] ?? null
}

export function buildSportCreatePayload(
  form: SportEditorFormState,
  fields: readonly SportEditorField[] = sportCreatorFields,
): SportCreate {
  const enabledFields = new Set(fields)
  const payload: SportCreate = {
    name: form.name.trim(),
  }
  const description = cleanOptionalText(form.description)

  if (description !== undefined) payload.description = description
  if (enabledFields.has('directors')) payload.directors = form.directorIds

  return payload
}

export function buildSportUpdatePayload(
  sport: Sport,
  form: SportEditorFormState,
  fields: readonly SportEditorField[],
): SportPartialUpdate {
  const enabledFields = new Set(fields)
  const payload: SportPartialUpdate = {}

  if (enabledFields.has('name')) {
    const name = form.name.trim()
    if (form.name !== sport.name) payload.name = name
  }

  if (enabledFields.has('description')) {
    const description = form.description.trim()
    if (form.description !== (sport.description ?? '')) payload.description = description
  }

  if (enabledFields.has('directors')) {
    const currentDirectorIds = sport.directors.map((member) => member.id)
    if (!sameIds(form.directorIds, currentDirectorIds)) payload.directors = form.directorIds
  }

  return payload
}

export function sportCreatorFieldsForUser(user: AuthUser): readonly SportEditorField[] {
  return user.role === 'admin' ? sportCreatorFields : []
}

export function sportEditorFieldsForUser(
  sport: Sport,
  user: AuthUser,
): readonly SportEditorField[] {
  if (user.role === 'admin') return adminSportEditorFields
  if (user.role === 'director' && isSportDirector(sport, user.id)) {
    return directorSportEditorFields
  }

  return []
}

// Assignments grant the derived Keycloak role, so every member remains selectable.
export function buildSportDirectorPickerOptions(
  members: MemberSummary[],
  sports: readonly Sport[],
  currentDirectors: readonly MemberRef[] = [],
): SportDirectorPickerOption[] {
  const directorIds = new Set(sports.flatMap((sport) => sport.directors.map((director) => director.id)))
  for (const director of currentDirectors) directorIds.add(director.id)

  return buildDirectorMemberOptions(members, currentDirectors)
    .map((option) =>
      directorIds.has(option.id)
        ? { ...option, meta: roleMeta('Director', option.meta) }
        : option,
    )
    .toSorted((a, b) => roleSort(directorIds, a, b))
}

function isSportDirector(sport: Sport, userId: string): boolean {
  return sport.directors.some((director) => director.id === userId)
}

function cleanOptionalText(value: string): string | undefined {
  const cleaned = value.trim()
  return cleaned.length > 0 ? cleaned : undefined
}

function buildDirectorMemberOptions(
  members: MemberSummary[],
  currentDirectors: readonly MemberRef[],
): SportDirectorPickerOption[] {
  const options = new Map<string, SportDirectorPickerOption>()

  for (const member of members) {
    options.set(member.id, {
      id: member.id,
      name: memberSummaryName(member),
      meta: member.email,
    })
  }

  for (const director of currentDirectors) {
    if (!options.has(director.id)) {
      options.set(director.id, {
        id: director.id,
        name: director.name,
      })
    }
  }

  return Array.from(options.values())
}
