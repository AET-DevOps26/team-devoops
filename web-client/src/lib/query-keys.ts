import type { QueryKey } from '@tanstack/react-query'

// Cross-resource dependency keys live here to avoid cycles between feature query modules.

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

// These resources embed member refs or aggregates and must be refetched after member writes.
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

// Team and sport changes cascade into embedded member rows and dashboard aggregates.
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

// Balances are server-computed from transactions.
export const transactionDependentKeys: QueryKey[] = [paymentsKeys.balances, dashboardKeys.me]

export const feedbackDependentKeys: QueryKey[] = [dashboardKeys.me]

export const eventCreateDependentKeys: QueryKey[] = [dashboardKeys.me]

export const eventDependentKeys: QueryKey[] = [feedbackKeys.all, dashboardKeys.me]
