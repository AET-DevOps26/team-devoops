import { useEffect, useState } from 'react'
import { ChevronRight, UserPlus } from 'lucide-react'

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
import { useAuth } from '@/features/auth'
import { formatDate, formatDateShort } from '@/lib/format'
import { serverErrorMessage } from '@/lib/server-error'
import { useDeleteFeedback } from '../api/queries'
import { FeedbackComposeDialog, FeedbackComposeNotice } from '../components/FeedbackComposeDialog'
import { useFeedbackUiStore } from '../model/feedbackUiStore'
import { useFeedbackDetailView, useFeedbackViewModel } from '../model/useFeedbackViewModel'

const ratingOptions = [
  { value: 'all', label: 'All ratings' },
  { value: 'high', label: '7+' },
  { value: 'medium', label: '4-6' },
  { value: 'low', label: '0-3' },
] as const

export function FeedbackPage() {
  const { user } = useAuth()
  const { view, isLoading, error } = useFeedbackViewModel()
  const deleteFeedback = useDeleteFeedback()
  const [deleteError, setDeleteError] = useState<string | null>(null)
  const [deleteTarget, setDeleteTarget] = useState<{ id: string; label: string } | null>(null)
  const [pickerOpen, setPickerOpen] = useState(false)
  const [pickerSport, setPickerSport] = useState('')
  const [pickerTeamId, setPickerTeamId] = useState('')
  const [pickerEventId, setPickerEventId] = useState('')
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
  const openCompose = useFeedbackUiStore((state) => state.openCompose)
  const detailView = useFeedbackDetailView(openFeedbackId)

  const isTrainer = user.role === 'trainer'

  useEffect(() => resetFilters, [resetFilters])

  const canDeleteFeedback = (creatorId: string | null | undefined) =>
    user.role === 'admin' || creatorId === user.id

  const requestDeleteFeedback = (id: string, label: string) => {
    setDeleteError(null)
    setDeleteTarget({ id, label })
  }

  const confirmDeleteFeedback = async () => {
    if (!deleteTarget) return
    const { id } = deleteTarget

    try {
      await deleteFeedback.mutateAsync(id)
      if (openFeedbackId === id) closeFeedback()
      setDeleteTarget(null)
    } catch (deleteError) {
      setDeleteError(serverErrorMessage(deleteError))
      setDeleteTarget(null)
    }
  }

  const openTraineePicker = () => {
    setPickerSport('')
    setPickerTeamId('')
    setPickerEventId('')
    setPickerOpen(true)
  }

  const pickerSports = view.coverage?.sports ?? []
  const pickerTeams = pickerSports.find((sport) => sport.name === pickerSport)?.teams ?? []
  const pickerEvents = pickerTeams.find((team) => team.id === pickerTeamId)?.events ?? []
  const pickerEvent = pickerEvents.find((event) => event.id === pickerEventId)
  const pickerTeamName = pickerTeams.find((team) => team.id === pickerTeamId)?.name

  const composeForMissing = (trainee: { id: string; name: string }) => {
    if (!pickerEvent) return
    setPickerOpen(false)
    openCompose({ id: trainee.id, name: trainee.name, eventId: pickerEvent.id })
  }

  return (
    <div className="mx-auto flex w-full max-w-content flex-col gap-6">
      <PageHeader
        eyebrow="My Club"
        title="Feedback"
        subtitle={
          isTrainer
            ? "Feedback you've given, by event."
            : 'Feedback coaches have given you, by event.'
        }
        action={
          isTrainer && view.coverage ? (
            <Button onClick={openTraineePicker} disabled={view.coverage.totalCount === 0}>
              <UserPlus />
              New feedback
            </Button>
          ) : undefined
        }
      />

      <FeedbackComposeNotice />

      <div
        className={`grid grid-cols-1 gap-3 sm:grid-cols-3 ${isTrainer && view.coverage ? 'lg:grid-cols-4' : ''}`}
      >
        <StatCard
          label="Total"
          value={String(view.stats.total)}
          meta={isTrainer ? 'All given' : 'All received'}
        />
        <StatCard
          label={isTrainer ? 'Avg Rating Given' : 'Avg Rating'}
          value={view.stats.avgRatingLabel}
          meta={
            view.stats.total === 0
              ? 'No feedback'
              : isTrainer
                ? `Across ${view.stats.total} given`
                : `${view.stats.total} rated`
          }
        />
        <StatCard label="Latest" value={view.stats.latestLabel} meta="Newest" />
        {isTrainer && view.coverage && (
          <StatCard
            label="Coverage"
            value={`${view.coverage.coveredCount} of ${view.coverage.totalCount}`}
            meta={
              view.coverage.coveredCount === view.coverage.totalCount
                ? 'All event attendances covered'
                : `${view.coverage.totalCount - view.coverage.coveredCount} attendance(s) still need feedback`
            }
            tone={view.coverage.coveredCount === view.coverage.totalCount ? 'positive' : 'default'}
          />
        )}
      </div>

      {deleteError && (
        <p className="border border-destructive/30 bg-destructive/10 px-4 py-3 text-body-sm text-destructive">
          {deleteError}
        </p>
      )}

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

            {!isTrainer && (
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
            )}

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
                  {!isTrainer && <THead>From</THead>}
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
                    {!isTrainer && <TCell>{feedback.creatorName}</TCell>}
                    <TCell>
                      <Badge size="sm">{feedback.rating}/10</Badge>
                    </TCell>
                    <TCell className="text-right">
                      <div className="flex justify-end gap-3">
                        <Button
                          variant="link"
                          className="h-auto p-0"
                          onClick={() => openFeedback(feedback.id)}
                        >
                          View
                        </Button>
                        {canDeleteFeedback(feedback.creatorId) && (
                          <Button
                            variant="link"
                            className="h-auto p-0 text-destructive"
                            disabled={deleteFeedback.isPending}
                            onClick={() => requestDeleteFeedback(feedback.id, feedback.memberName)}
                          >
                            Delete
                          </Button>
                        )}
                      </div>
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
          <FeedbackDetailSheet
            detailView={detailView}
            canDeleteFeedback={canDeleteFeedback}
            isDeleting={deleteFeedback.isPending}
            onDeleteFeedback={requestDeleteFeedback}
          />
        </SheetContent>
      </Sheet>

      <AlertDialog
        open={deleteTarget !== null}
        onOpenChange={(open) => !open && setDeleteTarget(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete feedback</AlertDialogTitle>
            <AlertDialogDescription>
              Delete feedback for {deleteTarget?.label}? This cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={deleteFeedback.isPending}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              disabled={deleteFeedback.isPending}
              onClick={confirmDeleteFeedback}
            >
              {deleteFeedback.isPending ? 'Deleting' : 'Delete'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {isTrainer && (
        <Dialog open={pickerOpen} onOpenChange={setPickerOpen}>
          <DialogContent className="sm:max-w-lg">
            <DialogHeader>
              <DialogTitle>New feedback</DialogTitle>
            </DialogHeader>

            {pickerSports.length === 0 ? (
              <p className="text-body-sm text-text-secondary">
                All your trainees already have feedback for every event.
              </p>
            ) : (
              <div className="space-y-4">
                <PickerBreadcrumb
                  sport={pickerSport}
                  teamName={pickerTeamName}
                  eventName={pickerEvent?.name}
                  onResetToSports={() => {
                    setPickerSport('')
                    setPickerTeamId('')
                    setPickerEventId('')
                  }}
                  onResetToTeams={() => {
                    setPickerTeamId('')
                    setPickerEventId('')
                  }}
                  onResetToEvents={() => setPickerEventId('')}
                />

                {!pickerSport ? (
                  <PickerList
                    items={pickerSports.map((sport) => ({
                      key: sport.name,
                      label: sport.name,
                      meta: `${sport.teams.length} team(s)`,
                    }))}
                    onSelect={(key) => setPickerSport(key)}
                  />
                ) : !pickerTeamId ? (
                  <PickerList
                    items={pickerTeams.map((team) => ({
                      key: team.id,
                      label: team.name,
                      meta: `${team.events.length} event(s) need feedback`,
                    }))}
                    onSelect={(key) => setPickerTeamId(key)}
                  />
                ) : !pickerEvent ? (
                  <PickerList
                    items={pickerEvents.map((event) => ({
                      key: event.id,
                      label: event.name,
                      meta: event.formattedWhen,
                      badge: `${event.missing.length} missing`,
                    }))}
                    onSelect={(key) => setPickerEventId(key)}
                  />
                ) : (
                  <ul className="divide-y border bg-card">
                    {pickerEvent.missing.map((trainee) => (
                      <li
                        key={trainee.id}
                        className="flex items-center justify-between gap-3 px-3 py-2"
                      >
                        <p className="text-body-sm font-medium text-text-primary">
                          {trainee.name}
                        </p>
                        <Button
                          variant="link"
                          className="h-auto p-0"
                          onClick={() => composeForMissing(trainee)}
                        >
                          Give feedback
                        </Button>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            )}

            <DialogFooter>
              <Button variant="outline" onClick={() => setPickerOpen(false)}>
                Close
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}

      <FeedbackComposeDialog />
    </div>
  )
}

function FeedbackDetailSheet({
  detailView,
  canDeleteFeedback,
  isDeleting,
  onDeleteFeedback,
}: {
  detailView: ReturnType<typeof useFeedbackDetailView>
  canDeleteFeedback: (creatorId: string | null | undefined) => boolean
  isDeleting: boolean
  onDeleteFeedback: (id: string, label: string) => void
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

        {canDeleteFeedback(detail.creator?.id) && (
          <Button
            variant="destructive"
            onClick={() => onDeleteFeedback(detail.id, memberName ?? 'this member')}
            disabled={isDeleting}
          >
            Delete Feedback
          </Button>
        )}
      </div>
    </>
  )
}

function PickerBreadcrumb({
  sport,
  teamName,
  eventName,
  onResetToSports,
  onResetToTeams,
  onResetToEvents,
}: {
  sport: string
  teamName: string | undefined
  eventName: string | undefined
  onResetToSports: () => void
  onResetToTeams: () => void
  onResetToEvents: () => void
}) {
  const crumbs: { label: string; onClick?: () => void }[] = [
    { label: 'Sport', onClick: sport ? onResetToSports : undefined },
  ]
  if (sport) crumbs.push({ label: sport, onClick: teamName ? onResetToTeams : undefined })
  if (teamName) crumbs.push({ label: teamName, onClick: eventName ? onResetToEvents : undefined })
  if (eventName) crumbs.push({ label: eventName })

  return (
    <div className="flex flex-wrap items-center gap-1 text-caption text-text-tertiary">
      {crumbs.map((crumb, index) => (
        <span key={`${crumb.label}-${index}`} className="flex items-center gap-1">
          {index > 0 && <ChevronRight className="size-3.5 shrink-0" />}
          {crumb.onClick ? (
            <button
              type="button"
              onClick={crumb.onClick}
              className="text-primary underline-offset-2 hover:underline"
            >
              {crumb.label}
            </button>
          ) : (
            <span className={index === crumbs.length - 1 ? 'font-medium text-text-primary' : ''}>
              {crumb.label}
            </span>
          )}
        </span>
      ))}
    </div>
  )
}

function PickerList({
  items,
  onSelect,
}: {
  items: { key: string; label: string; meta: string; badge?: string }[]
  onSelect: (key: string) => void
}) {
  return (
    <ul className="divide-y border bg-card">
      {items.map((item) => (
        <li key={item.key}>
          <button
            type="button"
            onClick={() => onSelect(item.key)}
            className="flex w-full items-center gap-3 px-3 py-2.5 text-left transition-colors hover:bg-surface-sunken"
          >
            <div className="min-w-0 flex-1">
              <p className="truncate text-body-sm font-medium text-text-primary">{item.label}</p>
              <p className="truncate text-caption text-text-tertiary">{item.meta}</p>
            </div>
            {item.badge && (
              <Badge tone="accent" size="sm" className="shrink-0">
                {item.badge}
              </Badge>
            )}
            <ChevronRight className="size-4 shrink-0 text-text-tertiary" />
          </button>
        </li>
      ))}
    </ul>
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
