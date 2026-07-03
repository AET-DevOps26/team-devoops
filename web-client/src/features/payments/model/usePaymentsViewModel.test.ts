import { describe, expect, it } from 'vitest'

import type { AuthUser, Balance, Reference, Sport, Team, Transaction } from '@/types'
import type { PaymentsFilters } from './paymentsUiStore'
import {
  buildManagedPaymentsView,
  buildPaymentsView,
  managedMembersForDirector,
} from './usePaymentsViewModel'

const filters: PaymentsFilters = {
  search: '',
  kind: 'all',
  fromDate: '',
  toDate: '',
  sort: 'date-desc',
}

function ref(id: string, name: string): Reference {
  return { id, name }
}

function user(member: Reference, role: AuthUser['role']): AuthUser {
  return {
    id: member.id,
    name: member.name,
    email: `${member.id}@club.test`,
    role,
  }
}

function sport(id: string, name: string, directors: Reference[]): Sport {
  return {
    id,
    name,
    description: `${name} sport.`,
    created_at: '2026-01-01',
    directors,
  }
}

function team({
  id,
  name,
  sportRef,
  trainers = [],
  trainees = [],
}: {
  id: string
  name: string
  sportRef: Reference
  trainers?: Reference[]
  trainees?: Reference[]
}): Team {
  return {
    id,
    name,
    description: `${name} squad.`,
    created_at: '2026-01-01',
    address: 'Club grounds',
    sport: sportRef,
    trainers,
    trainees,
  }
}

function transaction({
  id,
  member,
  creator,
  amountCents,
  title = 'Monthly dues',
  description = 'Membership fee',
}: {
  id: string
  member: Reference
  creator: Reference | null
  amountCents: number
  title?: string
  description?: string
}): Transaction {
  return {
    id,
    member,
    creator,
    amount_cents: amountCents,
    created_at: '2026-06-01T00:00:00.000Z',
    title,
    description,
  }
}

describe('payments view-model builders', () => {
  it('keeps director scope to trainees of teams in directed sports', () => {
    const director = ref('director-1', 'Director One')
    const otherDirector = ref('director-2', 'Director Two')
    const coach = ref('coach-1', 'Coach One')
    const football = sport('sport-football', 'Football', [director])
    const tennis = sport('sport-tennis', 'Tennis', [otherDirector])
    const footballTrainee = ref('member-football', 'Football Trainee')
    const tennisTrainee = ref('member-tennis', 'Tennis Trainee')

    const members = managedMembersForDirector(
      [football, tennis],
      [
        team({
          id: 'team-football',
          name: 'Football Team',
          sportRef: { id: football.id, name: football.name },
          trainers: [coach],
          trainees: [footballTrainee],
        }),
        team({
          id: 'team-tennis',
          name: 'Tennis Team',
          sportRef: { id: tennis.id, name: tennis.name },
          trainees: [tennisTrainee],
        }),
      ],
      director.id,
    )

    expect(members).toEqual([{ id: footballTrainee.id, name: footballTrainee.name }])
  })

  it('unions balances with the managed roster and filters transactions by selected member', () => {
    const director = ref('director-1', 'Director One')
    const memberWithBalance = ref('member-1', 'Member One')
    const zeroBalanceMember = ref('member-2', 'Member Two')
    const transactions = [
      transaction({
        id: 'transaction-1',
        member: memberWithBalance,
        creator: director,
        amountCents: -1000,
      }),
      transaction({
        id: 'transaction-2',
        member: zeroBalanceMember,
        creator: director,
        amountCents: 500,
        title: 'Payment received',
      }),
    ]
    const balances: Balance[] = [{ member: memberWithBalance, balance_cents: -1000 }]

    const view = buildManagedPaymentsView({
      transactions,
      balances,
      members: [
        { id: memberWithBalance.id, name: memberWithBalance.name },
        { id: zeroBalanceMember.id, name: zeroBalanceMember.name },
      ],
      filters,
      selectedMemberId: zeroBalanceMember.id,
      user: user(director, 'director'),
    })

    expect(view.balances.map((balance) => ({
      memberId: balance.memberId,
      balanceCents: balance.balanceCents,
      isSelected: balance.isSelected,
    }))).toEqual([
      { memberId: memberWithBalance.id, balanceCents: -1000, isSelected: false },
      { memberId: zeroBalanceMember.id, balanceCents: 0, isSelected: true },
    ])
    expect(view.rows.map((row) => row.id)).toEqual(['transaction-2'])
    expect(view.rows[0].canDelete).toBe(true)
    expect(view.totalRows).toBe(1)
  })

  it('does not search member or creator names in the self view', () => {
    const member = ref('member-1', 'Member One')
    const creator = ref('creator-1', 'Creator One')
    const selfTransaction = transaction({
      id: 'transaction-1',
      member,
      creator,
      amountCents: -1000,
      title: 'Monthly dues',
      description: 'Membership fee',
    })

    expect(
      buildPaymentsView([selfTransaction], member.id, {
        ...filters,
        search: 'Creator',
      }).rows,
    ).toEqual([])
    expect(
      buildPaymentsView([selfTransaction], member.id, {
        ...filters,
        search: 'Monthly',
      }).rows.map((row) => row.id),
    ).toEqual(['transaction-1'])
  })
})
