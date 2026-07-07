import { CalendarIcon, XIcon } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Calendar } from '@/components/ui/calendar'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { dateRangeFromFilters, dateRangeLabel, dateToInputValue } from '@/lib/date-fields'
import { cn } from '@/lib/utils'

interface DateRangeFilterProps {
  fromDate: string
  toDate: string
  onChange: (range: { fromDate: string; toDate: string }) => void
  ariaLabel: string
}

export function DateRangeFilter({
  fromDate,
  toDate,
  onChange,
  ariaLabel,
}: DateRangeFilterProps) {
  const hasRange = fromDate !== '' || toDate !== ''

  return (
    <div className="flex items-center gap-2">
      <Popover>
        <PopoverTrigger asChild>
          <Button
            type="button"
          variant="outline"
          size="sm"
          aria-label={ariaLabel}
          className={cn(
            'h-10 min-w-40 justify-start gap-2 bg-card px-3 py-2 text-[0.9375rem] leading-[1.55] font-normal normal-case tracking-normal',
            hasRange && 'border-primary',
          )}
          >
            <CalendarIcon />
            {dateRangeLabel(fromDate, toDate)}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0">
          <Calendar
            mode="range"
            numberOfMonths={2}
            selected={dateRangeFromFilters(fromDate, toDate)}
            onSelect={(range) =>
              onChange({
                fromDate: range?.from ? dateToInputValue(range.from) : '',
                toDate: range?.to ? dateToInputValue(range.to) : '',
              })
            }
            aria-label={ariaLabel}
          />
        </PopoverContent>
      </Popover>

      {hasRange && (
        <Button
          type="button"
          variant="outline"
          size="sm"
          className="h-10 gap-2 bg-card px-3 text-[0.9375rem] leading-[1.55] font-normal normal-case tracking-normal"
          onClick={() => onChange({ fromDate: '', toDate: '' })}
        >
          <XIcon />
          Reset
        </Button>
      )}
    </div>
  )
}
