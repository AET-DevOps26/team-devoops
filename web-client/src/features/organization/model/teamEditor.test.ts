import { describe, expect, it } from 'vitest'

import type { AuthUser, MemberRef, Sport, Team } from '@/types'
import {
  adminTeamEditorFields,
  buildMemberPickerOptions,
  buildTeamEditorInitialState,
  buildTeamUpdatePayload,
  coachTeamEditorFields,
  directorTeamEditorFields,
  teamEditorFieldsForUser,
  validateTeamEditorForm,
} from './teamEditor'

const sport = { id: 'sport-1', name: 'Football' }

function ref(id: string, name: string): MemberRef {
  return { id, name }
}

const sportDetails: Sport = {
  ...sport,
  description: 'Football squads.',
  created_at: '2026-01-01',
  directors: [ref('director-1', 'Director One')],
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
    trainers: [ref('coach-1', 'Coach One')],
    trainees: [ref('member-1', 'Member One'), ref('member-2', 'Member Two')],
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
        { ...buildTeamEditorInitialState(baseTeam), traineeIds: ['member-2', 'member-3'] },
        coachTeamEditorFields,
      ),
    ).toEqual({ trainees: ['member-2', 'member-3'] })

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
        { ...buildTeamEditorInitialState(baseTeam), traineeIds: ['member-2', 'member-1'] },
        coachTeamEditorFields,
      ),
    ).toEqual({})
  })

  it('validates the required name field only when it is enabled', () => {
    const form = { name: ' ', description: '', address: '', traineeIds: [] }

    expect(validateTeamEditorForm(form, coachTeamEditorFields)).toBe('Name is required.')
    expect(validateTeamEditorForm(form, ['trainees'])).toBeNull()
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
    const coach = ref('coach-1', 'Coach One')
    const director = ref('director-1', 'Director One')
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
})
