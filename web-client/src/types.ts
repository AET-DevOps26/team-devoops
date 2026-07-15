import type { components } from './api'

type S = components['schemas']

export type Reference = S['Reference']
export type MemberRef = Reference
export type TeamRef = Reference
export type EventRef = Reference

export type Member = S['Member']
export type MemberSummary = S['MemberSummary']
export type MemberCreate = S['MemberCreate']
export type MemberPartialUpdate = S['MemberPartialUpdate']
export type MailRequest = S['MailRequest']
export type PdfRequest = S['PdfRequest']

export type SportEvent = S['Event']
export type EventSummary = S['EventSummary']
export type EventCreate = S['EventCreate']
export type EventPartialUpdate = S['EventPartialUpdate']

// The wire summary omits linkage refs needed for client-side scoping; detail remains authoritative.
export type EventListItem = EventSummary & {
  teams_linked?: Reference[]
  sports_linked?: Reference[]
}

export type Sport = S['Sport']
export type SportCreate = S['SportCreate']
export type SportPartialUpdate = S['SportPartialUpdate']

export type Team = S['Team']
export type TeamCreate = S['TeamCreate']
export type TeamPartialUpdate = S['TeamPartialUpdate']

export type Feedback = S['Feedback']
export type FeedbackSummary = S['FeedbackSummary']
export type FeedbackCreate = S['FeedbackCreate']
export type FeedbackPartialUpdate = S['FeedbackPartialUpdate']

export type Transaction = S['Transaction']
export type TransactionCreate = S['TransactionCreate']
export type TransactionPartialUpdate = S['TransactionPartialUpdate']
export type Balance = S['Balance']

export type ReportKind = 'member' | 'team'
export type MemberReportSummary = S['MemberReportSummary']
export type TeamReportSummary = S['TeamReportSummary']
// Report text is untrusted model output and must never be rendered as trusted markup.
export type Report = S['Report']

export type TeamBalanceSummary = S['TeamBalanceSummary']

export type TraineeDashboard = S['TraineeDashboard']
export type TrainerDashboard = S['TrainerDashboard']
export type DirectorDashboard = S['DirectorDashboard']
export type AdminDashboard = S['AdminDashboard']

// The dashboard discriminator is `trainee`, while the token role remains `member`.
export type Dashboard = S['Dashboard']

export type Role = 'member' | 'trainer' | 'director' | 'admin'

const ROLE_LABELS = {
  member: 'Trainee',
  trainer: 'Coach',
  director: 'Director',
  admin: 'Admin',
} as const satisfies Record<Role, string>

export function roleLabel(role: Role): string {
  return ROLE_LABELS[role]
}

// Keycloak role labels come from an unordered HashSet and may contain multiple values.
const LABEL_TO_ROLE: Record<string, Role> = {
  Trainee: 'member',
  Coach: 'trainer',
  Director: 'director',
  Admin: 'admin',
}

const ROLE_POWER: Record<Role, number> = {
  member: 0,
  trainer: 1,
  director: 2,
  admin: 3,
}

export function highestRole(roles: readonly string[]): Role {
  return roles.reduce<Role>((resolved, label) => {
    const role = LABEL_TO_ROLE[label]
    if (!role) return resolved
    return ROLE_POWER[role] > ROLE_POWER[resolved] ? role : resolved
  }, 'member')
}

export interface AuthUser {
  id: string
  name: string
  email: string
  role: Role
}

export function memberRefName(ref: Reference): string {
  return ref.name
}

export function isTeamCoach(
  team: { trainers: readonly Reference[] },
  currentUserId: string,
): boolean {
  return team.trainers.some((member) => member.id === currentUserId)
}

export function creatorName(ref: Reference | null, fallback = 'Unknown'): string {
  return ref ? memberRefName(ref) : fallback
}
