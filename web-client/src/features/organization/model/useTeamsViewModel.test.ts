import { describe, expect, it } from 'vitest'

import type { AuthUser, MemberRef, Sport, Team } from '@/types'
import { buildTeamsView } from './useTeamsViewModel'

const football: Sport = {
  id: 'sport-1',
  name: 'Football',
  description: 'Football squads.',
  created_at: '2026-01-01',
  directors: [],
}

function ref(id: string, name: string): MemberRef {
  return { id, name }
}

function user(member: MemberRef, role: AuthUser['role']): AuthUser {
  return {
    id: member.id,
    name: member.name,
    email: `${member.id}@club.test`,
    role,
  }
}

function team({
  id,
  name,
  trainers = [],
  trainees = [],
}: {
  id: string
  name: string
  trainers?: MemberRef[]
  trainees?: MemberRef[]
}): Team {
  return {
    id,
    name,
    description: `${name} squad.`,
    created_at: '2026-01-01',
    address: 'Club grounds',
    sport: { id: football.id, name: football.name },
    trainers,
    trainees,
  }
}

describe('buildTeamsView', () => {
  it('includes teams where the current user is only a trainer', () => {
    const coach = ref('coach-1', 'Coach One')
    const trainee = ref('trainee-1', 'Trainee One')
    const coachedTeam = team({
      id: 'team-coached',
      name: 'Coached Team',
      trainers: [coach],
      trainees: [trainee],
    })
    const unrelatedTeam = team({
      id: 'team-unrelated',
      name: 'Unrelated Team',
      trainers: [ref('coach-2', 'Coach Two')],
      trainees: [trainee],
    })

    const view = buildTeamsView([football], [coachedTeam, unrelatedTeam], user(coach, 'trainer'))

    expect(view.myTeams.map((entry) => ({ id: entry.id, sportName: entry.sportName }))).toEqual([
      { id: 'team-coached', sportName: 'Football' },
    ])
    expect(view.stats.myTeams).toBe(1)
    expect(view.stats.mySports).toBe(1)
  })

  it('keeps trainee-only membership in my teams', () => {
    const coach = ref('coach-1', 'Coach One')
    const member = ref('member-1', 'Member One')
    const traineeTeam = team({
      id: 'team-trainee',
      name: 'Trainee Team',
      trainers: [coach],
      trainees: [member],
    })
    const coachedOnlyTeam = team({
      id: 'team-coached-only',
      name: 'Coached Only Team',
      trainers: [coach],
      trainees: [],
    })

    const view = buildTeamsView([football], [traineeTeam, coachedOnlyTeam], user(member, 'member'))

    expect(view.myTeams.map((entry) => entry.id)).toEqual(['team-trainee'])
    expect(view.stats.myTeams).toBe(1)
    expect(view.stats.mySports).toBe(1)
  })

  it('does not duplicate a team when the current user is both trainer and trainee', () => {
    const dualMember = ref('dual-1', 'Dual Member')
    const dualRoleTeam = team({
      id: 'team-dual-role',
      name: 'Dual Role Team',
      trainers: [dualMember],
      trainees: [dualMember],
    })

    const view = buildTeamsView([football], [dualRoleTeam], user(dualMember, 'trainer'))

    expect(view.myTeams.map((entry) => entry.id)).toEqual(['team-dual-role'])
    expect(view.stats.myTeams).toBe(1)
    expect(view.stats.mySports).toBe(1)
  })
})
