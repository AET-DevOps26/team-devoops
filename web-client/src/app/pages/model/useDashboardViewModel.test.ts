import { describe, expect, it } from 'vitest'

import { formatCents } from '@/lib/format'
import type { AdminDashboard, DirectorDashboard, Sport, Team } from '@/types'
import {
  buildAdminCounts,
  buildAdminOrganizationSection,
  buildDirectorSportSection,
} from './useDashboardViewModel'

const adminDashboard: AdminDashboard = {
  role: 'admin',
  total_members: 240,
  total_sports: 6,
  total_teams: 18,
  total_directors: 4,
  total_trainers: 12,
  total_balance_cents: 123_45,
  events_this_week: 9,
}

const sports: Sport[] = [
  {
    id: 'sport-1',
    name: 'Football',
    description: '',
    created_at: '2026-01-01',
    directors: [],
  },
  {
    id: 'sport-2',
    name: 'Basketball',
    description: '',
    created_at: '2026-01-01',
    directors: [],
  },
]

const teams: Team[] = [
  {
    id: 'team-1',
    name: 'Football Juniors',
    description: '',
    address: '',
    created_at: '2026-01-01',
    sport: { id: 'sport-1', name: 'Football' },
    trainers: [{ id: 'trainer-1', name: 'Coach One' }],
    trainees: [
      { id: 'member-1', name: 'Member One' },
      { id: 'member-2', name: 'Member Two' },
    ],
  },
  {
    id: 'team-2',
    name: 'Football Seniors',
    description: '',
    address: '',
    created_at: '2026-01-01',
    sport: { id: 'sport-1', name: 'Football' },
    trainers: [{ id: 'trainer-2', name: 'Coach Two' }],
    trainees: [
      { id: 'member-2', name: 'Member Two' },
      { id: 'member-3', name: 'Member Three' },
    ],
  },
  {
    id: 'team-3',
    name: 'Basketball Juniors',
    description: '',
    address: '',
    created_at: '2026-01-01',
    sport: { id: 'sport-2', name: 'Basketball' },
    trainers: [{ id: 'trainer-3', name: 'Coach Three' }],
    trainees: [{ id: 'member-4', name: 'Member Four' }],
  },
]

function directorDashboard(teamCount: number): DirectorDashboard {
  return {
    role: 'director',
    sport: { id: 'sport-1', name: 'Football' },
    total_teams: teamCount,
    total_members: 80,
    sport_balance_cents: 500_00,
    upcoming_events: 3,
    teams: Array.from({ length: teamCount }, (_, index) => ({
      team: { id: `team-${index + 1}`, name: `Team ${index + 1}` },
      member_count: index + 10,
      balance_cents: (index + 1) * 100,
    })),
  }
}

describe('dashboard view model builders', () => {
  it('maps admin dashboard counts directly from the counts-only envelope', () => {
    expect(buildAdminCounts(adminDashboard)).toEqual({
      totalMembers: adminDashboard.total_members,
      totalSports: adminDashboard.total_sports,
      totalTeams: adminDashboard.total_teams,
      directors: adminDashboard.total_directors,
      trainers: adminDashboard.total_trainers,
      totalBalanceFormatted: formatCents(adminDashboard.total_balance_cents),
      eventsThisWeek: adminDashboard.events_this_week,
    })
  })

  it('builds admin organization insights from sport and team lists', () => {
    const section = buildAdminOrganizationSection(adminDashboard, sports, teams)

    expect(section.sportDistribution).toEqual([
      {
        id: 'sport-1',
        sportName: 'Football',
        teamCount: 2,
        memberCount: 3,
        trainerCount: 2,
        memberSharePercentage: 75,
        membersPerTeam: 1.5,
      },
      {
        id: 'sport-2',
        sportName: 'Basketball',
        teamCount: 1,
        memberCount: 1,
        trainerCount: 1,
        memberSharePercentage: 25,
        membersPerTeam: 1,
      },
    ])
    expect(section.hiddenSports).toBe(0)
    expect(section.averageTeamsPerSport).toBe(1.5)
    expect(section.averageMembersPerTeam).toBeCloseTo(5 / 3)
    expect(section.busiestSport).toEqual({
      sportName: 'Football',
      memberCount: 3,
      teamCount: 2,
      membersPerTeam: 1.5,
    })
    expect(section.totalRoleAssignments).toBe(16)
    expect(section.roleAssignments).toEqual([
      { label: 'Directors', value: 4, percentage: 25 },
      { label: 'Coaches', value: 12, percentage: 75 },
    ])
    expect(section.totalDistributedMembers).toBe(4)
  })

  it('caps director team previews while preserving the full team total', () => {
    const section = buildDirectorSportSection(directorDashboard(7))

    expect(section.totalTeams).toBe(7)
    expect(section.teams).toHaveLength(5)
    expect(section.teams.map((team) => team.id)).toEqual([
      'team-1',
      'team-2',
      'team-3',
      'team-4',
      'team-5',
    ])
    expect(section.hiddenTeams).toBe(2)
  })
})
