import {
  memberNamesById,
  sportFixtures as sportFixturesSource,
  teamFixtures as teamFixturesSource,
} from '@/testing/fixtures'
import { httpError } from '@/testing/httpError'
import { isTeamCoach, type AuthUser, type MemberRef } from '@/types'
import type {
  Sport,
  SportCreate,
  SportPartialUpdate,
  Team,
  TeamCreate,
  TeamPartialUpdate,
} from '@/features/organization/types'

let sportFixtures: Sport[] = []
let teamFixtures: Team[] = []
let sportsById: Record<string, Sport> = {}
const pendingTeamUpdates = new Set<string>()

export function reset(): void {
  sportFixtures = sportFixturesSource.map(cloneSport)
  teamFixtures = teamFixturesSource.map(cloneTeam)
  sportsById = Object.fromEntries(sportFixtures.map((sport) => [sport.id, sport]))
  pendingTeamUpdates.clear()
}

reset()

export function listSports(): Sport[] {
  return sportFixtures.map(cloneSport)
}

export function getSport(id: string): Sport {
  const found = sportsById[id]
  if (!found) throw httpError(404, 'Sport not found')
  return cloneSport(found)
}

export function listTeams(): Team[] {
  return teamFixtures.map(cloneTeam)
}

export function getTeam(id: string): Team {
  const found = teamFixtures.find((t) => t.id === id)
  if (!found) throw httpError(404, 'Team not found')
  return cloneTeam(found)
}

export function createSport(data: SportCreate, user: AuthUser): Sport {
  const name = data.name.trim()

  if (user.role !== 'admin') {
    throw httpError(403, 'Only admins can create sports.')
  }
  if (!name) throw httpError(400, 'Name is required.')
  assertUniqueSportName(name)

  const sport: Sport = {
    id: newSportId(),
    name,
    description: data.description?.trim() ?? '',
    created_at: new Date().toISOString().slice(0, 10),
    directors: memberRefsFromIds(data.directors ?? [], (id) => `Member not found: ${id}`),
  }

  sportFixtures.unshift(sport)
  sportsById[sport.id] = sport
  return cloneSport(sport)
}

export function updateSport(
  id: string,
  data: SportPartialUpdate,
  user: AuthUser,
): Sport {
  const index = sportFixtures.findIndex((sport) => sport.id === id)
  const sport = sportFixtures[index]

  if (!sport) throw httpError(404, `Sport not found: ${id}`)
  if (!canUpdateSport(sport, user)) {
    throw httpError(403, 'Access denied')
  }

  if (data.name !== undefined) {
    const name = data.name.trim()
    if (!name) throw httpError(400, 'Name is required.')
    if (name !== sport.name) assertUniqueSportName(name, id)
  }

  const updated: Sport = {
    ...sport,
    name: data.name !== undefined ? data.name.trim() : sport.name,
    description: data.description !== undefined ? data.description : sport.description,
    directors:
      user.role === 'admin' && data.directors !== undefined
        ? memberRefsFromIds(data.directors, (memberId) => `Member not found: ${memberId}`)
        : sport.directors,
  }

  sportFixtures[index] = updated
  sportsById[id] = updated
  syncTeamSportNames(updated)
  return cloneSport(updated)
}

export function deleteSport(id: string, user: AuthUser): void {
  const index = sportFixtures.findIndex((sport) => sport.id === id)

  if (user.role !== 'admin') {
    throw httpError(403, 'Only admins can delete sports.')
  }
  if (index === -1) throw httpError(404, `Sport not found: ${id}`)

  sportFixtures.splice(index, 1)
  delete sportsById[id]

  for (let teamIndex = teamFixtures.length - 1; teamIndex >= 0; teamIndex -= 1) {
    if (teamFixtures[teamIndex].sport.id === id) {
      teamFixtures.splice(teamIndex, 1)
    }
  }
}

export function teamIdsForSport(sportId: string): string[] {
  return teamFixtures.filter((team) => team.sport.id === sportId).map((team) => team.id)
}

export function createTeam(data: TeamCreate, user: AuthUser): Team {
  const name = data.name.trim()

  if (!name) throw httpError(400, 'Name is required.')
  const sport = sportsById[data.sport]
  if (!sport) throw httpError(400, 'Sport not found.')
  if (!canCreateTeam(data.sport, user)) {
    throw httpError(403, 'You are not allowed to create a team for this sport.')
  }

  const team: Team = {
    id: newTeamId(),
    name,
    description: data.description?.trim() ?? '',
    address: data.address?.trim() ?? '',
    created_at: new Date().toISOString().slice(0, 10),
    sport: { id: sport.id, name: sport.name },
    trainers: memberRefsFromIds(data.trainers ?? []),
    trainees: memberRefsFromIds(data.trainees ?? []),
  }

  teamFixtures.unshift(team)
  return cloneTeam(team)
}

