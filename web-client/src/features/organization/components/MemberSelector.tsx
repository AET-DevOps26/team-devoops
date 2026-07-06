import { X } from 'lucide-react'

import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { cn } from '@/lib/utils'

export interface MemberSelectorOption {
  id: string
  name: string
  meta?: string
}

export function MemberSelector({
  label,
  searchId,
  options,
  selectedIds,
  search,
  disabled,
  onSearchChange,
  onToggle,
}: {
  label: string
  searchId: string
  options: MemberSelectorOption[]
  selectedIds: string[]
  search: string
  disabled: boolean
  onSearchChange: (search: string) => void
  onToggle: (id: string) => void
}) {
  const normalizedSearch = search.trim().toLowerCase()
  const visibleOptions = normalizedSearch
    ? options.filter((option) =>
        `${option.name} ${option.meta ?? ''}`.toLowerCase().includes(normalizedSearch),
      )
    : options
  const selectedOptions = selectedIds
    .map((id) => options.find((option) => option.id === id))
    .filter((option): option is MemberSelectorOption => option !== undefined)

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between gap-3">
        <Label htmlFor={searchId}>{label}</Label>
        <Badge size="sm">{selectedIds.length}</Badge>
      </div>

      {selectedOptions.length > 0 && (
        <div className="flex max-h-28 flex-wrap gap-1.5 overflow-y-auto border bg-card p-2">
          {selectedOptions.map((option) => (
            <Badge key={option.id} className="gap-1">
              {option.name}
              <button
                type="button"
                className="inline-flex size-4 items-center justify-center text-text-tertiary hover:text-destructive disabled:pointer-events-none disabled:opacity-50"
                disabled={disabled}
                onClick={() => onToggle(option.id)}
              >
                <X className="size-3" />
                <span className="sr-only">Remove {option.name}</span>
              </button>
            </Badge>
          ))}
        </div>
      )}

      <Input
        id={searchId}
        value={search}
        onChange={(event) => onSearchChange(event.target.value)}
        placeholder="Search members"
        disabled={disabled}
      />

      {options.length === 0 ? (
        <p className="border bg-card px-3 py-2 text-body-sm text-text-secondary">
          No members available.
        </p>
      ) : visibleOptions.length === 0 ? (
        <p className="border bg-card px-3 py-2 text-body-sm text-text-secondary">
          No members match that search.
        </p>
      ) : (
        <div className="grid max-h-56 grid-cols-1 gap-2 overflow-y-auto sm:grid-cols-2">
          {visibleOptions.map((option) => {
            const selected = selectedIds.includes(option.id)

            return (
              <button
                key={option.id}
                type="button"
                aria-pressed={selected}
                disabled={disabled}
                onClick={() => onToggle(option.id)}
                className={cn(
                  'flex min-h-12 items-center justify-between gap-3 border px-3 py-2 text-left transition-colors disabled:pointer-events-none disabled:opacity-50',
                  selected
                    ? 'border-primary bg-primary/10 text-text-primary'
                    : 'border-border bg-card hover:bg-muted/60',
                )}
              >
                <span className="min-w-0">
                  <span className="block truncate text-body-sm font-medium">{option.name}</span>
                  {option.meta && (
                    <span className="mt-0.5 block truncate text-caption text-text-tertiary">
                      {option.meta}
                    </span>
                  )}
                </span>
                <span
                  className={cn(
                    'size-3 shrink-0 border',
                    selected ? 'border-primary bg-primary' : 'border-border',
                  )}
                  aria-hidden="true"
                />
              </button>
            )
          })}
        </div>
      )}
    </div>
  )
}
