import { useMemo } from 'react'

import { useAuth } from '@/features/auth'
import { useMembers } from '@/features/members/api/queries'
import { useSportsList, useTeamsList } from '@/features/organization/api/queries'
import { formatDateShort, formatCents, memberSummaryName } from '@/lib/format'
import { creatorName, memberRefName } from '@/types'
import type { AuthUser, Balance, MemberSummary, Reference, Sport, Team } from '@/types'
import { useBalances, useTransactions } from '../api/queries'
import type { Transaction } from '../types'
import type { PaymentsFilters } from './paymentsUiStore'
import { usePaymentsUiStore } from './paymentsUiStore'

type PaymentStatus = 'clear' | 'overdue'
type PaymentKind = 'charge' | 'payment'

export type BalanceStatusFilter = 'all' | PaymentStatus
export type BalanceSort = 'name-asc' | 'balance-asc' | 'balance-desc' | 'transactions-desc'

export interface BalanceFilters {
  search: string
  status: BalanceStatusFilter
  sort: BalanceSort
}

export interface PaymentRow {
  id: string
  createdAt: string
  date: string
  memberId: string
  memberName: string
  title: string
  rawDescription: string
  description: string
  amountFormatted: string
  kind: PaymentKind
  creatorName: string
  creatorId: string | null
  canDelete: boolean
}

export interface PaymentsView {
  balanceCents: number
  balanceFormatted: string
  paidInCents: number
  paidInFormatted: string
  chargedCents: number
  chargedFormatted: string
  status: PaymentStatus
  rows: PaymentRow[]
  totalRows: number
}

export interface PaymentMemberOption {
  id: string
  name: string
}

export interface BalanceRow {
  memberId: string
  memberName: string
  balanceCents: number
  balanceFormatted: string
  status: PaymentStatus
  transactionCount: number
  isSelected: boolean
}

export interface ManagedPaymentsView {
  memberOptions: PaymentMemberOption[]
  balances: BalanceRow[]
  rows: PaymentRow[]
  totalRows: number
  selectedMemberId: string | null
  selectedMemberName: string | null
  balanceCents: number
  balanceFormatted: string
  paidInCents: number
  paidInFormatted: string
  chargedCents: number
  chargedFormatted: string
  overdueCount: number
  memberCount: number
}

export type PaymentsViewModelView =
  | {
      mode: 'self'
      self: PaymentsView
      managed: null
    }
  | {
      mode: 'managed'
      self: PaymentsView
      managed: ManagedPaymentsView
    }

function includesSearch(value: string, search: string): boolean {
  return value.toLocaleLowerCase().includes(search)
}

export function filterPaymentRows(
  rows: PaymentRow[],
  filters: PaymentsFilters,
  includePeople = false,
): PaymentRow[] {
  const search = filters.search.trim().toLocaleLowerCase()
  const fromTime = filters.fromDate ? new Date(`${filters.fromDate}T00:00:00`).getTime() : null
  const toTime = filters.toDate ? new Date(`${filters.toDate}T23:59:59.999`).getTime() : null

  return rows.filter((transaction) => {
    const transactionTime = new Date(transaction.createdAt).getTime()
    const matchesText =
      search.length === 0 ||
      includesSearch(transaction.title, search) ||
      includesSearch(transaction.rawDescription, search) ||
      includesSearch(transaction.description, search) ||
      (includePeople &&
        (includesSearch(transaction.memberName, search) ||
          includesSearch(transaction.creatorName, search)))

    return (
      matchesText &&
      (filters.kind === 'all' || transaction.kind === filters.kind) &&
      (fromTime === null || transactionTime >= fromTime) &&
      (toTime === null || transactionTime <= toTime)
    )
  })
}

export function filterBalanceRows(
  rows: BalanceRow[],
  filters: BalanceFilters,
): BalanceRow[] {
  const search = filters.search.trim().toLocaleLowerCase()

  return rows
    .filter(
      (balance) =>
        (search.length === 0 || includesSearch(balance.memberName, search)) &&
        (filters.status === 'all' || balance.status === filters.status),
    )
    .toSorted((a, b) => {
      const nameSort =
        a.memberName.localeCompare(b.memberName) || a.memberId.localeCompare(b.memberId)

      switch (filters.sort) {
        case 'balance-asc':
          return a.balanceCents - b.balanceCents || nameSort
        case 'balance-desc':
          return b.balanceCents - a.balanceCents || nameSort
        case 'transactions-desc':
          return b.transactionCount - a.transactionCount || nameSort
        case 'name-asc':
          return nameSort
      }
    })
}

