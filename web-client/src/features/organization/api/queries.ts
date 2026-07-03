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
        () => Promise.resolve(sportFixtures),
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
          return Promise.resolve(found)
        },
        () => organizationClient.get<Sport>(`/sports/${encodeURIComponent(id)}`).then(r => r.data),
      ),
    enabled: !!id,
  })
}

export function useCreateSport() {
  const qc = useQueryClient()

  return useMutation<Sport, Error, SportCreate>({
    mutationFn: data => organizationClient.post<Sport>('/sports', data).then(r => r.data),
    onSuccess: () => qc.invalidateQueries({ queryKey: organizationKeys.sports }),
  })
}

export function useUpdateSport() {
  const qc = useQueryClient()

  return useMutation<Sport, Error, { id: string } & SportPartialUpdate>({
    mutationFn: ({ id, ...data }) => organizationClient.patch<Sport>(`/sports/${id}`, data).then(r => r.data),
    onSuccess: (_, { id }) => {
      qc.invalidateQueries({ queryKey: organizationKeys.sports })
      qc.invalidateQueries({ queryKey: organizationKeys.sport(id) })
    },
  })
}

export function useDeleteSport() {
  const qc = useQueryClient()

  return useMutation<void, Error, string>({
    mutationFn: id => organizationClient.delete(`/sports/${id}`).then(() => undefined),
    onSuccess: (_, id) => {
      qc.invalidateQueries({ queryKey: organizationKeys.sports })
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
    mutationFn: data => organizationClient.post<Team>('/teams', data).then(r => r.data),
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
    mutationFn: id => organizationClient.delete(`/teams/${id}`).then(() => undefined),
    onSuccess: (_, id) => {
      qc.invalidateQueries({ queryKey: organizationKeys.teams })
      qc.removeQueries({ queryKey: organizationKeys.team(id) })
    },
  })
}

const pendingTeamUpdates = new Set<string>()

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

function canUpdateTeam(team: Team, user: AuthUser): boolean {
  switch (user.role) {
    case 'admin':
      return true
    case 'director':
      return sportFixtures
        .find((sport) => sport.id === team.sport.id)
        ?.directors.some((director) => director.id === user.id) ?? false
    case 'trainer':
      return isTeamCoach(team, user.id)
    case 'member':
      return false
  }
}

function memberRefsFromIds(ids: string[]): MemberRef[] {
  return ids.map((id) => {
    const name = memberNamesById[id]
    if (!name) throw mockHttpError(400, 'Member not found.')
    return { id, name }
  })
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
