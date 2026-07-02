import { useEffect } from 'react'

import { Badge } from '@/components/ui/badge'
import { DataTable, TCell, THead, TRow } from '@/components/ui/data-table'
import { DateRangeFilter } from '@/components/ui/date-range-filter'
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
import { usePaymentsUiStore } from '../model/paymentsUiStore'
import { usePaymentsViewModel } from '../model/usePaymentsViewModel'

export function PaymentsPage() {
  const { view, isLoading, error } = usePaymentsViewModel()
  const filters = usePaymentsUiStore((state) => state.filters)
  const setSearch = usePaymentsUiStore((state) => state.setSearch)
  const setKind = usePaymentsUiStore((state) => state.setKind)
  const setDateRange = usePaymentsUiStore((state) => state.setDateRange)
  const setSort = usePaymentsUiStore((state) => state.setSort)
  const resetFilters = usePaymentsUiStore((state) => state.resetFilters)
  const isOverdue = view.status === 'overdue'

  useEffect(() => resetFilters, [resetFilters])

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
          {error.message}
        </p>
      ) : view.totalRows === 0 ? (
        <p className="border bg-card px-5 py-4 text-body-sm text-text-secondary">
          No transactions are listed yet.
        </p>
      ) : (
        <>
          <TableToolbar
            searchValue={filters.search}
            onSearchChange={setSearch}
            searchLabel="Search transactions"
            searchPlaceholder="Title or description"
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

          {view.rows.length === 0 ? (
            <p className="border bg-card px-5 py-4 text-body-sm text-text-secondary">
              No transactions match the current filters.
            </p>
          ) : (
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
                {view.rows.map((transaction) => (
                  <TRow key={transaction.id}>
                    <TCell className="whitespace-nowrap text-text-secondary">
                      {transaction.date}
                    </TCell>
                    <TCell className="font-medium">{transaction.description}</TCell>
                    <TCell className="whitespace-nowrap text-text-secondary">
                      {transaction.creatorName}
                    </TCell>
                    <TCell>
                      <Badge
                        tone={transaction.kind === 'payment' ? 'positive' : 'negative'}
                        size="sm"
                      >
                        {transaction.kind === 'payment' ? 'Payment' : 'Charge'}
                      </Badge>
                    </TCell>
                    <TCell
                      className={`text-right font-semibold tabular-nums ${
                        transaction.kind === 'charge'
                          ? 'text-destructive'
                          : 'text-[oklch(0.5_0.17_145)] dark:text-[oklch(0.72_0.17_145)]'
                      }`}
                    >
                      {transaction.amountFormatted}
                    </TCell>
                  </TRow>
                ))}
              </tbody>
            </DataTable>
          )}
        </>
      )}
    </div>
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
