import {
  type FormEvent,
  type KeyboardEvent,
  useCallback,
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
} from 'react'
import { Check, ChevronsUpDown, MinusCircle, Plus, PlusCircle, Trash2, X } from 'lucide-react'
import { toast } from 'sonner'

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
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { ErrorNotice } from '@/components/ui/ErrorNotice'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { PageHeader } from '@/components/ui/page-header'
import { PendingButton, PendingButtonContent } from '@/components/ui/pending-button'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { RowActionButton, RowActions } from '@/components/ui/row-action-button'
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Textarea } from '@/components/ui/textarea'
import { formMutationErrorFields, notifyMutationError } from '@/lib/mutation-feedback'
import { serverErrorMessage } from '@/lib/server-error'
import { mutationFeedbackCopy } from '@/lib/mutation-feedback-copy'
import { fieldError } from '@/lib/validation'
import { cn } from '@/lib/utils'
import { useCreateTransaction, useDeleteTransaction } from '../api/queries'
import { usePaymentsUiStore } from '../model/paymentsUiStore'
import {
  parseEuroAmountCents,
  validateTransactionCreateForm,
} from '../model/transactionEditor'
import {
  type BalanceFilters,
  type ManagedPaymentsView,
  type PaymentMemberOption,
  type PaymentRow,
  type PaymentsView,
  filterBalanceRows,
  usePaymentsViewModel,
} from '../model/usePaymentsViewModel'

type TransactionKind = 'charge' | 'payment'

const MEMBER_PICKER_RESULT_LIMIT = 8

const DEFAULT_BALANCE_FILTERS: BalanceFilters = {
  search: '',
  status: 'all',
  sort: 'name-asc',
}

