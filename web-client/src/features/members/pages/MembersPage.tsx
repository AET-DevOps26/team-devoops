import { useEffect } from 'react'

import { Badge } from '@/components/ui/badge'
import { DataTable, TCell, THead, TRow } from '@/components/ui/data-table'
import { PageHeader } from '@/components/ui/page-header'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Skeleton } from '@/components/ui/skeleton'
import { TableToolbar } from '@/components/ui/table-toolbar'
import { useMembersUiStore } from '../model/membersUiStore'
import { useMembersViewModel } from '../model/useMembersViewModel'

export function MembersPage() {
  const { view, isLoading, error } = useMembersViewModel()
  const filters = useMembersUiStore((state) => state.filters)
  const setSearch = useMembersUiStore((state) => state.setSearch)
  const setTeamId = useMembersUiStore((state) => state.setTeamId)
  const setSport = useMembersUiStore((state) => state.setSport)
  const resetFilters = useMembersUiStore((state) => state.resetFilters)

  useEffect(() => resetFilters, [resetFilters])

  return (
    <div className="mx-auto flex w-full max-w-content flex-col gap-6">
      <PageHeader
        eyebrow="My Club"
        title="Members"
        subtitle="People in your visible teams and sports."
      />

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
                </tr>
              </thead>
              <tbody>
                {view.rows.map((member) => (
                  <TRow key={member.id}>
                    <TCell className="font-medium">{member.name}</TCell>
                    <TCell className="text-text-secondary">{member.email}</TCell>
                    <TCell>
                      <FacetBadges values={member.teamNames} emptyLabel="No team" />
                    </TCell>
                    <TCell>
                      <FacetBadges values={member.sports} emptyLabel="No sport" />
                    </TCell>
                  </TRow>
                ))}
              </tbody>
            </DataTable>
          )}
        </>
      )}
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
