import { ArrowRight } from 'lucide-react'
import { Link } from 'react-router-dom'

import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { PageHeader } from '@/components/ui/page-header'
import { Skeleton } from '@/components/ui/skeleton'
import { StatCard } from '@/components/ui/stat-card'
import {
  type DashboardFeedbackItem,
  type DashboardSectionState,
  type DashboardSportSection,
  useDashboardViewModel,
} from './model/useDashboardViewModel'

const initials = (name: string) =>
  name
    .split(' ')
    .map((part) => part[0])
    .join('')
    .slice(0, 2)
    .toUpperCase()

export function DashboardPage() {
  const { view, states } = useDashboardViewModel()

  return (
    <div className="mx-auto flex w-full max-w-content flex-col gap-6">
      <PageHeader
        eyebrow="Welcome back"
        title={view.userName}
        subtitle="Here's what's happening across your club."
      />

      {view.adminCounts && (
        <AdminCountsSection counts={view.adminCounts} state={states.adminCounts} />
      )}

      {(view.myBalance || view.myEvents || view.myFeedback) && (
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">
          {view.myBalance && <BalanceCard balance={view.myBalance} state={states.myBalance} />}
          {view.myEvents && <EventsCards events={view.myEvents} state={states.myEvents} />}
          {view.myFeedback && (
            <FeedbackStat feedback={view.myFeedback} state={states.myFeedback} />
          )}
        </div>
      )}

      {view.myEvents && <EventsSection events={view.myEvents} state={states.myEvents} />}
      {view.myFeedback && (
        <FeedbackSection feedback={view.myFeedback.items} state={states.myFeedback} />
      )}
      {view.sports && <SportsSection sports={view.sports} state={states.sports} />}
    </div>
  )
}

