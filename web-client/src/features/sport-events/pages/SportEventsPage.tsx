import { useEffect } from 'react'
import { CalendarPlus, Eye, Pencil, Trash2 } from 'lucide-react'
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
import { PageHeader } from '@/components/ui/page-header'
import { PendingButtonContent } from '@/components/ui/pending-button'
import { RowActionButton, RowActions } from '@/components/ui/row-action-button'
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
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet'
import { ErrorNotice } from '@/components/ui/ErrorNotice'
import { Skeleton } from '@/components/ui/skeleton'
import { StatCard } from '@/components/ui/stat-card'
import { TableToolbar } from '@/components/ui/table-toolbar'
import { useAuth } from '@/features/auth'
import { formatDateShort, formatTime } from '@/lib/format'
import { notifyMutationError } from '@/lib/mutation-feedback'
import { serverErrorMessage } from '@/lib/server-error'
import { mutationFeedbackCopy } from '@/lib/mutation-feedback-copy'
import { creatorName, memberRefName } from '@/types'
import { useDeleteSportEvent } from '../api/queries'
import { SportEventEditorDialog } from '../components/SportEventEditorDialog'
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
  const { user } = useAuth()
  const { view, isLoading, error, refetch } = useEventsViewModel()
  const filters = useEventsUiStore((state) => state.filters)
  const setSearch = useEventsUiStore((state) => state.setSearch)
  const setStatus = useEventsUiStore((state) => state.setStatus)
  const setSport = useEventsUiStore((state) => state.setSport)
  const setDateRange = useEventsUiStore((state) => state.setDateRange)
  const setSort = useEventsUiStore((state) => state.setSort)
  const resetFilters = useEventsUiStore((state) => state.resetFilters)
  const openEventId = useEventsUiStore((state) => state.openEventId)
  const openEvent = useEventsUiStore((state) => state.open)
  const closeEvent = useEventsUiStore((state) => state.close)
  const openCreate = useEventsUiStore((state) => state.openCreate)
  const openEdit = useEventsUiStore((state) => state.openEdit)
  const deleteTargetId = useEventsUiStore((state) => state.deleteTargetId)
  const openDeleteConfirm = useEventsUiStore((state) => state.openDeleteConfirm)
  const closeDeleteConfirm = useEventsUiStore((state) => state.closeDeleteConfirm)
  const detailView = useEventDetailView(openEventId)
  const deleteEvent = useDeleteSportEvent()
  const canCreateEvent = user.role === 'trainer' || user.role === 'director' || user.role === 'admin'
  const showAttendanceStatusFilters = user.role === 'member'
  const deleteTargetName =
    view.rows.find((event) => event.id === deleteTargetId)?.name ??
    (detailView.detail?.id === deleteTargetId ? detailView.detail.name : undefined)

  const confirmDeleteEvent = async () => {
    const targetId = deleteTargetId
    if (!targetId) return

    try {
      await deleteEvent.mutateAsync(targetId)
      toast.success('Event deleted.')
      closeDeleteConfirm()
      if (openEventId === targetId) closeEvent()
    } catch (deleteFailure) {
      notifyMutationError(deleteFailure, mutationFeedbackCopy.event.delete)
    }
  }

  useEffect(() => resetFilters, [resetFilters])

  useEffect(() => {
    if (
      !showAttendanceStatusFilters &&
      (filters.status === 'attended' || filters.status === 'missed')
    ) {
      setStatus('all')
    }
  }, [filters.status, setStatus, showAttendanceStatusFilters])

  return (
    <div className="mx-auto flex w-full max-w-content flex-col gap-6">
      <PageHeader
        eyebrow="My Club"
        title="Events"
        subtitle="Training sessions and matches in your club calendar."
        action={
          canCreateEvent ? (
            <Button onClick={openCreate}>
              <CalendarPlus />
              New event
            </Button>
          ) : undefined
        }
      />

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
        <StatCard label="Upcoming" value={String(view.stats.upcoming)} meta="Scheduled ahead" />
        <StatCard label="This Week" value={String(view.stats.thisWeek)} meta="Next 7 days" />
        <StatCard label="Total Listed" value={String(view.stats.total)} meta="All events" />
      </div>

      {isLoading ? (
        <EventsTableSkeleton />
      ) : error ? (
        <ErrorNotice message={serverErrorMessage(error)} onRetry={refetch} />
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
            searchPlaceholder="Event name or sport"
          >
            <Select value={filters.status} onValueChange={setStatus}>
              <SelectTrigger aria-label="Filter events by status">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All statuses</SelectItem>
                {showAttendanceStatusFilters && (
                  <>
                    <SelectItem value="attended">Attended</SelectItem>
                    <SelectItem value="missed">Missed</SelectItem>
                  </>
                )}
                <SelectItem value="upcoming">Upcoming</SelectItem>
                <SelectItem value="past">Past</SelectItem>
              </SelectContent>
            </Select>

            <Select value={filters.sport} onValueChange={setSport}>
              <SelectTrigger aria-label="Filter events by sport">
                <SelectValue placeholder="Sport" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All sports</SelectItem>
                {view.sportOptions.map((sport) => (
                  <SelectItem key={sport.value} value={sport.value}>
                    {sport.label}
                  </SelectItem>
                ))}
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
                  <THead>Sport</THead>
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
                      <FacetBadges values={event.sportNames} />
                    </TCell>
                    <TCell>
                      <Badge tone={statusTone[event.status]} size="sm">
                        {statusLabel[event.status]}
                      </Badge>
                    </TCell>
                    <TCell className="text-text-secondary">{event.duration}</TCell>
                    <TCell className="text-right">
                      <RowActions>
                        <RowActionButton
                          icon={Eye}
                          label={`View ${event.name}`}
                          onClick={() => openEvent(event.id)}
                        />
                        {user.role === 'admin' && (
                          <>
                            <RowActionButton
                              icon={Pencil}
                              label={`Edit ${event.name}`}
                              onClick={() => openEdit(event.id)}
                            />
                            <RowActionButton
                              icon={Trash2}
                              destructive
                              label={`Delete ${event.name}`}
                              onClick={() => openDeleteConfirm(event.id)}
                            />
                          </>
                        )}
                      </RowActions>
                    </TCell>
                  </TRow>
                ))}
              </tbody>
            </DataTable>
          )}
        </>
      )}

      <p className="text-caption italic text-text-tertiary">
        Description and attendees load when you open an event.
      </p>

      <Sheet open={openEventId !== null} onOpenChange={(open) => !open && closeEvent()}>
        <SheetContent className="w-full gap-0 sm:max-w-md">
          <EventDetailSheet detailView={detailView} />
        </SheetContent>
      </Sheet>

      <AlertDialog
        open={deleteTargetId !== null}
        onOpenChange={(open) => {
          if (!open) closeDeleteConfirm()
        }}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete event</AlertDialogTitle>
            <AlertDialogDescription>
              Delete {deleteTargetName ?? 'this event'} permanently? This cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={deleteEvent.isPending}>Cancel</AlertDialogCancel>
            <AlertDialogAction disabled={deleteEvent.isPending} onClick={confirmDeleteEvent}>
              {deleteEvent.isPending ? (
                <PendingButtonContent pendingLabel="Deleting…" />
              ) : (
                'Delete'
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <SportEventEditorDialog />
    </div>
  )
}