function sortPaymentRows(rows: PaymentRow[], sort: PaymentsFilters['sort']): PaymentRow[] {
  return rows.toSorted((a, b) => {
    const aTime = new Date(a.createdAt).getTime()
    const bTime = new Date(b.createdAt).getTime()

    return sort === 'date-asc' ? aTime - bTime : bTime - aTime
  })
}

function transactionToPaymentRow(transaction: Transaction, user: AuthUser): PaymentRow {
  return {
    id: transaction.id,
    createdAt: transaction.created_at,
    date: formatDateShort(transaction.created_at),
    memberId: transaction.member.id,
    memberName: memberRefName(transaction.member),
    title: transaction.title,
    rawDescription: transaction.description ?? '',
    description: transaction.description
      ? `${transaction.title} - ${transaction.description}`
      : transaction.title,
    amountFormatted: `${transaction.amount_cents > 0 ? '+' : ''}${formatCents(transaction.amount_cents)}`,
    kind: transaction.amount_cents < 0 ? 'charge' : 'payment',
    creatorName: creatorName(transaction.creator),
    creatorId: transaction.creator?.id ?? null,
    canDelete: user.role === 'admin' || transaction.creator?.id === user.id,
  }
}

export function buildPaymentsView(
  transactions: Transaction[],
  memberId: string,
  filters: PaymentsFilters,
): PaymentsView {
  const memberTransactions = transactions.filter((transaction) => transaction.member.id === memberId)
  const balanceCents = memberTransactions.reduce(
    (sum, transaction) => sum + transaction.amount_cents,
    0,
  )
  const paidInCents = memberTransactions.reduce(
    (sum, transaction) => (transaction.amount_cents > 0 ? sum + transaction.amount_cents : sum),
    0,
  )
  const chargedCents = memberTransactions.reduce(
    (sum, transaction) => (transaction.amount_cents < 0 ? sum + transaction.amount_cents : sum),
    0,
  )

  return {
    balanceCents,
    balanceFormatted: formatCents(balanceCents),
    paidInCents,
    paidInFormatted: formatCents(paidInCents),
    chargedCents,
    chargedFormatted: formatCents(Math.abs(chargedCents)),
    status: balanceCents < 0 ? 'overdue' : 'clear',
    rows: sortPaymentRows(
      filterPaymentRows(
        memberTransactions.map((transaction) =>
          transactionToPaymentRow(transaction, {
            id: memberId,
            name: '',
            email: '',
            role: 'member',
          }),
        ),
        filters,
      ),
      filters.sort,
    ),
    totalRows: memberTransactions.length,
  }
}

export function buildManagedPaymentsView({
  transactions,
  balances,
  members,
  filters,
  selectedMemberId,
  user,
}: {
  transactions: Transaction[]
  balances: Balance[]
  members: PaymentMemberOption[]
  filters: PaymentsFilters
  selectedMemberId: string | null
  user: AuthUser
}): ManagedPaymentsView {
  const memberMap = new Map<string, PaymentMemberOption>()

  balances.forEach((balance) => {
    memberMap.set(balance.member.id, {
      id: balance.member.id,
      name: memberRefName(balance.member),
    })
  })
  members.forEach((member) => memberMap.set(member.id, member))

  const balancesByMember = new Map(
    balances.map((balance) => [balance.member.id, balance.balance_cents]),
  )
  const transactionCounts = transactions.reduce<Map<string, number>>((counts, transaction) => {
    counts.set(transaction.member.id, (counts.get(transaction.member.id) ?? 0) + 1)
    return counts
  }, new Map())
  const balanceRows = Array.from(memberMap.values())
    .map((member) => {
      const balanceCents = balancesByMember.get(member.id) ?? 0

      return {
        memberId: member.id,
        memberName: member.name,
        balanceCents,
        balanceFormatted: formatCents(balanceCents),
        status: balanceCents < 0 ? 'overdue' : 'clear',
        transactionCount: transactionCounts.get(member.id) ?? 0,
        isSelected: selectedMemberId === member.id,
      } satisfies BalanceRow
    })
    .toSorted((a, b) => a.memberName.localeCompare(b.memberName))
  const scopedTransactions = selectedMemberId
    ? transactions.filter((transaction) => transaction.member.id === selectedMemberId)
    : transactions
  const paidInCents = transactions.reduce(
    (sum, transaction) => (transaction.amount_cents > 0 ? sum + transaction.amount_cents : sum),
    0,
  )
  const chargedCents = transactions.reduce(
    (sum, transaction) => (transaction.amount_cents < 0 ? sum + transaction.amount_cents : sum),
    0,
  )
  const balanceCents = balanceRows.reduce((sum, row) => sum + row.balanceCents, 0)

  return {
    memberOptions: Array.from(memberMap.values()).toSorted((a, b) => a.name.localeCompare(b.name)),
    balances: balanceRows,
    rows: sortPaymentRows(
      filterPaymentRows(
        scopedTransactions.map((transaction) => transactionToPaymentRow(transaction, user)),
        filters,
        true,
      ),
      filters.sort,
    ),
    totalRows: scopedTransactions.length,
    selectedMemberId,
    selectedMemberName: selectedMemberId ? memberMap.get(selectedMemberId)?.name ?? null : null,
    balanceCents,
    balanceFormatted: formatCents(balanceCents),
    paidInCents,
    paidInFormatted: formatCents(paidInCents),
    chargedCents,
    chargedFormatted: formatCents(Math.abs(chargedCents)),
    overdueCount: balanceRows.filter((row) => row.status === 'overdue').length,
    memberCount: balanceRows.length,
  }
}

