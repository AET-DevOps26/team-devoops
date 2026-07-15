import { useEffect, useState } from 'react'
import { ChevronRight, Eye, MessageSquarePlus, Pencil, Trash2, UserPlus } from 'lucide-react'
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
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
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
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet'
import { ErrorNotice } from '@/components/ui/ErrorNotice'
import { Skeleton } from '@/components/ui/skeleton'
import { StatCard } from '@/components/ui/stat-card'
import { TableToolbar } from '@/components/ui/table-toolbar'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { useAuth } from '@/features/auth'
import { formatDate, formatDateShort } from '@/lib/format'
import { notifyMutationError } from '@/lib/mutation-feedback'
import { serverErrorMessage } from '@/lib/server-error'
import { mutationFeedbackCopy } from '@/lib/mutation-feedback-copy'
import { useDeleteFeedback } from '../api/queries'
import { FeedbackComposeDialog } from '../components/FeedbackComposeDialog'
import { FeedbackEditDialog } from '../components/FeedbackEditDialog'
import { type FeedbackEditTarget, useFeedbackUiStore } from '../model/feedbackUiStore'
import { canManageFeedback, useFeedbackDetailView, useFeedbackViewModel } from '../model/useFeedbackViewModel'

const ratingOptions = [
  { value: 'all', label: 'All ratings' },
  { value: 'high', label: '7+' },
  { value: 'medium', label: '4-6' },
  { value: 'low', label: '0-3' },
] as const

type PickerMode = 'member' | 'event'

