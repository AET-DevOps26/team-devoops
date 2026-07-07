import { describe, expect, it } from 'vitest'

import type { AuthUser, Balance, Reference, Sport, Team, Transaction } from '@/types'
import type { PaymentsFilters } from './paymentsUiStore'
import {
  type BalanceRow,
  buildManagedPaymentsView,
  buildPaymentsView,
  filterBalanceRows,
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
  createdAt = '2026-06-01T00:00:00.000Z',
}: {
  id: string
  member: Reference
  creator: Reference | null
  amountCents: number
  title?: string
  description?: string
  createdAt?: string
}): Transaction {
  return {
    id,
    member,
    creator,
    amount_cents: amountCents,
    created_at: createdAt,
    title,
    description,
  }
}

function balanceRow({
  memberId,
  memberName,
  balanceCents,
  transactionCount,
  isSelected = false,
}: {
  memberId: string
  memberName: string
  balanceCents: number
  transactionCount: number
  isSelected?: boolean
}): BalanceRow {
  return {
    memberId,
    memberName,
    balanceCents,
    balanceFormatted: `${balanceCents}`,
    status: balanceCents < 0 ? 'overdue' : 'clear',
    transactionCount,
    isSelected,
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

  it('filters managed transactions by member search, type, and date range', () => {
    const admin = ref('admin-1', 'Admin One')
    const memberOne = ref('member-1', 'Member One')
    const memberTwo = ref('member-2', 'Member Two')
    const transactions = [
      transaction({
        id: 'transaction-1',
        member: memberOne,
        creator: admin,
        amountCents: -1000,
        title: 'Monthly dues',
        createdAt: '2026-06-10T00:00:00.000Z',
      }),
      transaction({
        id: 'transaction-2',
        member: memberOne,
        creator: admin,
        amountCents: 500,
        title: 'Payment received',
        createdAt: '2026-06-12T00:00:00.000Z',
      }),
      transaction({
        id: 'transaction-3',
        member: memberTwo,
        creator: admin,
        amountCents: -700,
        title: 'Monthly dues',
        createdAt: '2026-06-15T00:00:00.000Z',
      }),
      transaction({
        id: 'transaction-4',
        member: memberOne,
        creator: admin,
        amountCents: -300,
        title: 'Old charge',
        createdAt: '2026-05-20T00:00:00.000Z',
      }),
    ]

    const view = buildManagedPaymentsView({
      transactions,
      balances: [],
      members: [
        { id: memberOne.id, name: memberOne.name },
        { id: memberTwo.id, name: memberTwo.name },
      ],
      filters: {
        ...filters,
        search: 'member one',
        kind: 'charge',
        fromDate: '2026-06-01',
        toDate: '2026-06-30',
      },
      selectedMemberId: null,
      user: user(admin, 'admin'),
    })

    expect(view.rows.map((row) => row.id)).toEqual(['transaction-1'])
  })

  it('filters balance rows by member search and status', () => {
    const rows = [
      balanceRow({
        memberId: 'member-1',
        memberName: 'Alice Rivera',
        balanceCents: -1200,
        transactionCount: 3,
      }),
      balanceRow({
        memberId: 'member-2',
        memberName: 'Bert Klein',
        balanceCents: 0,
        transactionCount: 0,
      }),
      balanceRow({
        memberId: 'member-3',
        memberName: 'Alicia Stern',
        balanceCents: 500,
        transactionCount: 1,
      }),
    ]

    expect(
      filterBalanceRows(rows, {
        search: 'ali',
        status: 'all',
        sort: 'name-asc',
      }).map((row) => row.memberId),
    ).toEqual(['member-1', 'member-3'])

    expect(
      filterBalanceRows(rows, {
        search: 'ali',
        status: 'overdue',
        sort: 'name-asc',
      }).map((row) => row.memberId),
    ).toEqual(['member-1'])

    expect(
      filterBalanceRows(rows, {
        search: 'bert',
        status: 'overdue',
        sort: 'name-asc',
      }),
    ).toEqual([])
  })

  it('sorts balance rows by name, balance, and transaction count', () => {
    const rows = [
      balanceRow({
        memberId: 'member-1',
        memberName: 'Celine',
        balanceCents: -500,
        transactionCount: 2,
      }),
      balanceRow({
        memberId: 'member-2',
        memberName: 'Alex',
        balanceCents: -1500,
        transactionCount: 1,
      }),
      balanceRow({
        memberId: 'member-3',
        memberName: 'Bianca',
        balanceCents: 700,
        transactionCount: 4,
      }),
    ]
    const rowIdsForSort = (sort: Parameters<typeof filterBalanceRows>[1]['sort']) =>
      filterBalanceRows(rows, { search: '', status: 'all', sort }).map((row) => row.memberId)

    expect(rowIdsForSort('name-asc')).toEqual(['member-2', 'member-3', 'member-1'])
    expect(rowIdsForSort('balance-asc')).toEqual(['member-2', 'member-1', 'member-3'])
    expect(rowIdsForSort('balance-desc')).toEqual(['member-3', 'member-1', 'member-2'])
    expect(rowIdsForSort('transactions-desc')).toEqual(['member-3', 'member-1', 'member-2'])
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
