import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

import { getCurrentUser } from '@/features/auth/currentUser'
import {
  memberReportSummaries,
  reportById,
  teamReportSummaries,
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
          return Promise.resolve()
        },
        () => helperClient.post(`/reports/team/${teamId}`).then(() => undefined),
      ),
    onSuccess: () => qc.invalidateQueries({ queryKey: helperKeys.teamReports(teamId) }),
  })
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
          return Promise.resolve(memberReportSummaries(memberId))
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
          return Promise.resolve(teamReportSummaries(teamId))
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
          const found = reportId ? reportById[reportId] : undefined
          if (!found) throw new Error('Report not found')
          return Promise.resolve(found)
        },
        () => helperClient.get<Report>(`/reports/${reportId}`).then(r => r.data),
      ),
  })
}

// ---- delete ----

export function useDeleteReport() {
  const qc = useQueryClient()

  return useMutation<void, Error, { reportId: string; listKey: readonly unknown[] }>({
    mutationFn: ({ reportId }) =>
      mockOr(
        () => Promise.resolve(),
        () => helperClient.delete(`/reports/${reportId}`).then(() => undefined),
      ),
    onSuccess: (_, { reportId, listKey }) => {
      qc.invalidateQueries({ queryKey: listKey })
      qc.removeQueries({ queryKey: helperKeys.report(reportId) })
    },
  })
}
