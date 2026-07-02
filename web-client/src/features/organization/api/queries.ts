import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

import { sportFixtures, sportsById, teamFixtures } from '@/mocks/fixtures'
import { mockOr } from '@/mocks/mockSwitch'
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
        () => organizationClient.get<Sport>(`/sports/${id}`).then(r => r.data),
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
        () => Promise.resolve(teamFixtures),
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
          return Promise.resolve(found)
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
    mutationFn: ({ id, ...data }) => organizationClient.patch<Team>(`/teams/${id}`, data).then(r => r.data),
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
