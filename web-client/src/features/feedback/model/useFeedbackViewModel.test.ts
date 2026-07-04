import { describe, expect, it } from 'vitest'

import type {
  AuthUser,
  EventListItem,
  FeedbackSummary,
  MemberRef,
  MemberSummary,
  Sport,
  Team,
} from '@/types'
import { buildFeedbackView, canManageFeedback } from './useFeedbackViewModel'
import type { FeedbackFilters } from './feedbackUiStore'

const football: Sport = {
  id: 'sport-football',
  name: 'Football',
  description: 'Football squads.',
  created_at: '2026-01-01',
  directors: [],
}

const basketball: Sport = {
  id: 'sport-basketball',
  name: 'Basketball',
  description: 'Basketball squads.',
  created_at: '2026-01-01',
  directors: [],
}

const noFilters: FeedbackFilters = {
  search: '',
  rating: 'all',
  sport: 'all',
  coachId: 'all',
  fromDate: '',
  toDate: '',
  sort: 'date-desc',
}

function ref(id: string, name: string): MemberRef {
  return { id, name }
}

function member(id: string, firstName: string, lastName: string): MemberSummary {
  return { id, first_name: firstName, last_name: lastName, email: `${id}@club.test` }
}

function user(id: string, name: string, role: AuthUser['role']): AuthUser {
  return { id, name, email: `${id}@club.test`, role }
}

function team({
  id,
  name,
  sport = football,
  trainers = [],
  trainees = [],
}: {
  id: string
  name: string
  sport?: Sport
  trainers?: MemberRef[]
  trainees?: MemberRef[]
}): Team {
  return {
    id,
    name,
    description: `${name} squad.`,
    created_at: '2026-01-01',
    address: 'Club grounds',
    sport: { id: sport.id, name: sport.name },
    trainers,
    trainees,
  }
}

function event({
  id,
  name,
  teamId,
  teamIds,
  attendees = [],
}: {
  id: string
  name: string
  teamId?: string
  teamIds?: string[]
  attendees?: MemberRef[]
}): EventListItem {
  const linkedTeamIds = teamIds ?? (teamId ? [teamId] : [])

  return {
    id,
    name,
    start_time: '2026-01-10T10:00:00.000Z',
    end_time: '2026-01-10T11:00:00.000Z',
    attendees,
    teams_linked: linkedTeamIds.map((id) => ({ id, name: `Team ${id}` })),
  }
}

function feedbackSummary({
  id,
  eventRef,
  memberRef,
  creatorRef,
  rating = 8,
}: {
  id: string
  eventRef: MemberRef
  memberRef: MemberRef
  creatorRef: MemberRef | null
  rating?: number
}): FeedbackSummary {
  return {
    id,
    event: eventRef,
    member: memberRef,
    creator: creatorRef,
    created_at: '2026-01-11T09:00:00.000Z',
    rating,
  }
}

describe('canManageFeedback', () => {
  it('allows an admin to manage feedback regardless of creator', () => {
    const admin = user('admin-1', 'Admin One', 'admin')

    expect(canManageFeedback(admin, 'someone-else')).toBe(true)
    expect(canManageFeedback(admin, null)).toBe(true)
  })

  it('allows a trainer to manage feedback they created', () => {
    const coach = user('coach-1', 'Coach One', 'trainer')

    expect(canManageFeedback(coach, coach.id)).toBe(true)
  })

  it('blocks a trainer from managing feedback created by someone else', () => {
    const coach = user('coach-1', 'Coach One', 'trainer')

    expect(canManageFeedback(coach, 'coach-2')).toBe(false)
    expect(canManageFeedback(coach, null)).toBe(false)
  })
})