export function updateTeam(
  id: string,
  data: TeamPartialUpdate,
  user: AuthUser,
): Promise<Team> {
  if (pendingTeamUpdates.has(id)) {
    throw httpError(409, 'A team update is already in progress.')
  }

  pendingTeamUpdates.add(id)

  try {
    const index = teamFixtures.findIndex((team) => team.id === id)
    const team = teamFixtures[index]

    if (!team) throw httpError(404, 'Team not found')
    if (!canUpdateTeam(team, user)) {
      throw httpError(403, 'You are not allowed to update this team.')
    }
    if (data.name !== undefined && data.name.trim() === '') {
      throw httpError(400, 'Name is required.')
    }
    if (data.sport !== undefined && user.role !== 'admin') {
      throw httpError(403, 'Only admins can change a team sport.')
    }
    if (data.trainers !== undefined && user.role !== 'admin' && user.role !== 'director') {
      throw httpError(403, 'Only admins and directors can change team coaches.')
    }

    const nextSport = data.sport !== undefined ? sportsById[data.sport] : undefined
    if (data.sport !== undefined && !nextSport) {
      throw httpError(400, 'Sport not found.')
    }

    const updated: Team = {
      ...team,
      name: data.name ?? team.name,
      description: data.description ?? team.description,
      address: data.address ?? team.address,
      sport: nextSport ? { id: nextSport.id, name: nextSport.name } : team.sport,
      trainers: data.trainers !== undefined ? memberRefsFromIds(data.trainers) : team.trainers,
      trainees: data.trainees !== undefined ? memberRefsFromIds(data.trainees) : team.trainees,
    }

    teamFixtures[index] = updated
    return Promise.resolve(cloneTeam(updated)).finally(() => {
      pendingTeamUpdates.delete(id)
    })
  } catch (error) {
    pendingTeamUpdates.delete(id)
    throw error
  }
}

// Each service owns member replicas, so renames must propagate through embedded refs.
export function renameMemberInOrganization(memberId: string, name: string): void {
  const rename = (ref: MemberRef) => (ref.id === memberId ? { ...ref, name } : ref)

  for (const team of teamFixtures) {
    team.trainers = team.trainers.map(rename)
    team.trainees = team.trainees.map(rename)
  }

  for (const sport of sportFixtures) {
    sport.directors = sport.directors.map(rename)
  }
}

export function removeMemberFromOrganization(memberId: string): void {
  for (const team of teamFixtures) {
    team.trainers = team.trainers.filter((trainer) => trainer.id !== memberId)
    team.trainees = team.trainees.filter((trainee) => trainee.id !== memberId)
  }

  for (const sport of sportFixtures) {
    sport.directors = sport.directors.filter((director) => director.id !== memberId)
  }
}

export function deleteTeam(id: string, user: AuthUser): void {
  const index = teamFixtures.findIndex((team) => team.id === id)
  const team = teamFixtures[index]

  if (!team) throw httpError(404, 'Team not found')
  if (!canDeleteTeam(team, user)) {
    throw httpError(403, 'You are not allowed to delete this team.')
  }

  teamFixtures.splice(index, 1)
}

function canCreateTeam(sportId: string, user: AuthUser): boolean {
  if (user.role === 'admin') return true
  if (user.role !== 'director') return false

  return isDirectorForSport(sportId, user.id)
}

function canUpdateTeam(team: Team, user: AuthUser): boolean {
  switch (user.role) {
    case 'admin':
      return true
    case 'director':
      return isDirectorForSport(team.sport.id, user.id)
    case 'trainer':
      return isTeamCoach(team, user.id)
    case 'member':
      return false
  }
}

function canDeleteTeam(team: Team, user: AuthUser): boolean {
  if (user.role === 'admin') return true
  if (user.role === 'director') return isDirectorForSport(team.sport.id, user.id)
  return false
}

function canUpdateSport(sport: Sport, user: AuthUser): boolean {
  if (user.role === 'admin') return true
  if (user.role === 'director') {
    return sport.directors.some((director) => director.id === user.id)
  }

  return false
}

function isDirectorForSport(sportId: string, userId: string): boolean {
  return (
    sportFixtures
      .find((sport) => sport.id === sportId)
      ?.directors.some((director) => director.id === userId) ?? false
  )
}

function assertUniqueSportName(name: string, excludeId?: string): void {
  const duplicate = sportFixtures.some((sport) => sport.id !== excludeId && sport.name === name)
  if (duplicate) throw httpError(409, `Sport already exists: ${name}`)
}

function memberRefsFromIds(
  ids: string[],
  missingMessage: (id: string) => string = () => 'Member not found.',
): MemberRef[] {
  return ids.map((id) => {
    const name = memberNamesById[id]
    if (!name) throw httpError(400, missingMessage(id))
    return { id, name }
  })
}

function syncTeamSportNames(sport: Sport): void {
  for (const team of teamFixtures) {
    if (team.sport.id === sport.id) {
      team.sport = { id: sport.id, name: sport.name }
    }
  }
}

function newSportId(): string {
  return (
    globalThis.crypto?.randomUUID?.() ??
    `cccccccc-cccc-4ccc-8ccc-${Date.now().toString(16).padStart(12, '0').slice(-12)}`
  )
}

function newTeamId(): string {
  return (
    globalThis.crypto?.randomUUID?.() ??
    `bbbbbbbb-bbbb-4bbb-8bbb-${Date.now().toString(16).padStart(12, '0').slice(-12)}`
  )
}

function cloneSport(sport: Sport): Sport {
  return {
    ...sport,
    directors: sport.directors.map((director) => ({ ...director })),
  }
}

function cloneTeam(team: Team): Team {
  return {
    ...team,
    sport: { ...team.sport },
    trainers: team.trainers.map((trainer) => ({ ...trainer })),
    trainees: team.trainees.map((trainee) => ({ ...trainee })),
  }
}
