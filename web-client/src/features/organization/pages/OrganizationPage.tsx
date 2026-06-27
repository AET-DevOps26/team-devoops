import { useState } from 'react'
import { ChevronRight } from 'lucide-react'

import { Badge } from '@/components/ui/badge'
import { PageHeader } from '@/components/ui/page-header'
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
import { memberRefName } from '@/types'
import {
  type SportTeamsView,
  type TeamView,
  useTeamsViewModel,
} from '../model/useTeamsViewModel'

const nameList = (refs: Parameters<typeof memberRefName>[0][]) =>
  refs.map(memberRefName).join(', ') || '--'

export function OrganizationPage() {
  const { view, currentUserId, isLoading, error } = useTeamsViewModel()
  const [openSport, setOpenSport] = useState<string | null>(null)
  const [rosterTeamId, setRosterTeamId] = useState<string | null>(null)
  const activeOpenSport = openSport ?? view.sports[0]?.name ?? ''
  const rosterTeam = findRosterTeam(view.sports, rosterTeamId)

  return (
    <div className="mx-auto flex w-full max-w-content flex-col gap-5">
      <PageHeader
        eyebrow="My Club"
        title="Teams"
        subtitle="The sports your club runs and the teams within them."
      />

      {error && (
        <div className="border border-destructive/30 bg-destructive/10 px-4 py-3 text-body-sm text-destructive">
          Teams could not be loaded. Please try again later.
        </div>
      )}

      <StatsRow view={view} isLoading={isLoading} />

      {isLoading ? (
        <LoadingState />
      ) : view.sports.length === 0 ? (
        <EmptyState />
      ) : (
        <>
          {view.myTeams.length > 0 && (
            <section className="space-y-2.5">
              <h2 className="text-caption font-semibold uppercase tracking-[0.12em] text-text-tertiary">
                My Teams
              </h2>
              <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                {view.myTeams.map((team) => (
                  <TeamSummaryCard
                    key={team.id}
                    team={team}
                    sportName={team.sportName}
                    isMine
                    onOpen={() => setRosterTeamId(team.id)}
                  />
                ))}
              </div>
            </section>
          )}

          <section className="space-y-2.5">
            <h2 className="text-caption font-semibold uppercase tracking-[0.12em] text-text-tertiary">
              Sports
            </h2>
            <div className="border bg-card">
              {view.sports.map((sport, index) => {
                const expanded = activeOpenSport === sport.name

                return (
                  <SportSection
                    key={sport.name}
                    sport={sport}
                    currentUserId={currentUserId}
                    expanded={expanded}
                    withTopBorder={index > 0}
                    onToggle={() => setOpenSport(expanded ? '' : sport.name)}
                    onOpenTeam={setRosterTeamId}
                  />
                )
              })}
            </div>
          </section>
        </>
      )}

      <Sheet open={rosterTeamId !== null} onOpenChange={(open) => !open && setRosterTeamId(null)}>
        <SheetContent className="w-full gap-0 sm:max-w-md">
          {rosterTeam && <RosterSheet team={rosterTeam} currentUserId={currentUserId} />}
        </SheetContent>
      </Sheet>
    </div>
  )
}

function StatsRow({
  view,
  isLoading,
}: {
  view: ReturnType<typeof useTeamsViewModel>['view']
  isLoading: boolean
}) {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">
        {['my-teams', 'sports', 'teams', 'my-sports'].map((key) => (
          <Skeleton key={key} className="h-32 border" />
        ))}
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">
      <StatCard
        label="My Teams"
        value={String(view.stats.myTeams)}
        tone={view.stats.myTeams > 0 ? 'positive' : 'default'}
        meta="You're a member"
      />
      <StatCard label="Sports" value={String(view.stats.sports)} meta="Offered by the club" />
      <StatCard label="Teams Total" value={String(view.stats.teams)} meta="Across all sports" />
      <StatCard label="My Sports" value={String(view.stats.mySports)} meta="From my teams" />
    </div>
  )
}

function findRosterTeam(sports: SportTeamsView[], teamId: string | null) {
  if (!teamId) return null

  for (const sport of sports) {
    const team = sport.teams.find((candidate) => candidate.id === teamId)
    if (team) return { ...team, sportName: sport.name }
  }

  return null
}