export function PaymentsPage() {
  const { view, isLoading, error, refetch } = usePaymentsViewModel()
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
        onRetry={refetch}
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
      onRetry={refetch}
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
  onRetry,
  setSearch,
  setKind,
  setDateRange,
  setSort,
}: {
  view: PaymentsView
  filters: ReturnType<typeof usePaymentsUiStore.getState>['filters']
  isLoading: boolean
  error: Error | null
  onRetry: () => void
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
        <ErrorNotice message={serverErrorMessage(error)} onRetry={onRetry} />
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
  onRetry,
  setSearch,
  setKind,
  setDateRange,
  setSort,
}: {
  view: ManagedPaymentsView
  filters: ReturnType<typeof usePaymentsUiStore.getState>['filters']
  isLoading: boolean
  error: Error | null
  onRetry: () => void
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
  const activeTab = usePaymentsUiStore((state) => state.activeTab)
  const setActiveTab = usePaymentsUiStore((state) => state.setActiveTab)
  const deleteTransaction = useDeleteTransaction()
  const deleteTarget = useMemo(
    () => view.rows.find((row) => row.id === deleteTargetId) ?? null,
    [deleteTargetId, view.rows],
  )

  const handleSelectMemberFromBalances = (memberId: string | null) => {
    selectMember(memberId)
    if (memberId) {
      setActiveTab('transactions')
    }
  }

  const confirmDelete = async () => {
    if (!deleteTarget) return

    try {
      await deleteTransaction.mutateAsync(deleteTarget.id)
      toast.success('Transaction deleted.')
      closeDeleteConfirm()
    } catch (deleteFailure) {
      notifyMutationError(deleteFailure, mutationFeedbackCopy.transaction.delete)
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

      <Tabs
        value={activeTab}
        onValueChange={(value) => setActiveTab(value as typeof activeTab)}
      >
        <TabsList>
          <TabsTrigger value="balances">Balances</TabsTrigger>
          <TabsTrigger value="transactions">Transactions</TabsTrigger>
        </TabsList>

        <TabsContent value="balances">
          {isLoading ? (
            <PaymentsTableSkeleton />
          ) : error ? (
            <ErrorNotice message={serverErrorMessage(error)} onRetry={onRetry} />
          ) : (
            <BalanceTable view={view} onSelectMember={handleSelectMemberFromBalances} />
          )}
        </TabsContent>

        <TabsContent value="transactions">
          {isLoading ? (
            <PaymentsTableSkeleton />
          ) : error ? (
            <ErrorNotice message={serverErrorMessage(error)} onRetry={onRetry} />
          ) : (
            <div className="space-y-3">
              {view.selectedMemberId && (
                <div className="flex justify-end">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => selectMember(null)}
                  >
                    <X data-icon="inline-start" />
                    Clear Member
                  </Button>
                </div>
              )}

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
          )}
        </TabsContent>
      </Tabs>

      <TransactionCreateDialog members={view.memberOptions} />

      <AlertDialog
        open={deleteTargetId !== null}
        onOpenChange={(open) => {
          if (!open) closeDeleteConfirm()
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
          <AlertDialogFooter>
            <AlertDialogCancel disabled={deleteTransaction.isPending}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              disabled={deleteTransaction.isPending || !deleteTarget}
              onClick={(event) => {
                event.preventDefault()
                void confirmDelete()
              }}
            >
              {deleteTransaction.isPending ? (
                <PendingButtonContent pendingLabel="Deleting…" />
              ) : (
                'Delete'
              )}
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

function BalanceToolbar({
  filters,
  setSearch,
  setStatus,
  setSort,
}: {
  filters: BalanceFilters
  setSearch: (search: string) => void
  setStatus: (status: BalanceFilters['status']) => void
  setSort: (sort: BalanceFilters['sort']) => void
}) {
  return (
    <TableToolbar
      searchValue={filters.search}
      onSearchChange={setSearch}
      searchLabel="Search members"
      searchPlaceholder="Search members"
    >
      <Select value={filters.status} onValueChange={setStatus}>
        <SelectTrigger aria-label="Filter balances by status">
          <SelectValue placeholder="Status" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All</SelectItem>
          <SelectItem value="overdue">Overdue</SelectItem>
          <SelectItem value="clear">Clear</SelectItem>
        </SelectContent>
      </Select>

      <Select value={filters.sort} onValueChange={setSort}>
        <SelectTrigger aria-label="Sort balances">
          <SelectValue placeholder="Sort" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="name-asc">Name A-Z</SelectItem>
          <SelectItem value="balance-asc">Most owed first</SelectItem>
          <SelectItem value="balance-desc">Highest balance first</SelectItem>
          <SelectItem value="transactions-desc">Most transactions</SelectItem>
        </SelectContent>
      </Select>
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
  const [balanceFilters, setBalanceFilters] = useState<BalanceFilters>(DEFAULT_BALANCE_FILTERS)
  const filteredBalances = useMemo(
    () => filterBalanceRows(view.balances, balanceFilters),
    [balanceFilters, view.balances],
  )
  const setBalanceSearch = useCallback((search: string) => {
    setBalanceFilters((current) => ({ ...current, search }))
  }, [])
  const setBalanceStatus = useCallback((status: BalanceFilters['status']) => {
    setBalanceFilters((current) => ({ ...current, status }))
  }, [])
  const setBalanceSort = useCallback((sort: BalanceFilters['sort']) => {
    setBalanceFilters((current) => ({ ...current, sort }))
  }, [])

  if (view.balances.length === 0) {
    return (
      <p className="border bg-card px-5 py-4 text-body-sm text-text-secondary">
        No managed members are listed yet.
      </p>
    )
  }

  return (
    <div className="space-y-3">
      <BalanceToolbar
        filters={balanceFilters}
        setSearch={setBalanceSearch}
        setStatus={setBalanceStatus}
        setSort={setBalanceSort}
      />

      {filteredBalances.length === 0 ? (
        <p className="border bg-card px-5 py-4 text-body-sm text-text-secondary">
          No members match the current filters.
        </p>
      ) : (
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
            {filteredBalances.map((balance) => (
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
      )}
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
                <RowActions>
                  <RowActionButton
                    icon={Trash2}
                    label={`Delete ${transaction.title}`}
                    destructive
                    onClick={() => onDelete(transaction.id)}
                  />
                </RowActions>
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

function MemberSearchPicker({
  triggerId,
  members,
  value,
  onChange,
  disabled,
  invalid,
}: {
  triggerId: string
  members: PaymentMemberOption[]
  value: string
  onChange: (memberId: string) => void
  disabled: boolean
  invalid: boolean
}) {
  const inputId = useId()
  const listId = useId()
  const [isOpen, setIsOpen] = useState(false)
  const [search, setSearch] = useState('')
  const [activeIndex, setActiveIndex] = useState(0)
  const inputRef = useRef<HTMLInputElement>(null)
  const triggerRef = useRef<HTMLButtonElement>(null)
  const selectedMember = useMemo(
    () => members.find((member) => member.id === value) ?? null,
    [members, value],
  )
  const matchingMembers = useMemo(() => {
    const normalizedSearch = search.trim().toLocaleLowerCase()

    if (normalizedSearch.length === 0) return members

    return members.filter((member) =>
      member.name.toLocaleLowerCase().includes(normalizedSearch),
    )
  }, [members, search])
  const visibleMembers = matchingMembers.slice(0, MEMBER_PICKER_RESULT_LIMIT)
  const clampedActiveIndex =
    visibleMembers.length === 0
      ? -1
      : Math.min(Math.max(activeIndex, 0), visibleMembers.length - 1)
  const activeOptionId =
    isOpen && clampedActiveIndex >= 0 && visibleMembers[clampedActiveIndex]
      ? `${listId}-option-${clampedActiveIndex}`
      : undefined

  useEffect(() => {
    if (!isOpen) return

    const timeout = window.setTimeout(() => inputRef.current?.focus(), 0)

    return () => window.clearTimeout(timeout)
  }, [isOpen])

  const handleOpenChange = (open: boolean) => {
    if (disabled) return

    setIsOpen(open)

    if (open) {
      setSearch('')
      setActiveIndex(0)
    }
  }

  const selectMember = (memberId: string) => {
    onChange(memberId)
    setIsOpen(false)
    setSearch('')
    setActiveIndex(0)
    window.setTimeout(() => triggerRef.current?.focus(), 0)
  }

  const handleInputKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'ArrowDown') {
      event.preventDefault()
      setActiveIndex((currentIndex) =>
        visibleMembers.length === 0
          ? -1
          : Math.min(currentIndex + 1, visibleMembers.length - 1),
      )
      return
    }

    if (event.key === 'ArrowUp') {
      event.preventDefault()
      setActiveIndex((currentIndex) =>
        visibleMembers.length === 0
          ? -1
          : Math.max(currentIndex - 1, 0),
      )
      return
    }

    if (event.key === 'Enter') {
      event.preventDefault()
      const activeMember = visibleMembers[clampedActiveIndex]

      if (activeMember) {
        selectMember(activeMember.id)
      }
      return
    }

    if (event.key === 'Escape') {
      event.preventDefault()
      setIsOpen(false)
      triggerRef.current?.focus()
    }
  }

  return (
    <Popover open={isOpen} onOpenChange={handleOpenChange}>
      <PopoverTrigger asChild>
        <Button
          ref={triggerRef}
          id={triggerId}
          type="button"
          variant="outline"
          role="combobox"
          aria-controls={listId}
          aria-expanded={isOpen}
          aria-invalid={invalid || undefined}
          disabled={disabled}
          className={cn(
            'w-full justify-between px-3 text-left text-sm font-medium normal-case tracking-normal',
            !selectedMember && 'text-text-tertiary',
          )}
        >
          <span className="truncate">{selectedMember?.name ?? 'Select member'}</span>
          <ChevronsUpDown data-icon="inline-end" className="opacity-60" />
        </Button>
      </PopoverTrigger>
      <PopoverContent
        className="w-[var(--radix-popover-trigger-width)] min-w-72 p-0"
        onOpenAutoFocus={(event) => event.preventDefault()}
      >
        <div className="border-b border-border p-2">
          <Label htmlFor={inputId} className="sr-only">
            Search members
          </Label>
          <Input
            ref={inputRef}
            id={inputId}
            type="search"
            value={search}
            placeholder="Search members"
            role="combobox"
            aria-autocomplete="list"
            aria-controls={listId}
            aria-expanded={isOpen}
            aria-activedescendant={activeOptionId}
            className="h-9 bg-card"
            onChange={(event) => {
              setSearch(event.target.value)
              setActiveIndex(0)
            }}
            onKeyDown={handleInputKeyDown}
          />
        </div>
        <div id={listId} role="listbox" className="roost-scroll max-h-64 overflow-y-auto p-1">
          {visibleMembers.length > 0 ? (
            visibleMembers.map((member, index) => (
              <button
                key={member.id}
                id={`${listId}-option-${index}`}
                type="button"
                role="option"
                aria-selected={member.id === value}
                className={cn(
                  'flex h-9 w-full items-center justify-between gap-2 px-3 text-left text-sm text-text-primary outline-none',
                  index === clampedActiveIndex && 'bg-muted',
                  member.id === value && 'font-semibold',
                )}
                onMouseEnter={() => setActiveIndex(index)}
                onMouseDown={(event) => event.preventDefault()}
                onClick={() => selectMember(member.id)}
              >
                <span className="truncate">{member.name}</span>
                <Check
                  className={cn(
                    'size-4 text-primary opacity-0',
                    member.id === value && 'opacity-100',
                  )}
                />
              </button>
            ))
          ) : (
            <p className="px-3 py-6 text-center text-body-sm text-text-secondary">
              No members found.
            </p>
          )}
        </div>
      </PopoverContent>
    </Popover>
  )
}

function TransactionCreateDialog({ members }: { members: PaymentMemberOption[] }) {
  const isOpen = usePaymentsUiStore((state) => state.isCreateDialogOpen)
  const closeCreateDialog = usePaymentsUiStore((state) => state.closeCreateDialog)
  const createTransaction = useCreateTransaction()
  const [memberId, setMemberId] = useState('')
  const [kind, setKind] = useState<TransactionKind>('charge')
  const [amount, setAmount] = useState('')
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [fieldErrors, setFieldErrors] = useState<Record<string, string> | null>(null)
  const sortedMembers = useMemo(
    () => members.toSorted((a, b) => a.name.localeCompare(b.name)),
    [members],
  )
  const memberStillListed = sortedMembers.some((member) => member.id === memberId)
  const effectiveMemberId = memberStillListed ? memberId : ''
  const memberError = fieldError(fieldErrors, 'memberId', 'member')
  const amountError = fieldError(fieldErrors, 'amount', 'amount_cents')
  const titleError = fieldError(fieldErrors, 'title')

  const resetForm = () => {
    setMemberId('')
    setKind('charge')
    setAmount('')
    setTitle('')
    setDescription('')
    setFieldErrors(null)
  }

  const handleClose = () => {
    resetForm()
    closeCreateDialog()
  }

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setFieldErrors(null)

    const validationErrors = validateTransactionCreateForm({
      memberId: effectiveMemberId,
      amount,
      title,
      description,
    })
    if (validationErrors) {
      setFieldErrors(validationErrors)
      return
    }

    const amountCents = parseEuroAmountCents(amount)
    if (amountCents === null) return
    const trimmedTitle = title.trim()

    try {
      const created = await createTransaction.mutateAsync({
        member: effectiveMemberId,
        amount_cents: kind === 'charge' ? -amountCents : amountCents,
        title: trimmedTitle,
        description: description.trim() || undefined,
      })

      toast.success(`Transaction recorded for ${created.member.name}.`)
      handleClose()
    } catch (error) {
      setFieldErrors(formMutationErrorFields(error, mutationFeedbackCopy.transaction.create))
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && handleClose()}>
      <DialogContent
        className="roost-scroll max-h-[92vh] overflow-y-auto sm:max-w-lg"
        dismissOnInteractOutside={false}
      >
        <DialogHeader>
          <DialogTitle>New Transaction</DialogTitle>
          <DialogDescription className="sr-only">
            Record a charge or payment for a member.
          </DialogDescription>
        </DialogHeader>

        <form className="space-y-5" onSubmit={handleSubmit} noValidate>
          <div className="space-y-1.5">
            <Label htmlFor="payment-member">Member</Label>
            <MemberSearchPicker
              triggerId="payment-member"
              members={sortedMembers}
              value={effectiveMemberId}
              onChange={setMemberId}
              disabled={createTransaction.isPending || sortedMembers.length === 0}
              invalid={memberError !== undefined}
            />
            {memberError && (
              <p className="text-caption text-destructive">{memberError}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label>Type</Label>
            <div className="grid grid-cols-2 gap-1 border border-border bg-card p-1">
              <Button
                type="button"
                variant="ghost"
                aria-pressed={kind === 'charge'}
                onClick={() => setKind('charge')}
                disabled={createTransaction.isPending}
                className={cn(
                  'h-auto w-full flex-col gap-1 border px-3 py-3 text-center',
                  kind === 'charge'
                    ? 'border-destructive/40 bg-destructive/10 text-destructive shadow-sm hover:bg-destructive/15'
                    : 'border-transparent text-text-secondary hover:bg-destructive/8 hover:text-destructive',
                )}
              >
                <MinusCircle className="size-4" />
                <span>Charge</span>
              </Button>
              <Button
                type="button"
                variant="ghost"
                aria-pressed={kind === 'payment'}
                onClick={() => setKind('payment')}
                disabled={createTransaction.isPending}
                className={cn(
                  'h-auto w-full flex-col gap-1 border px-3 py-3 text-center',
                  kind === 'payment'
                    ? 'border-emerald-500/40 bg-emerald-50 text-emerald-700 shadow-sm hover:bg-emerald-100 dark:border-emerald-400/40 dark:bg-emerald-500/15 dark:text-emerald-300'
                    : 'border-transparent text-text-secondary hover:bg-emerald-500/10 hover:text-emerald-700 dark:hover:text-emerald-300',
                )}
              >
                <PlusCircle className="size-4" />
                <span>Payment</span>
              </Button>
            </div>
            <p className="text-body-sm text-text-secondary">
              Charge increases what the member owes; payment reduces it.
            </p>
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
                aria-invalid={amountError !== undefined}
              />
              {amountError && (
                <p className="text-caption text-destructive">{amountError}</p>
              )}
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="payment-title">Title</Label>
              <Input
                id="payment-title"
                value={title}
                onChange={(event) => setTitle(event.target.value)}
                required
                disabled={createTransaction.isPending}
                aria-invalid={titleError !== undefined}
              />
              {titleError && (
                <p className="text-caption text-destructive">{titleError}</p>
              )}
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

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              disabled={createTransaction.isPending}
            >
              Cancel
            </Button>
            <PendingButton
              type="submit"
              disabled={sortedMembers.length === 0}
              isPending={createTransaction.isPending}
              pendingLabel="Saving…"
            >
              Record Transaction
            </PendingButton>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
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
