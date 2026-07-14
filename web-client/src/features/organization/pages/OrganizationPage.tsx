import { useState } from 'react'
import { ChevronRight, Pencil, Plus, Trash2 } from 'lucide-react'
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
import { ErrorNotice } from '@/components/ui/ErrorNotice'
import { PageHeader } from '@/components/ui/page-header'
import { PendingButtonContent } from '@/components/ui/pending-button'
import { RowActionButton, RowActions } from '@/components/ui/row-action-button'
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
import { notifyMutationError } from '@/lib/mutation-feedback'
import { serverErrorMessage } from '@/lib/server-error'
import { mutationFeedbackCopy } from '@/lib/mutation-feedback-copy'
import { cn } from '@/lib/utils'
import { isTeamCoach, memberRefName } from '@/types'
import { useDeleteSport, useDeleteTeam } from '../api/queries'
import {
  type SportTeamsView,
  type TeamView,
  useTeamsViewModel,
} from '../model/useTeamsViewModel'
import { SportEditorDialog } from '../components/SportEditorDialog'
import { TeamEditorDialog } from '../components/TeamEditorDialog'
import { useOrganizationUiStore } from '../model/organizationUiStore'

const nameList = (refs: Parameters<typeof memberRefName>[0][]) =>
  refs.map(memberRefName).join(', ') || '--'

