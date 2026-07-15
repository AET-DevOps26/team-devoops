import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

import type { MemberReportSummary, Report, TeamReportSummary } from '@/types'
import { helperKeys } from '@/lib/query-keys'
import { settleMutation } from '@/lib/query-cache'
import { helperClient } from './client'

export { helperKeys }

export function useHelperHello() {
  return useQuery<string>({
    queryKey: helperKeys.hello,
    queryFn: () => helperClient.get<string>('/hello').then(r => r.data),
  })
}

export function useGenerateMemberReport(memberId: string) {
  const qc = useQueryClient()

  return useMutation<void, Error, boolean | undefined>({
    mutationFn: (useLocal) =>
      helperClient.post(`/reports/member/${memberId}`, { uselocal: useLocal }).then(() => undefined),
    // This first refresh may precede the asynchronous result. The view model keeps polling the
    // invalidated list until the generated report appears.
    onSuccess: () =>
      settleMutation(qc, { invalidate: [helperKeys.memberReports(memberId)] }),
  })
}

export function useGenerateTeamReport(teamId: string) {
  const qc = useQueryClient()

  return useMutation<void, Error, boolean | undefined>({
    mutationFn: (useLocal) =>
      helperClient.post(`/reports/team/${teamId}`, { uselocal: useLocal }).then(() => undefined),
    onSuccess: () => settleMutation(qc, { invalidate: [helperKeys.teamReports(teamId)] }),
  })
}

export function useMemberReports(memberId: string, enabled = true) {
  return useQuery<MemberReportSummary[]>({
    queryKey: helperKeys.memberReports(memberId),
    staleTime: 30_000,
    enabled: enabled && !!memberId,
    queryFn: () => helperClient.get<MemberReportSummary[]>(`/reports/member/${memberId}`).then(r => r.data),
  })
}

export function useTeamReports(teamId: string, enabled = true) {
  return useQuery<TeamReportSummary[]>({
    queryKey: helperKeys.teamReports(teamId),
    staleTime: 30_000,
    enabled: enabled && !!teamId,
    queryFn: () => helperClient.get<TeamReportSummary[]>(`/reports/team/${teamId}`).then(r => r.data),
  })
}

export function useReport(reportId: string | null) {
  return useQuery<Report>({
    queryKey: helperKeys.report(reportId ?? ''),
    enabled: !!reportId,
    queryFn: () => helperClient.get<Report>(`/reports/${reportId}`).then(r => r.data),
  })
}

export function useDeleteReport() {
  const qc = useQueryClient()

  return useMutation<void, Error, { reportId: string; listKey: readonly unknown[] }>({
    mutationFn: ({ reportId }) => helperClient.delete(`/reports/${reportId}`).then(() => undefined),
    // The caller passes the list the report is shown in (member or team), because a report id alone
    // does not say which. The row is dropped by id so it cannot outlive the refetch.
    onSuccess: (_, { reportId, listKey }) =>
      settleMutation(qc, {
        remove: [{ key: listKey, id: reportId }],
        evict: [helperKeys.report(reportId)],
        invalidate: [listKey],
      }),
  })
}
