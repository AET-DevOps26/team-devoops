import { ArrowRight } from 'lucide-react'
import { Link } from 'react-router-dom'

import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { BarList, DonutChart } from '@/components/ui/chart-primitives'
import { Button } from '@/components/ui/button'
import { PageHeader } from '@/components/ui/page-header'
import { Skeleton } from '@/components/ui/skeleton'
import { StatCard } from '@/components/ui/stat-card'
import {
  type DashboardDirectorSportSection,
  type DashboardFeedbackItem,
  type DashboardAdminOrganizationSection,
  type DashboardSectionState,
  useDashboardViewModel,
} from './model/useDashboardViewModel'

const SPORT_CHART_COLORS = [
  'var(--primary)',
  'var(--chart-2)',
  'var(--chart-3)',
  'var(--chart-4)',
  'var(--chart-5)',
] as const

const ROLE_CHART_COLORS = ['var(--primary)', 'var(--text-secondary)'] as const

const plural = (count: number, singular: string, pluralLabel = `${singular}s`) =>
  count === 1 ? singular : pluralLabel

const initials = (name: string) =>
  name
    .split(' ')
    .map((part) => part[0])
    .join('')
    .slice(0, 2)
    .toUpperCase()

export function DashboardPage() {
  const { view, states } = useDashboardViewModel()
  const showBalanceCard = Boolean(view.myBalance || states.myBalance?.isLoading)
  const showTeamCard = Boolean(view.myTeam || states.myTeam?.isLoading)
  const showSportCards = Boolean(view.mySport || states.mySport?.isLoading)
  const showEventsCards = Boolean(view.myEvents || states.myEvents?.isLoading)
  const showFeedbackStat = Boolean(view.myFeedback || states.myFeedback?.isLoading)

  return (
    <div className="mx-auto flex w-full max-w-content flex-col gap-6">
      <PageHeader
        eyebrow="Welcome back"
        title={view.userName}
        subtitle="Here's what's happening across your club."
      />

      {view.adminCounts && (
        <>
          <AdminCountsSection counts={view.adminCounts} state={states.adminCounts} />
          <AdminOrganizationSummary
            organization={view.adminOrganization}
            state={states.adminOrganization}
          />
        </>
      )}

      {showSportCards && <DirectorSportCards sport={view.mySport} state={states.mySport} />}

      {(showBalanceCard || showTeamCard || showEventsCards || showFeedbackStat) && (
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">
          {showBalanceCard && <BalanceCard balance={view.myBalance} state={states.myBalance} />}
          {showTeamCard && <TeamCard team={view.myTeam} state={states.myTeam} />}
          {showEventsCards && <EventsCards events={view.myEvents} state={states.myEvents} />}
          {showFeedbackStat && (
            <FeedbackStat feedback={view.myFeedback} state={states.myFeedback} />
          )}
        </div>
      )}

      {view.mySport && <DirectorTeamsSection sport={view.mySport} state={states.mySport} />}
      {view.myEvents && <EventsSection events={view.myEvents} state={states.myEvents} />}
      {view.myFeedback && (
        <FeedbackSection feedback={view.myFeedback.items} state={states.myFeedback} />
      )}
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
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">
        {['members', 'sports', 'teams', 'directors', 'coaches', 'balance', 'events'].map((key) => (
          <Skeleton key={key} className="h-32 border" />
        ))}
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">
      <StatCard label="Total Members" value={String(counts.totalMembers)} meta="All members" />
      <StatCard
        label="Total Sports"
        value={String(counts.totalSports)}
        meta="Active disciplines"
      />
      <StatCard label="Total Teams" value={String(counts.totalTeams)} meta="Across all sports" />
      <StatCard label="Directors" value={String(counts.directors)} meta="Across all sports" />
      <StatCard label="Coaches" value={String(counts.trainers)} meta="Across all teams" />
      <StatCard
        label="Club Balance"
        value={counts.totalBalanceFormatted}
        meta="All member balances"
      />
      <StatCard
        label="Events This Week"
        value={String(counts.eventsThisWeek)}
        meta="Scheduled this week"
      />
    </div>
  )
}