function AdminCountsSection({
  counts,
  state,
}: {
  counts: NonNullable<ReturnType<typeof useDashboardViewModel>['view']['adminCounts']>
  state?: DashboardSectionState
}) {
  if (state?.isLoading) {
    return (
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
        {['teams', 'directors', 'trainers'].map((key) => (
          <Skeleton key={key} className="h-32 border" />
        ))}
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
      <StatCard label="Total Teams" value={String(counts.totalTeams)} meta="Across all sports" />
      <StatCard label="Directors" value={String(counts.directors)} meta="Unique directors" />
      <StatCard label="Trainers" value={String(counts.trainers)} meta="Unique trainers" />
    </div>
  )
}

function BalanceCard({
  balance,
  state,
}: {
  balance: NonNullable<ReturnType<typeof useDashboardViewModel>['view']['myBalance']>
  state?: DashboardSectionState
}) {
  if (state?.isLoading) return <Skeleton className="h-32 border" />

  return (
    <StatCard
      label="My Balance"
      value={balance.balanceFormatted}
      tone={balance.status === 'overdue' ? 'negative' : 'positive'}
      meta={balance.status === 'overdue' ? 'Overdue - pay soon' : 'All clear'}
    />
  )
}

function EventsCards({
  events,
  state,
}: {
  events: NonNullable<ReturnType<typeof useDashboardViewModel>['view']['myEvents']>
  state?: DashboardSectionState
}) {
  if (state?.isLoading) {
    return (
      <>
        <Skeleton className="h-32 border" />
        <Skeleton className="h-32 border" />
      </>
    )
  }

  return (
    <>
      <StatCard
        label="Next Training"
        value={events.nextEvent?.date ?? '--'}
        meta={
          events.nextEvent
            ? `${events.nextEvent.time} - ${events.nextEvent.name}`
            : 'Nothing scheduled'
        }
      />
      <StatCard
        label="Upcoming Events"
        value={String(events.upcomingCount)}
        meta="Scheduled ahead"
      />
    </>
  )
}

function FeedbackStat({
  feedback,
  state,
}: {
  feedback: NonNullable<ReturnType<typeof useDashboardViewModel>['view']['myFeedback']>
  state?: DashboardSectionState
}) {
  if (state?.isLoading) return <Skeleton className="h-32 border" />

  return (
    <StatCard
      label="Recent Feedback"
      value={String(feedback.total)}
      tone={feedback.total > 0 ? 'positive' : 'default'}
      meta="Entries in scope"
    />
  )
}

function EventsSection({
  events,
  state,
}: {
  events: NonNullable<ReturnType<typeof useDashboardViewModel>['view']['myEvents']>
  state?: DashboardSectionState
}) {
  return (
    <section className="border bg-card">
      <SectionHeader title="Upcoming Events" to="/sport-events" />
      {sectionBody(state, events.items.length === 0, 'No upcoming events.', (
        <ul className="divide-y">
          {events.items.map((event) => (
            <li key={event.id}>
              <Link
                to="/sport-events"
                className="flex items-center justify-between gap-4 px-4 py-3 transition-colors hover:bg-surface-sunken sm:px-5"
              >
                <div className="min-w-0">
                  <p className="truncate text-body-sm font-medium text-text-primary">
                    {event.name}
                  </p>
                  <p className="text-caption text-text-tertiary">
                    {event.date} - {event.time}
                  </p>
                </div>
                <ArrowRight className="size-4 shrink-0 text-text-tertiary" />
              </Link>
            </li>
          ))}
        </ul>
      ))}
    </section>
  )
}

function FeedbackSection({
  feedback,
  state,
}: {
  feedback: DashboardFeedbackItem[]
  state?: DashboardSectionState
}) {
  return (
    <section className="border bg-card">
      <SectionHeader title="Recent Feedback" to="/feedback" />
      {sectionBody(state, feedback.length === 0, 'No feedback is listed yet.', (
        <ul className="divide-y">
          {feedback.map((entry) => (
            <li key={entry.id}>
              <Link
                to="/feedback"
                className="flex items-start gap-3 px-4 py-3 transition-colors hover:bg-surface-sunken sm:px-5"
              >
                <Avatar className="mt-0.5 size-9 bg-primary/15 text-primary">
                  <AvatarFallback className="bg-transparent text-caption font-semibold text-primary">
                    {initials(entry.from)}
                  </AvatarFallback>
                </Avatar>
                <div className="min-w-0 flex-1 space-y-1">
                  <p className="truncate text-body-sm font-medium text-text-primary">
                    {entry.from}
                  </p>
                  <p className="text-body-sm leading-relaxed text-text-tertiary">
                    {entry.eventName} - {entry.date}
                  </p>
                  <p className="text-caption text-text-tertiary">About {entry.about}</p>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      ))}
    </section>
  )
}

function SportsSection({
  sports,
  state,
}: {
  sports: DashboardSportSection[]
  state?: DashboardSectionState
}) {
  return (
    <section className="border bg-card">
      <SectionHeader title="Sports" to="/organization" />
      {sectionBody(state, sports.length === 0, 'No sports are listed yet.', (
        <div className="divide-y">
          {sports.map((sport) => (
            <article key={sport.name} className="px-4 py-4 sm:px-5">
              <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                <div className="min-w-0">
                  <h3 className="text-body-sm font-semibold text-text-primary">{sport.name}</h3>
                  <p className="mt-1 text-caption text-text-tertiary">{sport.description}</p>
                  <p className="mt-1 text-caption text-text-tertiary">
                    Directors {sport.directors}
                  </p>
                </div>
                <Badge tone="accent" size="sm">
                  {sport.teams.length} teams
                </Badge>
              </div>
              <div className="mt-3 grid grid-cols-1 gap-2 lg:grid-cols-2">
                {sport.teams.length === 0 ? (
                  <p className="text-body-sm text-text-tertiary">No teams in this sport yet.</p>
                ) : (
                  sport.teams.map((team) => (
                    <div key={team.id} className="border bg-surface-sunken/40 px-3 py-2.5">
                      <p className="truncate text-body-sm font-medium text-text-primary">
                        {team.name}
                      </p>
                      <p className="truncate text-caption text-text-tertiary">
                        Coach {team.trainers} - {team.members} members
                      </p>
                    </div>
                  ))
                )}
              </div>
            </article>
          ))}
        </div>
      ))}
    </section>
  )
}

function SectionHeader({ title, to }: { title: string; to: string }) {
  return (
    <div className="flex flex-col gap-2 border-b px-4 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-5">
      <h2 className="text-caption font-semibold uppercase tracking-[0.12em] text-text-tertiary">
        {title}
      </h2>
      <Button asChild variant="link" className="h-auto p-0 text-caption">
        <Link to={to}>View all</Link>
      </Button>
    </div>
  )
}

function sectionBody(
  state: DashboardSectionState | undefined,
  isEmpty: boolean,
  emptyText: string,
  content: React.ReactNode,
) {
  if (state?.isLoading) {
    return (
      <div className="space-y-3 p-5">
        {Array.from({ length: 3 }).map((_, index) => (
          <Skeleton key={index} className="h-10 w-full" />
        ))}
      </div>
    )
  }

  if (state?.error) {
    return <p className="px-5 py-4 text-body-sm text-destructive">{state.error.message}</p>
  }

  if (isEmpty) {
    return <p className="px-5 py-4 text-body-sm text-text-secondary">{emptyText}</p>
  }

  return content
}
