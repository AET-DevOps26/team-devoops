import { useMemo } from 'react'

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { cn } from '@/lib/utils'

interface TimePickerProps {
  value: string
  onChange: (value: string) => void
  id?: string
  ariaLabel?: string
  disabled?: boolean
  'aria-invalid'?: boolean
}

type Period = 'AM' | 'PM'

const HOURS = [12, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11]
const MINUTES = Array.from({ length: 60 }, (_, minute) => minute)

export function TimePicker({
  value,
  onChange,
  id,
  ariaLabel,
  disabled,
  'aria-invalid': ariaInvalid,
}: TimePickerProps) {
  const [hour24, minute] = useMemo(() => parseTime(value), [value])
  const hour12 = to12Hour(hour24 ?? 0)
  const period = toPeriod(hour24 ?? 0)

  const handleHourChange = (nextHour12: string) => {
    onChange(formatTime(to24Hour(Number(nextHour12), period), minute ?? 0))
  }

  const handleMinuteChange = (nextMinute: string) => {
    onChange(formatTime(hour24 ?? 0, Number(nextMinute)))
  }

  const handlePeriodChange = (nextPeriod: string) => {
    onChange(formatTime(to24Hour(hour12, nextPeriod as Period), minute ?? 0))
  }

  const triggerClassName = cn(
    'h-10 min-w-0 gap-1 bg-transparent px-2 py-1 text-base font-normal normal-case tracking-normal text-text-primary',
    'aria-invalid:border-destructive dark:aria-invalid:border-destructive/50',
  )

  return (
    <div id={id} className="flex gap-1.5" aria-label={ariaLabel} aria-invalid={ariaInvalid}>
      <Select value={String(hour12)} onValueChange={handleHourChange} disabled={disabled}>
        <SelectTrigger aria-label={ariaLabel ? `${ariaLabel} hour` : 'Hour'} className={triggerClassName}>
          <SelectValue placeholder="--" />
        </SelectTrigger>
        <SelectContent>
          {HOURS.map((hour) => (
            <SelectItem key={hour} value={String(hour)}>
              {String(hour).padStart(2, '0')}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Select value={String(minute ?? 0)} onValueChange={handleMinuteChange} disabled={disabled}>
        <SelectTrigger aria-label={ariaLabel ? `${ariaLabel} minute` : 'Minute'} className={triggerClassName}>
          <SelectValue placeholder="--" />
        </SelectTrigger>
        <SelectContent>
          {MINUTES.map((m) => (
            <SelectItem key={m} value={String(m)}>
              {String(m).padStart(2, '0')}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Select value={period} onValueChange={handlePeriodChange} disabled={disabled}>
        <SelectTrigger aria-label={ariaLabel ? `${ariaLabel} AM or PM` : 'AM or PM'} className={triggerClassName}>
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="AM">AM</SelectItem>
          <SelectItem value="PM">PM</SelectItem>
        </SelectContent>
      </Select>
    </div>
  )
}

function to12Hour(hour24: number): number {
  const hour12 = hour24 % 12
  return hour12 === 0 ? 12 : hour12
}

function toPeriod(hour24: number): Period {
  return hour24 >= 12 ? 'PM' : 'AM'
}

function to24Hour(hour12: number, period: Period): number {
  const base = hour12 % 12
  return period === 'PM' ? base + 12 : base
}

function parseTime(value: string): [number | null, number | null] {
  const match = value.match(/^(\d{1,2}):(\d{1,2})$/)
  if (!match) return [null, null]

  const hour = Number(match[1])
  const minute = Number(match[2])
  if (hour > 23 || minute > 59) return [null, null]

  return [hour, minute]
}

function formatTime(hour24: number, minute: number): string {
  return `${String(hour24).padStart(2, '0')}:${String(minute).padStart(2, '0')}`
}
