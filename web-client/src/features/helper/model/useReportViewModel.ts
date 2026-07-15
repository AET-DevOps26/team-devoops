import { useEffect, useMemo, useRef, useState } from 'react'

import { useAuth } from '@/features/auth'
import { useTeamsList } from '@/features/organization/api/queries'
import { formatDate } from '@/lib/format'
import { memberRefName, type Reference } from '@/types'
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

  const isTrainer = user.role === 'trainer'
  const teamsQuery = useTeamsList(isTrainer)
  const team = useMemo<Reference | null>(() => {
    if (!isTrainer) return null
    const found = teamsQuery.data?.find((t) => t.trainers.some((tr) => tr.id === user.id))
    return found ? { id: found.id, name: found.name } : null
  }, [isTrainer, teamsQuery.data, user.id])

  const scope: ReportScope = isTrainer ? 'team' : 'member'

  // The 202 response has no status endpoint, so a new list entry is the completion signal.
  const [awaitCount, setAwaitCount] = useState<number | null>(null)
  const awaitTimer = useRef<ReturnType<typeof setTimeout> | null>(null)

  const memberReports = useMemberReports(user.id, scope === 'member')
  const teamReports = useTeamReports(team?.id ?? '', scope === 'team')

  const query = scope === 'team' ? teamReports : memberReports
  const listKey =
    scope === 'team'
      ? helperKeys.teamReports(team?.id ?? '')
      : helperKeys.memberReports(user.id)

  const reportCount = query.data?.length ?? 0
  const isAwaitingReport = awaitCount !== null && reportCount <= awaitCount

  const refetch = query.refetch
  useEffect(() => {
    if (!isAwaitingReport) return
    const id = setInterval(() => void refetch(), 4000)
    return () => clearInterval(id)
  }, [isAwaitingReport, refetch])

  useEffect(() => () => {
    if (awaitTimer.current) clearTimeout(awaitTimer.current)
  }, [])

  const generateMember = useGenerateMemberReport(user.id)
  const generateTeam = useGenerateTeamReport(team?.id ?? '')
  const generateMutation = scope === 'team' ? generateTeam : generateMember

  const stopAwaiting = () => {
    if (awaitTimer.current) clearTimeout(awaitTimer.current)
    awaitTimer.current = null
    setAwaitCount(null)
  }

  const generate = async (useLocal?: boolean) => {
    if (awaitTimer.current) clearTimeout(awaitTimer.current)
    setAwaitCount(reportCount)
    awaitTimer.current = setTimeout(() => setAwaitCount(null), 120_000)
    // The POST itself can fail (or time out). Without this the page would keep claiming
    // "Generating…" for the full 2 minutes while also showing the error.
    try {
      await generateMutation.mutateAsync(useLocal)
    } catch (error) {
      stopAwaiting()
      throw error
    }
  }

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
    error: query.error,
    refetch: () => void query.refetch(),
    generate,
    isGenerating: generateMutation.isPending,
    isAwaitingReport,
    listKey,
  }
}

export interface ReportDetailView {
  text: string
  subject: string
  dateLabel: string
  isLoading: boolean
  isError: boolean
  error: Error | null
  refetch: () => void
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
    error: reportQuery.error,
    refetch: () => void reportQuery.refetch(),
  }
}

export { useDeleteReport }
