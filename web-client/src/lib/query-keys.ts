import type { QueryKey } from '@tanstack/react-query'

/**
 * Every query key in the app, and the cross-resource dependencies between them.
 *
 * Keys live here rather than in each feature's `queries.ts` for one reason: a mutation on one
 * resource routinely changes another. Members are embedded in team rosters, feedback, events and
 * transactions; a transaction changes a balance; deleting a sport deletes its teams. Expressing
 * those edges means a feature's mutation module has to name another feature's keys, and if keys
 * stay next to their `useQuery` hooks that turns into a cycle of feature modules importing each
 * other. Keys are pure data, so hoisting them breaks the cycle and — more importantly — puts the
 * dependency map in one place where a missing edge is visible instead of implied.
 */

export const membersKeys = {
  hello: ['members', 'hello'] as const,
  all: ['members'] as const,
  detail: (id: string) => ['members', id] as const,
}

export const organizationKeys = {
  hello: ['organization', 'hello'] as const,
  sports: ['organization', 'sports'] as const,
  sport: (id: string) => ['organization', 'sports', id] as const,
  teams: ['organization', 'teams'] as const,
  team: (id: string) => ['organization', 'teams', id] as const,
}

export const feedbackKeys = {
  all: ['feedback'] as const,
  detail: (id: string) => ['feedback', id] as const,
  hello: ['feedback', 'hello'] as const,
}

export const eventKeys = {
  hello: ['sport-events', 'hello'] as const,
  all: ['sport-events'] as const,
  list: () => ['sport-events', 'list'] as const,
  detail: (id: string | null | undefined) => ['sport-events', 'detail', id] as const,
}

export const paymentsKeys = {
  hello: ['payments', 'hello'] as const,
  balances: ['payments', 'balances'] as const,
  balance: (memberId: string) => ['payments', 'balances', memberId] as const,
  transactions: ['payments', 'transactions'] as const,
  transaction: (id: string) => ['payments', 'transactions', id] as const,
}

export const helperKeys = {
  hello: ['helper', 'hello'] as const,
  reports: ['helper', 'reports'] as const,
  memberReportsAll: ['helper', 'reports', 'member'] as const,
  memberReports: (memberId: string) => ['helper', 'reports', 'member', memberId] as const,
  teamReportsAll: ['helper', 'reports', 'team'] as const,
  teamReports: (teamId: string) => ['helper', 'reports', 'team', teamId] as const,
  report: (reportId: string) => ['helper', 'reports', reportId] as const,
}

export const dashboardKeys = {
  me: ['dashboard', 'me'] as const,
}

/**
 * Resources that embed a member ref and are therefore stale after any member write.
 *
 * Rosters, feedback, events and transactions all carry a resolved `{ id, name }` member ref, and
 * the dashboard aggregates them. Deleting a member drops their team and sport memberships, deletes
 * feedback about them and clears their name from records they authored (this is what the delete
 * confirmation promises); renaming one changes the name every roster and picker shows. Neither
 * cascade can be reproduced by editing the client cache, so these are refetched.
 */
export const memberCreateDependentKeys: QueryKey[] = [dashboardKeys.me]

export const memberDependentKeys = (memberId: string): QueryKey[] => [
  organizationKeys.teams,
  organizationKeys.sports,
  feedbackKeys.all,
  eventKeys.all,
  paymentsKeys.transactions,
  paymentsKeys.balances,
  helperKeys.memberReports(memberId),
  helperKeys.reports,
  dashboardKeys.me,
]

/**
 * A team's roster and its sport link are embedded in the member rows (which show team and sport
 * names) and in the dashboard. Deleting a sport also deletes its teams server-side.
 */
export const teamCreateDependentKeys: QueryKey[] = [membersKeys.all, dashboardKeys.me]

export const teamDependentKeys = (teamId: string): QueryKey[] => [
  membersKeys.all,
  eventKeys.all,
  helperKeys.teamReports(teamId),
  helperKeys.reports,
  dashboardKeys.me,
]

export const sportDependentKeys: QueryKey[] = [
  organizationKeys.teams,
  membersKeys.all,
  eventKeys.all,
  helperKeys.teamReportsAll,
  helperKeys.reports,
  dashboardKeys.me,
]

export const sportCreateDependentKeys: QueryKey[] = [dashboardKeys.me]

/** A transaction is what a balance is computed from, so a balance is never authoritative locally. */
export const transactionDependentKeys: QueryKey[] = [paymentsKeys.balances, dashboardKeys.me]

/** Feedback is attached to an event and surfaced on the dashboard. */
export const feedbackDependentKeys: QueryKey[] = [dashboardKeys.me]

/** An event carries its attendees and the feedback written against it. */
export const eventCreateDependentKeys: QueryKey[] = [dashboardKeys.me]

export const eventDependentKeys: QueryKey[] = [feedbackKeys.all, dashboardKeys.me]
