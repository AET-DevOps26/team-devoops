import { describe, expect, it } from 'vitest'

import type { AuthUser, MemberRef, MemberSummary, Sport, Team } from '@/types'
import { buildMembersView } from './useMembersViewModel'
import type { MembersFilters } from './membersUiStore'

const football: Sport = {
  id: 'sport-football',
  name: 'Football',
  description: 'Football squads.',
  created_at: '2026-01-01',
  directors: [],
}

const basketball: Sport = {
  id: 'sport-basketball',
  name: 'Basketball',
  description: 'Basketball squads.',
  created_at: '2026-01-01',
  directors: [],
}

const noFilters: MembersFilters = { search: '', teamId: 'all', sport: 'all' }

function ref(id: string, name: string): MemberRef {
  return { id, name }
}

function member(id: string, firstName: string, lastName: string): MemberSummary {
  return { id, first_name: firstName, last_name: lastName, email: `${id}@club.test` }
}

function user(id: string, name: string, role: AuthUser['role']): AuthUser {
  return { id, name, email: `${id}@club.test`, role }
}

function team({
  id,
  name,
  sport,
  trainers = [],
  trainees = [],
}: {
  id: string
  name: string
  sport: Sport
  trainers?: MemberRef[]
  trainees?: MemberRef[]
}): Team {
  return {
    id,
    name,
    description: `${name} squad.`,
    created_at: '2026-01-01',
    address: 'Club grounds',
    sport: { id: sport.id, name: sport.name },
    trainers,
    trainees,
  }
}

describe('buildMembersView', () => {
  it('scopes a trainer persona filter options to their own team/sport', () => {
    const coach = ref('coach-1', 'Coach One')
    const trainee = ref('trainee-1', 'Trainee One')
    const otherTrainee = ref('trainee-2', 'Trainee Two')

    const coachedTeam = team({
      id: 'team-coached',
      name: 'Coached Team',
      sport: football,
      trainers: [coach],
      trainees: [trainee],
    })
    const unrelatedTeam = team({
      id: 'team-unrelated',
      name: 'Unrelated Team',
      sport: basketball,
      trainers: [ref('coach-2', 'Coach Two')],
      trainees: [otherTrainee],
    })

    // mock scoping (scopeMembers) already narrows this to the trainer's own trainees before
    // buildMembersView ever sees it — mirror that here rather than passing the whole club.
    const scopedMembers = [member(trainee.id, 'Trainee', 'One')]

    const view = buildMembersView(
      scopedMembers,
      [coachedTeam, unrelatedTeam],
      noFilters,
      user(coach.id, coach.name, 'trainer'),
    )

    expect(view.teamOptions).toEqual([{ value: 'team-coached', label: 'Coached Team' }])
    expect(view.sportOptions).toEqual([{ value: 'Football', label: 'Football' }])
  })

  it('scopes a director persona filter options to their own sport', () => {
    const director = ref('director-1', 'Director One')
    const footballTrainee = ref('trainee-1', 'Trainee One')
    const otherFootballTrainee = ref('trainee-2', 'Trainee Two')
    const basketballTrainee = ref('trainee-3', 'Trainee Three')

    const footballTeamA = team({
      id: 'team-football-a',
      name: 'Football A',
      sport: football,
      trainees: [footballTrainee],
    })
    const footballTeamB = team({
      id: 'team-football-b',
      name: 'Football B',
      sport: football,
      trainees: [otherFootballTrainee],
    })
    const basketballTeam = team({
      id: 'team-basketball',
      name: 'Basketball A',
      sport: basketball,
      trainees: [basketballTrainee],
    })

    // director's sport scope (mock scopeMembers) limits rows to members of their sport's teams.
    const scopedMembers = [
      member(footballTrainee.id, 'Trainee', 'One'),
      member(otherFootballTrainee.id, 'Trainee', 'Two'),
    ]

    const view = buildMembersView(
      scopedMembers,
      [footballTeamA, footballTeamB, basketballTeam],
      noFilters,
      user(director.id, director.name, 'director'),
    )

    expect(view.teamOptions.map((option) => option.value).toSorted()).toEqual([
      'team-football-a',
      'team-football-b',
    ])
    expect(view.sportOptions).toEqual([{ value: 'Football', label: 'Football' }])
  })

  it('keeps the full club in scope for an admin persona', () => {
    const admin = ref('admin-1', 'Admin One')
    const footballTeam = team({
      id: 'team-football',
      name: 'Football A',
      sport: football,
      trainees: [ref('trainee-1', 'Trainee One')],
    })
    const basketballTeam = team({
      id: 'team-basketball',
      name: 'Basketball A',
      sport: basketball,
      trainees: [ref('trainee-2', 'Trainee Two')],
    })

    const allMembers = [member('trainee-1', 'Trainee', 'One'), member('trainee-2', 'Trainee', 'Two')]

    const view = buildMembersView(
      allMembers,
      [footballTeam, basketballTeam],
      noFilters,
      user(admin.id, admin.name, 'admin'),
    )

    expect(view.teamOptions.map((option) => option.value).toSorted()).toEqual([
      'team-basketball',
      'team-football',
    ])
    expect(view.sportOptions.map((option) => option.value).toSorted()).toEqual([
      'Basketball',
      'Football',
    ])
  })
})
