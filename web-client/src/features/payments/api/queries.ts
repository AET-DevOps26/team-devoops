import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

import { getCurrentUser } from '@/features/auth/currentUser'
import {
  balanceFixtures,
  memberNamesById,
  sportFixtures,
  teamFixtures,
  transactionFixtures,
} from '@/mocks/fixtures'
import { mockOr } from '@/mocks/mockSwitch'
import { scopeBalances, scopeTransactions } from '@/mocks/scope'
import { paymentsClient } from './client'
import type { AuthUser, Reference } from '@/types'
import type { Balance, Transaction, TransactionCreate, TransactionPartialUpdate } from '../types'

export const paymentsKeys = {
  hello: ['payments', 'hello'] as const,
  balances: ['payments', 'balances'] as const,
  balance: (memberId: string) => ['payments', 'balances', memberId] as const,
  transactions: ['payments', 'transactions'] as const,
  transaction: (id: string) => ['payments', 'transactions', id] as const,
}

export function usePaymentsHello() {
  return useQuery<string>({
    queryKey: paymentsKeys.hello,
    queryFn: () => paymentsClient.get<string>('/hello').then(r => r.data),
  })
}

export function useBalances(enabled = true) {
  return useQuery<Balance[]>({
    queryKey: paymentsKeys.balances,
    staleTime: 30_000,
    enabled,
    queryFn: () =>
      mockOr(
        () => {
          const user = getCurrentUser()
          if (user.role === 'member') throw mockHttpError(403, 'Access denied')
          return Promise.resolve(scopeBalances(balanceFixtures, user))
        },
        () => paymentsClient.get<Balance[]>('/balances').then(r => r.data),
      ),
  })
}

export function useMemberBalance(memberId: string) {
  return useQuery<Balance>({
    queryKey: paymentsKeys.balance(memberId),
    staleTime: 30_000,
    queryFn: () =>
      mockOr(
        () => {
          const found = balanceFixtures.find(balance => balance.member.id === memberId)
          const scoped = found ? scopeBalances([found], getCurrentUser()) : []
          if (!scoped[0]) throw new Error('Balance not found')
          return Promise.resolve(scoped[0])
        },
        () => paymentsClient.get<Balance>(`/balances/${memberId}`).then(r => r.data),
      ),
    enabled: !!memberId,
  })
}

export function useTransactions(enabled = true) {
  return useQuery<Transaction[]>({
    queryKey: paymentsKeys.transactions,
    staleTime: 30_000,
    enabled,
    queryFn: () =>
      mockOr(
        () => Promise.resolve(scopeTransactions(transactionFixtures, getCurrentUser())),
        () => paymentsClient.get<Transaction[]>('/transactions').then(r => r.data),
      ),
  })
}

export function useTransaction(id: string) {
  return useQuery<Transaction>({
    queryKey: paymentsKeys.transaction(id),
    staleTime: 30_000,
    queryFn: () =>
      mockOr(
        () => {
          const found = transactionFixtures.find(transaction => transaction.id === id)
          const scoped = found ? scopeTransactions([found], getCurrentUser()) : []
          if (!scoped[0]) throw new Error('Transaction not found')
          return Promise.resolve(scoped[0])
        },
        () => paymentsClient.get<Transaction>(`/transactions/${id}`).then(r => r.data),
      ),
    enabled: !!id,
  })
}

export function useCreateTransaction() {
  const qc = useQueryClient()

  return useMutation<Transaction, Error, TransactionCreate>({
    mutationFn: data =>
      mockOr(
        () => Promise.resolve(mockCreateTransaction(data)),
        () => paymentsClient.post<Transaction>('/transactions', data).then(r => r.data),
      ),
    onSuccess: (transaction) => {
      qc.invalidateQueries({ queryKey: paymentsKeys.transactions })
      qc.invalidateQueries({ queryKey: paymentsKeys.balances })
      qc.invalidateQueries({ queryKey: paymentsKeys.balance(transaction.member.id) })
    },
  })
}

export function useUpdateTransaction() {
  const qc = useQueryClient()

  return useMutation<Transaction, Error, { id: string } & TransactionPartialUpdate>({
    mutationFn: ({ id, ...data }) => paymentsClient.patch<Transaction>(`/transactions/${id}`, data).then(r => r.data),
    onSuccess: (_, { id }) => {
      qc.invalidateQueries({ queryKey: paymentsKeys.transactions })
      qc.invalidateQueries({ queryKey: paymentsKeys.balances })
      qc.invalidateQueries({ queryKey: paymentsKeys.transaction(id) })
    },
  })
}

