import { useEffect } from 'react'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
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
import { Separator } from '@/components/ui/separator'
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet'
import { Skeleton } from '@/components/ui/skeleton'
import { StatCard } from '@/components/ui/stat-card'
import { TableToolbar } from '@/components/ui/table-toolbar'
import { formatDate, formatDateShort } from '@/lib/format'
import { useFeedbackUiStore } from '../model/feedbackUiStore'
import { useFeedbackDetailView, useFeedbackViewModel } from '../model/useFeedbackViewModel'

const ratingOptions = [
  { value: 'all', label: 'All ratings' },
  { value: 'high', label: '7+' },
  { value: 'medium', label: '4-6' },
  { value: 'low', label: '0-3' },
] as const

export function FeedbackPage() {
  const { view, isLoading, error } = useFeedbackViewModel()
  const filters = useFeedbackUiStore((state) => state.filters)
  const setSearch = useFeedbackUiStore((state) => state.setSearch)
  const setRating = useFeedbackUiStore((state) => state.setRating)
  const setEventId = useFeedbackUiStore((state) => state.setEventId)
  const setCoachId = useFeedbackUiStore((state) => state.setCoachId)
  const setDateRange = useFeedbackUiStore((state) => state.setDateRange)
  const setSort = useFeedbackUiStore((state) => state.setSort)
  const resetFilters = useFeedbackUiStore((state) => state.resetFilters)
  const openFeedbackId = useFeedbackUiStore((state) => state.openFeedbackId)
  const openFeedback = useFeedbackUiStore((state) => state.open)
  const closeFeedback = useFeedbackUiStore((state) => state.close)
  const detailView = useFeedbackDetailView(openFeedbackId)

  useEffect(() => resetFilters, [resetFilters])

  return (
    <div className="mx-auto flex w-full max-w-content flex-col gap-6">
      <PageHeader
        eyebrow="My Club"
        title="Feedback"
        subtitle="Feedback coaches have given you, by event."
      />

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
        <StatCard label="Total" value={String(view.stats.total)} meta="All received" />
        <StatCard
          label="Avg Rating"
          value={view.stats.avgRatingLabel}
          meta={view.stats.total === 0 ? 'No feedback' : `${view.stats.total} rated`}
        />
        <StatCard label="Latest" value={view.stats.latestLabel} meta="Newest" />
      </div>

      {isLoading ? (
        <FeedbackTableSkeleton />
      ) : error ? (
        <p className="border bg-card px-5 py-4 text-body-sm text-destructive">
          {error.message}
        </p>
      ) : view.totalRows === 0 ? (
        <p className="border bg-card px-5 py-4 text-body-sm text-text-secondary">
          No feedback is listed yet.
        </p>
      ) : (
        <>
          <TableToolbar
            searchValue={filters.search}
            onSearchChange={setSearch}
            searchLabel="Search feedback"
            searchPlaceholder="Member, coach, or event"
          >
            <Select value={filters.rating} onValueChange={setRating}>
              <SelectTrigger aria-label="Filter feedback by rating bucket">
                <SelectValue placeholder="Rating" />
              </SelectTrigger>
              <SelectContent>
                {ratingOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={filters.eventId} onValueChange={setEventId}>
              <SelectTrigger aria-label="Filter feedback by event">
                <SelectValue placeholder="Event" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All events</SelectItem>
                {view.eventOptions.map((event) => (
                  <SelectItem key={event.value} value={event.value}>
                    {event.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={filters.coachId} onValueChange={setCoachId}>
              <SelectTrigger aria-label="Filter feedback by coach">
                <SelectValue placeholder="Coach" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All coaches</SelectItem>
                {view.coachOptions.map((coach) => (
                  <SelectItem key={coach.value} value={coach.value}>
                    {coach.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={filters.sort} onValueChange={setSort}>
              <SelectTrigger aria-label="Sort feedback">
                <SelectValue placeholder="Sort" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="date-desc">Newest first</SelectItem>
                <SelectItem value="date-asc">Oldest first</SelectItem>
                <SelectItem value="event-asc">Event A-Z</SelectItem>
                <SelectItem value="event-desc">Event Z-A</SelectItem>
                <SelectItem value="rating-desc">Rating high-low</SelectItem>
                <SelectItem value="rating-asc">Rating low-high</SelectItem>
              </SelectContent>
            </Select>

            <DateRangeFilter
              fromDate={filters.fromDate}
              toDate={filters.toDate}
              onChange={setDateRange}
              ariaLabel="Filter feedback by date range"
            />
          </TableToolbar>

          {view.rows.length === 0 ? (
            <p className="border bg-card px-5 py-4 text-body-sm text-text-secondary">
              No feedback matches the current filters.
            </p>
          ) : (
            <DataTable>
              <thead>
                <tr>
                  <THead>Date</THead>
                  <THead>Event</THead>
                  <THead>Trainee</THead>
                  <THead>From</THead>
                  <THead>Rating</THead>
                  <THead className="text-right" />
                </tr>
              </thead>
              <tbody>
                {view.rows.map((feedback) => (
                  <TRow key={feedback.id}>
                    <TCell className="whitespace-nowrap text-text-secondary">
                      {formatDateShort(feedback.createdAt)}
                    </TCell>
                    <TCell className="font-medium">{feedback.eventName}</TCell>
                    <TCell>{feedback.memberName}</TCell>
                    <TCell>{feedback.creatorName}</TCell>
                    <TCell>
                      <Badge size="sm">{feedback.rating}/10</Badge>
                    </TCell>
                    <TCell className="text-right">
                      <Button
                        variant="link"
                        className="h-auto p-0"
                        onClick={() => openFeedback(feedback.id)}
                      >
                        View
                      </Button>
                    </TCell>
                  </TRow>
                ))}
              </tbody>
            </DataTable>
          )}
        </>
      )}

      <p className="text-caption italic text-text-tertiary">
        The feedback text is not in the list response - open an entry to read it.
      </p>

      <Sheet open={openFeedbackId !== null} onOpenChange={(open) => !open && closeFeedback()}>
        <SheetContent className="w-full gap-0 sm:max-w-md">
          <FeedbackDetailSheet detailView={detailView} />
        </SheetContent>
      </Sheet>
    </div>
  )
}

function FeedbackDetailSheet({
  detailView,
}: {
  detailView: ReturnType<typeof useFeedbackDetailView>
}) {
  const { detail, eventName, memberName, creatorName, isLoading, error } = detailView

  if (isLoading) {
    return (
      <div className="space-y-6 p-8">
        <Skeleton className="h-6 w-36" />
        <Skeleton className="h-10 w-3/4" />
        <Skeleton className="h-20 w-full" />
        <Skeleton className="h-28 w-full" />
      </div>
    )
  }

  if (error) {
    return (
      <p className="m-8 border bg-card px-4 py-3 text-body-sm text-destructive">
        {error.message}
      </p>
    )
  }

  if (!detail) {
    return (
      <p className="m-8 border bg-card px-4 py-3 text-body-sm text-text-secondary">
        Select feedback to view details.
      </p>
    )
  }

  return (
    <>
      <SheetHeader>
        <p className="text-caption font-semibold uppercase tracking-[0.2em] text-text-tertiary">
          Feedback detail
        </p>
        <SheetTitle className="font-display text-h2 uppercase tracking-wide">
          {eventName ?? 'Event'}
        </SheetTitle>
      </SheetHeader>

      <div className="space-y-4 px-4 py-2">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Field label="From" value={creatorName ?? '--'} />
          <Field label="Date" value={formatDate(detail.created_at)} />
          <Field label="Rating" value={`${detail.rating}/10`} />
        </div>

        <Separator />

        <p className="text-body-sm leading-relaxed text-text-secondary">
          {detail.feedback}
        </p>

        <Badge>About: {memberName ?? '--'}</Badge>
      </div>
    </>
  )
}

function FeedbackTableSkeleton() {
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

function FieldLabel({ children }: { children: React.ReactNode }) {
  return (
    <p className="text-caption uppercase tracking-[0.1em] text-text-tertiary">{children}</p>
  )
}

function Field({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <FieldLabel>{label}</FieldLabel>
      <p className="mt-0.5 text-body-sm">{value}</p>
    </div>
  )
}
