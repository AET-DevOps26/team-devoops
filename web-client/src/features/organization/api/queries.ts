import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

import {
  organizationKeys,
  sportCreateDependentKeys,
  sportDependentKeys,
  teamCreateDependentKeys,
  teamDependentKeys,
} from '@/lib/query-keys'
import { settleMutation } from '@/lib/query-cache'
import { organizationClient } from './client'
import type {
  Sport,
  SportCreate,
  SportPartialUpdate,
  Team,
  TeamCreate,
  TeamPartialUpdate,
} from '../types'

export { organizationKeys }

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
    queryFn: () => organizationClient.get<Sport[]>('/sports').then(r => r.data),
    enabled,
    staleTime: 5 * 60_000,
  })
}

export function useSport(id: string) {
  return useQuery<Sport>({
    queryKey: organizationKeys.sport(id),
    queryFn: () => organizationClient.get<Sport>(`/sports/${encodeURIComponent(id)}`).then(r => r.data),
    enabled: !!id,
  })
}

export function useCreateSport() {
  const qc = useQueryClient()

  return useMutation<Sport, Error, SportCreate>({
    mutationFn: data => organizationClient.post<Sport>('/sports', data).then(r => r.data),
    onSuccess: (created) => {
      qc.setQueryData(organizationKeys.sport(created.id), created)
      return settleMutation(qc, {
        invalidate: [organizationKeys.sports, ...sportCreateDependentKeys],
      })
    },
  })
}

export function useUpdateSport() {
  const qc = useQueryClient()

  return useMutation<Sport, Error, { id: string } & SportPartialUpdate>({
    mutationFn: ({ id, ...data }) => organizationClient.patch<Sport>(`/sports/${id}`, data).then(r => r.data),
    // A renamed sport is embedded in every team's `sport` ref and in the member rows' sport column,
    // so those are refetched rather than patched.
    onSuccess: (updated, { id }) => {
      qc.setQueryData(organizationKeys.sport(id), updated)
      return settleMutation(qc, {
        invalidate: [organizationKeys.sports, organizationKeys.sport(id), ...sportDependentKeys],
      })
    },
  })
}

export function useDeleteSport() {
  const qc = useQueryClient()

  return useMutation<void, Error, string>({
    mutationFn: id => organizationClient.delete(`/sports/${id}`).then(() => undefined),
    // Deleting a sport deletes its teams server-side, so the teams list is refetched, never patched.
    onSuccess: (_, id) =>
      settleMutation(qc, {
        remove: [{ key: organizationKeys.sports, id }],
        evict: [organizationKeys.sport(id)],
        invalidate: [organizationKeys.sports, ...sportDependentKeys],
      }),
  })
}

export function useTeams() {
  return useTeamsList()
}

export function useTeamsList(enabled = true) {
  return useQuery<Team[]>({
    queryKey: organizationKeys.teams,
    queryFn: () => organizationClient.get<Team[]>('/teams').then(r => r.data),
    enabled,
    staleTime: 5 * 60_000,
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
    onSuccess: (created) => {
      qc.setQueryData(organizationKeys.team(created.id), created)
      return settleMutation(qc, {
        invalidate: [organizationKeys.teams, organizationKeys.sports, ...teamCreateDependentKeys],
      })
    },
  })
}

export function useUpdateTeam() {
  const qc = useQueryClient()

  return useMutation<Team, Error, { id: string } & TeamPartialUpdate>({
    mutationFn: ({ id, ...data }) => organizationClient.patch<Team>(`/teams/${id}`, data).then(r => r.data),
    // The roster edit changes which members show this team (and its sport) in the members table.
    onSuccess: (updated, { id }) => {
      qc.setQueryData(organizationKeys.team(id), updated)
      return settleMutation(qc, {
        invalidate: [
          organizationKeys.teams,
          organizationKeys.team(id),
          organizationKeys.sports,
          ...teamDependentKeys(id),
        ],
      })
    },
  })
}

export function useDeleteTeam() {
  const qc = useQueryClient()

  return useMutation<void, Error, string>({
    mutationFn: id => organizationClient.delete(`/teams/${id}`).then(() => undefined),
    onSuccess: (_, id) =>
      settleMutation(qc, {
        remove: [{ key: organizationKeys.teams, id }],
        evict: [organizationKeys.team(id)],
        invalidate: [organizationKeys.teams, organizationKeys.sports, ...teamDependentKeys(id)],
      }),
  })
}
