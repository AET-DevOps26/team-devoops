import type { Team } from '@/types'

type LinkedTeamRef = {
  id: string
}

type EventTeamLinks = {
  id: string
  teams_linked?: readonly LinkedTeamRef[]
}

type TeamSport = Pick<Team, 'id' | 'sport'>

function teamSportNamesById(teams: readonly TeamSport[]): Map<string, string> {
  return new Map(teams.map((team) => [team.id, team.sport.name]))
}

function sportNamesForTeamLinks(
  linkedTeams: readonly LinkedTeamRef[] | undefined,
  sportNamesByTeamId: ReadonlyMap<string, string>,
): string[] {
  const sportNames = new Set<string>()

  for (const linkedTeam of linkedTeams ?? []) {
    const sportName = sportNamesByTeamId.get(linkedTeam.id)
    if (sportName) {
      sportNames.add(sportName)
    }
  }

  return Array.from(sportNames).toSorted((a, b) => a.localeCompare(b))
}

export function deriveEventSportNames(
  event: Pick<EventTeamLinks, 'teams_linked'>,
  teams: readonly TeamSport[],
): string[] {
  return sportNamesForTeamLinks(event.teams_linked, teamSportNamesById(teams))
}

export function buildEventSportNamesById(
  events: readonly EventTeamLinks[],
  teams: readonly TeamSport[],
): Map<string, string[]> {
  const sportNamesByTeamId = teamSportNamesById(teams)

  return new Map(
    events.map((event) => [
      event.id,
      sportNamesForTeamLinks(event.teams_linked, sportNamesByTeamId),
    ]),
  )
}
