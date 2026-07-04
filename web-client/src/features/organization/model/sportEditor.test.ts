import { describe, expect, it } from 'vitest'

import type { AuthUser, MemberRef, Sport } from '@/types'
import {
  adminSportEditorFields,
  buildSportCreatePayload,
  buildSportCreatorInitialState,
  buildSportDirectorPickerOptions,
  buildSportEditorInitialState,
  buildSportUpdatePayload,
  directorSportEditorFields,
  sportCreatorFields,
  sportCreatorFieldsForUser,
  sportEditorFieldsForUser,
  validateSportEditorForm,
} from './sportEditor'

const director = ref('director-1', 'Director One')
const nextDirector = ref('director-2', 'Director Two')
const outsider = ref('member-1', 'Member One')

const football: Sport = {
  id: 'sport-1',
  name: 'Football',
  description: 'Football squads.',
  created_at: '2026-01-01',
  directors: [director],
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

describe('sport editor helpers', () => {
  it('scopes sport creation to admins only', () => {
    expect(sportCreatorFieldsForUser(user(outsider, 'admin'))).toEqual(sportCreatorFields)
    expect(sportCreatorFieldsForUser(user(director, 'director'))).toEqual([])
    expect(sportCreatorFieldsForUser(user(outsider, 'trainer'))).toEqual([])
    expect(sportCreatorFieldsForUser(user(outsider, 'member'))).toEqual([])
  })

  it('scopes sport editing to admins or directors of that sport', () => {
    expect(sportEditorFieldsForUser(football, user(outsider, 'admin'))).toEqual(
      adminSportEditorFields,
    )
    expect(sportEditorFieldsForUser(football, user(director, 'director'))).toEqual(
      directorSportEditorFields,
    )
    expect(sportEditorFieldsForUser(football, user(outsider, 'director'))).toEqual([])
    expect(sportEditorFieldsForUser(football, user(outsider, 'trainer'))).toEqual([])
  })

  it('builds create payloads with trimmed text and bare director ids', () => {
    expect(
      buildSportCreatePayload({
        name: '  Handball ',
        description: ' Indoor squads ',
        directorIds: [director.id, nextDirector.id],
      }),
    ).toEqual({
      name: 'Handball',
      description: 'Indoor squads',
      directors: [director.id, nextDirector.id],
    })
  })

  it('omits blank create descriptions', () => {
    expect(
      buildSportCreatePayload({
        name: 'Handball',
        description: '   ',
        directorIds: [],
      }),
    ).toEqual({
      name: 'Handball',
      directors: [],
    })
  })

  it('sends changed text fields only for director edits', () => {
    const form = {
      ...buildSportEditorInitialState(football),
      name: 'Football U18',
      directorIds: [nextDirector.id],
    }

    expect(buildSportUpdatePayload(football, form, directorSportEditorFields)).toEqual({
      name: 'Football U18',
    })
  })

  it('sends full director replacements for admin edits, including empty lists', () => {
    expect(
      buildSportUpdatePayload(
        football,
        { ...buildSportEditorInitialState(football), directorIds: [nextDirector.id] },
        adminSportEditorFields,
      ),
    ).toEqual({ directors: [nextDirector.id] })

    expect(
      buildSportUpdatePayload(
        football,
        { ...buildSportEditorInitialState(football), directorIds: [] },
        adminSportEditorFields,
      ),
    ).toEqual({ directors: [] })
  })

  it('validates required names only when the name field is enabled', () => {
    const form = { ...buildSportCreatorInitialState(), name: ' ' }

    expect(validateSportEditorForm(form, sportCreatorFields)).toBe('Name is required.')
    expect(validateSportEditorForm(form, ['directors'])).toBeNull()
  })

  it('builds director picker options scoped to members who already direct a sport', () => {
    const members = [
      {
        id: 'member-2',
        first_name: 'Beta',
        last_name: 'Member',
        email: 'beta@example.test',
      },
      {
        id: 'member-1',
        first_name: 'Alpha',
        last_name: 'Member',
        email: 'alpha@example.test',
      },
      {
        id: director.id,
        first_name: 'Director',
        last_name: 'One',
        email: 'director-1@example.test',
      },
    ]

    expect(buildSportDirectorPickerOptions(members, [football])).toEqual([
      { id: director.id, name: 'Director One', meta: 'director-1@example.test' },
    ])
  })

  it('keeps the sport being edited\'s current directors selectable even without another directorship', () => {
    const members = [
      {
        id: director.id,
        first_name: 'Director',
        last_name: 'One',
        email: 'director-1@example.test',
      },
    ]

    expect(buildSportDirectorPickerOptions(members, [], [director])).toEqual([
      { id: director.id, name: 'Director One', meta: 'director-1@example.test' },
    ])
  })

  it('returns no options when nobody currently directs a sport', () => {
    const members = [
      {
        id: 'member-1',
        first_name: 'Alpha',
        last_name: 'Member',
        email: 'alpha@example.test',
      },
    ]

    expect(buildSportDirectorPickerOptions(members, [])).toEqual([])
  })
})
