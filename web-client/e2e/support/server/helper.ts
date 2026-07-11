import {
  memberNamesById,
  memberReportSummariesById,
  reportById as reportByIdFixture,
  teamFixtures,
  teamReportSummariesById,
} from '@/testing/fixtures'
import { httpError } from '@/testing/httpError'
import { scopeReport, scopeTeamReport } from '@/testing/scope'
import type { AuthUser, MemberReportSummary, Report, TeamReportSummary } from '@/types'

// In-memory helper (reports) resource; reset() restores the module-level state per test.

let reportState: Record<string, Report> = {}
let memberReportSummariesState: Record<string, MemberReportSummary[]> = {}
let teamReportSummariesState: Record<string, TeamReportSummary[]> = {}

export function reset(): void {
  reportState = { ...reportByIdFixture }
  memberReportSummariesState = Object.fromEntries(
    Object.entries(memberReportSummariesById).map(([memberId, rows]) => [memberId, [...rows]]),
  )
  teamReportSummariesState = Object.fromEntries(
    Object.entries(teamReportSummariesById).map(([teamId, rows]) => [teamId, [...rows]]),
  )
}

reset()

function newReportId(): string {
  return globalThis.crypto?.randomUUID?.() ?? `ffffffff-ffff-4fff-8fff-${Date.now().toString(16).padStart(12, '0').slice(-12)}`
}

export function generateMemberReport(memberId: string, user: AuthUser): void {
  if (!scopeReport(memberId, user)) throw httpError(403, 'Report not allowed')

  const name = memberNamesById[memberId]
  if (!name) return

  const member = { id: memberId, name }
  const report: Report = {
    id: newReportId(),
    kind: 'member',
    member,
    created_at: new Date().toISOString(),
    text: `# Development report — ${name}\n\nReport generation in progress.`,
  }

  reportState[report.id] = report
  memberReportSummariesState[memberId] = [
    { id: report.id, member, created_at: report.created_at },
    ...(memberReportSummariesState[memberId] ?? []),
  ]
}

export function generateTeamReport(teamId: string, user: AuthUser): void {
  if (!scopeTeamReport(teamId, user)) throw httpError(403, 'Report not allowed')

  const team = teamFixtures.find((item) => item.id === teamId)
  if (!team) return

  const teamRef = { id: team.id, name: team.name }
  const report: Report = {
    id: newReportId(),
    kind: 'team',
    team: teamRef,
    created_at: new Date().toISOString(),
    text: `# Team report — ${team.name}\n\nReport generation in progress.`,
  }

  reportState[report.id] = report
  teamReportSummariesState[teamId] = [
    { id: report.id, team: teamRef, created_at: report.created_at },
    ...(teamReportSummariesState[teamId] ?? []),
  ]
}

export function listMemberReports(memberId: string, user: AuthUser): MemberReportSummary[] {
  if (!scopeReport(memberId, user)) return []
  return memberReportSummariesState[memberId] ?? []
}

export function listTeamReports(teamId: string, user: AuthUser): TeamReportSummary[] {
  if (!scopeTeamReport(teamId, user)) return []
  return teamReportSummariesState[teamId] ?? []
}

export function getReport(reportId: string): Report {
  const found = reportId ? reportState[reportId] : undefined
  if (!found) throw httpError(404, 'Report not found')
  return found
}

export function deleteReport(reportId: string): void {
  const report = reportState[reportId]
  if (!report) return

  delete reportState[reportId]

  if (report.kind === 'member' && report.member) {
    const memberId = report.member.id
    memberReportSummariesState[memberId] = (memberReportSummariesState[memberId] ?? []).filter(
      (row) => row.id !== reportId,
    )
  }

  if (report.kind === 'team' && report.team) {
    const teamId = report.team.id
    teamReportSummariesState[teamId] = (teamReportSummariesState[teamId] ?? []).filter(
      (row) => row.id !== reportId,
    )
  }
}
