import { describe, expect, it } from 'vitest'

import { dashboardFixtures } from '@/testing/fixtures/dashboard'
import { creatorName, memberRefName, type Reference } from './types'

// These lock the two shapes PR #99 actually ships (see the reconciliation task):
//  1. FK refs are Reference { id, name } — a single combined display string.
//  2. dashboard upcoming_events is a COUNT (number), never an array.
// The types are aliased straight from the generated OpenAPI schema, so a future spec drift
// is already a compile error; these guard the runtime behaviour that used to break live.

describe('memberRefName', () => {
  it('renders the combined name off a Reference', () => {
    const ref: Reference = { id: 'm1', name: 'Lena Roth' }
    expect(memberRefName(ref)).toBe('Lena Roth')
  })

  it('falls back for a null creator ref', () => {
    expect(creatorName(null, 'Unknown')).toBe('Unknown')
    expect(creatorName({ id: 'c1', name: 'Coach Devoops' })).toBe('Coach Devoops')
  })
})

describe('dashboard shapes', () => {
  it('exposes upcoming_events as a numeric count on the trainee envelope', () => {
    const trainee = dashboardFixtures.member
    expect(trainee.role).toBe('trainee')
    if (trainee.role === 'trainee') {
      expect(typeof trainee.upcoming_events).toBe('number')
    }
  })

  it('exposes events_this_week as a number on the admin envelope', () => {
    const admin = dashboardFixtures.admin
    expect(admin.role).toBe('admin')
    if (admin.role === 'admin') {
      expect(typeof admin.events_this_week).toBe('number')
    }
  })
})
