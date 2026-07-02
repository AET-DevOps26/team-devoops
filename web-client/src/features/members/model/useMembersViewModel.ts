import { useMemo } from 'react'

import { useTeamsList } from '@/features/organization/api/queries'
import { type MemberSummary, type Team } from '@/types'
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
  teamOptions: { value: string; label: string }[]
  sportOptions: { value: string; label: string }[]
}

// MemberSummary is the list model with split names (not an FK ref) — combine them here.
function memberName(member: MemberSummary): string {
  return `${member.first_name} ${member.last_name}`
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
      name: memberName(member),
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
): MembersView {
  const rows = memberTeamRows(members, teams).toSorted((a, b) => a.name.localeCompare(b.name))
  const teamOptions = teams
    .map((team) => ({ value: team.id, label: team.name }))
    .toSorted((a, b) => a.label.localeCompare(b.label))
  const sportOptions = Array.from(new Set(teams.map((team) => team.sport.name)), (sport) => ({
    value: sport,
    label: sport,
  })).toSorted((a, b) => a.label.localeCompare(b.label))

  return {
    rows: filterMemberRows(rows, filters),
    totalRows: rows.length,
    teamOptions,
    sportOptions,
  }
}

export function useMembersViewModel() {
  const membersQuery = useMembers()
  const teamsQuery = useTeamsList()
  const filters = useMembersUiStore((state) => state.filters)

  const view = useMemo(
    () => buildMembersView(membersQuery.data ?? [], teamsQuery.data ?? [], filters),
    [filters, membersQuery.data, teamsQuery.data],
  )

  return {
    view,
    isLoading: membersQuery.isLoading || teamsQuery.isLoading,
    error: membersQuery.error ?? teamsQuery.error,
  }
}