function SportSection({
  sport,
  currentUserId,
  expanded,
  withTopBorder,
  onToggle,
  onOpenTeam,
}: {
  sport: SportTeamsView
  currentUserId: string
  expanded: boolean
  withTopBorder: boolean
  onToggle: () => void
  onOpenTeam: (id: string) => void
}) {
  return (
    <div className={withTopBorder ? 'border-t' : ''}>
      <button
        type="button"
        onClick={onToggle}
        className="flex w-full items-center gap-3 px-4 py-3 text-left transition-colors hover:bg-surface-sunken"
      >
        <ChevronRight
          className={`size-4 shrink-0 text-text-tertiary transition-transform ${
            expanded ? 'rotate-90' : ''
          }`}
        />
        <div className="min-w-0 flex-1">
          <p className="text-body-sm font-medium text-text-primary">{sport.name}</p>
          <p className="truncate text-caption text-text-tertiary">{sport.description}</p>
          <p className="truncate text-caption text-text-tertiary">
            Directors {nameList(sport.directors)}
          </p>
        </div>
        <Badge tone="accent" size="sm">
          {sport.teams.length} teams
        </Badge>
      </button>

      {expanded && (
        <ul className="border-t bg-surface-sunken/40">
          {sport.teams.length === 0 ? (
            <li className="py-3 pl-11 pr-4 text-body-sm text-text-tertiary">
              No teams in this sport yet.
            </li>
          ) : (
            sport.teams.map((team) => (
              <li key={team.id} className="border-b last:border-b-0">
                <button
                  type="button"
                  onClick={() => onOpenTeam(team.id)}
                  className="flex w-full items-center gap-3 py-2.5 pl-11 pr-4 text-left transition-colors hover:bg-surface-sunken"
                >
                  <div className="min-w-0 flex-1">
                    <p className="text-body-sm font-medium text-text-primary">{team.name}</p>
                    <p className="truncate text-caption text-text-tertiary">
                      Coach {nameList(team.trainers)} - {team.trainees.length} members
                    </p>
                  </div>
                  {team.trainees.some((member) => member.id === currentUserId) && (
                    <Badge tone="positive" size="sm">
                      Trainee
                    </Badge>
                  )}
                </button>
              </li>
            ))
          )}
        </ul>
      )}
    </div>
  )
}

function TeamSummaryCard({
  team,
  sportName,
  isMine,
  onOpen,
}: {
  team: TeamView
  sportName: string
  isMine: boolean
  onOpen: () => void
}) {
  return (
    <button
      type="button"
      onClick={onOpen}
      className="border border-primary/30 bg-primary/4 p-4 text-left transition-colors hover:bg-primary/8"
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="text-caption uppercase tracking-[0.1em] text-primary">{sportName}</p>
          <h3 className="mt-0.5 truncate text-h4">{team.name}</h3>
        </div>
        {isMine && (
          <Badge tone="positive" size="sm">
            Trainee
          </Badge>
        )}
      </div>
      <p className="mt-2 text-caption text-text-tertiary">
        Coach {nameList(team.trainers)} - {team.trainees.length} members
      </p>
    </button>
  )
}

function RosterSheet({
  team,
  currentUserId,
}: {
  team: TeamView & { sportName: string }
  currentUserId: string
}) {
  return (
    <>
      <SheetHeader>
        <p className="text-caption font-semibold uppercase tracking-[0.2em] text-text-tertiary">
          {team.sportName} team
        </p>
        <SheetTitle className="font-display text-h2 uppercase tracking-wide">
          {team.name}
        </SheetTitle>
        <SheetDescription>{team.description}</SheetDescription>
      </SheetHeader>

      <div className="space-y-6 px-4 py-2">
        <div>
          <FieldLabel>Address</FieldLabel>
          <p className="mt-0.5 text-body-sm">{team.address}</p>
        </div>

        <div>
          <FieldLabel>Coaches ({team.trainers.length})</FieldLabel>
          <MemberBadges members={team.trainers} tone="accent" emptyText="No coaches assigned." />
        </div>

        <Separator />

        <div>
          <FieldLabel>Roster ({team.trainees.length})</FieldLabel>
          <MemberBadges members={team.trainees} currentUserId={currentUserId} />
        </div>
      </div>
    </>
  )
}

function MemberBadges({
  members,
  currentUserId,
  tone = 'default',
  emptyText = 'No members yet.',
}: {
  members: Parameters<typeof memberRefName>[0][]
  currentUserId?: string
  tone?: React.ComponentProps<typeof Badge>['tone']
  emptyText?: string
}) {
  if (members.length === 0) {
    return <p className="mt-2 text-body-sm text-text-tertiary">{emptyText}</p>
  }

  return (
    <div className="mt-2 flex flex-wrap gap-1.5">
      {members.map((member) => {
        const isCurrentUser = member.id === currentUserId

        return (
          <Badge key={member.id} tone={isCurrentUser ? 'positive' : tone} size="sm">
            {isCurrentUser ? `${memberRefName(member)} (you)` : memberRefName(member)}
          </Badge>
        )
      })}
    </div>
  )
}

function LoadingState() {
  return (
    <div className="space-y-3">
      <Skeleton className="h-6 w-24" />
      <div className="border bg-card">
        <Skeleton className="h-16 border-b" />
        <Skeleton className="h-16 border-b" />
        <Skeleton className="h-16" />
      </div>
    </div>
  )
}

function EmptyState() {
  return (
    <div className="border bg-card px-4 py-8 text-center">
      <p className="text-body-sm font-medium text-text-primary">No sports yet.</p>
      <p className="mt-1 text-caption text-text-tertiary">
        Sports and teams will appear here after they are created.
      </p>
    </div>
  )
}

function FieldLabel({ children }: { children: React.ReactNode }) {
  return (
    <p className="text-caption uppercase tracking-[0.1em] text-text-tertiary">{children}</p>
  )
}
