import { type FormEvent, useEffect, useMemo, useState } from 'react'
import { MinusCircle, Plus, PlusCircle, Trash2, X } from 'lucide-react'

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { DataTable, TCell, THead, TRow } from '@/components/ui/data-table'
import { DateRangeFilter } from '@/components/ui/date-range-filter'
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { PageHeader } from '@/components/ui/page-header'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Skeleton } from '@/components/ui/skeleton'
import { StatCard } from '@/components/ui/stat-card'
import { TableToolbar } from '@/components/ui/table-toolbar'
import { Textarea } from '@/components/ui/textarea'
import { serverErrorMessage } from '@/lib/server-error'
import { cn } from '@/lib/utils'
import { useCreateTransaction, useDeleteTransaction } from '../api/queries'
import { usePaymentsUiStore } from '../model/paymentsUiStore'
import {
  type ManagedPaymentsView,
  type PaymentMemberOption,
  type PaymentRow,
  type PaymentsView,
  usePaymentsViewModel,
} from '../model/usePaymentsViewModel'

type TransactionKind = 'charge' | 'payment'

export function PaymentsPage() {
  const { view, isLoading, error } = usePaymentsViewModel()
  const filters = usePaymentsUiStore((state) => state.filters)
  const setSearch = usePaymentsUiStore((state) => state.setSearch)
  const setKind = usePaymentsUiStore((state) => state.setKind)
  const setDateRange = usePaymentsUiStore((state) => state.setDateRange)
  const setSort = usePaymentsUiStore((state) => state.setSort)
  const resetFilters = usePaymentsUiStore((state) => state.resetFilters)

  useEffect(() => resetFilters, [resetFilters])

  if (view.mode === 'managed' && view.managed) {
    return (
      <ManagedPaymentsContent
        view={view.managed}
        filters={filters}
        isLoading={isLoading}
        error={error}
        setSearch={setSearch}
        setKind={setKind}
        setDateRange={setDateRange}
        setSort={setSort}
      />
    )
  }

  return (
    <SelfPaymentsContent
      view={view.self}
      filters={filters}
      isLoading={isLoading}
      error={error}
      setSearch={setSearch}
      setKind={setKind}
      setDateRange={setDateRange}
      setSort={setSort}
    />
  )
}

function SelfPaymentsContent({
  view,
  filters,
  isLoading,
  error,
  setSearch,
  setKind,
  setDateRange,
  setSort,
}: {
  view: PaymentsView
  filters: ReturnType<typeof usePaymentsUiStore.getState>['filters']
  isLoading: boolean
  error: Error | null
  setSearch: (search: string) => void
  setKind: (kind: typeof filters.kind) => void
  setDateRange: (range: Pick<typeof filters, 'fromDate' | 'toDate'>) => void
  setSort: (sort: typeof filters.sort) => void
}) {
  const isOverdue = view.status === 'overdue'

  return (
    <div className="mx-auto flex w-full max-w-content flex-col gap-6">
      <PageHeader
        eyebrow="My Club"
        title="Payments"
        subtitle="Your balance and transaction history."
      />

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
        <StatCard
          label="Balance"
          value={view.balanceFormatted}
          meta={isOverdue ? 'Overdue' : 'Clear'}
          tone={isOverdue ? 'negative' : 'positive'}
        />
        <StatCard
          label="Paid In"
          value={view.paidInFormatted}
          meta="Payments"
          tone="positive"
        />
        <StatCard
          label="Charged"
          value={view.chargedFormatted}
          meta="Charges"
          tone="negative"
        />
      </div>

      {isLoading ? (
        <PaymentsTableSkeleton />
      ) : error ? (
        <p className="border bg-card px-5 py-4 text-body-sm text-destructive">
          {serverErrorMessage(error)}
        </p>
      ) : view.totalRows === 0 ? (
        <p className="border bg-card px-5 py-4 text-body-sm text-text-secondary">
          No transactions are listed yet.
        </p>
      ) : (
        <>
          <PaymentsToolbar
            filters={filters}
            setSearch={setSearch}
            setKind={setKind}
            setDateRange={setDateRange}
            setSort={setSort}
            searchPlaceholder="Title or description"
          />

          {view.rows.length === 0 ? (
            <p className="border bg-card px-5 py-4 text-body-sm text-text-secondary">
              No transactions match the current filters.
            </p>
          ) : (
            <SelfTransactionsTable rows={view.rows} />
          )}
        </>
      )}
    </div>
  )
}