function AdminOrganizationSummary({
  organization,
  state,
}: {
  organization?: DashboardAdminOrganizationSection
  state?: DashboardSectionState
}) {
  return (
    <section className="border bg-card">
      <SectionHeader title="Organization Summary" to="/organization" />
      {sectionBody(
        state,
        !organization || organization.sportDistribution.length === 0,
        'No organization insights are available yet.',
        organization && (
          <div className="grid gap-5 p-4 sm:p-5 lg:grid-cols-[minmax(0,1.6fr)_minmax(16rem,0.9fr)] lg:gap-6">
            <div className="min-w-0 space-y-4">
              <div>
                <p className="text-body-sm font-semibold text-text-primary">Members by sport</p>
                <p className="text-caption text-text-tertiary">Members across teams</p>
              </div>
              <SportDistributionChart organization={organization} />
              {organization.hiddenSports > 0 && (
                <p className="text-caption text-text-tertiary">
                  +{organization.hiddenSports} more sports in the organization view
                </p>
              )}
            </div>
            <div className="space-y-5 lg:border-l lg:pl-6">
              <RoleAssignmentChart organization={organization} />
              <div className="grid grid-cols-2 gap-4 border-t pt-4">
                <div>
                  <p className="text-caption uppercase tracking-[0.12em] text-text-tertiary">
                    Average team size
                  </p>
                  <p className="mt-2 text-h2 font-semibold leading-none text-text-primary">
                    {organization.averageMembersPerTeam.toFixed(1)}
                  </p>
                  <p className="mt-2 text-caption text-text-tertiary">members per team</p>
                </div>
                <div>
                  <p className="text-caption uppercase tracking-[0.12em] text-text-tertiary">
                    Avg teams per sport
                  </p>
                  <p className="mt-2 text-h2 font-semibold leading-none text-text-primary">
                    {organization.averageTeamsPerSport.toFixed(1)}
                  </p>
                  <p className="mt-2 text-caption text-text-tertiary">teams per sport</p>
                </div>
                {organization.busiestSport && (
                  <div className="col-span-2">
                    <p className="text-caption uppercase tracking-[0.12em] text-text-tertiary">
                      Busiest sport
                    </p>
                    <p className="mt-2 text-h3 font-semibold leading-none text-text-primary">
                      {organization.busiestSport.sportName}
                    </p>
                    <p className="mt-2 text-caption text-text-tertiary">
                      {organization.busiestSport.memberCount}{' '}
                      {plural(organization.busiestSport.memberCount, 'member')}
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        ),
      )}
    </section>
  )
}

function SportDistributionChart({
  organization,
}: {
  organization: DashboardAdminOrganizationSection
}) {
  const chartItems = organization.sportDistribution.map((item, index) => ({
    id: item.id,
    label: item.sportName,
    value: item.memberCount,
    percentage: item.memberSharePercentage,
    description: `${item.teamCount} ${plural(item.teamCount, 'team')} - ${item.trainerCount} ${plural(
      item.trainerCount,
      'coach',
      'coaches',
    )} - ${item.membersPerTeam.toFixed(1)} members/team`,
    tooltip: `${item.sportName}: ${item.memberCount} ${plural(
      item.memberCount,
      'member',
    )}, ${item.memberSharePercentage}% of sport members, ${item.teamCount} ${plural(
      item.teamCount,
      'team',
    )}, ${item.trainerCount} ${plural(item.trainerCount, 'coach', 'coaches')}`,
    color: SPORT_CHART_COLORS[index % SPORT_CHART_COLORS.length],
  }))
  const chartDescription = chartItems
    .map((item) => `${item.label}: ${item.value} members, ${item.percentage}%`)
    .join('; ')

  return (
    <BarList
      items={chartItems}
      maxValue={organization.totalDistributedMembers}
      valueLabel="members"
      ariaLabel={`Members by sport. ${chartDescription}.`}
    />
  )
}

function RoleAssignmentChart({
  organization,
}: {
  organization: DashboardAdminOrganizationSection
}) {
  const [directors, coaches] = organization.roleAssignments
  const segments = organization.roleAssignments.map((item, index) => ({
    id: item.label.toLocaleLowerCase(),
    label: item.label,
    value: item.value,
    percentage: item.percentage,
    color: ROLE_CHART_COLORS[index % ROLE_CHART_COLORS.length],
  }))

  return (
    <div className="space-y-4">
      <div>
        <p className="text-body-sm font-semibold text-text-primary">Role assignments</p>
        <p className="text-caption text-text-tertiary">
          Directors and coaches as operational role records
        </p>
      </div>
      <div className="flex flex-col items-center gap-4 sm:flex-row sm:items-center">
        <DonutChart
          className="w-36 shrink-0"
          segments={segments}
          centerValue={String(organization.totalRoleAssignments)}
          centerLabel="role records"
          ariaLabel={`Role assignments: ${directors.value} directors (${directors.percentage}%) and ${coaches.value} coaches (${coaches.percentage}%).`}
        />
        <div className="grid w-full grid-cols-2 gap-3 sm:grid-cols-1">
          <RoleAssignmentLegend color={ROLE_CHART_COLORS[0]} item={directors} />
          <RoleAssignmentLegend color={ROLE_CHART_COLORS[1]} item={coaches} />
        </div>
      </div>
    </div>
  )
}

function RoleAssignmentLegend({
  color,
  item,
}: {
  color: string
  item: DashboardAdminOrganizationSection['roleAssignments'][number]
}) {
  return (
    <div className="min-w-0">
      <div className="flex items-center gap-2">
        <span className="size-2 shrink-0" style={{ backgroundColor: color }} aria-hidden="true" />
        <p className="truncate text-caption text-text-tertiary">{item.label}</p>
      </div>
      <p className="mt-1 text-body-sm font-semibold text-text-primary">
        {item.value}
        <span className="ml-1 font-normal text-text-tertiary">({item.percentage}%)</span>
      </p>
    </div>
  )
}

function DirectorSportCards({
  sport,
  state,
}: {
  sport?: DashboardDirectorSportSection
  state?: DashboardSectionState
}) {
  if (state?.isLoading) {
    return (
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">
        {['sport', 'teams', 'members', 'balance'].map((key) => (
          <Skeleton key={key} className="h-32 border" />
        ))}
      </div>
    )
  }
  if (!sport) return null

  return (
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">
      <StatCard label="My Sport" value={sport.sportName} meta="Director scope" />
      <StatCard label="Total Teams" value={String(sport.totalTeams)} meta={sport.sportName} />
      <StatCard
        label="Total Members"
        value={String(sport.totalMembers)}
        meta="Members"
      />
      <StatCard
        label="Sport Balance"
        value={sport.sportBalanceFormatted}
        meta="Current total"
      />
    </div>
  )
}

function TeamCard({
  team,
  state,
}: {
  team?: NonNullable<ReturnType<typeof useDashboardViewModel>['view']['myTeam']>
  state?: DashboardSectionState
}) {
  if (state?.isLoading) return <Skeleton className="h-32 border" />
  if (!team) return null

  return (
    <StatCard
      label="My Team"
      value={team.teamName}
      meta={`${team.totalMembers} members`}
    />
  )
}

function BalanceCard({
  balance,
  state,
}: {
  balance?: NonNullable<ReturnType<typeof useDashboardViewModel>['view']['myBalance']>
  state?: DashboardSectionState
}) {
  if (state?.isLoading) return <Skeleton className="h-32 border" />
  if (!balance) return null

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
  events?: NonNullable<ReturnType<typeof useDashboardViewModel>['view']['myEvents']>
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
  if (!events) return null

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
  feedback?: NonNullable<ReturnType<typeof useDashboardViewModel>['view']['myFeedback']>
  state?: DashboardSectionState
}) {
  if (state?.isLoading) return <Skeleton className="h-32 border" />
  if (!feedback) return null

  return (
    <StatCard
      label="Recent Feedback"
      value={String(feedback.total)}
      tone={feedback.total > 0 ? 'positive' : 'default'}
      meta="Entries in scope"
    />
  )
}

function DirectorTeamsSection({
  sport,
  state,
}: {
  sport: DashboardDirectorSportSection
  state?: DashboardSectionState
}) {
  return (
    <section className="border bg-card">
      <SectionHeader title="Team Breakdown" to="/organization" />
      {sectionBody(state, sport.teams.length === 0, 'No teams are listed for this sport yet.', (
        <div className="overflow-x-auto">
          <table className="w-full min-w-[34rem] text-left">
            <thead className="border-b bg-surface-sunken/40">
              <tr>
                <th
                  scope="col"
                  className="px-4 py-3 text-caption font-semibold uppercase tracking-[0.12em] text-text-tertiary sm:px-5"
                >
                  Team
                </th>
                <th
                  scope="col"
                  className="px-4 py-3 text-caption font-semibold uppercase tracking-[0.12em] text-text-tertiary sm:px-5"
                >
                  Members
                </th>
                <th
                  scope="col"
                  className="px-4 py-3 text-caption font-semibold uppercase tracking-[0.12em] text-text-tertiary sm:px-5"
                >
                  Balance
                </th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {sport.teams.map((team) => (
                <tr key={team.id}>
                  <td className="px-4 py-3 text-body-sm font-medium text-text-primary sm:px-5">
                    {team.name}
                  </td>
                  <td className="whitespace-nowrap px-4 py-3 text-body-sm text-text-secondary sm:px-5">
                    {team.memberCount} members
                  </td>
                  <td className="whitespace-nowrap px-4 py-3 text-body-sm font-medium text-text-primary sm:px-5">
                    {team.balanceFormatted}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {sport.hiddenTeams > 0 && (
            <div className="border-t px-4 py-3 text-caption text-text-tertiary sm:px-5">
              Showing {sport.teams.length} of {sport.totalTeams} teams
            </div>
          )}
        </div>
      ))}
    </section>
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