describe('buildFeedbackView sport rows and filters', () => {
  it('derives feedback sports from event team links', () => {
    const trainee = ref('trainee-1', 'Trainee One')
    const coach = ref('coach-1', 'Coach One')
    const footballTeam = team({ id: 'team-football', name: 'Football Team' })
    const basketballTeam = team({
      id: 'team-basketball',
      name: 'Basketball Team',
      sport: basketball,
    })
    const jointEvent = event({
      id: 'event-1',
      name: 'Joint Session',
      teamIds: [footballTeam.id, basketballTeam.id],
      attendees: [trainee],
    })
    const feedback = feedbackSummary({
      id: 'feedback-1',
      eventRef: ref(jointEvent.id, jointEvent.name),
      memberRef: trainee,
      creatorRef: coach,
    })

    const view = buildFeedbackView(
      [feedback],
      noFilters,
      [member(trainee.id, 'Trainee', 'One')],
      [footballTeam, basketballTeam],
      [football, basketball],
      [jointEvent],
      user('member-1', 'Member One', 'member'),
    )

    expect(view.rows[0]?.sportNames).toEqual(['Basketball', 'Football'])
    expect(view.sportOptions).toEqual([
      { value: 'Basketball', label: 'Basketball' },
      { value: 'Football', label: 'Football' },
    ])
  })

  it('filters and searches feedback by sport', () => {
    const trainee = ref('trainee-1', 'Trainee One')
    const coach = ref('coach-1', 'Coach One')
    const footballTeam = team({ id: 'team-football', name: 'Football Team' })
    const basketballTeam = team({
      id: 'team-basketball',
      name: 'Basketball Team',
      sport: basketball,
    })
    const footballEvent = event({
      id: 'event-football',
      name: 'Football Session',
      teamId: footballTeam.id,
      attendees: [trainee],
    })
    const basketballEvent = event({
      id: 'event-basketball',
      name: 'Court Session',
      teamId: basketballTeam.id,
      attendees: [trainee],
    })
    const footballFeedback = feedbackSummary({
      id: 'feedback-football',
      eventRef: ref(footballEvent.id, footballEvent.name),
      memberRef: trainee,
      creatorRef: coach,
    })
    const basketballFeedback = feedbackSummary({
      id: 'feedback-basketball',
      eventRef: ref(basketballEvent.id, basketballEvent.name),
      memberRef: trainee,
      creatorRef: coach,
    })

    const filteredView = buildFeedbackView(
      [footballFeedback, basketballFeedback],
      { ...noFilters, sport: 'Basketball' },
      [member(trainee.id, 'Trainee', 'One')],
      [footballTeam, basketballTeam],
      [football, basketball],
      [footballEvent, basketballEvent],
      user('member-1', 'Member One', 'member'),
    )
    const searchedView = buildFeedbackView(
      [footballFeedback, basketballFeedback],
      { ...noFilters, search: 'basket' },
      [member(trainee.id, 'Trainee', 'One')],
      [footballTeam, basketballTeam],
      [football, basketball],
      [footballEvent, basketballEvent],
      user('member-1', 'Member One', 'member'),
    )

    expect(filteredView.rows.map((row) => row.id)).toEqual(['feedback-basketball'])
    expect(searchedView.rows.map((row) => row.id)).toEqual(['feedback-basketball'])
  })
})

