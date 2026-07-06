import { sameIds } from '@/lib/id-selection'
import type {
  AuthUser,
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

export function buildSportDirectorPickerOptions(
  members: MemberSummary[],
): SportDirectorPickerOption[] {
  return members
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

function memberSummaryName(member: MemberSummary): string {
  const name = `${member.first_name} ${member.last_name}`.trim()
  return name || member.email
}

function cleanOptionalText(value: string): string | undefined {
  const cleaned = value.trim()
  return cleaned.length > 0 ? cleaned : undefined
}
