import { useMemo, useState } from 'react'
import { ChevronsUpDown, X } from 'lucide-react'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandItemCheck,
  CommandList,
} from '@/components/ui/command'
import { Label } from '@/components/ui/label'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'

export interface MultiSelectOption {
  id: string
  label: string
  meta?: string
  group?: string
}

export function MultiSelectCombobox({
  label,
  placeholder = 'Search and select...',
  emptyLabel = 'No options available.',
  emptySearchLabel = 'No options match your search.',
  options,
  selectedIds,
  disabled,
  onToggle,
}: {
  label: string
  placeholder?: string
  emptyLabel?: string
  emptySearchLabel?: string
  options: MultiSelectOption[]
  selectedIds: string[]
  disabled?: boolean
  onToggle: (id: string) => void
}) {
  const [open, setOpen] = useState(false)
  const selectedSet = useMemo(() => new Set(selectedIds), [selectedIds])
  const selected = useMemo(
    () => options.filter((option) => selectedSet.has(option.id)),
    [options, selectedSet],
  )
  const groups = useMemo(() => groupOptions(options), [options])

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between gap-3">
        <Label>{label}</Label>
        <Badge size="sm">{selectedIds.length}</Badge>
      </div>

      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            type="button"
            variant="outline"
            role="combobox"
            aria-expanded={open}
            disabled={disabled || options.length === 0}
            className="w-full justify-between font-normal"
          >
            {options.length === 0
              ? emptyLabel
              : selected.length > 0
                ? `${selected.length} selected`
                : placeholder}
            <ChevronsUpDown className="size-4 shrink-0 text-text-tertiary" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-(--radix-popover-trigger-width) p-0" align="start">
          <Command>
            <CommandInput placeholder={placeholder} />
            <CommandList>
              <CommandEmpty>{emptySearchLabel}</CommandEmpty>
              {groups.map(([groupName, groupOptions]) => (
                <CommandGroup key={groupName} heading={groupName || undefined}>
                  {groupOptions.map((option) => {
                    const checked = selectedSet.has(option.id)

                    return (
                      <CommandItem
                        key={option.id}
                        value={`${option.id} ${option.label} ${option.meta ?? ''}`}
                        onSelect={() => onToggle(option.id)}
                      >
                        <span className="min-w-0 truncate">{option.label}</span>
                        {option.meta && (
                          <span className="truncate text-caption text-text-tertiary">
                            {option.meta}
                          </span>
                        )}
                        <CommandItemCheck checked={checked} />
                      </CommandItem>
                    )
                  })}
                </CommandGroup>
              ))}
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>

      {selected.length > 0 && (
        <div className="roost-scroll flex max-h-32 flex-wrap gap-1.5 overflow-y-auto border bg-card p-2">
          {selected.map((option) => (
            <Badge key={option.id} className="gap-1">
              {option.label}
              <button
                type="button"
                className="inline-flex size-4 items-center justify-center text-text-tertiary hover:text-destructive disabled:pointer-events-none disabled:opacity-50"
                disabled={disabled}
                onClick={() => onToggle(option.id)}
              >
                <X className="size-3" />
                <span className="sr-only">Remove {option.label}</span>
              </button>
            </Badge>
          ))}
        </div>
      )}
    </div>
  )
}

function groupOptions(options: MultiSelectOption[]): [string, MultiSelectOption[]][] {
  const groups = new Map<string, MultiSelectOption[]>()

  options.forEach((option) => {
    const key = option.group ?? ''
    const group = groups.get(key) ?? []
    group.push(option)
    groups.set(key, group)
  })

  return Array.from(groups.entries())
}
