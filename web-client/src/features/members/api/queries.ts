import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

import { getCurrentUser } from '@/features/auth/currentUser'
import { memberFixtures, memberSummaryFixtures } from '@/mocks/fixtures'
import { mockOr } from '@/mocks/mockSwitch'
import { scopeMembers } from '@/mocks/scope'
import { membersClient } from './client'
import type { Member, MemberCreate, MemberPartialUpdate, MemberSummary } from '../types'

export const membersKeys = {
  hello: ['members', 'hello'] as const,
  all: ['members'] as const,
  detail: (id: string) => ['members', id] as const,
}

export function useMembersHello() {
  return useQuery<string>({
    queryKey: membersKeys.hello,
    queryFn: () => membersClient.get<string>('/hello').then(r => r.data),
  })
}

export function useMembers() {
  return useQuery<MemberSummary[]>({
    queryKey: membersKeys.all,
    queryFn: () =>
      mockOr(
        () => Promise.resolve(scopeMembers(memberSummaryFixtures, getCurrentUser())),
        () => membersClient.get<MemberSummary[]>('/').then(r => r.data),
      ),
  })
}

export function useMember(id: string) {
  return useQuery<Member>({
    queryKey: membersKeys.detail(id),
    queryFn: () =>
      mockOr(
        () => {
          const found = memberFixtures.find(m => m.id === id)
          const scoped = found ? scopeMembers([found], getCurrentUser()) : []
          if (!scoped[0]) throw new Error('Member not found')
          return Promise.resolve(scoped[0])
        },
        () => membersClient.get<Member>(`/${id}`).then(r => r.data),
      ),
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