function EventDetailSheet({ detailView }: { detailView: ReturnType<typeof useEventDetailView> }) {
  const { detail, isLoading, error, missed, sportNames, refetch } = detailView
  const { user } = useAuth()
  const openEdit = useEventsUiStore((state) => state.openEdit)
  const openDeleteConfirm = useEventsUiStore((state) => state.openDeleteConfirm)

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
      <div className="m-8">
        <ErrorNotice message={serverErrorMessage(error)} onRetry={refetch} compact />
      </div>
    )
  }

  if (!detail) {
    return (
      <p className="m-8 border bg-card px-4 py-3 text-body-sm text-text-secondary">
        Select an event to view details.
      </p>
    )
  }

  const canManage = user.role === 'admin' || detail.creator?.id === user.id

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

      <div className="roost-scroll flex-1 space-y-6 overflow-y-auto px-4 py-2">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <Field
            label="Start"
            value={`${formatDateShort(detail.start_time)}, ${formatTime(detail.start_time)}`}
          />
          <Field label="End" value={formatTime(detail.end_time)} />
          <Field label="Created by" value={creatorName(detail.creator)} />
        </div>

        <div>
          <FieldLabel>Sports</FieldLabel>
          <div className="mt-2 flex flex-wrap gap-1.5">
            {sportNames.map((sport) => (
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

      {canManage && (
        <SheetFooter className="flex-row justify-end border-t">
          <Button size="sm" variant="outline" onClick={() => openEdit(detail.id)}>
            <Pencil />
            Edit
          </Button>
          <Button
            size="sm"
            variant="destructive"
            onClick={() => openDeleteConfirm(detail.id)}
          >
            <Trash2 />
            Delete
          </Button>
        </SheetFooter>
      )}
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

function FacetBadges({ values }: { values: string[] }) {
  if (values.length === 0) {
    return <span className="text-text-tertiary">—</span>
  }

  return (
    <div className="flex flex-wrap gap-1.5">
      {values.map((value) => (
        <Badge key={value} size="sm">
          {value}
        </Badge>
      ))}
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
