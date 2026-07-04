import { CalendarIcon } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Calendar } from '@/components/ui/calendar'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { TimePicker } from '@/components/ui/time-picker'
import { dateToInputValue, inputValueToDate } from '@/lib/date-fields'
import { formatDate } from '@/lib/format'
import { cn } from '@/lib/utils'

interface DatePickerProps {
  value: string
  onChange: (value: string) => void
  id?: string
  ariaLabel?: string
  placeholder?: string
  disabled?: boolean
  required?: boolean
  'aria-invalid'?: boolean
}

export function DatePicker({
  value,
  onChange,
  id,
  ariaLabel,
  placeholder = 'Pick a date',
  disabled,
  required,
  'aria-invalid': ariaInvalid,
}: DatePickerProps) {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          id={id}
          type="button"
          variant="outline"
          aria-label={ariaLabel}
          aria-invalid={ariaInvalid}
          disabled={disabled}
          className={cn(
            'h-10 w-full justify-start gap-2 bg-transparent px-3 py-1 text-base font-normal normal-case tracking-normal text-text-primary',
            'aria-invalid:border-destructive dark:aria-invalid:border-destructive/50',
            !value && 'text-text-tertiary',
          )}
          >
          <CalendarIcon className="size-4 shrink-0" />
          {formatDateLabel(value, placeholder)}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0">
        <Calendar
          mode="single"
          required={required}
          selected={inputValueToDate(value)}
          onSelect={(date: Date | undefined) => onChange(date ? dateToInputValue(date) : '')}
          aria-label={ariaLabel}
        />
      </PopoverContent>
    </Popover>
  )
}

interface DateTimePickerProps {
  value: string
  onChange: (value: string) => void
  id?: string
  ariaLabel?: string
  placeholder?: string
  disabled?: boolean
  required?: boolean
  'aria-invalid'?: boolean
}

export function DateTimePicker({
  value,
  onChange,
  id,
  ariaLabel,
  placeholder = 'Pick a date and time',
  disabled,
  required,
  'aria-invalid': ariaInvalid,
}: DateTimePickerProps) {
  const [datePart, timePart] = splitLocalDateTime(value)

  const handleDateSelect = (date: Date | undefined) => {
    if (!date) {
      onChange('')
      return
    }

    onChange(joinLocalDateTime(dateToInputValue(date), timePart || '00:00'))
  }

  const handleTimeChange = (nextTime: string) => {
    if (!datePart) return
    onChange(joinLocalDateTime(datePart, nextTime))
  }

  return (
    <div className="flex gap-2">
      <Popover>
        <PopoverTrigger asChild>
          <Button
            id={id}
            type="button"
            variant="outline"
            aria-label={ariaLabel}
            aria-invalid={ariaInvalid}
            disabled={disabled}
            className={cn(
              'h-10 flex-1 justify-start gap-2 bg-transparent px-3 py-1 text-base font-normal normal-case tracking-normal text-text-primary',
              'aria-invalid:border-destructive dark:aria-invalid:border-destructive/50',
              !datePart && 'text-text-tertiary',
            )}
            >
            <CalendarIcon className="size-4 shrink-0" />
            {formatDateLabel(datePart, placeholder)}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0">
          <Calendar
            mode="single"
            required={required}
            selected={inputValueToDate(datePart)}
            onSelect={handleDateSelect}
            aria-label={ariaLabel}
          />
        </PopoverContent>
      </Popover>

      <TimePicker
        value={timePart}
        onChange={handleTimeChange}
        disabled={disabled || !datePart}
        ariaLabel={ariaLabel ? `${ariaLabel} time` : undefined}
        aria-invalid={ariaInvalid}
      />
    </div>
  )
}

function splitLocalDateTime(value: string): [string, string] {
  const [datePart = '', timePart = ''] = value.split('T')
  return [datePart, timePart]
}

function joinLocalDateTime(datePart: string, timePart: string): string {
  return `${datePart}T${timePart}`
}

function formatDateLabel(value: string, placeholder: string): string {
  return value ? formatDate(value) : placeholder
}