export function FeedbackPage() {
  const { user } = useAuth()
  const isTrainer = user.role === 'trainer'
  const isAdmin = user.role === 'admin'
  const { view, isLoading, error, refetch } = useFeedbackViewModel()
  const deleteFeedback = useDeleteFeedback()
  const [deleteTarget, setDeleteTarget] = useState<{ id: string; label: string } | null>(null)
  const [pickerOpen, setPickerOpen] = useState(false)
  const [pickerMode, setPickerMode] = useState<PickerMode>('member')
  const [pickerMemberSearch, setPickerMemberSearch] = useState('')
  const [pickerSport, setPickerSport] = useState('')
  const [pickerTeamId, setPickerTeamId] = useState('')
  const [pickerEventId, setPickerEventId] = useState('')
  const filters = useFeedbackUiStore((state) => state.filters)
  const setSearch = useFeedbackUiStore((state) => state.setSearch)
  const setRating = useFeedbackUiStore((state) => state.setRating)
  const setSport = useFeedbackUiStore((state) => state.setSport)
  const setCoachId = useFeedbackUiStore((state) => state.setCoachId)
  const setDateRange = useFeedbackUiStore((state) => state.setDateRange)
  const setSort = useFeedbackUiStore((state) => state.setSort)
  const resetFilters = useFeedbackUiStore((state) => state.resetFilters)
  const openFeedbackId = useFeedbackUiStore((state) => state.openFeedbackId)
  const openFeedback = useFeedbackUiStore((state) => state.open)
  const closeFeedback = useFeedbackUiStore((state) => state.close)
  const openCompose = useFeedbackUiStore((state) => state.openCompose)
  const openEdit = useFeedbackUiStore((state) => state.openEdit)
  const detailView = useFeedbackDetailView(openFeedbackId)

  useEffect(() => resetFilters, [resetFilters])

  const canDeleteFeedback = (creatorId: string | null | undefined) =>
    canManageFeedback(user, creatorId)
  const canEditFeedback = canDeleteFeedback

  const requestDeleteFeedback = (id: string, label: string) => {
    setDeleteTarget({ id, label })
  }

  const confirmDeleteFeedback = async () => {
    if (!deleteTarget) return
    const { id } = deleteTarget

    try {
      await deleteFeedback.mutateAsync(id)
      toast.success('Feedback deleted.')
      if (openFeedbackId === id) closeFeedback()
      setDeleteTarget(null)
    } catch (deleteFailure) {
      notifyMutationError(deleteFailure, mutationFeedbackCopy.feedback.delete)
    }
  }

  const openFeedbackPicker = () => {
    setPickerMode('member')
    setPickerMemberSearch('')
    setPickerSport('')
    setPickerTeamId('')
    setPickerEventId('')
    setPickerOpen(true)
  }

  const canCompose = view.composableMembers.length > 0
  const pickerCoverage = isTrainer || isAdmin ? view.coverage : null
  const pickerSports = pickerCoverage?.sports ?? []
  const pickerTeams = pickerSports.find((sport) => sport.name === pickerSport)?.teams ?? []
  const pickerEvents = pickerTeams.find((team) => team.id === pickerTeamId)?.events ?? []
  const pickerEvent = pickerEvents.find((event) => event.id === pickerEventId)
  const pickerTeamName = pickerTeams.find((team) => team.id === pickerTeamId)?.name

  const composeForMissing = (trainee: { id: string; name: string }) => {
    if (!pickerEvent) return
    setPickerOpen(false)
    openCompose({ id: trainee.id, name: trainee.name, eventId: pickerEvent.id })
  }

  // Composition is permission-based, not limited to missing-feedback coverage.
  const composeForMember = (member: { id: string; name: string }) => {
    setPickerOpen(false)
    openCompose({ id: member.id, name: member.name })
  }

  const memberMatches = view.composableMembers.filter((member) =>
    member.name.toLocaleLowerCase().includes(pickerMemberSearch.trim().toLocaleLowerCase()),
  )

  const hasCoverageTree = pickerCoverage !== null && pickerSports.length > 0

  const memberPicker = (
    <div className="space-y-3">
      <Input
        value={pickerMemberSearch}
        onChange={(event) => setPickerMemberSearch(event.target.value)}
        placeholder="Search members"
        aria-label="Search members"
      />
      {memberMatches.length === 0 ? (
        <p className="border bg-card px-4 py-3 text-body-sm text-text-secondary">
          No members match your search.
        </p>
      ) : (
        <ul className="roost-scroll max-h-80 divide-y overflow-y-auto border bg-card">
          {memberMatches.map((member) => (
            <li key={member.id} className="flex items-center justify-between gap-3 px-3 py-2">
              <p className="text-body-sm font-medium text-text-primary">{member.name}</p>
              <RowActions>
                <RowActionButton
                  icon={MessageSquarePlus}
                  label={`Give feedback for ${member.name}`}
                  onClick={() => composeForMember(member)}
                />
              </RowActions>
            </li>
          ))}
        </ul>
      )}
    </div>
  )

  const eventPicker = (
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
            meta: isAdmin
              ? `${team.events.length} event(s)`
              : `${team.events.length} event(s) need feedback`,
          }))}
          onSelect={(key) => setPickerTeamId(key)}
        />
      ) : !pickerEvent ? (
        <PickerList
          items={pickerEvents.map((event) => ({
            key: event.id,
            label: event.name,
            meta: event.formattedWhen,
            badge: isAdmin
              ? `${event.missing.length} attendee(s)`
              : `${event.missing.length} missing`,
          }))}
          onSelect={(key) => setPickerEventId(key)}
        />
      ) : (
        <ul className="divide-y border bg-card">
          {pickerEvent.missing.map((trainee) => (
            <li key={trainee.id} className="flex items-center justify-between gap-3 px-3 py-2">
              <p className="text-body-sm font-medium text-text-primary">{trainee.name}</p>
              <RowActions>
                <RowActionButton
                  icon={MessageSquarePlus}
                  label={`Give feedback for ${trainee.name}`}
                  onClick={() => composeForMissing(trainee)}
                />
              </RowActions>
            </li>
          ))}
        </ul>
      )}
    </div>
  )

  return (
    <div className="mx-auto flex w-full max-w-content flex-col gap-6">
      <PageHeader
        eyebrow="My Club"
        title="Feedback"
        subtitle={
          isTrainer
            ? "Feedback you've given, by event."
            : isAdmin
              ? 'Feedback coaches have given, by event.'
              : 'Feedback coaches have given you, by event.'
        }
        action={
          canCompose ? (
            <Button onClick={openFeedbackPicker}>
              <UserPlus />
              New feedback
            </Button>
          ) : undefined
        }
      />

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

      {isLoading ? (
        <FeedbackTableSkeleton />
      ) : error ? (
        <ErrorNotice message={serverErrorMessage(error)} onRetry={refetch} />
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
            searchPlaceholder="Member, coach, event, or sport"
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

            <Select value={filters.sport} onValueChange={setSport}>
              <SelectTrigger aria-label="Filter feedback by sport">
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
                  <THead>Sport</THead>
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
                    <TCell>
                      {feedback.sportNames.length > 0 ? (
                        <div className="flex flex-wrap gap-1">
                          {feedback.sportNames.map((sportName) => (
                            <Badge key={sportName} tone="accent" size="sm">
                              {sportName}
                            </Badge>
                          ))}
                        </div>
                      ) : (
                        <span className="text-text-tertiary">&mdash;</span>
                      )}
                    </TCell>
                    <TCell>{feedback.memberName}</TCell>
                    {!isTrainer && <TCell>{feedback.creatorName}</TCell>}
                    <TCell>
                      <Badge size="sm">{feedback.rating}/10</Badge>
                    </TCell>
                    <TCell className="text-right">
                      <RowActions>
                        <RowActionButton
                          icon={Eye}
                          label={`View feedback for ${feedback.memberName}`}
                          onClick={() => openFeedback(feedback.id)}
                        />
                        {canEditFeedback(feedback.creatorId) && (
                          <RowActionButton
                            icon={Pencil}
                            label={`Edit feedback for ${feedback.memberName}`}
                            onClick={() => openFeedback(feedback.id)}
                          />
                        )}
                        {canDeleteFeedback(feedback.creatorId) && (
                          <RowActionButton
                            icon={Trash2}
                            label={`Delete feedback for ${feedback.memberName}`}
                            destructive
                            disabled={deleteFeedback.isPending}
                            onClick={() => requestDeleteFeedback(feedback.id, feedback.memberName)}
                          />
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
        The feedback text is not in the list response - open an entry to read it.
      </p>

      <Sheet open={openFeedbackId !== null} onOpenChange={(open) => !open && closeFeedback()}>
        <SheetContent className="w-full gap-0 sm:max-w-md">
          <FeedbackDetailSheet
            detailView={detailView}
            canDeleteFeedback={canDeleteFeedback}
            canEditFeedback={canEditFeedback}
            isDeleting={deleteFeedback.isPending}
            onDeleteFeedback={requestDeleteFeedback}
            onEditFeedback={openEdit}
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
              {deleteFeedback.isPending ? (
                <PendingButtonContent pendingLabel="Deleting…" />
              ) : (
                'Delete'
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {canCompose && (
        <Dialog open={pickerOpen} onOpenChange={setPickerOpen}>
          <DialogContent className="sm:max-w-lg">
            <DialogHeader>
              <DialogTitle>New feedback</DialogTitle>
            </DialogHeader>

            {hasCoverageTree ? (
              <Tabs
                value={pickerMode}
                onValueChange={(value) => setPickerMode(value as PickerMode)}
              >
                <TabsList>
                  <TabsTrigger value="member">By member</TabsTrigger>
                  <TabsTrigger value="event">By event</TabsTrigger>
                </TabsList>

                <TabsContent value="member">{memberPicker}</TabsContent>
                <TabsContent value="event">{eventPicker}</TabsContent>
              </Tabs>
            ) : (
              memberPicker
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
      <FeedbackEditDialog />
    </div>
  )
}

function FeedbackDetailSheet({
  detailView,
  canDeleteFeedback,
  canEditFeedback,
  isDeleting,
  onDeleteFeedback,
  onEditFeedback,
}: {
  detailView: ReturnType<typeof useFeedbackDetailView>
  canDeleteFeedback: (creatorId: string | null | undefined) => boolean
  canEditFeedback: (creatorId: string | null | undefined) => boolean
  isDeleting: boolean
  onDeleteFeedback: (id: string, label: string) => void
  onEditFeedback: (target: FeedbackEditTarget) => void
}) {
  const { detail, eventName, memberName, creatorName, isLoading, error, refetch } = detailView

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
      <div className="m-8">
        <ErrorNotice message={serverErrorMessage(error)} onRetry={refetch} compact />
      </div>
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

      <div className="roost-scroll flex-1 space-y-4 overflow-y-auto px-4 py-2">
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

      {(canEditFeedback(detail.creator?.id) || canDeleteFeedback(detail.creator?.id)) && (
        <SheetFooter className="flex-row justify-end gap-2 border-t">
          {canEditFeedback(detail.creator?.id) && (
            <Button
              size="sm"
              variant="outline"
              onClick={() =>
                onEditFeedback({
                  id: detail.id,
                  memberName: memberName ?? 'this member',
                  eventName: eventName ?? 'this event',
                  feedback: detail.feedback,
                  rating: detail.rating,
                })
              }
            >
              Edit Feedback
            </Button>
          )}
          {canDeleteFeedback(detail.creator?.id) && (
            <Button
              size="sm"
              variant="destructive"
              onClick={() => onDeleteFeedback(detail.id, memberName ?? 'this member')}
              disabled={isDeleting}
            >
              Delete Feedback
            </Button>
          )}
        </SheetFooter>
      )}
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
