import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

import { getCurrentUser } from '@/features/auth/currentUser'
import {
  memberNamesById,
  memberReportSummariesById,
  reportById as reportByIdFixture,
  teamFixtures,
  teamReportSummariesById,
} from '@/mocks/fixtures'
import { mockOr } from '@/mocks/mockSwitch'
import { scopeReport, scopeTeamReport } from '@/mocks/scope'
import type { MemberReportSummary, Report, TeamReportSummary } from '@/types'
import { helperClient } from './client'

export const helperKeys = {
  hello: ['helper', 'hello'] as const,
  memberReports: (memberId: string) => ['helper', 'reports', 'member', memberId] as const,
  teamReports: (teamId: string) => ['helper', 'reports', 'team', teamId] as const,
  report: (reportId: string) => ['helper', 'reports', reportId] as const,
}

const mockReportById: Record<string, Report> = { ...reportByIdFixture }
const mockMemberReportSummariesById: Record<string, MemberReportSummary[]> = Object.fromEntries(
  Object.entries(memberReportSummariesById).map(([memberId, rows]) => [memberId, [...rows]]),
)
const mockTeamReportSummariesById: Record<string, TeamReportSummary[]> = Object.fromEntries(
  Object.entries(teamReportSummariesById).map(([teamId, rows]) => [teamId, [...rows]]),
)

function mockReportId(): string {
  return globalThis.crypto?.randomUUID?.() ?? `ffffffff-ffff-4fff-8fff-${Date.now().toString(16).padStart(12, '0').slice(-12)}`
}

export function useHelperHello() {
  return useQuery<string>({
    queryKey: helperKeys.hello,
    queryFn: () => helperClient.get<string>('/hello').then(r => r.data),
  })
}

// ---- generate (async 202, fire-and-forget) ----

export function useGenerateMemberReport(memberId: string) {
  const qc = useQueryClient()

  return useMutation<void, Error, void>({
    mutationFn: () =>
      mockOr(
        () => {
          if (!scopeReport(memberId, getCurrentUser())) throw new Error('Report not allowed')
          mockGenerateMemberReport(memberId)
          return Promise.resolve()
        },
        () => helperClient.post(`/reports/member/${memberId}`).then(() => undefined),
      ),
    onSuccess: () => qc.invalidateQueries({ queryKey: helperKeys.memberReports(memberId) }),
  })
}

export function useGenerateTeamReport(teamId: string) {
  const qc = useQueryClient()

  return useMutation<void, Error, void>({
    mutationFn: () =>
      mockOr(
        () => {
          if (!scopeTeamReport(teamId, getCurrentUser())) throw new Error('Report not allowed')
          mockGenerateTeamReport(teamId)
          return Promise.resolve()
        },
        () => helperClient.post(`/reports/team/${teamId}`).then(() => undefined),
      ),
    onSuccess: () => qc.invalidateQueries({ queryKey: helperKeys.teamReports(teamId) }),
  })
}

function mockGenerateMemberReport(memberId: string): void {
  const name = memberNamesById[memberId]
  if (!name) return

  const member = { id: memberId, name }
  const report: Report = {
    id: mockReportId(),
    kind: 'member',
    member,
    created_at: new Date().toISOString(),
    text: `# Development report — ${name}\n\nReport generation in progress.`,
  }

  mockReportById[report.id] = report
  mockMemberReportSummariesById[memberId] = [
    { id: report.id, member, created_at: report.created_at },
    ...(mockMemberReportSummariesById[memberId] ?? []),
  ]
}

function mockGenerateTeamReport(teamId: string): void {
  const team = teamFixtures.find((item) => item.id === teamId)
  if (!team) return

  const teamRef = { id: team.id, name: team.name }
  const report: Report = {
    id: mockReportId(),
    kind: 'team',
    team: teamRef,
    created_at: new Date().toISOString(),
    text: `# Team report — ${team.name}\n\nReport generation in progress.`,
  }

  mockReportById[report.id] = report
  mockTeamReportSummariesById[teamId] = [
    { id: report.id, team: teamRef, created_at: report.created_at },
    ...(mockTeamReportSummariesById[teamId] ?? []),
  ]
}

// ---- list summaries (newest-first, no text) ----

export function useMemberReports(memberId: string, enabled = true) {
  return useQuery<MemberReportSummary[]>({
    queryKey: helperKeys.memberReports(memberId),
    staleTime: 30_000,
    enabled: enabled && !!memberId,
    queryFn: () =>
      mockOr(
        () => {
          if (!scopeReport(memberId, getCurrentUser())) return Promise.resolve([])
          return Promise.resolve(mockMemberReportSummariesById[memberId] ?? [])
        },
        () => helperClient.get<MemberReportSummary[]>(`/reports/member/${memberId}`).then(r => r.data),
      ),
  })
}

export function useTeamReports(teamId: string, enabled = true) {
  return useQuery<TeamReportSummary[]>({
    queryKey: helperKeys.teamReports(teamId),
    staleTime: 30_000,
    enabled: enabled && !!teamId,
    queryFn: () =>
      mockOr(
        () => {
          if (!scopeTeamReport(teamId, getCurrentUser())) return Promise.resolve([])
          return Promise.resolve(mockTeamReportSummariesById[teamId] ?? [])
        },
        () => helperClient.get<TeamReportSummary[]>(`/reports/team/${teamId}`).then(r => r.data),
      ),
  })
}

// ---- read one full report (with text) ----

export function useReport(reportId: string | null) {
  return useQuery<Report>({
    queryKey: helperKeys.report(reportId ?? ''),
    enabled: !!reportId,
    queryFn: () =>
      mockOr(
        () => {
          const found = reportId ? mockReportById[reportId] : undefined
          if (!found) throw new Error('Report not found')
          return Promise.resolve(found)
        },
        () => helperClient.get<Report>(`/reports/${reportId}`).then(r => r.data),
      ),
  })
}

// ---- delete ----

function mockDeleteReport(reportId: string): void {
  const report = mockReportById[reportId]
  if (!report) return

  delete mockReportById[reportId]

  if (report.kind === 'member' && report.member) {
    const memberId = report.member.id
    mockMemberReportSummariesById[memberId] = (mockMemberReportSummariesById[memberId] ?? []).filter(
      (row) => row.id !== reportId,
    )
  }

  if (report.kind === 'team' && report.team) {
    const teamId = report.team.id
    mockTeamReportSummariesById[teamId] = (mockTeamReportSummariesById[teamId] ?? []).filter(
      (row) => row.id !== reportId,
    )
  }
}

export function useDeleteReport() {
  const qc = useQueryClient()

  return useMutation<void, Error, { reportId: string; listKey: readonly unknown[] }>({
    mutationFn: ({ reportId }) =>
      mockOr(
        () => {
          mockDeleteReport(reportId)
          return Promise.resolve()
        },
        () => helperClient.delete(`/reports/${reportId}`).then(() => undefined),
      ),
    onSuccess: (_, { reportId, listKey }) => {
      qc.invalidateQueries({ queryKey: listKey })
      qc.removeQueries({ queryKey: helperKeys.report(reportId) })
    },
  })
}
