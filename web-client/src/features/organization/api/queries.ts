import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

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
  sport: (name: string) => ['organization', 'sports', name] as const,
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
  return useQuery<Sport[]>({
    queryKey: organizationKeys.sports,
    queryFn: () => organizationClient.get<Sport[]>('/sports').then(r => r.data),
  })
}

export function useSport(name: string) {
  return useQuery<Sport>({
    queryKey: organizationKeys.sport(name),
    queryFn: () => organizationClient.get<Sport>(`/sports/${name}`).then(r => r.data),
    enabled: !!name,
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

  return useMutation<Sport, Error, { name: string } & SportPartialUpdate>({
    mutationFn: ({ name, ...data }) => organizationClient.patch<Sport>(`/sports/${name}`, data).then(r => r.data),
    onSuccess: (_, { name }) => {
      qc.invalidateQueries({ queryKey: organizationKeys.sports })
      qc.invalidateQueries({ queryKey: organizationKeys.sport(name) })
    },
  })
}

export function useDeleteSport() {
  const qc = useQueryClient()

  return useMutation<void, Error, string>({
    mutationFn: name => organizationClient.delete(`/sports/${name}`).then(() => undefined),
    onSuccess: (_, name) => {
      qc.invalidateQueries({ queryKey: organizationKeys.sports })
      qc.removeQueries({ queryKey: organizationKeys.sport(name) })
    },
  })
}

export function useTeams() {
  return useQuery<Team[]>({
    queryKey: organizationKeys.teams,
    queryFn: () => organizationClient.get<Team[]>('/teams').then(r => r.data),
  })
}

export function useTeam(id: string) {
  return useQuery<Team>({
    queryKey: organizationKeys.team(id),
    queryFn: () => organizationClient.get<Team>(`/teams/${id}`).then(r => r.data),
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
