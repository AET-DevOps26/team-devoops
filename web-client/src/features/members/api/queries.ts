import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

import {
  membersKeys,
  memberCreateDependentKeys,
  memberDependentKeys,
} from '@/lib/query-keys'
import { settleMutation } from '@/lib/query-cache'
import { membersClient } from './client'
import type { Member, MemberCreate, MemberPartialUpdate, MemberSummary } from '../types'

export { membersKeys }

export function useMembersHello() {
  return useQuery<string>({
    queryKey: membersKeys.hello,
    queryFn: () => membersClient.get<string>('/hello').then(r => r.data),
  })
}

export function useMembers(enabled = true) {
  return useQuery<MemberSummary[]>({
    queryKey: membersKeys.all,
    staleTime: 30_000,
    enabled,
    queryFn: () => membersClient.get<MemberSummary[]>('').then(r => r.data),
  })
}

export function useMember(id: string) {
  return useQuery<Member>({
    queryKey: membersKeys.detail(id),
    staleTime: 30_000,
    queryFn: () => membersClient.get<Member>(`/${id}`).then(r => r.data),
    enabled: !!id,
  })
}

export function useCreateMember() {
  const qc = useQueryClient()

  return useMutation<Member, Error, MemberCreate>({
    mutationFn: data => membersClient.post<Member>('', data).then(r => r.data),
    // The list is server-ordered and role-scoped, so the new row is refetched rather than spliced
    // in at a guessed position. The response is authoritative for the detail cache.
    onSuccess: (created) => {
      qc.setQueryData(membersKeys.detail(created.id), created)
      return settleMutation(qc, {
        invalidate: [membersKeys.all, ...memberCreateDependentKeys],
      })
    },
  })
}

export function useUpdateMember() {
  const qc = useQueryClient()

  return useMutation<Member, Error, { id: string } & MemberPartialUpdate>({
    mutationFn: ({ id, ...data }) => membersClient.patch<Member>(`/${id}`, data).then(r => r.data),
    onSuccess: (updated, { id }) => {
      const summary: MemberSummary = {
        id: updated.id,
        first_name: updated.first_name,
        last_name: updated.last_name,
        email: updated.email,
      }
      qc.setQueryData(membersKeys.detail(id), updated)

      return settleMutation(qc, {
        replace: [{ key: membersKeys.all, id, next: summary }],
        invalidate: [membersKeys.all, membersKeys.detail(id), ...memberDependentKeys(id)],
      })
    },
  })
}

export function useDeleteMember() {
  const qc = useQueryClient()

  return useMutation<void, Error, string>({
    mutationFn: id => membersClient.delete(`/${id}`).then(() => undefined),
    onSuccess: (_, id) =>
      settleMutation(qc, {
        remove: [{ key: membersKeys.all, id }],
        evict: [membersKeys.detail(id)],
        invalidate: [membersKeys.all, ...memberDependentKeys(id)],
      }),
  })
}
