import type { components } from './api'

type S = components['schemas']

// Read models resolve member/team FKs to objects; write DTOs keep bare ids.
export interface MemberRef {
  id: string
  first_name: string
  last_name: string
}

export interface TeamRef {
  id: string
  name: string
}

export type Member = S['Member']
export type MemberSummary = S['MemberSummary']
export type MemberCreate = S['MemberCreate']
export type MemberPartialUpdate = S['MemberPartialUpdate']

export type SportEvent = Omit<S['Event'], 'attendees' | 'creator' | 'teams_linked'> & {
  attendees?: MemberRef[]
  creator: MemberRef
  teams_linked?: TeamRef[]
}
export type EventSummary = S['EventSummary'] & {
  attendees?: MemberRef[]
  teams_linked?: TeamRef[]
}
export type EventCreate = S['EventCreate']
export type EventPartialUpdate = S['EventPartialUpdate']

export type Sport = Omit<S['Sport'], 'directors'> & {
  directors: MemberRef[]
}
export type SportCreate = S['SportCreate']
export type SportPartialUpdate = S['SportPartialUpdate']

export type Team = Omit<S['Team'], 'trainers' | 'trainees'> & {
  trainers: MemberRef[]
  trainees: MemberRef[]
}
export type TeamCreate = S['TeamCreate']
export type TeamPartialUpdate = S['TeamPartialUpdate']

// rating: 0-10, optional until the live schema adds it.
export type Feedback = Omit<S['Feedback'], 'member' | 'creator'> & {
  member: MemberRef
  creator: MemberRef
  rating?: number
}
export type FeedbackSummary = Omit<S['FeedbackSummary'], 'member' | 'creator'> & {
  member: MemberRef
  creator: MemberRef
  rating?: number
}
export type FeedbackCreate = S['FeedbackCreate']
export type FeedbackPartialUpdate = S['FeedbackPartialUpdate']

export type Transaction = Omit<S['Transaction'], 'member' | 'creator'> & {
  member: MemberRef
  creator: MemberRef
}
export type TransactionCreate = S['TransactionCreate']
export type TransactionPartialUpdate = S['TransactionPartialUpdate']
export type Balance = Omit<S['Balance'], 'member'> & {
  member: MemberRef
}

export interface DashboardAggregate {
  member: MemberSummary
  events: EventSummary[]
  feedback: FeedbackSummary[]
  balance: Balance
  transactions: Transaction[]
  report: string
}

export type Role = 'member' | 'trainer' | 'director' | 'admin'

const ROLE_LABELS = {
  member: 'Member',
  trainer: 'Coach',
  director: 'Director',
  admin: 'Admin',
} as const satisfies Record<Role, string>

export function roleLabel(role: Role): string {
  return ROLE_LABELS[role]
}

export interface AuthUser {
  id: string
  name: string
  email: string
  role: Role
}

/** Render a resolved member reference as a display name. */
export function memberRefName(ref: MemberRef): string {
  return `${ref.first_name} ${ref.last_name}`
}
