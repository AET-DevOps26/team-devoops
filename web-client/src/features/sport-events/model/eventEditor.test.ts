import { describe, expect, it } from 'vitest'

import {
  buildSportEventCreatePayload,
  type EventEditorFormState,
  validateSportEventEditorForm,
} from './eventEditor'

function validForm(overrides: Partial<EventEditorFormState> = {}): EventEditorFormState {
  return {
    name: 'Friendly Match',
    description: '',
    startLocal: '2026-08-01T18:00',
    endLocal: '2026-08-01T19:30',
    sportIds: [],
    teamIds: [],
    attendeeIds: [],
    ...overrides,
  }
}

describe('event editor validation', () => {
  it('accepts a valid form and builds the create payload', () => {
    const form = validForm()

    expect(validateSportEventEditorForm(form)).toBeNull()
    expect(buildSportEventCreatePayload(form, [])).toEqual({
      name: 'Friendly Match',
      description: undefined,
      start_time: new Date('2026-08-01T18:00').toISOString(),
      end_time: new Date('2026-08-01T19:30').toISOString(),
      sports_linked: [],
      teams_linked: [],
      attendees: [],
    })
  })

  it('requires a name', () => {
    expect(validateSportEventEditorForm(validForm({ name: ' ' }))).toEqual({
      name: 'Name is required.',
    })
  })

  it('requires valid start and end times', () => {
    expect(validateSportEventEditorForm(validForm({ startLocal: '' }))).toEqual({
      startLocal: 'Start time is required.',
    })
    expect(validateSportEventEditorForm(validForm({ endLocal: '' }))).toEqual({
      endLocal: 'End time is required.',
    })
  })

  it('requires the end time to be after the start time', () => {
    expect(validateSportEventEditorForm(validForm({ endLocal: '2026-08-01T17:00' }))).toEqual({
      endLocal: 'End time must be after start time.',
    })
  })

  it('can scope validation to the current step', () => {
    expect(
      validateSportEventEditorForm(
        validForm({ name: '', endLocal: '2026-08-01T17:00' }),
        ['name'],
      ),
    ).toEqual({ name: 'Name is required.' })
  })
})
