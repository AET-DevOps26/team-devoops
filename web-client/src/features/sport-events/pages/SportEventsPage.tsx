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
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet'
import { Skeleton } from '@/components/ui/skeleton'
import { StatCard } from '@/components/ui/stat-card'
import { TableToolbar } from '@/components/ui/table-toolbar'
import { formatDateShort, formatTime } from '@/lib/format'
import { memberRefName } from '@/types'
import { useEventsUiStore } from '../model/eventsUiStore'
import {
  type EventStatus,
  useEventDetailView,
  useEventsViewModel,
} from '../model/useEventsViewModel'

const statusLabel: Record<EventStatus, string> = {
  attended: 'Attended',
  missed: 'Missed',
  upcoming: 'Upcoming',
  past: 'Past',
}

const statusTone: Record<EventStatus, React.ComponentProps<typeof Badge>['tone']> = {
  attended: 'positive',
  missed: 'negative',
  upcoming: 'accent',
  past: 'default',
}

export function SportEventsPage() {
  const { view, isLoading, error } = useEventsViewModel()
  const filters = useEventsUiStore((state) => state.filters)
  const setSearch = useEventsUiStore((state) => state.setSearch)
  const setStatus = useEventsUiStore((state) => state.setStatus)
  const setDateRange = useEventsUiStore((state) => state.setDateRange)
  const setSort = useEventsUiStore((state) => state.setSort)
  const resetFilters = useEventsUiStore((state) => state.resetFilters)
  const openEventId = useEventsUiStore((state) => state.openEventId)
  const openEvent = useEventsUiStore((state) => state.open)
  const closeEvent = useEventsUiStore((state) => state.close)
  const detailView = useEventDetailView(openEventId)

  useEffect(() => resetFilters, [resetFilters])

  return (
    <div className="mx-auto flex w-full max-w-content flex-col gap-6">
      <PageHeader
        eyebrow="My Club"
        title="Events"
        subtitle="Training sessions and matches in your club calendar."
      />

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
        <StatCard label="Upcoming" value={String(view.stats.upcoming)} meta="Scheduled ahead" />
        <StatCard label="This Week" value={String(view.stats.thisWeek)} meta="Next 7 days" />
        <StatCard label="Total Listed" value={String(view.stats.total)} meta="All events" />
      </div>

      {isLoading ? (
        <EventsTableSkeleton />
      ) : error ? (
        <p className="border bg-card px-5 py-4 text-body-sm text-destructive">
          {error.message}
        </p>
      ) : view.totalRows === 0 ? (
        <p className="border bg-card px-5 py-4 text-body-sm text-text-secondary">
          No events are listed yet.
        </p>
      ) : (
        <>
          <TableToolbar
            searchValue={filters.search}
            onSearchChange={setSearch}
            searchLabel="Search events"
            searchPlaceholder="Event name"
          >
            <Select value={filters.status} onValueChange={setStatus}>
              <SelectTrigger aria-label="Filter events by status">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All statuses</SelectItem>
                <SelectItem value="attended">Attended</SelectItem>
                <SelectItem value="missed">Missed</SelectItem>
                <SelectItem value="upcoming">Upcoming</SelectItem>
              </SelectContent>
            </Select>

            <Select value={filters.sort} onValueChange={setSort}>
              <SelectTrigger aria-label="Sort events">
                <SelectValue placeholder="Sort" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="date-asc">Date ascending</SelectItem>
                <SelectItem value="date-desc">Date descending</SelectItem>
                <SelectItem value="duration-asc">Duration shortest</SelectItem>
                <SelectItem value="duration-desc">Duration longest</SelectItem>
              </SelectContent>
            </Select>

            <DateRangeFilter
              fromDate={filters.fromDate}
              toDate={filters.toDate}
              onChange={setDateRange}
              ariaLabel="Filter events by date range"
            />
          </TableToolbar>

          {view.rows.length === 0 ? (
            <p className="border bg-card px-5 py-4 text-body-sm text-text-secondary">
              No events match the current filters.
            </p>
          ) : (
            <DataTable>
              <thead>
                <tr>
                  <THead>When</THead>
                  <THead>Event</THead>
                  <THead>Status</THead>
                  <THead>Duration</THead>
                  <THead className="text-right">Details</THead>
                </tr>
              </thead>
              <tbody>
                {view.rows.map((event) => (
                  <TRow key={event.id}>
                    <TCell className="whitespace-nowrap text-text-secondary">
                      {event.formattedWhen}
                    </TCell>
                    <TCell className="font-medium">{event.name}</TCell>
                    <TCell>
                      <Badge tone={statusTone[event.status]} size="sm">
                        {statusLabel[event.status]}
                      </Badge>
                    </TCell>
                    <TCell className="text-text-secondary">{event.duration}</TCell>
                    <TCell className="text-right">
                      <Button variant="link" className="h-auto p-0" onClick={() => openEvent(event.id)}>
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
        Sport, description and attendees load when you open an event.
      </p>

      <Sheet open={openEventId !== null} onOpenChange={(open) => !open && closeEvent()}>
        <SheetContent className="w-full gap-0 sm:max-w-md">
          <EventDetailSheet detailView={detailView} />
        </SheetContent>
      </Sheet>
    </div>
  )
}

function EventDetailSheet({ detailView }: { detailView: ReturnType<typeof useEventDetailView> }) {
  const { detail, isLoading, error, missed } = detailView

  if (isLoading) {
    return (
      <div className="space-y-6 p-8">
        <Skeleton className="h-6 w-28" />
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
        Select an event to view details.
      </p>
    )
  }

  return (
    <>
      <SheetHeader>
        <p className="text-caption font-semibold uppercase tracking-[0.2em] text-text-tertiary">
          Event details
        </p>
        <SheetTitle className="font-display text-h2 uppercase tracking-wide">
          {detail.name}
        </SheetTitle>
        <SheetDescription>{detail.description}</SheetDescription>
      </SheetHeader>

      <div className="space-y-6 px-4 py-2">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <Field
            label="Start"
            value={`${formatDateShort(detail.start_time)}, ${formatTime(detail.start_time)}`}
          />
          <Field label="End" value={formatTime(detail.end_time)} />
          <Field label="Created by" value={memberRefName(detail.creator)} />
        </div>

        <div>
          <FieldLabel>Sports</FieldLabel>
          <div className="mt-2 flex flex-wrap gap-1.5">
            {detail.sports_linked?.map((sport) => (
              <Badge key={sport} tone="accent">
                {sport}
              </Badge>
            ))}
          </div>
        </div>

        <div>
          <FieldLabel>Attendees ({detail.attendees?.length ?? 0})</FieldLabel>
          <div className="mt-2 flex flex-wrap gap-1.5">
            {detail.attendees?.map((member) => (
              <Badge key={member.id}>{memberRefName(member)}</Badge>
            ))}
          </div>
        </div>

        {missed && (
          <>
            <Separator />
            <p className="border bg-muted/40 px-4 py-3 text-body-sm text-text-secondary">
              You missed this session.
            </p>
          </>
        )}
      </div>
    </>
  )
}

function EventsTableSkeleton() {
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
