import { describe, expect, it } from 'vitest'

import { eventSummaryFixtures, teamFixtures } from '@/mocks/fixtures'
import { MOCK_PERSONAS } from '@/mocks/personas'
import { scopeEvents } from '@/mocks/scope'
import type { EventSummary } from '@/types'
import { buildEventsView, eventAttendanceStatus, userTeamIds } from './useEventsViewModel'

const now = new Date('2026-06-26T12:00:00.000Z')
const memberId = 'member-1'
const teamId = 'team-1'
const user = {
  id: memberId,
  teamIds: new Set([teamId]),
}

function event(overrides: Partial<EventSummary>): EventSummary {
  return {
    id: 'event-1',
    name: 'Training',
    start_time: '2026-06-20T10:00:00.000Z',
    end_time: '2026-06-20T11:00:00.000Z',
    ...overrides,
  }
}

describe('eventAttendanceStatus', () => {
  it('marks past events attended when the user is in attendees', () => {
    expect(
      eventAttendanceStatus(
        event({
          attendees: [{ id: memberId, first_name: 'Lena', last_name: 'Roth' }],
          teams_linked: [{ id: teamId, name: 'Juniors' }],
        }),
        user,
        now,
      ),
    ).toBe('attended')
  })

  it('marks past enrolled events missed when the user is absent from attendees', () => {
    expect(
      eventAttendanceStatus(
        event({
          attendees: [],
          teams_linked: [{ id: teamId, name: 'Juniors' }],
        }),
        user,
        now,
      ),
    ).toBe('missed')
  })

  it('marks future events upcoming before considering attendance', () => {
    expect(
      eventAttendanceStatus(
        event({
          start_time: '2026-07-01T10:00:00.000Z',
          end_time: '2026-07-01T11:00:00.000Z',
          attendees: [],
          teams_linked: [{ id: teamId, name: 'Juniors' }],
        }),
        user,
        now,
      ),
    ).toBe('upcoming')
  })

  it('falls back to past when enrollment is unknown and the user did not attend', () => {
    expect(
      eventAttendanceStatus(
        event({
          attendees: [],
          teams_linked: undefined,
        }),
        user,
        now,
      ),
    ).toBe('past')
  })

  it('derives missed, attended and upcoming rows for the member persona fixtures', () => {
    const member = MOCK_PERSONAS.member
    const view = buildEventsView(scopeEvents(eventSummaryFixtures, member), now, {
      id: member.id,
      teamIds: userTeamIds(teamFixtures, member.id),
    })

    expect(view.rows.filter((row) => row.status === 'missed')).toHaveLength(2)
    expect(view.rows.some((row) => row.status === 'attended')).toBe(true)
    expect(view.rows.some((row) => row.status === 'upcoming')).toBe(true)
  })
})
