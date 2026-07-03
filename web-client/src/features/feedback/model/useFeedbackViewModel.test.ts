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
import { buildFeedbackView } from './useFeedbackViewModel'
import type { FeedbackFilters } from './feedbackUiStore'

const football: Sport = {
  id: 'sport-football',
  name: 'Football',
  description: 'Football squads.',
  created_at: '2026-01-01',
  directors: [],
}

const noFilters: FeedbackFilters = {
  search: '',
  rating: 'all',
  eventId: 'all',
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
  trainers = [],
  trainees = [],
}: {
  id: string
  name: string
  trainers?: MemberRef[]
  trainees?: MemberRef[]
}): Team {
  return {
    id,
    name,
    description: `${name} squad.`,
    created_at: '2026-01-01',
    address: 'Club grounds',
    sport: { id: football.id, name: football.name },
    trainers,
    trainees,
  }
}

function event({
  id,
  name,
  teamId,
  attendees = [],
}: {
  id: string
  name: string
  teamId: string
  attendees?: MemberRef[]
}): EventListItem {
  return {
    id,
    name,
    start_time: '2026-01-10T10:00:00.000Z',
    end_time: '2026-01-10T11:00:00.000Z',
    attendees,
    teams_linked: [{ id: teamId, name: `Team ${teamId}` }],
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

  it('returns null coverage for non-trainer roles', () => {
    const member1 = user('member-1', 'Member One', 'member')

    const view = buildFeedbackView([], noFilters, [], [], [football], [], member1)

    expect(view.coverage).toBeNull()
  })
})