function ManagedPaymentsContent({
  view,
  filters,
  isLoading,
  error,
  setSearch,
  setKind,
  setDateRange,
  setSort,
}: {
  view: ManagedPaymentsView
  filters: ReturnType<typeof usePaymentsUiStore.getState>['filters']
  isLoading: boolean
  error: Error | null
  setSearch: (search: string) => void
  setKind: (kind: typeof filters.kind) => void
  setDateRange: (range: Pick<typeof filters, 'fromDate' | 'toDate'>) => void
  setSort: (sort: typeof filters.sort) => void
}) {
  const openCreateDialog = usePaymentsUiStore((state) => state.openCreateDialog)
  const selectMember = usePaymentsUiStore((state) => state.selectMember)
  const openDeleteConfirm = usePaymentsUiStore((state) => state.openDeleteConfirm)
  const closeDeleteConfirm = usePaymentsUiStore((state) => state.closeDeleteConfirm)
  const deleteTargetId = usePaymentsUiStore((state) => state.deleteTargetId)
  const mutationNotice = usePaymentsUiStore((state) => state.mutationNotice)
  const setMutationNotice = usePaymentsUiStore((state) => state.setMutationNotice)
  const deleteTransaction = useDeleteTransaction()
  const [deleteError, setDeleteError] = useState<string | null>(null)
  const deleteTarget = useMemo(
    () => view.rows.find((row) => row.id === deleteTargetId) ?? null,
    [deleteTargetId, view.rows],
  )

  const confirmDelete = async () => {
    if (!deleteTarget) return

    setDeleteError(null)

    try {
      await deleteTransaction.mutateAsync(deleteTarget.id)
      setMutationNotice('Transaction deleted.')
      closeDeleteConfirm()
    } catch (deleteFailure) {
      setDeleteError(serverErrorMessage(deleteFailure))
    }
  }

  return (
    <div className="mx-auto flex w-full max-w-content flex-col gap-6">
      <PageHeader
        eyebrow="My Club"
        title="Payments"
        subtitle="Member balances and transaction history."
        action={
          <Button
            type="button"
            onClick={openCreateDialog}
            disabled={isLoading || view.memberOptions.length === 0}
          >
            <Plus data-icon="inline-start" />
            New Transaction
          </Button>
        }
      />

      {mutationNotice && (
        <p
          role="status"
          className="border border-primary/25 bg-primary/8 px-4 py-3 text-body-sm text-text-primary"
        >
          {mutationNotice}
        </p>
      )}

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-4">
        <StatCard
          label="Total Balance"
          value={view.balanceFormatted}
          meta={`${view.memberCount} members`}
          tone={view.balanceCents < 0 ? 'negative' : 'positive'}
        />
        <StatCard label="Paid In" value={view.paidInFormatted} meta="Payments" tone="positive" />
        <StatCard label="Charged" value={view.chargedFormatted} meta="Charges" tone="negative" />
        <StatCard
          label="Overdue"
          value={String(view.overdueCount)}
          meta="Negative balances"
          tone={view.overdueCount > 0 ? 'negative' : 'positive'}
        />
      </div>

      {isLoading ? (
        <PaymentsTableSkeleton />
      ) : error ? (
        <p className="border bg-card px-5 py-4 text-body-sm text-destructive">
          {serverErrorMessage(error)}
        </p>
      ) : (
        <>
          <BalanceTable view={view} onSelectMember={selectMember} />

          <div className="space-y-3">
            <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
              <h2 className="text-h3 font-semibold tracking-tight text-text-primary">
                Transactions
              </h2>
              {view.selectedMemberId && (
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => selectMember(null)}
                >
                  <X data-icon="inline-start" />
                  Clear Member
                </Button>
              )}
            </div>

            <PaymentsToolbar
              filters={filters}
              setSearch={setSearch}
              setKind={setKind}
              setDateRange={setDateRange}
              setSort={setSort}
              searchPlaceholder="Title, member, or description"
            />

            {view.totalRows === 0 ? (
              <p className="border bg-card px-5 py-4 text-body-sm text-text-secondary">
                No transactions are listed yet.
              </p>
            ) : view.rows.length === 0 ? (
              <p className="border bg-card px-5 py-4 text-body-sm text-text-secondary">
                No transactions match the current filters.
              </p>
            ) : (
              <ManagedTransactionsTable rows={view.rows} onDelete={openDeleteConfirm} />
            )}
          </div>
        </>
      )}

      <TransactionCreateDialog members={view.memberOptions} />

      <AlertDialog
        open={deleteTargetId !== null}
        onOpenChange={(open) => {
          if (!open) {
            setDeleteError(null)
            closeDeleteConfirm()
          }
        }}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete transaction</AlertDialogTitle>
            <AlertDialogDescription>
              Delete {deleteTarget?.title ?? 'this transaction'} for{' '}
              {deleteTarget?.memberName ?? 'this member'}? This cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          {deleteError && (
            <p className="border border-destructive/30 bg-destructive/10 px-3 py-2 text-body-sm text-destructive">
              {deleteError}
            </p>
          )}
          <AlertDialogFooter>
            <AlertDialogCancel disabled={deleteTransaction.isPending}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              disabled={deleteTransaction.isPending || !deleteTarget}
              onClick={(event) => {
                event.preventDefault()
                void confirmDelete()
              }}
            >
              {deleteTransaction.isPending ? 'Deleting' : 'Delete'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}

function PaymentsToolbar({
  filters,
  setSearch,
  setKind,
  setDateRange,
  setSort,
  searchPlaceholder,
}: {
  filters: ReturnType<typeof usePaymentsUiStore.getState>['filters']
  setSearch: (search: string) => void
  setKind: (kind: typeof filters.kind) => void
  setDateRange: (range: Pick<typeof filters, 'fromDate' | 'toDate'>) => void
  setSort: (sort: typeof filters.sort) => void
  searchPlaceholder: string
}) {
  return (
    <TableToolbar
      searchValue={filters.search}
      onSearchChange={setSearch}
      searchLabel="Search transactions"
      searchPlaceholder={searchPlaceholder}
    >
      <Select value={filters.kind} onValueChange={setKind}>
        <SelectTrigger aria-label="Filter transactions by type">
          <SelectValue placeholder="Type" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All types</SelectItem>
          <SelectItem value="charge">Charges</SelectItem>
          <SelectItem value="payment">Payments</SelectItem>
        </SelectContent>
      </Select>

      <Select value={filters.sort} onValueChange={setSort}>
        <SelectTrigger aria-label="Sort transactions">
          <SelectValue placeholder="Sort" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="date-desc">Newest first</SelectItem>
          <SelectItem value="date-asc">Oldest first</SelectItem>
        </SelectContent>
      </Select>

      <DateRangeFilter
        fromDate={filters.fromDate}
        toDate={filters.toDate}
        onChange={setDateRange}
        ariaLabel="Filter transactions by date range"
      />
    </TableToolbar>
  )
}

function BalanceTable({
  view,
  onSelectMember,
}: {
  view: ManagedPaymentsView
  onSelectMember: (memberId: string | null) => void
}) {
  if (view.balances.length === 0) {
    return (
      <p className="border bg-card px-5 py-4 text-body-sm text-text-secondary">
        No managed members are listed yet.
      </p>
    )
  }

  return (
    <div className="space-y-3">
      <h2 className="text-h3 font-semibold tracking-tight text-text-primary">Balances</h2>
      <DataTable>
        <thead>
          <tr>
            <THead>Member</THead>
            <THead>Status</THead>
            <THead className="text-right">Transactions</THead>
            <THead className="text-right">Balance</THead>
          </tr>
        </thead>
        <tbody>
          {view.balances.map((balance) => (
            <TRow
              key={balance.memberId}
              role="button"
              tabIndex={0}
              aria-pressed={balance.isSelected}
              onClick={() => onSelectMember(balance.isSelected ? null : balance.memberId)}
              onKeyDown={(event) => {
                if (event.key === 'Enter' || event.key === ' ') {
                  event.preventDefault()
                  onSelectMember(balance.isSelected ? null : balance.memberId)
                }
              }}
              className={cn(
                'cursor-pointer outline-none focus-visible:bg-surface-sunken/70 focus-visible:ring-2 focus-visible:ring-ring/30',
                balance.isSelected && 'bg-primary/8 hover:bg-primary/10',
              )}
            >
              <TCell className="font-medium">{balance.memberName}</TCell>
              <TCell>
                <Badge tone={balance.status === 'overdue' ? 'negative' : 'positive'} size="sm">
                  {balance.status === 'overdue' ? 'Overdue' : 'Clear'}
                </Badge>
              </TCell>
              <TCell className="text-right tabular-nums text-text-secondary">
                {balance.transactionCount}
              </TCell>
              <TCell
                className={cn(
                  'text-right font-semibold tabular-nums',
                  balance.status === 'overdue'
                    ? 'text-destructive'
                    : 'text-[oklch(0.5_0.17_145)] dark:text-[oklch(0.72_0.17_145)]',
                )}
              >
                {balance.balanceFormatted}
              </TCell>
            </TRow>
          ))}
        </tbody>
      </DataTable>
    </div>
  )
}

function SelfTransactionsTable({ rows }: { rows: PaymentRow[] }) {
  return (
    <DataTable>
      <thead>
        <tr>
          <THead>Date</THead>
          <THead>Description</THead>
          <THead>Recorded by</THead>
          <THead>Type</THead>
          <THead className="text-right">Amount</THead>
        </tr>
      </thead>
      <tbody>
        {rows.map((transaction) => (
          <TRow key={transaction.id}>
            <TCell className="whitespace-nowrap text-text-secondary">
              {transaction.date}
            </TCell>
            <TCell className="font-medium">{transaction.description}</TCell>
            <TCell className="whitespace-nowrap text-text-secondary">
              {transaction.creatorName}
            </TCell>
            <TCell>
              <Badge tone={transaction.kind === 'payment' ? 'positive' : 'negative'} size="sm">
                {transaction.kind === 'payment' ? 'Payment' : 'Charge'}
              </Badge>
            </TCell>
            <AmountCell transaction={transaction} />
          </TRow>
        ))}
      </tbody>
    </DataTable>
  )
}

function ManagedTransactionsTable({
  rows,
  onDelete,
}: {
  rows: PaymentRow[]
  onDelete: (transactionId: string) => void
}) {
  return (
    <DataTable>
      <thead>
        <tr>
          <THead>Date</THead>
          <THead>Member</THead>
          <THead>Description</THead>
          <THead>Recorded by</THead>
          <THead>Type</THead>
          <THead className="text-right">Amount</THead>
          <THead className="text-right">Actions</THead>
        </tr>
      </thead>
      <tbody>
        {rows.map((transaction) => (
          <TRow key={transaction.id}>
            <TCell className="whitespace-nowrap text-text-secondary">
              {transaction.date}
            </TCell>
            <TCell className="font-medium">{transaction.memberName}</TCell>
            <TCell>{transaction.description}</TCell>
            <TCell className="whitespace-nowrap text-text-secondary">
              {transaction.creatorName}
            </TCell>
            <TCell>
              <Badge tone={transaction.kind === 'payment' ? 'positive' : 'negative'} size="sm">
                {transaction.kind === 'payment' ? 'Payment' : 'Charge'}
              </Badge>
            </TCell>
            <AmountCell transaction={transaction} />
            <TCell className="text-right">
              {transaction.canDelete && (
                <Button
                  type="button"
                  variant="destructive"
                  size="icon-xs"
                  title={`Delete ${transaction.title}`}
                  onClick={() => onDelete(transaction.id)}
                >
                  <Trash2 />
                  <span className="sr-only">Delete {transaction.title}</span>
                </Button>
              )}
            </TCell>
          </TRow>
        ))}
      </tbody>
    </DataTable>
  )
}

function AmountCell({ transaction }: { transaction: PaymentRow }) {
  return (
    <TCell
      className={cn(
        'text-right font-semibold tabular-nums',
        transaction.kind === 'charge'
          ? 'text-destructive'
          : 'text-[oklch(0.5_0.17_145)] dark:text-[oklch(0.72_0.17_145)]',
      )}
    >
      {transaction.amountFormatted}
    </TCell>
  )
}

function TransactionCreateDialog({ members }: { members: PaymentMemberOption[] }) {
  const isOpen = usePaymentsUiStore((state) => state.isCreateDialogOpen)
  const closeCreateDialog = usePaymentsUiStore((state) => state.closeCreateDialog)
  const setMutationNotice = usePaymentsUiStore((state) => state.setMutationNotice)
  const createTransaction = useCreateTransaction()
  const [memberId, setMemberId] = useState('')
  const [kind, setKind] = useState<TransactionKind>('charge')
  const [amount, setAmount] = useState('')
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [formError, setFormError] = useState<string | null>(null)
  const sortedMembers = useMemo(
    () => members.toSorted((a, b) => a.name.localeCompare(b.name)),
    [members],
  )
  const selectedMemberId = memberId || sortedMembers[0]?.id || ''

  const resetForm = () => {
    setMemberId('')
    setKind('charge')
    setAmount('')
    setTitle('')
    setDescription('')
    setFormError(null)
  }

  const handleClose = () => {
    resetForm()
    closeCreateDialog()
  }

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    const amountCents = parseEuroAmountCents(amount)
    const trimmedTitle = title.trim()

    if (!selectedMemberId) {
      setFormError('Select a member.')
      return
    }
    if (amountCents === null) {
      setFormError('Enter an amount in euros with up to two decimals.')
      return
    }
    if (!trimmedTitle) {
      setFormError('Title is required.')
      return
    }

    setFormError(null)

    try {
      const created = await createTransaction.mutateAsync({
        member: selectedMemberId,
        amount_cents: kind === 'charge' ? -amountCents : amountCents,
        title: trimmedTitle,
        description: description.trim() || undefined,
      })

      setMutationNotice(`Transaction recorded for ${created.member.name}.`)
      handleClose()
    } catch (error) {
      setFormError(serverErrorMessage(error))
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && handleClose()}>
      <DialogContent className="max-h-[92vh] overflow-y-auto sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>New Transaction</DialogTitle>
        </DialogHeader>

        <form className="space-y-5" onSubmit={handleSubmit}>
          <div className="space-y-1.5">
            <Label htmlFor="payment-member">Member</Label>
            <Select
              value={selectedMemberId}
              onValueChange={setMemberId}
              disabled={createTransaction.isPending || sortedMembers.length === 0}
            >
              <SelectTrigger id="payment-member" className="w-full">
                <SelectValue placeholder="Select member" />
              </SelectTrigger>
              <SelectContent>
                {sortedMembers.map((member) => (
                  <SelectItem key={member.id} value={member.id}>
                    {member.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Type</Label>
            <div className="grid grid-cols-2 border border-border bg-card p-1">
              <Button
                type="button"
                variant={kind === 'charge' ? 'secondary' : 'ghost'}
                aria-pressed={kind === 'charge'}
                onClick={() => setKind('charge')}
                disabled={createTransaction.isPending}
                className="w-full"
              >
                <MinusCircle data-icon="inline-start" />
                Charge
              </Button>
              <Button
                type="button"
                variant={kind === 'payment' ? 'secondary' : 'ghost'}
                aria-pressed={kind === 'payment'}
                onClick={() => setKind('payment')}
                disabled={createTransaction.isPending}
                className="w-full"
              >
                <PlusCircle data-icon="inline-start" />
                Payment
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="space-y-1.5">
              <Label htmlFor="payment-amount">Amount</Label>
              <Input
                id="payment-amount"
                value={amount}
                onChange={(event) => setAmount(event.target.value)}
                inputMode="decimal"
                placeholder="0.00"
                required
                disabled={createTransaction.isPending}
                aria-invalid={formError !== null && parseEuroAmountCents(amount) === null}
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="payment-title">Title</Label>
              <Input
                id="payment-title"
                value={title}
                onChange={(event) => setTitle(event.target.value)}
                required
                disabled={createTransaction.isPending}
                aria-invalid={formError !== null && title.trim() === ''}
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="payment-description">Description</Label>
            <Textarea
              id="payment-description"
              value={description}
              onChange={(event) => setDescription(event.target.value)}
              disabled={createTransaction.isPending}
              className="min-h-24"
            />
          </div>

          {formError && (
            <p className="border border-destructive/30 bg-destructive/10 px-3 py-2 text-body-sm text-destructive">
              {formError}
            </p>
          )}

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              disabled={createTransaction.isPending}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={createTransaction.isPending || sortedMembers.length === 0}
            >
              {createTransaction.isPending ? 'Saving' : 'Record Transaction'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

function parseEuroAmountCents(value: string): number | null {
  const normalized = value.trim().replace(',', '.')
  if (!/^\d+(\.\d{1,2})?$/.test(normalized)) return null

  const [euros, cents = ''] = normalized.split('.')
  const amountCents = Number(euros) * 100 + Number(cents.padEnd(2, '0'))

  return amountCents > 0 ? amountCents : null
}

function PaymentsTableSkeleton() {
  return (
    <div className="border bg-card p-5">
      <div className="space-y-3">
        {Array.from({ length: 5 }).map((_, index) => (
          <Skeleton key={index} className="h-9 w-full" />
        ))}
      </div>
    </div>
  )
}
