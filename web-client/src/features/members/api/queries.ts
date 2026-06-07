import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

import { membersClient } from './client'
import type { Member, MemberCreate, MemberPartialUpdate, MemberSummary } from '../types'

export const membersKeys = {
  all: ['members'] as const,
  detail: (id: string) => ['members', id] as const,
}

export function useMembers() {
  return useQuery<MemberSummary[]>({
    queryKey: membersKeys.all,
    queryFn: () => membersClient.get<MemberSummary[]>('/').then(r => r.data),
  })
}

export function useMember(id: string) {
  return useQuery<Member>({
    queryKey: membersKeys.detail(id),
    queryFn: () => membersClient.get<Member>(`/${id}`).then(r => r.data),
    enabled: !!id,
  })
}

export function useCreateMember() {
  const qc = useQueryClient()

  return useMutation<Member, Error, MemberCreate>({
    mutationFn: data => membersClient.post<Member>('/', data).then(r => r.data),
    onSuccess: () => qc.invalidateQueries({ queryKey: membersKeys.all }),
  })
}

export function useUpdateMember() {
  const qc = useQueryClient()

  return useMutation<Member, Error, { id: string } & MemberPartialUpdate>({
    mutationFn: ({ id, ...data }) => membersClient.patch<Member>(`/${id}`, data).then(r => r.data),
    onSuccess: (_, { id }) => {
      qc.invalidateQueries({ queryKey: membersKeys.all })
      qc.invalidateQueries({ queryKey: membersKeys.detail(id) })
    },
  })
}

export function useDeleteMember() {
  const qc = useQueryClient()

  return useMutation<void, Error, string>({
    mutationFn: id => membersClient.delete(`/${id}`).then(() => undefined),
    onSuccess: (_, id) => {
      qc.invalidateQueries({ queryKey: membersKeys.all })
      qc.removeQueries({ queryKey: membersKeys.detail(id) })
    },
  })
}