describe('buildFeedbackView coverage (trainer persona)', () => {
  it('reports missing feedback for attendees the coach has not reviewed yet', () => {
    const coach = ref('coach-1', 'Coach One')
    const trainee1 = ref('trainee-1', 'Trainee One')
    const trainee2 = ref('trainee-2', 'Trainee Two')

    const coachedTeam = team({
      id: 'team-1',
      name: 'Coached Team',
      trainers: [coach],
      trainees: [trainee1, trainee2],
    })

    const sessionEvent = event({
      id: 'event-1',
      name: 'Session One',
      teamId: coachedTeam.id,
      attendees: [trainee1, trainee2],
    })

    const existingFeedback = feedbackSummary({
      id: 'feedback-1',
      eventRef: ref(sessionEvent.id, sessionEvent.name),
      memberRef: trainee1,
      creatorRef: coach,
    })

    const view = buildFeedbackView(
      [existingFeedback],
      noFilters,
      [member(trainee1.id, 'Trainee', 'One'), member(trainee2.id, 'Trainee', 'Two')],
      [coachedTeam],
      [football],
      [sessionEvent],
      user(coach.id, coach.name, 'trainer'),
    )

    expect(view.coverage).not.toBeNull()
    expect(view.coverage?.totalCount).toBe(2)
    expect(view.coverage?.coveredCount).toBe(1)
    expect(view.coverage?.sports).toEqual([
      {
        name: 'Football',
        teams: [
          {
            id: coachedTeam.id,
            name: coachedTeam.name,
            events: [
              {
                id: sessionEvent.id,
                name: sessionEvent.name,
                formattedWhen: expect.any(String),
                missing: [{ id: trainee2.id, name: 'Trainee Two' }],
              },
            ],
          },
        ],
      },
    ])
  })

  it('excludes an event once every attendee has feedback', () => {
    const coach = ref('coach-1', 'Coach One')
    const trainee = ref('trainee-1', 'Trainee One')
    const coachedTeam = team({
      id: 'team-1',
      name: 'Coached Team',
      trainers: [coach],
      trainees: [trainee],
    })
    const sessionEvent = event({
      id: 'event-1',
      name: 'Session One',
      teamId: coachedTeam.id,
      attendees: [trainee],
    })
    const feedback = feedbackSummary({
      id: 'feedback-1',
      eventRef: ref(sessionEvent.id, sessionEvent.name),
      memberRef: trainee,
      creatorRef: coach,
    })

    const view = buildFeedbackView(
      [feedback],
      noFilters,
      [member(trainee.id, 'Trainee', 'One')],
      [coachedTeam],
      [football],
      [sessionEvent],
      user(coach.id, coach.name, 'trainer'),
    )

    expect(view.coverage?.totalCount).toBe(1)
    expect(view.coverage?.coveredCount).toBe(1)
    expect(view.coverage?.sports).toEqual([])
  })

  it('ignores attendees who are not on the coach\'s team roster', () => {
    const coach = ref('coach-1', 'Coach One')
    const rosterTrainee = ref('trainee-1', 'Trainee One')
    const guestAttendee = ref('trainee-2', 'Guest Trainee')
    const coachedTeam = team({
      id: 'team-1',
      name: 'Coached Team',
      trainers: [coach],
      trainees: [rosterTrainee],
    })
    const sessionEvent = event({
      id: 'event-1',
      name: 'Session One',
      teamId: coachedTeam.id,
      attendees: [rosterTrainee, guestAttendee],
    })

    const view = buildFeedbackView(
      [],
      noFilters,
      [member(rosterTrainee.id, 'Trainee', 'One')],
      [coachedTeam],
      [football],
      [sessionEvent],
      user(coach.id, coach.name, 'trainer'),
    )

    expect(view.coverage?.totalCount).toBe(1)
    expect(view.coverage?.sports[0]?.teams[0]?.events[0]?.missing).toEqual([
      { id: rosterTrainee.id, name: 'Trainee One' },
    ])
  })

  it('returns null coverage for a coach with no coached teams', () => {
    const coach = user('coach-1', 'Coach One', 'trainer')

    const view = buildFeedbackView([], noFilters, [], [], [football], [], coach)

    expect(view.coverage).toBeNull()
  })

  it('returns null coverage for roles that cannot compose feedback', () => {
    const member1 = user('member-1', 'Member One', 'member')

    const view = buildFeedbackView([], noFilters, [], [], [football], [], member1)

    expect(view.coverage).toBeNull()
  })
})

describe('buildFeedbackView coverage (admin persona)', () => {
  it('lists all event attendees without hiding pairs that already have feedback', () => {
    const coach = ref('coach-1', 'Coach One')
    const trainee1 = ref('trainee-1', 'Trainee One')
    const trainee2 = ref('trainee-2', 'Trainee Two')
    const adminTeam = team({
      id: 'team-1',
      name: 'Admin Team',
      trainees: [trainee1],
    })
    const sessionEvent = event({
      id: 'event-1',
      name: 'Session One',
      teamId: adminTeam.id,
      attendees: [trainee1, trainee2],
    })
    const existingFeedback = feedbackSummary({
      id: 'feedback-1',
      eventRef: ref(sessionEvent.id, sessionEvent.name),
      memberRef: trainee1,
      creatorRef: coach,
    })

    const view = buildFeedbackView(
      [existingFeedback],
      noFilters,
      [member(trainee1.id, 'Trainee', 'One'), member(trainee2.id, 'Trainee', 'Two')],
      [adminTeam],
      [football],
      [sessionEvent],
      user('admin-1', 'Admin One', 'admin'),
    )

    expect(view.coverage).not.toBeNull()
    expect(view.coverage?.totalCount).toBe(2)
    expect(view.coverage?.coveredCount).toBe(1)
    expect(view.coverage?.sports).toEqual([
      {
        name: 'Football',
        teams: [
          {
            id: adminTeam.id,
            name: adminTeam.name,
            events: [
              {
                id: sessionEvent.id,
                name: sessionEvent.name,
                formattedWhen: expect.any(String),
                missing: [
                  { id: trainee1.id, name: 'Trainee One' },
                  { id: trainee2.id, name: 'Trainee Two' },
                ],
              },
            ],
          },
        ],
      },
    ])
  })
})
