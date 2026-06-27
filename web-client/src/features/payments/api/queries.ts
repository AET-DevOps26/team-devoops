import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

import { getCurrentUser } from '@/features/auth/currentUser'
import { balanceFixtures, transactionFixtures } from '@/mocks/fixtures'
import { mockOr } from '@/mocks/mockSwitch'
import { scopeBalances, scopeTransactions } from '@/mocks/scope'
import { paymentsClient } from './client'
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

export function useBalances() {
  return useQuery<Balance[]>({
    queryKey: paymentsKeys.balances,
    staleTime: 30_000,
    queryFn: () =>
      mockOr(
        () => Promise.resolve(scopeBalances(balanceFixtures, getCurrentUser())),
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
    mutationFn: data => paymentsClient.post<Transaction>('/transactions', data).then(r => r.data),
    onSuccess: () => qc.invalidateQueries({ queryKey: paymentsKeys.transactions }),
  })
}

export function useUpdateTransaction() {
  const qc = useQueryClient()

  return useMutation<Transaction, Error, { id: string } & TransactionPartialUpdate>({
    mutationFn: ({ id, ...data }) => paymentsClient.patch<Transaction>(`/transactions/${id}`, data).then(r => r.data),
    onSuccess: (_, { id }) => {
      qc.invalidateQueries({ queryKey: paymentsKeys.transactions })
      qc.invalidateQueries({ queryKey: paymentsKeys.transaction(id) })
    },
  })
}

export function useDeleteTransaction() {
  const qc = useQueryClient()

  return useMutation<void, Error, string>({
    mutationFn: id => paymentsClient.delete(`/transactions/${id}`).then(() => undefined),
    onSuccess: (_, id) => {
      qc.invalidateQueries({ queryKey: paymentsKeys.transactions })
      qc.removeQueries({ queryKey: paymentsKeys.transaction(id) })
    },
  })
}
