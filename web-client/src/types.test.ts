import { describe, expect, it } from 'vitest'

import { dashboardFixtures } from '@/testing/fixtures/dashboard'
import { creatorName, memberRefName, type Reference } from './types'

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
