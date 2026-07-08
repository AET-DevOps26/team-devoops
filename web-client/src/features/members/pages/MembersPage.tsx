import { useEffect, useState } from 'react'
import { MessageSquarePlus, Pencil, Plus, Trash2 } from 'lucide-react'

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
import { PageHeader } from '@/components/ui/page-header'
import { RowActionButton, RowActions } from '@/components/ui/row-action-button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Skeleton } from '@/components/ui/skeleton'
import { TableToolbar } from '@/components/ui/table-toolbar'
import { useAuth } from '@/features/auth'
import { FeedbackComposeDialog, FeedbackComposeNotice } from '@/features/feedback'
import { useFeedbackUiStore } from '@/features/feedback/model/feedbackUiStore'
import { serverErrorMessage } from '@/lib/server-error'
import { useDeleteMember } from '../api/queries'
import { MemberEditorDialog } from '../components/MemberEditorDialog'
import { useMembersUiStore } from '../model/membersUiStore'
import { useMembersViewModel } from '../model/useMembersViewModel'

export function MembersPage() {
  const { user } = useAuth()
  const { view, isLoading, error } = useMembersViewModel()
  const openCompose = useFeedbackUiStore((state) => state.openCompose)
  const filters = useMembersUiStore((state) => state.filters)
  const setSearch = useMembersUiStore((state) => state.setSearch)
  const setTeamId = useMembersUiStore((state) => state.setTeamId)
  const setSport = useMembersUiStore((state) => state.setSport)
  const resetFilters = useMembersUiStore((state) => state.resetFilters)
  const openCreateMember = useMembersUiStore((state) => state.openCreateMember)
  const openEditMember = useMembersUiStore((state) => state.openEditMember)
  const openDeleteConfirm = useMembersUiStore((state) => state.openDeleteConfirm)
  const closeDeleteConfirm = useMembersUiStore((state) => state.closeDeleteConfirm)
  const deleteTargetId = useMembersUiStore((state) => state.deleteTargetId)
  const mutationNotice = useMembersUiStore((state) => state.mutationNotice)
  const setMutationNotice = useMembersUiStore((state) => state.setMutationNotice)
  const deleteMember = useDeleteMember()
  const [deleteError, setDeleteError] = useState<string | null>(null)
  const isAdmin = user.role === 'admin'
  const deleteTarget = view.rows.find((row) => row.id === deleteTargetId) ?? null

  useEffect(() => resetFilters, [resetFilters])

  const handleDeleteMember = (memberId: string) => {
    setDeleteError(null)
    openDeleteConfirm(memberId)
  }

  const confirmDeleteMember = async () => {
    if (!deleteTargetId) return

    try {
      await deleteMember.mutateAsync(deleteTargetId)
      setMutationNotice('Member deleted.')
      setDeleteError(null)
      closeDeleteConfirm()
    } catch (deleteMemberError) {
      setDeleteError(serverErrorMessage(deleteMemberError))
    }
  }

  return (
    <div className="mx-auto flex w-full max-w-content flex-col gap-6">
      <PageHeader
        eyebrow="My Club"
        title="Members"
        subtitle="People in your visible teams and sports."
        action={
          isAdmin ? (
            <Button type="button" onClick={openCreateMember}>
              <Plus />
              New member
            </Button>
          ) : undefined
        }
      />

      {mutationNotice && (
        <p
          role="status"
          className="border border-primary/25 bg-primary/8 px-4 py-3 text-body-sm text-text-primary"
        >
          {mutationNotice}
        </p>
      )}

      <FeedbackComposeNotice />

      {isLoading ? (
        <MembersTableSkeleton />
      ) : error ? (
        <p className="border bg-card px-5 py-4 text-body-sm text-destructive">
          {error.message}
        </p>
      ) : view.totalRows === 0 ? (
        <p className="border bg-card px-5 py-4 text-body-sm text-text-secondary">
          No members are listed yet.
        </p>
      ) : (
        <>
          <TableToolbar
            searchValue={filters.search}
            onSearchChange={setSearch}
            searchLabel="Search members"
            searchPlaceholder="Name or email"
          >
            <Select value={filters.sport} onValueChange={setSport}>
              <SelectTrigger aria-label="Filter members by sport">
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

            <Select value={filters.teamId} onValueChange={setTeamId}>
              <SelectTrigger aria-label="Filter members by team">
                <SelectValue placeholder="Team" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All teams</SelectItem>
                {view.teamOptions.map((team) => (
                  <SelectItem key={team.value} value={team.value}>
                    {team.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </TableToolbar>

          {view.rows.length === 0 ? (
            <p className="border bg-card px-5 py-4 text-body-sm text-text-secondary">
              No members match the current filters.
            </p>
          ) : (
            <DataTable>
              <thead>
                <tr>
                  <THead>Name</THead>
                  <THead>Email</THead>
                  <THead>Teams</THead>
                  <THead>Sports</THead>
                  {(view.composableMemberIds.size > 0 || isAdmin) && (
                    <THead className="text-right" />
                  )}
                </tr>
              </thead>
              <tbody>
                {view.rows.map((member) => {
                  const canGiveFeedback = view.composableMemberIds.has(member.id)

                  return (
                    <TRow key={member.id}>
                      <TCell className="font-medium">{member.name}</TCell>
                      <TCell className="text-text-secondary">{member.email}</TCell>
                      <TCell>
                        <FacetBadges values={member.teamNames} emptyLabel="No team" />
                      </TCell>
                      <TCell>
                        <FacetBadges values={member.sports} emptyLabel="No sport" />
                      </TCell>
                      {(view.composableMemberIds.size > 0 || isAdmin) && (
                        <TCell className="text-right">
                          <RowActions>
                            {canGiveFeedback && (
                              <RowActionButton
                                icon={MessageSquarePlus}
                                label={`Give feedback for ${member.name}`}
                                onClick={() => openCompose({ id: member.id, name: member.name })}
                              />
                            )}
                            {isAdmin && (
                              <>
                                <RowActionButton
                                  icon={Pencil}
                                  label={`Edit ${member.name}`}
                                  onClick={() => openEditMember(member.id)}
                                />
                                <RowActionButton
                                  icon={Trash2}
                                  label={`Delete ${member.name}`}
                                  destructive
                                  disabled={deleteMember.isPending}
                                  onClick={() => handleDeleteMember(member.id)}
                                />
                              </>
                            )}
                          </RowActions>
                        </TCell>
                      )}
                    </TRow>
                  )
                })}
              </tbody>
            </DataTable>
          )}
        </>
      )}

      <FeedbackComposeDialog />
      <MemberEditorDialog />

      <AlertDialog
        open={deleteTargetId !== null}
        onOpenChange={(open) => {
          if (!open) {
            setDeleteError(null)
            closeDeleteConfirm()
          }
        }}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete member</AlertDialogTitle>
            <AlertDialogDescription>
              Delete {deleteTarget?.name ?? 'this member'}? This removes their team and sport
              memberships, deletes feedback about them, and clears their name from records they
              authored. This cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          {deleteError && (
            <p className="border border-destructive/30 bg-destructive/10 px-3 py-2 text-body-sm text-destructive">
              {deleteError}
            </p>
          )}
          <AlertDialogFooter>
            <AlertDialogCancel disabled={deleteMember.isPending}>Cancel</AlertDialogCancel>
            <AlertDialogAction disabled={deleteMember.isPending} onClick={confirmDeleteMember}>
              {deleteMember.isPending ? 'Deleting' : 'Delete'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}

function FacetBadges({ values, emptyLabel }: { values: string[]; emptyLabel: string }) {
  if (values.length === 0) {
    return <span className="text-text-tertiary">{emptyLabel}</span>
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

function MembersTableSkeleton() {
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
