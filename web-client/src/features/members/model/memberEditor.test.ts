import { describe, expect, it } from 'vitest'

import type { Member } from '@/types'
import {
  buildMemberCreatorInitialState,
  buildMemberProfileUpdatePayload,
  type MemberEditorFormState,
  validateMemberCreatorFieldErrors,
  validateMemberEditorFieldErrors,
} from './memberEditor'

function validCreateForm(overrides: Partial<MemberEditorFormState> = {}): MemberEditorFormState {
  return {
    ...buildMemberCreatorInitialState(),
    firstName: 'Lena',
    lastName: 'Roth',
    email: 'lena.roth@club.de',
    password: 'initial-secret',
    birthday: '2008-02-19',
    phoneNumber: '+49 177 1914194',
    ...overrides,
  }
}

describe('member editor validation', () => {
  it('accepts valid create and edit forms', () => {
    const form = validCreateForm()

    expect(validateMemberCreatorFieldErrors(form)).toBeNull()
    expect(validateMemberEditorFieldErrors({ ...form, password: '' })).toBeNull()
  })

  it('validates create identity fields by form-state key', () => {
    expect(validateMemberCreatorFieldErrors(validCreateForm({ firstName: ' ' }))).toEqual({
      firstName: 'First name is required.',
    })
    expect(validateMemberCreatorFieldErrors(validCreateForm({ lastName: ' ' }))).toEqual({
      lastName: 'Last name is required.',
    })
    expect(validateMemberCreatorFieldErrors(validCreateForm({ email: 'not-an-email' }))).toEqual({
      email: 'A valid email is required.',
    })
    expect(validateMemberCreatorFieldErrors(validCreateForm({ password: 'abc' }))).toEqual({
      password: 'Password must be at least 8 characters.',
    })
  })

  it('validates optional birthday and phone fields', () => {
    expect(validateMemberEditorFieldErrors(validCreateForm({ birthday: '2024-02-31' }))).toEqual({
      birthday: 'Birthday must be a valid date.',
    })
    expect(validateMemberEditorFieldErrors(validCreateForm({ birthday: '2999-01-01' }))).toEqual({
      birthday: 'Birthday cannot be in the future.',
    })
    expect(validateMemberEditorFieldErrors(validCreateForm({ phoneNumber: '+49-177' }))).toEqual({
      phoneNumber: 'Phone number can contain +, digits, and spaces only.',
    })
  })

  it('can scope validation to selected step fields', () => {
    const form = validCreateForm({
      firstName: '',
      birthday: '2999-01-01',
      phoneNumber: '+49-177',
    })

    expect(validateMemberCreatorFieldErrors(form, ['firstName'])).toEqual({
      firstName: 'First name is required.',
    })
  })

  it('does not include the read-only email in profile updates', () => {
    const member = {
      id: 'member-1',
      first_name: 'Lena',
      last_name: 'Roth',
      email: 'lena.roth@club.de',
    } as Member
    const form = validCreateForm({
      firstName: 'Elena',
      email: 'changed@example.test',
    })

    expect(buildMemberProfileUpdatePayload(member, form)).toMatchObject({
      first_name: 'Elena',
    })
    expect(buildMemberProfileUpdatePayload(member, form)).not.toHaveProperty('email')
  })
})
