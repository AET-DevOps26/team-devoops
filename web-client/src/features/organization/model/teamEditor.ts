import { sameIds } from '@/lib/id-selection'
import {
  isTeamCoach,
  type AuthUser,
  type MemberRef,
  type MemberSummary,
  type Sport,
  type Team,
  type TeamCreate,
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

export const teamCreatorFields = [
  'name',
  'description',
  'address',
  'sport',
  'trainers',
  'trainees',
] as const satisfies readonly TeamEditorField[]

export interface TeamEditorFormState {
  name: string
  description: string
  address: string
  sportId: string
  trainerIds: string[]
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
    sportId: team.sport.id,
    trainerIds: team.trainers.map((member) => member.id),
    traineeIds: team.trainees.map((member) => member.id),
  }
}

export function buildTeamCreatorInitialState(
  sports: readonly Sport[],
  user: AuthUser,
): TeamEditorFormState {
  return {
    name: '',
    description: '',
    address: '',
    sportId: manageableSportsForUser(sports, user)[0]?.id ?? '',
    trainerIds: [],
    traineeIds: [],
  }
}

export function validateTeamEditorForm(
  form: TeamEditorFormState,
  fields: readonly TeamEditorField[],
): string | null {
  if (fields.includes('name') && form.name.trim() === '') {
    return 'Name is required.'
  }

  if (fields.includes('sport') && form.sportId === '') {
    return 'Select a sport.'
  }

  return null
}

export function buildTeamCreatePayload(form: TeamEditorFormState): TeamCreate {
  const payload: TeamCreate = {
    name: form.name.trim(),
    sport: form.sportId,
    trainers: form.trainerIds,
    trainees: form.traineeIds,
  }
  const description = cleanOptionalText(form.description)
  const address = cleanOptionalText(form.address)

  if (description !== undefined) payload.description = description
  if (address !== undefined) payload.address = address

  return payload
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

  if (enabledFields.has('sport') && form.sportId !== team.sport.id) {
    payload.sport = form.sportId
  }

  if (enabledFields.has('trainers')) {
    const currentTrainerIds = team.trainers.map((member) => member.id)
    if (!sameIds(form.trainerIds, currentTrainerIds)) payload.trainers = form.trainerIds
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

export function teamCreatorFieldsForUser(
  sports: readonly Sport[],
  user: AuthUser,
): readonly TeamEditorField[] {
  if (user.role !== 'admin' && user.role !== 'director') return []
  return manageableSportsForUser(sports, user).length > 0 ? teamCreatorFields : []
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

export function manageableSportsForUser(sports: readonly Sport[], user: AuthUser): Sport[] {
  if (user.role === 'admin') return [...sports]
  if (user.role === 'director') {
    return sports.filter((sport) => isSportDirector(sport, user.id))
  }

  return []
}

export function canDeleteTeamForUser(
  team: Pick<Team, 'sport'>,
  sports: readonly Sport[],
  user: AuthUser,
): boolean {
  if (user.role === 'admin') return true
  if (user.role === 'director') return isDirectorForTeam(team, sports, user.id)
  return false
}

function memberSummaryName(member: MemberSummary): string {
  const name = `${member.first_name} ${member.last_name}`.trim()
  return name || member.email
}

function isDirectorForTeam(
  team: Pick<Team, 'sport'>,
  sports: readonly Sport[],
  userId: string,
): boolean {
  return (
    sports
      .find((sport) => sport.id === team.sport.id)
      ?.directors.some((director) => director.id === userId) ?? false
  )
}

function isSportDirector(sport: Sport, userId: string): boolean {
  return sport.directors.some((director) => director.id === userId)
}

function cleanOptionalText(value: string): string | undefined {
  const cleaned = value.trim()
  return cleaned.length > 0 ? cleaned : undefined
}
