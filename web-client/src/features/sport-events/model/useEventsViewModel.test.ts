import { describe, expect, it } from 'vitest'

import { eventDetailsById, eventSummaryFixtures, teamFixtures } from '@/testing/fixtures'
import { TEST_PERSONAS } from '@/testing/personas'
import { scopeEvents } from '@/testing/scope'
import type { EventListItem, Team } from '@/types'
import { buildEventsView, eventAttendanceStatus, userTeamIds } from './useEventsViewModel'

const now = new Date('2026-06-26T12:00:00.000Z')
const memberId = 'member-1'
const teamId = 'team-1'
const user = {
  id: memberId,
  teamIds: new Set([teamId]),
}
const directorUser = {
  id: 'director-1',
  role: 'director' as const,
  teamIds: new Set<string>(),
}

function event(overrides: Partial<EventListItem>): EventListItem {
  return {
    id: 'event-1',
    name: 'Training',
    start_time: '2026-06-20T10:00:00.000Z',
    end_time: '2026-06-20T11:00:00.000Z',
    ...overrides,
  }
}

function team(id: string, name: string, sportName: string): Team {
  return {
    id,
    name,
    description: `${name} squad.`,
    created_at: '2026-01-01',
    address: 'Club grounds',
    sport: { id: `sport-${sportName.toLocaleLowerCase()}`, name: sportName },
    trainers: [],
    trainees: [],
  }
}

describe('eventAttendanceStatus', () => {
  it('marks past events attended when the user is in attendees', () => {
    expect(
      eventAttendanceStatus(
        event({
          attendees: [{ id: memberId, name: 'Lena Roth' }],
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
    const member = TEST_PERSONAS.member
    const view = buildEventsView(
      scopeEvents(eventSummaryFixtures, member),
      now,
      {
        id: member.id,
        role: member.role,
        teamIds: userTeamIds(teamFixtures, member.id),
      },
      teamFixtures,
    )

    expect(view.rows.filter((row) => row.status === 'missed')).toHaveLength(2)
    expect(view.rows.some((row) => row.status === 'attended')).toBe(true)
    expect(view.rows.some((row) => row.status === 'upcoming')).toBe(true)
  })

  it("collapses a coach's own past event to a role-agnostic past status", () => {
    const coach = TEST_PERSONAS.coach
    const coachOwnedPastEvent = Object.values(eventDetailsById).find(
      (eventDetail) =>
        eventDetail.creator?.id === coach.id && new Date(eventDetail.start_time) < now,
    )
    const view = buildEventsView(
      scopeEvents(eventSummaryFixtures, coach),
      now,
      {
        id: coach.id,
        role: coach.role,
        teamIds: userTeamIds(teamFixtures, coach.id),
      },
      teamFixtures,
    )
    const staleMissedFilterView = buildEventsView(
      scopeEvents(eventSummaryFixtures, coach),
      now,
      {
        id: coach.id,
        role: coach.role,
        teamIds: userTeamIds(teamFixtures, coach.id),
      },
      teamFixtures,
      {
        search: '',
        status: 'missed',
        sport: 'all',
        fromDate: '',
        toDate: '',
        sort: 'date-asc',
      },
    )
    const row = view.rows.find((eventRow) => eventRow.id === coachOwnedPastEvent?.id)

    expect(coachOwnedPastEvent).toBeDefined()
    expect(row?.status).toBe('past')
    expect(
      view.rows.every(
        (eventRow) => eventRow.status !== 'attended' && eventRow.status !== 'missed',
      ),
    ).toBe(true)
    expect(staleMissedFilterView.rows).toHaveLength(view.rows.length)
  })
})

describe('buildEventsView sport facets', () => {
  it('derives sorted sport names for events linked to teams from multiple sports', () => {
    const footballTeam = team('team-football', 'Football Juniors', 'Football')
    const basketballTeam = team('team-basketball', 'Basketball Juniors', 'Basketball')

    const view = buildEventsView(
      [
        event({
          id: 'event-multi',
          teams_linked: [
            { id: footballTeam.id, name: footballTeam.name },
            { id: basketballTeam.id, name: basketballTeam.name },
          ],
        }),
      ],
      now,
      directorUser,
      [footballTeam, basketballTeam],
    )

    expect(view.rows[0]?.sportNames).toEqual(['Basketball', 'Football'])
    expect(view.sportOptions).toEqual([
      { value: 'Basketball', label: 'Basketball' },
      { value: 'Football', label: 'Football' },
    ])
  })

  it('keeps events with no linked team visible with no derived sports', () => {
    const footballTeam = team('team-football', 'Football Juniors', 'Football')

    const view = buildEventsView(
      [
        event({
          id: 'event-no-team',
          teams_linked: undefined,
        }),
      ],
      now,
      directorUser,
      [footballTeam],
    )

    expect(view.rows).toHaveLength(1)
    expect(view.rows[0]?.sportNames).toEqual([])
    expect(view.sportOptions).toEqual([])
  })

  it('filters and searches events by derived sport name', () => {
    const footballTeam = team('team-football', 'Football Juniors', 'Football')
    const basketballTeam = team('team-basketball', 'Basketball Juniors', 'Basketball')
    const rows = [
      event({
        id: 'event-football',
        name: 'Football Practice',
        start_time: '2026-06-20T10:00:00.000Z',
        end_time: '2026-06-20T11:00:00.000Z',
        teams_linked: [{ id: footballTeam.id, name: footballTeam.name }],
      }),
      event({
        id: 'event-basketball',
        name: 'Shooting Drills',
        start_time: '2026-06-21T10:00:00.000Z',
        end_time: '2026-06-21T11:00:00.000Z',
        teams_linked: [{ id: basketballTeam.id, name: basketballTeam.name }],
      }),
      event({
        id: 'event-multi',
        name: 'Club Festival',
        start_time: '2026-06-22T10:00:00.000Z',
        end_time: '2026-06-22T11:00:00.000Z',
        teams_linked: [
          { id: footballTeam.id, name: footballTeam.name },
          { id: basketballTeam.id, name: basketballTeam.name },
        ],
      }),
    ]

    const filteredBySport = buildEventsView(
      rows,
      now,
      directorUser,
      [footballTeam, basketballTeam],
      {
        search: '',
        status: 'all',
        sport: 'Basketball',
        fromDate: '',
        toDate: '',
        sort: 'date-asc',
      },
    )
    const searchedBySport = buildEventsView(
      rows,
      now,
      directorUser,
      [footballTeam, basketballTeam],
      {
        search: 'basket',
        status: 'all',
        sport: 'all',
        fromDate: '',
        toDate: '',
        sort: 'date-asc',
      },
    )

    expect(filteredBySport.rows.map((row) => row.id)).toEqual([
      'event-basketball',
      'event-multi',
    ])
    expect(searchedBySport.rows.map((row) => row.id)).toEqual([
      'event-basketball',
      'event-multi',
    ])
  })
})
