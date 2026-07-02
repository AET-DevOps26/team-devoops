import { useMemo } from 'react'

import { useAuth } from '@/features/auth'
import { useTeamsList } from '@/features/organization/api/queries'
import { formatDate } from '@/lib/format'
import { highestRole, memberRefName, type Reference } from '@/types'
import {
  helperKeys,
  useDeleteReport,
  useGenerateMemberReport,
  useGenerateTeamReport,
  useMemberReports,
  useReport,
  useTeamReports,
} from '../api/queries'

export type ReportScope = 'member' | 'team'

export interface ReportRow {
  id: string
  subject: string
  dateLabel: string
  createdAt: string
}

export function useReportViewModel() {
  const { user } = useAuth()

  // Coaches report on the team they train; everyone else reports on a member (their own
  // for trainees; admins/directors fall back to the member path per the task's scope).
  const isTrainer = highestRole(user.roles) === 'trainer'
  const teamsQuery = useTeamsList(isTrainer)
  const team = useMemo<Reference | null>(() => {
    if (!isTrainer) return null
    const found = teamsQuery.data?.find((t) => t.trainers.some((tr) => tr.id === user.id))
    return found ? { id: found.id, name: found.name } : null
  }, [isTrainer, teamsQuery.data, user.id])

  const scope: ReportScope = isTrainer ? 'team' : 'member'

  const memberReports = useMemberReports(user.id, scope === 'member')
  const teamReports = useTeamReports(team?.id ?? '', scope === 'team')

  const query = scope === 'team' ? teamReports : memberReports
  const listKey =
    scope === 'team'
      ? helperKeys.teamReports(team?.id ?? '')
      : helperKeys.memberReports(user.id)

  const generateMember = useGenerateMemberReport(user.id)
  const generateTeam = useGenerateTeamReport(team?.id ?? '')
  const generate = scope === 'team' ? generateTeam : generateMember

  const rows = useMemo<ReportRow[]>(() => {
    const data = query.data ?? []
    return data.map((summary) =>
      'team' in summary
        ? {
            id: summary.id,
            subject: summary.team.name,
            dateLabel: formatDate(summary.created_at),
            createdAt: summary.created_at,
          }
        : {
            id: summary.id,
            subject: memberRefName(summary.member),
            dateLabel: formatDate(summary.created_at),
            createdAt: summary.created_at,
          },
    )
  }, [query.data])

  return {
    scope,
    subjectLabel: scope === 'team' ? (team?.name ?? 'your team') : 'you',
    rows,
    isLoading: (isTrainer && teamsQuery.isLoading) || query.isLoading,
    isError: query.isError,
    generate: () => generate.mutate(),
    isGenerating: generate.isPending,
    generateError: generate.error,
    listKey,
  }
}

export interface ReportDetailView {
  text: string
  subject: string
  dateLabel: string
  isLoading: boolean
  isError: boolean
}

export function useReportDetailView(reportId: string | null): ReportDetailView {
  const reportQuery = useReport(reportId)
  const report = reportQuery.data

  const subject = report
    ? report.kind === 'team'
      ? (report.team?.name ?? 'Team')
      : report.member
        ? memberRefName(report.member)
        : 'Member'
    : ''

  return {
    text: report?.text ?? '',
    subject,
    dateLabel: report ? formatDate(report.created_at) : '',
    isLoading: reportQuery.isLoading,
    isError: reportQuery.isError,
  }
}

export { useDeleteReport }
