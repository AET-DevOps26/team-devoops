import {
  memberFixtures as memberFixturesSource,
  memberSummaryFixtures as memberSummaryFixturesSource,
} from '@/testing/fixtures'
import { httpError } from '@/testing/httpError'
import { scopeMembers } from '@/testing/scope'
import type { AuthUser, Member, MemberCreate, MemberPartialUpdate, MemberSummary } from '@/types'

let memberFixtures: Member[] = []
let memberSummaryFixtures: MemberSummary[] = []

export function reset(): void {
  memberFixtures = structuredClone(memberFixturesSource)
  memberSummaryFixtures = structuredClone(memberSummaryFixturesSource)
}

reset()

export function listMembers(user: AuthUser): MemberSummary[] {
  return scopeMembers(memberSummaryFixtures, user)
}

export function getMember(id: string, user: AuthUser): Member {
  const found = memberFixtures.find((m) => m.id === id)
  const scoped = found ? scopeMembers([found], user) : []
  if (!scoped[0]) throw httpError(404, 'Member not found')
  return scoped[0]
}

export function createMember(data: MemberCreate, user: AuthUser): Member {
  if (user.role !== 'admin') {
    throw httpError(403, 'Only admins can create members.')
  }

  const fieldErrors: { message: string }[] = []
  if (!data.first_name.trim()) fieldErrors.push({ message: 'first_name: must not be blank' })
  if (!data.last_name.trim()) fieldErrors.push({ message: 'last_name: must not be blank' })
  if (!data.password) fieldErrors.push({ message: 'password: must not be blank' })
  if (fieldErrors.length > 0) {
    throw httpError(400, 'Validation failed', fieldErrors)
  }

  const email = data.email.trim()
  assertUniqueMemberEmail(email)

  const member: Member = {
    id: newMemberId(),
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

export function updateMember(
  id: string,
  data: MemberPartialUpdate,
  user: AuthUser,
): Member {
  const index = memberFixtures.findIndex((member) => member.id === id)
  const member = memberFixtures[index]

  if (!member) throw httpError(404, `Member not found: ${id}`)
  if (user.role !== 'admin' && user.id !== id) {
    throw httpError(403, 'Access denied')
  }
  if (data.email !== undefined) {
    const email = data.email.trim()
    if (!email) throw httpError(400, 'Email is required.')
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

export function deleteMember(id: string, user: AuthUser): void {
  const index = memberFixtures.findIndex((member) => member.id === id)

  if (user.role !== 'admin') {
    throw httpError(403, 'Only admins can delete members.')
  }
  if (index === -1) throw httpError(404, `Member not found: ${id}`)

  memberFixtures.splice(index, 1)
  const summaryIndex = memberSummaryFixtures.findIndex((summary) => summary.id === id)
  if (summaryIndex !== -1) memberSummaryFixtures.splice(summaryIndex, 1)
}

function assertUniqueMemberEmail(email: string, excludeId?: string): void {
  const duplicate = memberFixtures.some(
    (member) => member.id !== excludeId && member.email.toLowerCase() === email.toLowerCase(),
  )
  if (duplicate) throw httpError(409, `Email already in use: ${email}`)
}

function newMemberId(): string {
  return (
    globalThis.crypto?.randomUUID?.() ??
    `dddddddd-dddd-4ddd-8ddd-${Date.now().toString(16).padStart(12, '0').slice(-12)}`
  )
}
