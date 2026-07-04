import { describe, expect, it } from 'vitest'

import type { AuthUser, MemberRef, Sport, Team } from '@/types'
import {
  adminTeamEditorFields,
  buildCoachPickerOptions,
  buildMemberPickerOptions,
  buildTeamCreatePayload,
  buildTeamEditorInitialState,
  buildTeamUpdatePayload,
  coachTeamEditorFields,
  directorTeamEditorFields,
  teamCreatorFields,
  teamCreatorFieldsForUser,
  teamEditorFieldsForUser,
  validateTeamEditorForm,
} from './teamEditor'

const director = ref('director-1', 'Director One')
const coach = ref('coach-1', 'Coach One')
const trainee = ref('member-1', 'Member One')
const secondTrainee = ref('member-2', 'Member Two')
const nextCoach = ref('coach-2', 'Coach Two')
const nextTrainee = ref('member-3', 'Member Three')

const sport = { id: 'sport-1', name: 'Football' }

const sportDetails: Sport = {
  ...sport,
  description: 'Football squads.',
  created_at: '2026-01-01',
  directors: [director],
}

const otherSport: Sport = {
  id: 'sport-2',
  name: 'Handball',
  description: 'Handball squads.',
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

function team(overrides: Partial<Team> = {}): Team {
  return {
    id: 'team-1',
    name: 'Football Juniors',
    description: 'Junior squad.',
    created_at: '2026-01-01',
    address: 'Club grounds',
    sport,
    trainers: [coach],
    trainees: [trainee, secondTrainee],
    ...overrides,
  }
}

describe('team editor helpers', () => {
  it('builds a changed-fields-only payload for coach-editable fields', () => {
    const baseTeam = team()
    const form = {
      ...buildTeamEditorInitialState(baseTeam),
      name: 'Football U16',
      description: 'Junior squad.',
      address: 'New pitch',
    }

    expect(buildTeamUpdatePayload(baseTeam, form, coachTeamEditorFields)).toEqual({
      name: 'Football U16',
      address: 'New pitch',
    })
  })

  it('sends a full trainee replacement list when trainees change, including empty lists', () => {
    const baseTeam = team()

    expect(
      buildTeamUpdatePayload(
        baseTeam,
        { ...buildTeamEditorInitialState(baseTeam), traineeIds: [secondTrainee.id, nextTrainee.id] },
        coachTeamEditorFields,
      ),
    ).toEqual({ trainees: [secondTrainee.id, nextTrainee.id] })

    expect(
      buildTeamUpdatePayload(
        baseTeam,
        { ...buildTeamEditorInitialState(baseTeam), traineeIds: [] },
        coachTeamEditorFields,
      ),
    ).toEqual({ trainees: [] })
  })

  it('does not treat reordered trainee ids as a change', () => {
    const baseTeam = team()

    expect(
      buildTeamUpdatePayload(
        baseTeam,
        { ...buildTeamEditorInitialState(baseTeam), traineeIds: [secondTrainee.id, trainee.id] },
        coachTeamEditorFields,
      ),
    ).toEqual({})
  })

  it('validates the required name field only when it is enabled', () => {
    const form = {
      name: ' ',
      description: '',
      address: '',
      sportId: '',
      trainerIds: [],
      traineeIds: [],
    }

    expect(validateTeamEditorForm(form, coachTeamEditorFields)).toBe('Name is required.')
    expect(validateTeamEditorForm(form, ['trainees'])).toBeNull()
  })

  it('validates the required sport field only when it is enabled', () => {
    const form = {
      name: 'Team',
      description: '',
      address: '',
      sportId: '',
      trainerIds: [],
      traineeIds: [],
    }

    expect(validateTeamEditorForm(form, teamCreatorFields)).toBe('Select a sport.')
    expect(validateTeamEditorForm(form, coachTeamEditorFields)).toBeNull()
  })

  it('detects raw whitespace edits and trims only the submitted values', () => {
    const baseTeam = team({ description: '', address: 'Club grounds' })

    expect(
      buildTeamUpdatePayload(
        baseTeam,
        { ...buildTeamEditorInitialState(baseTeam), description: '   ' },
        ['description'],
      ),
    ).toEqual({ description: '' })

    expect(
      buildTeamUpdatePayload(
        baseTeam,
        { ...buildTeamEditorInitialState(baseTeam), address: 'Club grounds ' },
        ['address'],
      ),
    ).toEqual({ address: 'Club grounds' })
  })

  it('derives editable fields from the current role and team relationship', () => {
    const outsider = ref('member-9', 'Member Nine')
    const baseTeam = team({ trainers: [coach] })

    expect(teamEditorFieldsForUser(baseTeam, [sportDetails], user(coach, 'trainer'))).toEqual(
      coachTeamEditorFields,
    )
    expect(teamEditorFieldsForUser(baseTeam, [sportDetails], user(director, 'director'))).toEqual(
      directorTeamEditorFields,
    )
    expect(teamEditorFieldsForUser(baseTeam, [sportDetails], user(outsider, 'admin'))).toEqual(
      adminTeamEditorFields,
    )
    expect(teamEditorFieldsForUser(baseTeam, [sportDetails], user(outsider, 'trainer'))).toEqual(
      [],
    )
  })

  it('builds member picker options from known members and current refs', () => {
    expect(
      buildMemberPickerOptions(
        [
          {
            id: 'member-1',
            first_name: 'Known',
            last_name: 'Member',
            email: 'known@example.test',
          },
        ],
        [ref('member-2', 'Current Member')],
      ),
    ).toEqual([
      { id: 'member-2', name: 'Current Member' },
      { id: 'member-1', name: 'Known Member', meta: 'known@example.test' },
    ])
  })

  it('builds coach picker options scoped to members who already coach a team', () => {
    const members = [
      {
        id: 'member-1',
        first_name: 'Plain',
        last_name: 'Member',
        email: 'plain@example.test',
      },
      {
        id: coach.id,
        first_name: 'Coach',
        last_name: 'One',
        email: 'coach-1@example.test',
      },
    ]

    expect(buildCoachPickerOptions(members, [team()], [])).toEqual([
      { id: coach.id, name: 'Coach One', meta: 'coach-1@example.test' },
    ])
  })

  it('keeps the team\'s current trainers selectable even without another coaching assignment', () => {
    const members = [
      {
        id: coach.id,
        first_name: 'Coach',
        last_name: 'One',
        email: 'coach-1@example.test',
      },
    ]

    expect(buildCoachPickerOptions(members, [], [coach])).toEqual([{ id: coach.id, name: 'Coach One' }])
  })

  it('returns no coach options when nobody currently coaches a team', () => {
    const members = [
      {
        id: 'member-1',
        first_name: 'Plain',
        last_name: 'Member',
        email: 'plain@example.test',
      },
    ]

    expect(buildCoachPickerOptions(members, [], [])).toEqual([])
  })
})

describe('team editor management helpers', () => {
  it('scopes create fields to admin or directed sports', () => {
    expect(teamCreatorFieldsForUser([sportDetails], user(director, 'director'))).toEqual(
      teamCreatorFields,
    )
    expect(teamCreatorFieldsForUser([otherSport], user(director, 'director'))).toEqual([])
    expect(teamCreatorFieldsForUser([otherSport], user(ref('admin-1', 'Admin'), 'admin'))).toEqual(
      teamCreatorFields,
    )
  })

  it('sends changed sport and full replacement rosters for admin edits', () => {
    const baseTeam = team()
    const form = buildTeamEditorInitialState(baseTeam)
    const payload = buildTeamUpdatePayload(
      baseTeam,
      {
        ...form,
        sportId: otherSport.id,
        trainerIds: [nextCoach.id],
        traineeIds: [trainee.id, nextTrainee.id],
      },
      adminTeamEditorFields,
    )

    expect(payload).toEqual({
      sport: otherSport.id,
      trainers: [nextCoach.id],
      trainees: [trainee.id, nextTrainee.id],
    })
  })

  it('builds create payloads with bare ids', () => {
    expect(
      buildTeamCreatePayload({
        name: ' New Team ',
        description: '',
        address: '  Main gym  ',
        sportId: sportDetails.id,
        trainerIds: [coach.id],
        traineeIds: [trainee.id],
      }),
    ).toEqual({
      name: 'New Team',
      address: 'Main gym',
      sport: sportDetails.id,
      trainers: [coach.id],
      trainees: [trainee.id],
    })
  })
})
