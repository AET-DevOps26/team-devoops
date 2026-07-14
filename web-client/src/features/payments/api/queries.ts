import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

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

export function useBalances(enabled = true) {
  return useQuery<Balance[]>({
    queryKey: paymentsKeys.balances,
    staleTime: 30_000,
    enabled,
    queryFn: () => paymentsClient.get<Balance[]>('/balances').then(r => r.data),
  })
}

export function useMemberBalance(memberId: string) {
  return useQuery<Balance>({
    queryKey: paymentsKeys.balance(memberId),
    staleTime: 30_000,
    queryFn: () => paymentsClient.get<Balance>(`/balances/${memberId}`).then(r => r.data),
    enabled: !!memberId,
  })
}

export function useTransactions(enabled = true) {
  return useQuery<Transaction[]>({
    queryKey: paymentsKeys.transactions,
    staleTime: 30_000,
    enabled,
    queryFn: () => paymentsClient.get<Transaction[]>('/transactions').then(r => r.data),
  })
}

export function useTransaction(id: string) {
  return useQuery<Transaction>({
    queryKey: paymentsKeys.transaction(id),
    staleTime: 30_000,
    queryFn: () => paymentsClient.get<Transaction>(`/transactions/${id}`).then(r => r.data),
    enabled: !!id,
  })
}

export function useCreateTransaction() {
  const qc = useQueryClient()

  return useMutation<Transaction, Error, TransactionCreate>({
    mutationFn: data => paymentsClient.post<Transaction>('/transactions', data).then(r => r.data),
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
    mutationFn: id => paymentsClient.delete(`/transactions/${id}`).then(() => undefined),
    onSuccess: (_, id) => {
      qc.invalidateQueries({ queryKey: paymentsKeys.transactions })
      qc.invalidateQueries({ queryKey: paymentsKeys.balances })
      qc.removeQueries({ queryKey: paymentsKeys.transaction(id) })
    },
  })
}
