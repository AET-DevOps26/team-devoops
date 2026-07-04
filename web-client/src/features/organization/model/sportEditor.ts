import { sameIds } from '@/lib/id-selection'
import { memberSummaryName } from '@/lib/format'
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

export function validateSportEditorForm(
  form: SportEditorFormState,
  fields: readonly SportEditorField[],
): string | null {
  if (fields.includes('name') && form.name.trim() === '') {
    return 'Name is required.'
  }

  return null
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

// Directors are members who already hold the director role — approximated client-side as "is a
// director of at least one sport", since role isn't a field on MemberSummary. Current directors of
// the sport being edited stay selectable even if this is their only directorship.
export function buildSportDirectorPickerOptions(
  members: MemberSummary[],
  sports: readonly Sport[],
  currentDirectors: readonly MemberRef[] = [],
): SportDirectorPickerOption[] {
  const directorIds = new Set(sports.flatMap((sport) => sport.directors.map((director) => director.id)))
  for (const director of currentDirectors) directorIds.add(director.id)

  return members
    .filter((member) => directorIds.has(member.id))
    .map((member) => ({
      id: member.id,
      name: memberSummaryName(member),
      meta: member.email,
    }))
    .toSorted((a, b) => a.name.localeCompare(b.name))
}

function isSportDirector(sport: Sport, userId: string): boolean {
  return sport.directors.some((director) => director.id === userId)
}

function cleanOptionalText(value: string): string | undefined {
  const cleaned = value.trim()
  return cleaned.length > 0 ? cleaned : undefined
}
