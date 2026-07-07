import { useMemo } from 'react'

import { useAuth } from '@/features/auth'
import { useTeamsList } from '@/features/organization/api/queries'
import { memberSummaryName } from '@/lib/format'
import { type AuthUser, type MemberSummary, type Team } from '@/types'
import { useMembers } from '../api/queries'
import type { MembersFilters } from './membersUiStore'
import { useMembersUiStore } from './membersUiStore'

export interface MemberRow {
  id: string
  name: string
  email: string
  teamIds: string[]
  teamNames: string[]
  sports: string[]
}

export interface MembersView {
  rows: MemberRow[]
  totalRows: number
  composableMemberIds: Set<string>
  teamOptions: { value: string; label: string }[]
  sportOptions: { value: string; label: string }[]
}

export interface MemberPickerOption {
  id: string
  name: string
}

export function buildMemberPickerOptions(
  members: MemberSummary[],
  search: string,
): MemberPickerOption[] {
  const query = search.trim().toLocaleLowerCase()

  return members
    .map((member) => ({ id: member.id, name: memberSummaryName(member) }))
    .filter((member) => query.length === 0 || member.name.toLocaleLowerCase().includes(query))
    .toSorted((a, b) => a.name.localeCompare(b.name))
}

function memberTeamRows(members: MemberSummary[], teams: Team[]): MemberRow[] {
  return members.map((member) => {
    const memberTeams = teams.filter(
      (team) =>
        team.trainees.some((trainee) => trainee.id === member.id) ||
        team.trainers.some((trainer) => trainer.id === member.id),
    )

    return {
      id: member.id,
      name: memberSummaryName(member),
      email: member.email,
      teamIds: memberTeams.map((team) => team.id),
      teamNames: memberTeams.map((team) => team.name),
      sports: Array.from(new Set(memberTeams.map((team) => team.sport.name))).toSorted(),
    }
  })
}

export function filterMemberRows(rows: MemberRow[], filters: MembersFilters): MemberRow[] {
  const search = filters.search.trim().toLocaleLowerCase()

  return rows.filter((member) => {
    const matchesText =
      search.length === 0 ||
      member.name.toLocaleLowerCase().includes(search) ||
      member.email.toLocaleLowerCase().includes(search)

    return (
      matchesText &&
      (filters.teamId === 'all' || member.teamIds.includes(filters.teamId)) &&
      (filters.sport === 'all' || member.sports.includes(filters.sport))
    )
  })
}

export function buildMembersView(
  members: MemberSummary[],
  teams: Team[],
  filters: MembersFilters,
  user: AuthUser,
): MembersView {
  const rows = memberTeamRows(members, teams).toSorted((a, b) => a.name.localeCompare(b.name))
  const composableMemberIds = buildComposableMemberIds(members, teams, user)

  const scopedTeamIds = new Set(rows.flatMap((row) => row.teamIds))
  const teamOptions = teams
    .filter((team) => scopedTeamIds.has(team.id))
    .map((team) => ({ value: team.id, label: team.name }))
    .toSorted((a, b) => a.label.localeCompare(b.label))
  const scopedSports = new Set(rows.flatMap((row) => row.sports))
  const sportOptions = Array.from(scopedSports, (sport) => ({
    value: sport,
    label: sport,
  })).toSorted((a, b) => a.label.localeCompare(b.label))

  return {
    rows: filterMemberRows(rows, filters),
    totalRows: rows.length,
    composableMemberIds,
    teamOptions,
    sportOptions,
  }
}

export function buildComposableMemberIds(
  members: MemberSummary[],
  teams: Team[],
  user: AuthUser,
): Set<string> {
  if (user.role === 'admin') {
    return new Set(members.map((member) => member.id))
  }

  if (user.role !== 'trainer') {
    return new Set()
  }

  return new Set(
    teams
      .filter((team) => team.trainers.some((trainer) => trainer.id === user.id))
      .flatMap((team) => team.trainees.map((trainee) => trainee.id)),
  )
}

export function useMembersViewModel() {
  const { user } = useAuth()
  const membersQuery = useMembers()
  const teamsQuery = useTeamsList()
  const filters = useMembersUiStore((state) => state.filters)

  const view = useMemo(
    () => buildMembersView(membersQuery.data ?? [], teamsQuery.data ?? [], filters, user),
    [filters, membersQuery.data, teamsQuery.data, user],
  )

  return {
    view,
    isLoading: membersQuery.isLoading || teamsQuery.isLoading,
    error: membersQuery.error ?? teamsQuery.error,
  }
}
