import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

import { getCurrentUser } from '@/features/auth/currentUser'
import { memberNamesById, sportFixtures, sportsById, teamFixtures } from '@/mocks/fixtures'
import { mockOr } from '@/mocks/mockSwitch'
import { isTeamCoach, type AuthUser, type MemberRef } from '@/types'
import { organizationClient } from './client'
import type {
  Sport,
  SportCreate,
  SportPartialUpdate,
  Team,
  TeamCreate,
  TeamPartialUpdate,
} from '../types'

export const organizationKeys = {
  hello: ['organization', 'hello'] as const,
  sports: ['organization', 'sports'] as const,
  sport: (id: string) => ['organization', 'sports', id] as const,
  teams: ['organization', 'teams'] as const,
  team: (id: string) => ['organization', 'teams', id] as const,
}

export function useOrganizationHello() {
  return useQuery<string>({
    queryKey: organizationKeys.hello,
    queryFn: () => organizationClient.get<string>('/hello').then(r => r.data),
  })
}

export function useSports() {
  return useSportsList()
}

export function useSportsList(enabled = true) {
  return useQuery<Sport[]>({
    queryKey: organizationKeys.sports,
    queryFn: () =>
      mockOr(
        () => Promise.resolve(sportFixtures.map(cloneSport)),
        () => organizationClient.get<Sport[]>('/sports').then(r => r.data),
      ),
    enabled,
    staleTime: 5 * 60_000,
  })
}

export function useSport(id: string) {
  return useQuery<Sport>({
    queryKey: organizationKeys.sport(id),
    queryFn: () =>
      mockOr(
        () => {
          const found = sportsById[id]
          if (!found) throw new Error('Sport not found')
          return Promise.resolve(cloneSport(found))
        },
        () => organizationClient.get<Sport>(`/sports/${encodeURIComponent(id)}`).then(r => r.data),
      ),
    enabled: !!id,
  })
}

export function useCreateSport() {
  const qc = useQueryClient()

  return useMutation<Sport, Error, SportCreate>({
    mutationFn: data =>
      mockOr(
        () => Promise.resolve(mockCreateSport(data)),
        () => organizationClient.post<Sport>('/sports', data).then(r => r.data),
      ),
    onSuccess: () => qc.invalidateQueries({ queryKey: organizationKeys.sports }),
  })
}

export function useUpdateSport() {
  const qc = useQueryClient()

  return useMutation<Sport, Error, { id: string } & SportPartialUpdate>({
    mutationFn: ({ id, ...data }) =>
      mockOr(
        () => Promise.resolve(mockUpdateSport({ id, ...data })),
        () => organizationClient.patch<Sport>(`/sports/${id}`, data).then(r => r.data),
      ),
    onSuccess: (_, { id }) => {
      qc.invalidateQueries({ queryKey: organizationKeys.sports })
      qc.invalidateQueries({ queryKey: organizationKeys.sport(id) })
      qc.invalidateQueries({ queryKey: organizationKeys.teams })
    },
  })
}

export function useDeleteSport() {
  const qc = useQueryClient()

  return useMutation<void, Error, string>({
    mutationFn: id =>
      mockOr(
        () => {
          mockDeleteSport(id)
          return Promise.resolve(undefined)
        },
        () => organizationClient.delete(`/sports/${id}`).then(() => undefined),
      ),
    onSuccess: (_, id) => {
      qc.invalidateQueries({ queryKey: organizationKeys.sports })
      qc.invalidateQueries({ queryKey: organizationKeys.teams })
      qc.removeQueries({ queryKey: organizationKeys.sport(id) })
    },
  })
}

export function useTeams() {
  return useTeamsList()
}

export function useTeamsList(enabled = true) {
  return useQuery<Team[]>({
    queryKey: organizationKeys.teams,
    queryFn: () =>
      mockOr(
        () => Promise.resolve(teamFixtures.map(cloneTeam)),
        () => organizationClient.get<Team[]>('/teams').then(r => r.data),
      ),
    enabled,
    staleTime: 5 * 60_000,
  })
}

export function useTeam(id: string) {
  return useQuery<Team>({
    queryKey: organizationKeys.team(id),
    queryFn: () =>
      mockOr(
        () => {
          const found = teamFixtures.find(t => t.id === id)
          if (!found) throw new Error('Team not found')
          return Promise.resolve(cloneTeam(found))
        },
        () => organizationClient.get<Team>(`/teams/${id}`).then(r => r.data),
      ),
    enabled: !!id,
  })
}

export function useCreateTeam() {
  const qc = useQueryClient()

  return useMutation<Team, Error, TeamCreate>({
    mutationFn: data =>
      mockOr(
        () => Promise.resolve(mockCreateTeam(data)),
        () => organizationClient.post<Team>('/teams', data).then(r => r.data),
      ),
    onSuccess: () => qc.invalidateQueries({ queryKey: organizationKeys.teams }),
  })
}

export function useUpdateTeam() {
  const qc = useQueryClient()

  return useMutation<Team, Error, { id: string } & TeamPartialUpdate>({
    mutationFn: ({ id, ...data }) =>
      mockOr(
        () => mockUpdateTeam({ id, ...data }),
        () => organizationClient.patch<Team>(`/teams/${id}`, data).then(r => r.data),
      ),
    onSuccess: (_, { id }) => {
      qc.invalidateQueries({ queryKey: organizationKeys.teams })
      qc.invalidateQueries({ queryKey: organizationKeys.team(id) })
    },
  })
}

