import { sameIds } from '@/lib/id-selection'
import {
  isTeamCoach,
  type AuthUser,
  type MemberRef,
  type MemberSummary,
  type Sport,
  type Team,
  type TeamPartialUpdate,
} from '@/types'

export type TeamEditorField =
  | 'name'
  | 'description'
  | 'address'
  | 'trainees'
  | 'sport'
  | 'trainers'

export const coachTeamEditorFields = [
  'name',
  'description',
  'address',
  'trainees',
] as const satisfies readonly TeamEditorField[]

export const directorTeamEditorFields = [
  'name',
  'description',
  'address',
  'trainees',
  'trainers',
] as const satisfies readonly TeamEditorField[]

export const adminTeamEditorFields = [
  'name',
  'description',
  'address',
  'trainees',
  'sport',
  'trainers',
] as const satisfies readonly TeamEditorField[]

export interface TeamEditorFormState {
  name: string
  description: string
  address: string
  traineeIds: string[]
}

export interface MemberPickerOption {
  id: string
  name: string
  meta?: string
}

export function buildTeamEditorInitialState(team: Team): TeamEditorFormState {
  return {
    name: team.name,
    description: team.description ?? '',
    address: team.address ?? '',
    traineeIds: team.trainees.map((member) => member.id),
  }
}

export function validateTeamEditorForm(
  form: TeamEditorFormState,
  fields: readonly TeamEditorField[],
): string | null {
  if (fields.includes('name') && form.name.trim() === '') {
    return 'Name is required.'
  }

  return null
}

export function buildTeamUpdatePayload(
  team: Team,
  form: TeamEditorFormState,
  fields: readonly TeamEditorField[],
): TeamPartialUpdate {
  const enabledFields = new Set(fields)
  const payload: TeamPartialUpdate = {}

  if (enabledFields.has('name')) {
    const name = form.name.trim()
    if (form.name !== team.name) payload.name = name
  }

  if (enabledFields.has('description')) {
    const description = form.description.trim()
    if (form.description !== (team.description ?? '')) payload.description = description
  }

  if (enabledFields.has('address')) {
    const address = form.address.trim()
    if (form.address !== (team.address ?? '')) payload.address = address
  }

  if (enabledFields.has('trainees')) {
    const currentTraineeIds = team.trainees.map((member) => member.id)
    if (!sameIds(form.traineeIds, currentTraineeIds)) payload.trainees = form.traineeIds
  }

  return payload
}

export function buildMemberPickerOptions(
  members: MemberSummary[],
  currentMembers: MemberRef[],
): MemberPickerOption[] {
  const options = new Map<string, MemberPickerOption>()

  for (const member of members) {
    options.set(member.id, {
      id: member.id,
      name: memberSummaryName(member),
      meta: member.email,
    })
  }

  for (const member of currentMembers) {
    if (!options.has(member.id)) {
      options.set(member.id, {
        id: member.id,
        name: member.name,
      })
    }
  }

  return Array.from(options.values()).toSorted((a, b) => a.name.localeCompare(b.name))
}

export function teamEditorFieldsForUser(
  team: Team,
  sports: readonly Sport[],
  user: AuthUser,
): readonly TeamEditorField[] {
  switch (user.role) {
    case 'admin':
      return adminTeamEditorFields
    case 'director':
      return isDirectorForTeam(team, sports, user.id) ? directorTeamEditorFields : []
    case 'trainer':
      return isTeamCoach(team, user.id) ? coachTeamEditorFields : []
    case 'member':
      return []
  }
}

function memberSummaryName(member: MemberSummary): string {
  const name = `${member.first_name} ${member.last_name}`.trim()
  return name || member.email
}

function isDirectorForTeam(team: Team, sports: readonly Sport[], userId: string): boolean {
  return (
    sports
      .find((sport) => sport.id === team.sport.id)
      ?.directors.some((director) => director.id === userId) ?? false
  )
}