export function OrganizationPage() {
  const { view, currentUserId, currentUserRole, isLoading, error, refetch } = useTeamsViewModel()
  const openCreateTeam = useOrganizationUiStore((state) => state.openCreateTeam)
  const openEditTeam = useOrganizationUiStore((state) => state.openEditTeam)
  const openCreateSport = useOrganizationUiStore((state) => state.openCreateSport)
  const openEditSport = useOrganizationUiStore((state) => state.openEditSport)
  const openDeleteConfirm = useOrganizationUiStore((state) => state.openDeleteConfirm)
  const closeDeleteConfirm = useOrganizationUiStore((state) => state.closeDeleteConfirm)
  const openDeleteSportConfirm = useOrganizationUiStore((state) => state.openDeleteSportConfirm)
  const closeDeleteSportConfirm = useOrganizationUiStore((state) => state.closeDeleteSportConfirm)
  const deleteTargetId = useOrganizationUiStore((state) => state.deleteTargetId)
  const sportDeleteTargetId = useOrganizationUiStore((state) => state.sportDeleteTargetId)
  const deleteTeam = useDeleteTeam()
  const deleteSport = useDeleteSport()
  const [openSportId, setOpenSportId] = useState<string | null>(null)
  const [rosterTeamId, setRosterTeamId] = useState<string | null>(null)
  const activeOpenSport = openSportId ?? view.sports[0]?.id ?? ''
  const rosterTeam = findRosterTeam(view.sports, rosterTeamId)
  const rosterSport = rosterTeam
    ? view.sports.find((sport) => sport.id === rosterTeam.sportId)
    : undefined
  const deleteTarget = findRosterTeam(view.sports, deleteTargetId)
  const sportDeleteTarget =
    view.sports.find((sport) => sport.id === sportDeleteTargetId) ?? null
  const canCreateTeam =
    currentUserRole === 'admin' ||
    (currentUserRole === 'director' &&
      view.sports.some((sport) => isSportDirector(sport, currentUserId)))
  const canCreateSport = currentUserRole === 'admin'
  const hasPageActions = canCreateSport || canCreateTeam
  const handleEditTeam = (teamId: string) => {
    setRosterTeamId(null)
    openEditTeam(teamId)
  }
  const handleEditSport = (sportId: string) => {
    setRosterTeamId(null)
    openEditSport(sportId)
  }
  const handleDeleteTeam = (teamId: string) => {
    openDeleteConfirm(teamId)
  }
  const handleDeleteSport = (sportId: string) => {
    openDeleteSportConfirm(sportId)
  }
  const confirmDeleteTeam = async () => {
    if (!deleteTarget) return

    try {
      await deleteTeam.mutateAsync(deleteTarget.id)
      toast.success('Team deleted.')
      if (rosterTeamId === deleteTarget.id) setRosterTeamId(null)
      closeDeleteConfirm()
    } catch (error) {
      notifyMutationError(error, mutationFeedbackCopy.team.delete)
    }
  }
  const confirmDeleteSport = async () => {
    if (!sportDeleteTarget) return

    try {
      await deleteSport.mutateAsync(sportDeleteTarget.id)
      toast.success('Sport deleted.')
      if (rosterSport?.id === sportDeleteTarget.id) setRosterTeamId(null)
      if (openSportId === sportDeleteTarget.id) setOpenSportId(null)
      closeDeleteSportConfirm()
    } catch (error) {
      notifyMutationError(error, mutationFeedbackCopy.sport.delete)
    }
  }

  return (
    <div className="mx-auto flex w-full max-w-content flex-col gap-5">
      <PageHeader
        eyebrow="My Club"
        title="Teams"
        subtitle="The sports your club runs and the teams within them."
        action={
          hasPageActions ? (
            <div className="flex flex-wrap justify-end gap-2">
              {canCreateSport && (
                <Button
                  type="button"
                  variant={canCreateTeam ? 'outline' : 'default'}
                  onClick={openCreateSport}
                >
                  <Plus />
                  New sport
                </Button>
              )}
              {canCreateTeam && (
                <Button type="button" onClick={openCreateTeam}>
                  <Plus />
                  New team
                </Button>
              )}
            </div>
          ) : undefined
        }
      />

      <StatsRow view={view} isLoading={isLoading} />

      {isLoading ? (
        <LoadingState />
      ) : error ? (
        <ErrorNotice message={serverErrorMessage(error)} onRetry={refetch} />
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
                {view.myTeams.map((team) => {
                  const sport = view.sports.find((candidate) => candidate.id === team.sportId)

                  return (
                    <TeamSummaryCard
                      key={team.id}
                      team={team}
                      sport={sport}
                      sportName={team.sportName}
                      currentUserId={currentUserId}
                      currentUserRole={currentUserRole}
                      onOpen={() => setRosterTeamId(team.id)}
                      onEdit={() => handleEditTeam(team.id)}
                      onDelete={() => handleDeleteTeam(team.id)}
                    />
                  )
                })}
              </div>
            </section>
          )}

          <section className="space-y-2.5">
            <h2 className="text-caption font-semibold uppercase tracking-[0.12em] text-text-tertiary">
              Sports
            </h2>
            <div className="border bg-card">
              {view.sports.map((sport, index) => {
                const expanded = activeOpenSport === sport.id

                return (
                  <SportSection
                    key={sport.id}
                    sport={sport}
                    currentUserId={currentUserId}
                    currentUserRole={currentUserRole}
                    expanded={expanded}
                    withTopBorder={index > 0}
                    onToggle={() => setOpenSportId(expanded ? '' : sport.id)}
                    onOpenTeam={setRosterTeamId}
                    onEditSport={handleEditSport}
                    onDeleteSport={handleDeleteSport}
                    onEditTeam={handleEditTeam}
                    onDeleteTeam={handleDeleteTeam}
                  />
                )
              })}
            </div>
          </section>
        </>
      )}

      <Sheet open={rosterTeamId !== null} onOpenChange={(open) => !open && setRosterTeamId(null)}>
        <SheetContent className="w-full gap-0 sm:max-w-md">
          {rosterTeam && (
            <RosterSheet
              team={rosterTeam}
              currentUserId={currentUserId}
              canEdit={
                rosterSport ? canEditTeam(rosterTeam, rosterSport, currentUserRole, currentUserId) : false
              }
              canDelete={
                rosterSport ? canDeleteTeam(rosterSport, currentUserRole, currentUserId) : false
              }
              onEdit={() => handleEditTeam(rosterTeam.id)}
              onDelete={() => handleDeleteTeam(rosterTeam.id)}
            />
          )}
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
            <AlertDialogTitle>Delete team</AlertDialogTitle>
            <AlertDialogDescription>
              Delete {deleteTarget?.name ?? 'this team'}? Team memberships will be removed with it.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={deleteTeam.isPending}>Cancel</AlertDialogCancel>
            <AlertDialogAction disabled={deleteTeam.isPending} onClick={confirmDeleteTeam}>
              {deleteTeam.isPending ? (
                <PendingButtonContent pendingLabel="Deleting…" />
              ) : (
                'Delete'
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
      <AlertDialog
        open={sportDeleteTargetId !== null}
        onOpenChange={(open) => {
          if (!open) closeDeleteSportConfirm()
        }}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete sport</AlertDialogTitle>
            <AlertDialogDescription>
              Delete {sportDeleteTarget?.name ?? 'this sport'}? This permanently deletes the sport,
              all of its teams, and every membership in those teams.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={deleteSport.isPending}>Cancel</AlertDialogCancel>
            <AlertDialogAction disabled={deleteSport.isPending} onClick={confirmDeleteSport}>
              {deleteSport.isPending ? (
                <PendingButtonContent pendingLabel="Deleting…" />
              ) : (
                'Delete sport'
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
      <SportEditorDialog />
      <TeamEditorDialog />
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
        {['sports', 'teams'].map((key) => (
          <Skeleton key={key} className="h-32 border" />
        ))}
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">
      {view.stats.myTeams > 0 && (
        <StatCard
          label="My Teams"
          value={String(view.stats.myTeams)}
          tone={view.stats.myTeams > 0 ? 'positive' : 'default'}
          meta="Teams you're part of"
        />
      )}
      <StatCard label="Sports" value={String(view.stats.sports)} meta="Offered by the club" />
      <StatCard label="Teams Total" value={String(view.stats.teams)} meta="Across all sports" />
      {view.stats.mySports > 0 && (
        <StatCard
          label="My Sports"
          value={String(view.stats.mySports)}
          tone={view.stats.mySports > 0 ? 'positive' : 'default'}
          meta="Teams and directed sports"
        />
      )}
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
  currentUserRole,
  expanded,
  withTopBorder,
  onToggle,
  onOpenTeam,
  onEditSport,
  onDeleteSport,
  onEditTeam,
  onDeleteTeam,
}: {
  sport: SportTeamsView
  currentUserId: string
  currentUserRole: ReturnType<typeof useTeamsViewModel>['currentUserRole']
  expanded: boolean
  withTopBorder: boolean
  onToggle: () => void
  onOpenTeam: (id: string) => void
  onEditSport: (id: string) => void
  onDeleteSport: (id: string) => void
  onEditTeam: (id: string) => void
  onDeleteTeam: (id: string) => void
}) {
  const isDirector = isSportDirector(sport, currentUserId)
  const canEditSport = canEditSportDetails(sport, currentUserRole, currentUserId)
  const canDeleteSport = canDeleteSportDetails(currentUserRole)

  return (
    <div className={withTopBorder ? 'border-t' : ''}>
      <div
        className={cn(
          'flex items-stretch transition-colors hover:bg-surface-sunken',
          isDirector && 'bg-primary/4 hover:bg-primary/8',
        )}
      >
        <button
          type="button"
          onClick={onToggle}
          className="flex min-w-0 flex-1 items-center gap-3 px-4 py-3 text-left"
        >
          <ChevronRight
            className={`size-4 shrink-0 text-text-tertiary transition-transform ${
              expanded ? 'rotate-90' : ''
            }`}
          />
          <div className="min-w-0 flex-1">
            <div className="flex min-w-0 items-center gap-2">
              <p className="truncate text-body-sm font-medium text-text-primary">{sport.name}</p>
              {isDirector && (
                <Badge tone="positive" size="sm">
                  Director
                </Badge>
              )}
            </div>
            <p className="truncate text-caption text-text-tertiary">{sport.description}</p>
            <p className="truncate text-caption text-text-tertiary">
              Directors {nameList(sport.directors)}
            </p>
          </div>
          <Badge tone="accent" size="sm">
            {sport.teams.length} teams
          </Badge>
        </button>
        {(canEditSport || canDeleteSport) && (
          <RowActions className="py-3 pr-4">
            {canEditSport && (
              <RowActionButton
                icon={Pencil}
                label={`Edit ${sport.name}`}
                onClick={() => onEditSport(sport.id)}
              />
            )}
            {canDeleteSport && (
              <RowActionButton
                icon={Trash2}
                label={`Delete ${sport.name}`}
                destructive
                onClick={() => onDeleteSport(sport.id)}
              />
            )}
          </RowActions>
        )}
      </div>

      {expanded && (
        <ul className="border-t bg-surface-sunken/40">
          {sport.teams.length === 0 ? (
            <li className="py-3 pl-11 pr-4 text-body-sm text-text-tertiary">
              No teams in this sport yet.
            </li>
          ) : (
            sport.teams.map((team) => {
              const isCoach = isTeamCoach(team, currentUserId)
              const isTrainee = isTeamTrainee(team, currentUserId)
              const canEdit = canEditTeam(team, sport, currentUserRole, currentUserId)
              const canDelete = canDeleteTeam(sport, currentUserRole, currentUserId)

              return (
                <li key={team.id} className="border-b last:border-b-0">
                  <div className="flex items-stretch transition-colors hover:bg-surface-sunken">
                    <button
                      type="button"
                      onClick={() => onOpenTeam(team.id)}
                      className="flex min-w-0 flex-1 items-center gap-3 py-2.5 pl-11 pr-4 text-left"
                    >
                      <div className="min-w-0 flex-1">
                        <p className="text-body-sm font-medium text-text-primary">{team.name}</p>
                        <p className="truncate text-caption text-text-tertiary">
                          Coach {nameList(team.trainers)} - {team.trainees.length} members
                        </p>
                      </div>
                      {(isCoach || isTrainee) && (
                        <div className="flex shrink-0 items-center gap-1.5">
                          {isCoach && (
                            <Badge tone="accent" size="sm">
                              Coach
                            </Badge>
                          )}
                          {isTrainee && (
                            <Badge tone="positive" size="sm">
                              Trainee
                            </Badge>
                          )}
                        </div>
                      )}
                    </button>
                    {(canEdit || canDelete) && (
                      <RowActions className="pr-4">
                        {canEdit && (
                          <RowActionButton
                            icon={Pencil}
                            label={`Edit ${team.name}`}
                            onClick={() => onEditTeam(team.id)}
                          />
                        )}
                        {canDelete && (
                          <RowActionButton
                            icon={Trash2}
                            label={`Delete ${team.name}`}
                            destructive
                            onClick={() => onDeleteTeam(team.id)}
                          />
                        )}
                      </RowActions>
                    )}
                  </div>
                </li>
              )
            })
          )}
        </ul>
      )}
    </div>
  )
}

function TeamSummaryCard({
  team,
  sport,
  sportName,
  currentUserId,
  currentUserRole,
  onOpen,
  onEdit,
  onDelete,
}: {
  team: TeamView
  sport?: SportTeamsView
  sportName: string
  currentUserId: string
  currentUserRole: ReturnType<typeof useTeamsViewModel>['currentUserRole']
  onOpen: () => void
  onEdit: () => void
  onDelete: () => void
}) {
  const isCoach = isTeamCoach(team, currentUserId)
  const isTrainee = isTeamTrainee(team, currentUserId)
  const canEdit = sport ? canEditTeam(team, sport, currentUserRole, currentUserId) : false
  const canDelete = sport ? canDeleteTeam(sport, currentUserRole, currentUserId) : false

  return (
    <div className="border border-primary/30 bg-primary/4 p-4 transition-colors hover:bg-primary/8">
      <button type="button" onClick={onOpen} className="block w-full text-left">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0 flex-1">
            <p className="text-caption uppercase tracking-[0.1em] text-primary">{sportName}</p>
            <h3 className="mt-0.5 truncate text-h4">{team.name}</h3>
          </div>
          {(isCoach || isTrainee) && (
            <div className="flex shrink-0 items-center gap-1.5">
              {isCoach && (
                <Badge tone="accent" size="sm">
                  Coach
                </Badge>
              )}
              {isTrainee && (
                <Badge tone="positive" size="sm">
                  Trainee
                </Badge>
              )}
            </div>
          )}
        </div>
        <p className="mt-2 text-caption text-text-tertiary">
          Coach {nameList(team.trainers)} - {team.trainees.length} members
        </p>
      </button>
      {(canEdit || canDelete) && (
        <div className="mt-3 flex justify-end gap-2">
          {canEdit && (
            <Button type="button" variant="outline" size="sm" onClick={onEdit}>
              <Pencil />
              Edit
            </Button>
          )}
          {canDelete && (
            <Button type="button" variant="destructive" size="sm" onClick={onDelete}>
              <Trash2 />
              Delete
            </Button>
          )}
        </div>
      )}
    </div>
  )
}

function isTeamTrainee(team: TeamView, currentUserId: string) {
  return team.trainees.some((member) => member.id === currentUserId)
}

function isSportDirector(sport: SportTeamsView, currentUserId: string) {
  return sport.directors.some((member) => member.id === currentUserId)
}

function canEditSportDetails(
  sport: SportTeamsView,
  currentUserRole: ReturnType<typeof useTeamsViewModel>['currentUserRole'],
  currentUserId: string,
) {
  if (currentUserRole === 'admin') return true
  if (currentUserRole === 'director') return isSportDirector(sport, currentUserId)
  return false
}

function canDeleteSportDetails(
  currentUserRole: ReturnType<typeof useTeamsViewModel>['currentUserRole'],
) {
  return currentUserRole === 'admin'
}

function canEditTeam(
  team: TeamView,
  sport: SportTeamsView,
  currentUserRole: ReturnType<typeof useTeamsViewModel>['currentUserRole'],
  currentUserId: string,
) {
  if (currentUserRole === 'admin') return true
  if (currentUserRole === 'director') return isSportDirector(sport, currentUserId)
  if (currentUserRole === 'trainer') return isTeamCoach(team, currentUserId)
  return false
}

function canDeleteTeam(
  sport: SportTeamsView,
  currentUserRole: ReturnType<typeof useTeamsViewModel>['currentUserRole'],
  currentUserId: string,
) {
  if (currentUserRole === 'admin') return true
  if (currentUserRole === 'director') return isSportDirector(sport, currentUserId)
  return false
}

function RosterSheet({
  team,
  currentUserId,
  canEdit,
  canDelete,
  onEdit,
  onDelete,
}: {
  team: TeamView & { sportName: string }
  currentUserId: string
  canEdit: boolean
  canDelete: boolean
  onEdit: () => void
  onDelete: () => void
}) {
  return (
    <>
      <SheetHeader>
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <p className="text-caption font-semibold uppercase tracking-[0.2em] text-text-tertiary">
              {team.sportName} team
            </p>
            <SheetTitle className="font-display text-h2 uppercase tracking-wide">
              {team.name}
            </SheetTitle>
            <SheetDescription>{team.description || 'No description provided.'}</SheetDescription>
          </div>
          {(canEdit || canDelete) && (
            <div className="flex shrink-0 items-center gap-2">
              {canEdit && (
                <Button type="button" variant="outline" size="sm" onClick={onEdit}>
                  <Pencil />
                  Edit
                </Button>
              )}
              {canDelete && (
                <Button type="button" variant="destructive" size="sm" onClick={onDelete}>
                  <Trash2 />
                  Delete
                </Button>
              )}
            </div>
          )}
        </div>
      </SheetHeader>

      <div className="roost-scroll flex min-h-0 flex-1 flex-col gap-6 overflow-y-auto px-4 py-2">
        <div>
          <FieldLabel>Address</FieldLabel>
          <p className="mt-0.5 text-body-sm">{team.address || '--'}</p>
        </div>

        <div>
          <FieldLabel>Coaches ({team.trainers.length})</FieldLabel>
          <MemberBadges
            members={team.trainers}
            currentUserId={currentUserId}
            tone="accent"
            emptyText="No coaches assigned."
          />
        </div>

        <Separator />

        <div>
          <FieldLabel>Members ({team.trainees.length})</FieldLabel>
          <RosterMembers members={team.trainees} currentUserId={currentUserId} />
        </div>
      </div>
    </>
  )
}

function RosterMembers({
  members,
  currentUserId,
}: {
  members: Parameters<typeof memberRefName>[0][]
  currentUserId: string
}) {
  if (members.length === 0) {
    return <p className="mt-2 text-body-sm text-text-tertiary">No members yet.</p>
  }

  return (
    <ul className="mt-2 divide-y border bg-card">
      {members.map((member) => {
        const name = memberRefName(member)
        const isCurrentUser = member.id === currentUserId

        return (
          <li key={member.id} className="flex items-center justify-between gap-3 px-3 py-2">
            <div className="min-w-0">
              <p className="truncate text-body-sm font-medium text-text-primary">{name}</p>
              {isCurrentUser && (
                <Badge tone="positive" size="sm" className="mt-1">
                  You
                </Badge>
              )}
            </div>
          </li>
        )
      })}
    </ul>
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
