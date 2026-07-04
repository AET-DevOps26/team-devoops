import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

import { getCurrentUser } from '@/features/auth/currentUser'
import { memberFixtures, memberSummaryFixtures } from '@/mocks/fixtures'
import { mockHttpError, mockOr } from '@/mocks/mockSwitch'
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

export function useMembers(enabled = true) {
  return useQuery<MemberSummary[]>({
    queryKey: membersKeys.all,
    staleTime: 30_000,
    enabled,
    queryFn: () =>
      mockOr(
        () => Promise.resolve(scopeMembers(memberSummaryFixtures, getCurrentUser())),
        () => membersClient.get<MemberSummary[]>('').then(r => r.data),
      ),
  })
}

export function useMember(id: string) {
  return useQuery<Member>({
    queryKey: membersKeys.detail(id),
    staleTime: 30_000,
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
    mutationFn: data =>
      mockOr(
        () => Promise.resolve(mockCreateMember(data)),
        () => membersClient.post<Member>('', data).then(r => r.data),
      ),
    onSuccess: () => qc.invalidateQueries({ queryKey: membersKeys.all }),
  })
}

export function useUpdateMember() {
  const qc = useQueryClient()

  return useMutation<Member, Error, { id: string } & MemberPartialUpdate>({
    mutationFn: ({ id, ...data }) =>
      mockOr(
        () => Promise.resolve(mockUpdateMember({ id, ...data })),
        () => membersClient.patch<Member>(`/${id}`, data).then(r => r.data),
      ),
    onSuccess: (_, { id }) => {
      qc.invalidateQueries({ queryKey: membersKeys.all })
      qc.invalidateQueries({ queryKey: membersKeys.detail(id) })
    },
  })
}

export function useDeleteMember() {
  const qc = useQueryClient()

  return useMutation<void, Error, string>({
    mutationFn: id =>
      mockOr(
        () => {
          mockDeleteMember(id)
          return Promise.resolve(undefined)
        },
        () => membersClient.delete(`/${id}`).then(() => undefined),
      ),
    onSuccess: (_, id) => {
      qc.invalidateQueries({ queryKey: membersKeys.all })
      qc.removeQueries({ queryKey: membersKeys.detail(id) })
    },
  })
}

function mockCreateMember(data: MemberCreate): Member {
  const user = getCurrentUser()

  if (user.role !== 'admin') {
    throw mockHttpError(403, 'Only admins can create members.')
  }

  const fieldErrors: { message: string }[] = []
  if (!data.first_name.trim()) fieldErrors.push({ message: 'first_name: must not be blank' })
  if (!data.last_name.trim()) fieldErrors.push({ message: 'last_name: must not be blank' })
  if (!data.password) fieldErrors.push({ message: 'password: must not be blank' })
  if (fieldErrors.length > 0) {
    throw mockHttpError(400, 'Validation failed', fieldErrors)
  }

  const email = data.email.trim()
  assertUniqueMemberEmail(email)

  const member: Member = {
    id: mockMemberId(),
    first_name: data.first_name.trim(),
    last_name: data.last_name.trim(),
    email,
    birthday: data.birthday ?? '',
    phone_number: data.phone_number ?? '',
    address: data.address ?? '',
    joining_date: new Date().toISOString().slice(0, 10),
    information: data.information ?? '',
  }

  memberFixtures.unshift(member)
  memberSummaryFixtures.unshift({
    id: member.id,
    first_name: member.first_name,
    last_name: member.last_name,
    email: member.email,
  })
  return { ...member }
}

function mockUpdateMember({ id, ...data }: { id: string } & MemberPartialUpdate): Member {
  const user = getCurrentUser()
  const index = memberFixtures.findIndex((member) => member.id === id)
  const member = memberFixtures[index]

  if (!member) throw mockHttpError(404, `Member not found: ${id}`)
  if (user.role !== 'admin' && user.id !== id) {
    throw mockHttpError(403, 'Access denied')
  }
  if (data.email !== undefined) {
    const email = data.email.trim()
    if (!email) throw mockHttpError(400, 'Email is required.')
    if (email !== member.email) assertUniqueMemberEmail(email, id)
  }

  const updated: Member = {
    ...member,
    first_name: data.first_name !== undefined ? data.first_name.trim() : member.first_name,
    last_name: data.last_name !== undefined ? data.last_name.trim() : member.last_name,
    email: data.email !== undefined ? data.email.trim() : member.email,
    birthday: data.birthday !== undefined ? data.birthday : member.birthday,
    phone_number: data.phone_number !== undefined ? data.phone_number : member.phone_number,
    address: data.address !== undefined ? data.address : member.address,
    information: data.information !== undefined ? data.information : member.information,
  }

  memberFixtures[index] = updated
  const summaryIndex = memberSummaryFixtures.findIndex((summary) => summary.id === id)
  if (summaryIndex !== -1) {
    memberSummaryFixtures[summaryIndex] = {
      id: updated.id,
      first_name: updated.first_name,
      last_name: updated.last_name,
      email: updated.email,
    }
  }
  return { ...updated }
}

function mockDeleteMember(id: string): void {
  const user = getCurrentUser()
  const index = memberFixtures.findIndex((member) => member.id === id)

  if (user.role !== 'admin') {
    throw mockHttpError(403, 'Only admins can delete members.')
  }
  if (index === -1) throw mockHttpError(404, `Member not found: ${id}`)

  memberFixtures.splice(index, 1)
  const summaryIndex = memberSummaryFixtures.findIndex((summary) => summary.id === id)
  if (summaryIndex !== -1) memberSummaryFixtures.splice(summaryIndex, 1)
}

function assertUniqueMemberEmail(email: string, excludeId?: string): void {
  const duplicate = memberFixtures.some(
    (member) => member.id !== excludeId && member.email.toLowerCase() === email.toLowerCase(),
  )
  if (duplicate) throw mockHttpError(409, `Email already in use: ${email}`)
}

function mockMemberId(): string {
  return (
    globalThis.crypto?.randomUUID?.() ??
    `dddddddd-dddd-4ddd-8ddd-${Date.now().toString(16).padStart(12, '0').slice(-12)}`
  )
}