function memberSummaryOption(member: MemberSummary): PaymentMemberOption {
  return {
    id: member.id,
    name: memberSummaryName(member),
  }
}

function referenceOption(member: Reference): PaymentMemberOption {
  return {
    id: member.id,
    name: memberRefName(member),
  }
}

export function managedMembersForDirector(
  sports: Sport[],
  teams: Team[],
  userId: string,
): PaymentMemberOption[] {
  const directedSportIds = new Set(
    sports
      .filter((sport) => sport.directors.some((director) => director.id === userId))
      .map((sport) => sport.id),
  )
  const members = new Map<string, PaymentMemberOption>()

  teams
    .filter((team) => directedSportIds.has(team.sport.id))
    .flatMap((team) => team.trainees)
    .forEach((member) => members.set(member.id, referenceOption(member)))

  return Array.from(members.values()).toSorted((a, b) => a.name.localeCompare(b.name))
}

function managedMembersForAdmin(members: MemberSummary[]): PaymentMemberOption[] {
  return members.map(memberSummaryOption).toSorted((a, b) => a.name.localeCompare(b.name))
}

function firstError(...errors: unknown[]): Error | null {
  return errors.find((error): error is Error => error instanceof Error) ?? null
}

export function usePaymentsViewModel() {
  const { user } = useAuth()
  const canManagePayments = user.role === 'director' || user.role === 'admin'
  const transactionsQuery = useTransactions()
  const balancesQuery = useBalances(canManagePayments)
  const sportsQuery = useSportsList(user.role === 'director')
  const teamsQuery = useTeamsList(user.role === 'director')
  const membersQuery = useMembers(user.role === 'admin')
  const filters = usePaymentsUiStore((state) => state.filters)
  const selectedMemberId = usePaymentsUiStore((state) => state.selectedMemberId)

  const view = useMemo<PaymentsViewModelView>(() => {
    const transactions = transactionsQuery.data ?? []
    const self = buildPaymentsView(transactions, user.id, filters)

    if (!canManagePayments) {
      return {
        mode: 'self',
        self,
        managed: null,
      }
    }

    const managedMembers =
      user.role === 'admin'
        ? managedMembersForAdmin(membersQuery.data ?? [])
        : managedMembersForDirector(sportsQuery.data ?? [], teamsQuery.data ?? [], user.id)

    return {
      mode: 'managed',
      self,
      managed: buildManagedPaymentsView({
        transactions,
        balances: balancesQuery.data ?? [],
        members: managedMembers,
        filters,
        selectedMemberId,
        user,
      }),
    }
  }, [
    balancesQuery.data,
    canManagePayments,
    filters,
    membersQuery.data,
    selectedMemberId,
    sportsQuery.data,
    teamsQuery.data,
    transactionsQuery.data,
    user,
  ])

  const error = canManagePayments
    ? firstError(
        transactionsQuery.error,
        balancesQuery.error,
        user.role === 'director' ? sportsQuery.error : null,
        user.role === 'director' ? teamsQuery.error : null,
        user.role === 'admin' ? membersQuery.error : null,
      )
    : firstError(transactionsQuery.error)

  return {
    view,
    isLoading:
      transactionsQuery.isLoading ||
      (canManagePayments && balancesQuery.isLoading) ||
      (user.role === 'director' && (sportsQuery.isLoading || teamsQuery.isLoading)) ||
      (user.role === 'admin' && membersQuery.isLoading),
    error,
  }
}
