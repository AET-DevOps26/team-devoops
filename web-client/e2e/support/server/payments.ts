import {
  balanceFixtures as balanceFixturesSource,
  memberNamesById,
  transactionFixtures as transactionFixturesSource,
} from '@/testing/fixtures'
import { httpError } from '@/testing/httpError'
import {
  directorManagesMember,
  scopeBalances,
  scopeTransactions,
  trainerManagesMember,
} from '@/testing/scope'
import type { AuthUser, Reference } from '@/types'
import type {
  Balance,
  Transaction,
  TransactionCreate,
  TransactionPartialUpdate,
} from '@/features/payments/types'

// In-memory payments resource. State is a deep clone of the fixtures; reset() restores it per test.
let transactionFixtures: Transaction[] = []
let balanceFixtures: Balance[] = []

export function reset(): void {
  transactionFixtures = transactionFixturesSource.map(cloneTransaction)
  balanceFixtures = balanceFixturesSource.map((b) => ({ ...b, member: { ...b.member } }))
}

reset()

export function listBalances(user: AuthUser): Balance[] {
  if (user.role === 'member') throw httpError(403, 'Access denied')
  return scopeBalances(balanceFixtures, user)
}

export function getMemberBalance(memberId: string, user: AuthUser): Balance {
  const found = balanceFixtures.find((balance) => balance.member.id === memberId)
  const scoped = found ? scopeBalances([found], user) : []
  if (!scoped[0]) throw httpError(404, 'Balance not found')
  return scoped[0]
}

export function listTransactions(user: AuthUser): Transaction[] {
  return scopeTransactions(transactionFixtures, user)
}

export function getTransaction(id: string, user: AuthUser): Transaction {
  const found = transactionFixtures.find((transaction) => transaction.id === id)
  const scoped = found ? scopeTransactions([found], user) : []
  if (!scoped[0]) throw httpError(404, 'Transaction not found')
  return scoped[0]
}

export function createTransaction(data: TransactionCreate, user: AuthUser): Transaction {
  const member = memberRef(data.member)
  const title = data.title.trim()

  if (!title) throw httpError(400, 'Title is required.')
  if (!canCreateTransactionForMember(user, data.member)) {
    throw httpError(403, 'You are not allowed to create transactions for this member.')
  }

  const transaction: Transaction = {
    id: newTransactionId(),
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

export function updateTransaction(
  id: string,
  data: TransactionPartialUpdate,
  user: AuthUser,
): Transaction {
  const index = transactionFixtures.findIndex((transaction) => transaction.id === id)
  const existing = transactionFixtures[index]

  if (!existing) throw httpError(404, 'Transaction not found.')
  // Same gate delete uses: only the creator or an admin may modify a transaction.
  if (user.role !== 'admin' && existing.creator?.id !== user.id) {
    throw httpError(403, 'You are not allowed to update this transaction.')
  }

  // Resolve a new member only if the caller is moving the transaction; keep the ref otherwise.
  const nextMember = data.member !== undefined ? memberRef(data.member) : existing.member

  const title = data.title !== undefined ? data.title.trim() : existing.title
  if (!title) throw httpError(400, 'Title is required.')

  const updated: Transaction = {
    ...existing,
    member: nextMember,
    amount_cents: data.amount_cents !== undefined ? data.amount_cents : existing.amount_cents,
    title,
    description: data.description !== undefined ? data.description.trim() : existing.description,
  }

  transactionFixtures[index] = updated

  // Re-sync the affected member balance(s). If the member changed, both the old and the new
  // member's balances must be recomputed.
  if (existing.member.id !== updated.member.id) {
    syncMockBalance(existing.member)
  }
  syncMockBalance(updated.member)

  return cloneTransaction(updated)
}

export function deleteTransaction(id: string, user: AuthUser): void {
  const index = transactionFixtures.findIndex((transaction) => transaction.id === id)
  const transaction = transactionFixtures[index]

  if (!transaction) throw httpError(404, 'Transaction not found.')
  if (user.role !== 'admin' && transaction.creator?.id !== user.id) {
    throw httpError(403, 'You are not allowed to delete this transaction.')
  }

  transactionFixtures.splice(index, 1)
  syncMockBalance(transaction.member)
}

function memberRef(memberId: string): Reference {
  const name = memberNamesById[memberId]
  if (!name) throw httpError(404, 'Member not found.')
  return { id: memberId, name }
}

function canCreateTransactionForMember(user: AuthUser, memberId: string): boolean {
  if (user.role === 'admin') return true
  if (user.role === 'director') return directorManagesMember(user.id, memberId)
  if (user.role === 'trainer') return trainerManagesMember(user.id, memberId)
  return false
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

function newTransactionId(): string {
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