export function useDeleteTransaction() {
  const qc = useQueryClient()

  return useMutation<void, Error, string>({
    mutationFn: id =>
      mockOr(
        () => {
          mockDeleteTransaction(id)
          return Promise.resolve(undefined)
        },
        () => paymentsClient.delete(`/transactions/${id}`).then(() => undefined),
      ),
    onSuccess: (_, id) => {
      qc.invalidateQueries({ queryKey: paymentsKeys.transactions })
      qc.invalidateQueries({ queryKey: paymentsKeys.balances })
      qc.removeQueries({ queryKey: paymentsKeys.transaction(id) })
    },
  })
}

function mockCreateTransaction(data: TransactionCreate): Transaction {
  const user = getCurrentUser()
  const member = memberRef(data.member)
  const title = data.title.trim()

  if (!title) throw mockHttpError(400, 'Title is required.')
  if (!canCreateTransactionForMember(user, data.member)) {
    throw mockHttpError(403, 'You are not allowed to create transactions for this member.')
  }

  const transaction: Transaction = {
    id: mockTransactionId(),
    member,
    creator: { id: user.id, name: user.name },
    amount_cents: data.amount_cents,
    created_at: new Date().toISOString(),
    title,
    description: data.description?.trim() ?? '',
  }

  transactionFixtures.unshift(transaction)
  syncMockBalance(member)
  return cloneTransaction(transaction)
}

function mockDeleteTransaction(id: string): void {
  const user = getCurrentUser()
  const index = transactionFixtures.findIndex((transaction) => transaction.id === id)
  const transaction = transactionFixtures[index]

  if (!transaction) throw mockHttpError(404, 'Transaction not found.')
  if (user.role !== 'admin' && transaction.creator?.id !== user.id) {
    throw mockHttpError(403, 'You are not allowed to delete this transaction.')
  }

  transactionFixtures.splice(index, 1)
  syncMockBalance(transaction.member)
}

function memberRef(memberId: string): Reference {
  const name = memberNamesById[memberId]
  if (!name) throw mockHttpError(404, 'Member not found.')
  return { id: memberId, name }
}

function canCreateTransactionForMember(user: AuthUser, memberId: string): boolean {
  if (user.role === 'admin') return true
  if (user.role === 'director') return directsMember(user.id, memberId)
  if (user.role === 'trainer') return trainsMember(user.id, memberId)
  return false
}

function directsMember(userId: string, memberId: string): boolean {
  const sportIds = new Set(
    sportFixtures
      .filter((sport) => sport.directors.some((director) => director.id === userId))
      .map((sport) => sport.id),
  )

  return teamFixtures.some(
    (team) =>
      sportIds.has(team.sport.id) &&
      team.trainees.some((trainee) => trainee.id === memberId),
  )
}

function trainsMember(userId: string, memberId: string): boolean {
  return teamFixtures.some(
    (team) =>
      team.trainers.some((trainer) => trainer.id === userId) &&
      team.trainees.some((trainee) => trainee.id === memberId),
  )
}

function syncMockBalance(member: Reference): void {
  const balanceCents = transactionFixtures.reduce(
    (sum, transaction) =>
      transaction.member.id === member.id ? sum + transaction.amount_cents : sum,
    0,
  )
  const index = balanceFixtures.findIndex((balance) => balance.member.id === member.id)
  const balance: Balance = {
    member: { ...member },
    balance_cents: balanceCents,
  }

  if (index === -1) {
    balanceFixtures.push(balance)
    return
  }

  balanceFixtures[index] = balance
}

function mockTransactionId(): string {
  return (
    globalThis.crypto?.randomUUID?.() ??
    `cccccccc-cccc-4ccc-8ccc-${Date.now().toString(16).padStart(12, '0').slice(-12)}`
  )
}

function cloneTransaction(transaction: Transaction): Transaction {
  return {
    ...transaction,
    member: { ...transaction.member },
    creator: transaction.creator ? { ...transaction.creator } : null,
  }
}

function mockHttpError(status: number, message: string): Error {
  return Object.assign(new Error(message), {
    isAxiosError: true,
    response: {
      status,
      data: { message },
    },
  })
}
