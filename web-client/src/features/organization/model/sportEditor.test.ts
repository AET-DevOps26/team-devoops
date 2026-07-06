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

  it('builds director picker options from existing members only', () => {
    expect(
      buildSportDirectorPickerOptions([
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
      ]),
    ).toEqual([
      { id: 'member-1', name: 'Alpha Member', meta: 'alpha@example.test' },
      { id: 'member-2', name: 'Beta Member', meta: 'beta@example.test' },
    ])
  })
})