export function useDeleteTeam() {
  const qc = useQueryClient()

  return useMutation<void, Error, string>({
    mutationFn: id =>
      mockOr(
        () => {
          mockDeleteTeam(id)
          return Promise.resolve(undefined)
        },
        () => organizationClient.delete(`/teams/${id}`).then(() => undefined),
      ),
    onSuccess: (_, id) => {
      qc.invalidateQueries({ queryKey: organizationKeys.teams })
      qc.removeQueries({ queryKey: organizationKeys.team(id) })
    },
  })
}

const pendingTeamUpdates = new Set<string>()

function mockCreateSport(data: SportCreate): Sport {
  const user = getCurrentUser()
  const name = data.name.trim()

  if (user.role !== 'admin') {
    throw mockHttpError(403, 'Only admins can create sports.')
  }
  if (!name) throw mockHttpError(400, 'Name is required.')
  assertUniqueSportName(name)

  const sport: Sport = {
    id: mockSportId(),
    name,
    description: data.description?.trim() ?? '',
    created_at: new Date().toISOString().slice(0, 10),
    directors: memberRefsFromIds(data.directors ?? [], (id) => `Member not found: ${id}`),
  }

  sportFixtures.unshift(sport)
  sportsById[sport.id] = sport
  return cloneSport(sport)
}

function mockUpdateSport({ id, ...data }: { id: string } & SportPartialUpdate): Sport {
  const user = getCurrentUser()
  const index = sportFixtures.findIndex((sport) => sport.id === id)
  const sport = sportFixtures[index]

  if (!sport) throw mockHttpError(404, `Sport not found: ${id}`)
  if (!canUpdateSport(sport, user)) {
    throw mockHttpError(403, 'Access denied')
  }

  if (data.name !== undefined) {
    const name = data.name.trim()
    if (!name) throw mockHttpError(400, 'Name is required.')
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

function mockDeleteSport(id: string): void {
  const user = getCurrentUser()
  const index = sportFixtures.findIndex((sport) => sport.id === id)

  if (user.role !== 'admin') {
    throw mockHttpError(403, 'Only admins can delete sports.')
  }
  if (index === -1) throw mockHttpError(404, `Sport not found: ${id}`)

  sportFixtures.splice(index, 1)
  delete sportsById[id]

  for (let teamIndex = teamFixtures.length - 1; teamIndex >= 0; teamIndex -= 1) {
    if (teamFixtures[teamIndex].sport.id === id) {
      teamFixtures.splice(teamIndex, 1)
    }
  }
}

function mockCreateTeam(data: TeamCreate): Team {
  const user = getCurrentUser()
  const name = data.name.trim()

  if (!name) throw mockHttpError(400, 'Name is required.')
  const sport = sportsById[data.sport]
  if (!sport) throw mockHttpError(400, 'Sport not found.')
  if (!canCreateTeam(data.sport, user)) {
    throw mockHttpError(403, 'You are not allowed to create a team for this sport.')
  }

  const team: Team = {
    id: mockTeamId(),
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

function mockUpdateTeam({ id, ...data }: { id: string } & TeamPartialUpdate): Promise<Team> {
  if (pendingTeamUpdates.has(id)) {
    throw mockHttpError(409, 'A team update is already in progress.')
  }

  pendingTeamUpdates.add(id)
  const user = getCurrentUser()

  try {
    const index = teamFixtures.findIndex((team) => team.id === id)
    const team = teamFixtures[index]

    if (!team) throw mockHttpError(404, 'Team not found')
    if (!canUpdateTeam(team, user)) {
      throw mockHttpError(403, 'You are not allowed to update this team.')
    }
    if (data.name !== undefined && data.name.trim() === '') {
      throw mockHttpError(400, 'Name is required.')
    }
    if (data.sport !== undefined && user.role !== 'admin') {
      throw mockHttpError(403, 'Only admins can change a team sport.')
    }
    if (data.trainers !== undefined && user.role !== 'admin' && user.role !== 'director') {
      throw mockHttpError(403, 'Only admins and directors can change team coaches.')
    }

    const nextSport = data.sport !== undefined ? sportsById[data.sport] : undefined
    if (data.sport !== undefined && !nextSport) {
      throw mockHttpError(400, 'Sport not found.')
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

function mockDeleteTeam(id: string): void {
  const user = getCurrentUser()
  const index = teamFixtures.findIndex((team) => team.id === id)
  const team = teamFixtures[index]

  if (!team) throw mockHttpError(404, 'Team not found')
  if (!canDeleteTeam(team, user)) {
    throw mockHttpError(403, 'You are not allowed to delete this team.')
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
  if (duplicate) throw mockHttpError(409, `Sport already exists: ${name}`)
}

function memberRefsFromIds(
  ids: string[],
  missingMessage: (id: string) => string = () => 'Member not found.',
): MemberRef[] {
  return ids.map((id) => {
    const name = memberNamesById[id]
    if (!name) throw mockHttpError(400, missingMessage(id))
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

function mockSportId(): string {
  return (
    globalThis.crypto?.randomUUID?.() ??
    `cccccccc-cccc-4ccc-8ccc-${Date.now().toString(16).padStart(12, '0').slice(-12)}`
  )
}

function mockTeamId(): string {
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

function mockHttpError(status: number, message: string): Error {
  return Object.assign(new Error(message), {
    isAxiosError: true,
    response: {
      status,
      data: { message },
    },
  })
}
