import { useMemo } from 'react'

import { useAuth } from '@/features/auth'
import type { AuthUser, MemberRef, Sport, Team } from '@/types'
import { useSportsList, useTeamsList } from '../api/queries'

export interface TeamView {
  id: string
  name: string
  description: string
  address: string
  trainers: MemberRef[]
  trainees: MemberRef[]
}

export interface SportTeamsView {
  id: string
  name: string
  description: string
  directors: MemberRef[]
  teams: TeamView[]
}

export interface TeamsView {
  sports: SportTeamsView[]
  myTeams: Array<TeamView & { sportName: string }>
  mySports: SportTeamsView[]
  stats: {
    myTeams: number
    sports: number
    teams: number
    mySports: number
  }
}

export function buildTeamsView(
  sports: Sport[],
  teams: Team[],
  user: AuthUser,
): TeamsView {
  const teamsBySportId = new Map<string, TeamView[]>()

  for (const team of teams) {
    const sportId = team.sport.id
    if (!sportId) continue

    const teamView: TeamView = {
      id: team.id,
      name: team.name,
      description: team.description ?? '',
      address: team.address ?? '',
      trainers: team.trainers,
      trainees: team.trainees,
    }

    const sportTeams = teamsBySportId.get(sportId) ?? []
    sportTeams.push(teamView)
    teamsBySportId.set(sportId, sportTeams)
  }

  const joinedSports = sports.map((sport) => ({
    id: sport.id,
    name: sport.name,
    description: sport.description,
    directors: sport.directors,
    teams: teamsBySportId.get(sport.id) ?? [],
  }))

  const myTeams = joinedSports.flatMap((sport) =>
    sport.teams
      .filter(
        (team) =>
          team.trainees.some((trainee) => trainee.id === user.id) ||
          team.trainers.some((trainer) => trainer.id === user.id),
      )
      .map((team) => ({ ...team, sportName: sport.name })),
  )

  const mySports = joinedSports.filter((sport) =>
    sport.directors.some((director) => director.id === user.id),
  )

  const mySportNames = new Set(myTeams.map((team) => team.sportName))
  for (const sport of mySports) {
    mySportNames.add(sport.name)
  }

  return {
    sports: joinedSports,
    myTeams,
    mySports,
    stats: {
      myTeams: myTeams.length,
      sports: joinedSports.length,
      teams: teams.length,
      mySports: mySportNames.size,
    },
  }
}

export function useTeamsViewModel() {
  const { user } = useAuth()
  const sportsQuery = useSportsList()
  const teamsQuery = useTeamsList()

  const view = useMemo(
    () => buildTeamsView(sportsQuery.data ?? [], teamsQuery.data ?? [], user),
    [sportsQuery.data, teamsQuery.data, user],
  )

  return {
    view,
    currentUserId: user.id,
    currentUserRole: user.role,
    isLoading: sportsQuery.isLoading || teamsQuery.isLoading,
    error: sportsQuery.error ?? teamsQuery.error,
  }
}
