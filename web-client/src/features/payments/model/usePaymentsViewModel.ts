import { useMemo } from 'react'

import { useAuth } from '@/features/auth'
import { formatDateShort, formatEuroCents } from '@/lib/format'
import { creatorName } from '@/types'
import { useTransactions } from '../api/queries'
import type { Transaction } from '../types'
import type { PaymentsFilters } from './paymentsUiStore'
import { usePaymentsUiStore } from './paymentsUiStore'

type PaymentStatus = 'clear' | 'overdue'
type PaymentKind = 'charge' | 'payment'

export interface PaymentRow {
  id: string
  createdAt: string
  date: string
  title: string
  rawDescription: string
  description: string
  amountFormatted: string
  kind: PaymentKind
  creatorName: string
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

function includesSearch(value: string, search: string): boolean {
  return value.toLocaleLowerCase().includes(search)
}

export function filterPaymentRows(
  rows: PaymentRow[],
  filters: PaymentsFilters,
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
      includesSearch(transaction.description, search)

    return (
      matchesText &&
      (filters.kind === 'all' || transaction.kind === filters.kind) &&
      (fromTime === null || transactionTime >= fromTime) &&
      (toTime === null || transactionTime <= toTime)
    )
  })
}

function sortPaymentRows(rows: PaymentRow[], sort: PaymentsFilters['sort']): PaymentRow[] {
  return rows.toSorted((a, b) => {
    const aTime = new Date(a.createdAt).getTime()
    const bTime = new Date(b.createdAt).getTime()

    return sort === 'date-asc' ? aTime - bTime : bTime - aTime
  })
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
    balanceFormatted: formatEuroCents(balanceCents),
    paidInCents,
    paidInFormatted: formatEuroCents(paidInCents),
    chargedCents,
    chargedFormatted: formatEuroCents(Math.abs(chargedCents)),
    status: balanceCents < 0 ? 'overdue' : 'clear',
    rows: sortPaymentRows(filterPaymentRows(memberTransactions.map((transaction) => ({
      id: transaction.id,
      createdAt: transaction.created_at,
      date: formatDateShort(transaction.created_at),
      title: transaction.title,
      rawDescription: transaction.description ?? '',
      description: transaction.description
        ? `${transaction.title} - ${transaction.description}`
        : transaction.title,
      amountFormatted: `${transaction.amount_cents > 0 ? '+' : ''}${formatEuroCents(transaction.amount_cents)}`,
      kind: transaction.amount_cents < 0 ? 'charge' : 'payment',
      creatorName: creatorName(transaction.creator),
    })), filters), filters.sort),
    totalRows: memberTransactions.length,
  }
}

export function usePaymentsViewModel() {
  const { user } = useAuth()
  const transactionsQuery = useTransactions()
  const filters = usePaymentsUiStore((state) => state.filters)

  const view = useMemo(
    () => buildPaymentsView(transactionsQuery.data ?? [], user.id, filters),
    [transactionsQuery.data, user.id, filters],
  )

  return {
    view,
    isLoading: transactionsQuery.isLoading,
    error: transactionsQuery.error,
  }
}
