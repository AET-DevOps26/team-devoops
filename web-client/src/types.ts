import type { components } from './api'

type S = components['schemas']

// Read models resolve member/team/event FKs to a lightweight Reference { id, name }.
// `name` is a single combined display string (e.g. "Lena Roth"); write DTOs keep bare ids.
export type Reference = S['Reference']
// Back-compat aliases — all FK refs collapse to the same { id, name } shape.
export type MemberRef = Reference
export type TeamRef = Reference
export type EventRef = Reference

export type Member = S['Member']
export type MemberSummary = S['MemberSummary']
export type MemberCreate = S['MemberCreate']
export type MemberPartialUpdate = S['MemberPartialUpdate']
export type MailRequest = S['MailRequest']
export type PdfRequest = S['PdfRequest']

// Generated Event already resolves attendees/creator/teams_linked/sports_linked to Reference.
export type SportEvent = S['Event']
export type EventSummary = S['EventSummary']
export type EventCreate = S['EventCreate']
export type EventPartialUpdate = S['EventPartialUpdate']

// The events list is scoped/filtered client-side by team & sport linkage. The wire summary
// (EventSummary) carries only attendees, so list rows augment it with the linkage refs the
// scope + attendance logic reads. These optional fields are list metadata, not part of the
// summary contract — the detail endpoint (SportEvent) is the authoritative source for them.
export type EventListItem = EventSummary & {
  teams_linked?: Reference[]
  sports_linked?: Reference[]
}

export type Sport = S['Sport']
export type SportCreate = S['SportCreate']
export type SportPartialUpdate = S['SportPartialUpdate']

export type Team = S['Team']
// Write DTOs send the bare sport uuid string for `sport`.
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

// GET /members/dashboard returns ONE role-specific envelope (discriminated by `role`),
// not a superset — the server emits the caller's highest role's shape only (no dual-role
// accounts). The client absorbs the union at the view-model boundary.

// Development reports: kicked off async (202), stored, then listed/read by id.
export type ReportKind = 'member' | 'team'
export type MemberReportSummary = S['MemberReportSummary']
export type TeamReportSummary = S['TeamReportSummary']
// A full report fetched by id; `member`/`team` is populated per `kind`. The text is
// freeform model output — render it as safe prose, never as trusted markup.
export type Report = S['Report']

// Per-sport balance breakdown for the director envelope.
export type TeamBalanceSummary = S['TeamBalanceSummary']

// Dashboard envelopes are aliased straight from the generated schema, so a future spec
// change (e.g. upcoming_events flipping back to an array) is a compile error, not a runtime
// crash. Note: upcoming_events / events_this_week are integer COUNTS, not arrays.
export type TraineeDashboard = S['TraineeDashboard']
export type TrainerDashboard = S['TrainerDashboard']
export type DirectorDashboard = S['DirectorDashboard']
export type AdminDashboard = S['AdminDashboard']

// Discriminated union read type for GET /members/dashboard (discriminator: `role`).
// Note: the server's trainee discriminator is `trainee`; the authz/token role stays `member`.
export type Dashboard = S['Dashboard']

export type Role = 'member' | 'trainer' | 'director' | 'admin'

// Display labels: `member` shows as "Trainee" (server discriminator); token stays `member`.
const ROLE_LABELS = {
  member: 'Trainee',
  trainer: 'Coach',
  director: 'Director',
  admin: 'Admin',
} as const satisfies Record<Role, string>

export function roleLabel(role: Role): string {
  return ROLE_LABELS[role]
}

// The Keycloak `member_roles` claim carries DISPLAY LABELS (Trainee/Coach/Director/Admin),
// assembled server-side from a HashSet — so the array is UNORDERED and may hold several
// roles. Never pick by position: map each label to its Role and reduce to the most
// privileged. Unknown/absent labels collapse to `member`.
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

/**
 * Collapse the (unordered, possibly multi-value) `member_roles` labels to the single most
 * privileged Role. Empty or all-unknown ⇒ `member`. Order-independent by design.
 */
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
  // Membership roles from the Keycloak `member_roles` claim — display labels
  // (Trainee/Coach/Director/Admin), unordered. Collapse with `highestRole(roles)`.
  roles: string[]
}

/** Render a resolved reference (member/team/event) as its display name. */
export function memberRefName(ref: Reference): string {
  return ref.name
}

/** Render a possibly-null creator reference; falls back when the author was deleted. */
export function creatorName(ref: Reference | null, fallback = 'Unknown'): string {
  return ref ? memberRefName(ref) : fallback
}
