import { SearchIcon } from 'lucide-react'
import { useEffect, useId, useState } from 'react'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { cn } from '@/lib/utils'

interface TableToolbarProps {
  searchValue: string
  onSearchChange: (value: string) => void
  searchLabel: string
  searchPlaceholder: string
  children?: React.ReactNode
  className?: string
}

export function TableToolbar({
  searchValue,
  onSearchChange,
  searchLabel,
  searchPlaceholder,
  children,
  className,
}: TableToolbarProps) {
  const searchId = useId()
  const [draftSearch, setDraftSearch] = useState(searchValue)

  useEffect(() => {
    const timeout = window.setTimeout(() => onSearchChange(draftSearch), 250)

    return () => window.clearTimeout(timeout)
  }, [draftSearch, onSearchChange])

  return (
    <div
      className={cn(
        'flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between',
        className,
      )}
    >
      <div className="flex flex-wrap items-center gap-2">{children}</div>

      <div className="flex h-10 w-full min-w-0 sm:w-80">
        <label
          htmlFor={searchId}
          className="sr-only"
        >
          {searchLabel}
        </label>
        <Input
          id={searchId}
          type="search"
          value={draftSearch}
          placeholder={searchPlaceholder}
          aria-label={searchLabel}
          className="h-10 rounded-none border border-r-0 border-border bg-card px-3 py-2 focus-visible:z-10 focus-visible:border-ring"
          onChange={(event) => setDraftSearch(event.target.value)}
        />
        <Button
          type="button"
          variant="default"
          size="icon"
          className="-ml-px h-10 border border-primary text-primary-foreground hover:bg-primary/80"
          aria-label={`Apply ${searchLabel.toLocaleLowerCase()}`}
          onClick={() => onSearchChange(draftSearch)}
        >
          <SearchIcon />
        </Button>
      </div>
    </div>
  )
}
