import * as React from 'react'
import {
  ChevronDownIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
} from 'lucide-react'
import { DayPicker, type DropdownProps, getDefaultClassNames } from 'react-day-picker'

import { Button, buttonVariants } from '@/components/ui/button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { cn } from '@/lib/utils'

export type CalendarProps = React.ComponentProps<typeof DayPicker>

function Calendar({
  className,
  classNames,
  showOutsideDays = true,
  captionLayout = 'label',
  buttonVariant = 'ghost',
  ...props
}: CalendarProps & {
  buttonVariant?: React.ComponentProps<typeof Button>['variant']
}) {
  const defaultClassNames = getDefaultClassNames()

  return (
    <DayPicker
      showOutsideDays={showOutsideDays}
      captionLayout={captionLayout}
      className={cn('bg-popover p-3 text-popover-foreground', className)}
      classNames={{
        root: cn(defaultClassNames.root, 'w-fit'),
        months: cn('flex flex-col gap-4 sm:flex-row'),
        month: cn('space-y-3'),
        // The nav spans the caption row edge-to-edge; make its transparent middle click-through
        // so it can't steal pointer events from the month/year dropdowns underneath it.
        nav: cn('pointer-events-none absolute inset-x-0 top-3 flex items-center justify-between px-3'),
        button_previous: cn(
          buttonVariants({ variant: buttonVariant, size: 'icon-sm' }),
          'pointer-events-auto size-8 bg-transparent p-0',
        ),
        button_next: cn(
          buttonVariants({ variant: buttonVariant, size: 'icon-sm' }),
          'pointer-events-auto size-8 bg-transparent p-0',
        ),
        month_caption: cn('flex h-8 items-center justify-center px-8'),
        caption_label: cn('inline-flex items-center gap-1 text-body-sm font-semibold whitespace-nowrap'),
        dropdowns: cn('flex items-center justify-center gap-1.5 text-body-sm'),
        dropdown_root: cn('relative'),
        chevron: cn('size-4'),
        weekdays: cn('flex'),
        weekday: cn('w-9 text-center text-caption font-medium text-text-tertiary'),
        week: cn('mt-1 flex w-full'),
        day: cn(
          'relative flex size-9 items-center justify-center p-0 text-center text-body-sm',
        ),
        day_button: cn(
          buttonVariants({ variant: 'ghost', size: 'icon-sm' }),
          'size-9 rounded-none p-0 font-normal aria-selected:opacity-100',
        ),
        range_start: cn('bg-primary [&>button]:bg-primary [&>button]:text-primary-foreground'),
        range_end: cn('bg-primary [&>button]:bg-primary [&>button]:text-primary-foreground'),
        range_middle: cn('bg-primary/20 [&>button]:bg-transparent [&>button]:!text-foreground'),
        selected: cn('[&>button]:bg-primary [&>button]:text-primary-foreground'),
        today: cn('[&>button]:border [&>button]:border-primary'),
        outside: cn('text-text-tertiary opacity-60'),
        disabled: cn('text-text-tertiary opacity-50'),
        hidden: cn('invisible'),
        ...classNames,
      }}
      components={{
        Chevron: ({ orientation, className, ...chevronProps }) => {
          if (orientation === 'left') {
            return <ChevronLeftIcon className={cn('size-4', className)} {...chevronProps} />
          }

          if (orientation === 'right') {
            return <ChevronRightIcon className={cn('size-4', className)} {...chevronProps} />
          }

          return <ChevronDownIcon className={cn('size-4', className)} {...chevronProps} />
        },
        Dropdown: CalendarDropdown,
      }}
      {...props}
    />
  )
}

// react-day-picker renders month/year navigation as native <select>s, which look off-theme
// and (on some platforms) open their list upward. Swap in our Radix Select: it portals with
// collision-aware placement, so the list opens downward and matches the rest of the app.
function CalendarDropdown({
  options,
  value,
  onChange,
  disabled,
  required,
  name,
  'aria-label': ariaLabel,
}: DropdownProps) {
  const selected = options?.find((option) => option.value === Number(value))

  const handleValueChange = (nextValue: string) => {
    if (!onChange) return
    // react-day-picker expects a native select change event; synthesise the minimum it reads.
    onChange({
      target: { value: nextValue },
    } as React.ChangeEvent<HTMLSelectElement>)
  }

  return (
    <Select
      value={value != null ? String(value) : undefined}
      onValueChange={handleValueChange}
      disabled={disabled}
      required={required}
      name={name}
    >
      <SelectTrigger
        aria-label={ariaLabel}
        className="h-8 min-w-0 gap-1 border-transparent bg-transparent px-2 font-semibold text-text-primary hover:bg-accent focus-visible:border-ring"
      >
        <SelectValue>{selected?.label ?? value}</SelectValue>
      </SelectTrigger>
      {/* The calendar usually lives inside a Popover (z-60), so the list has to outrank it. */}
      <SelectContent className="z-70 max-h-64">
        {options?.map((option) => (
          <SelectItem
            key={option.value}
            value={String(option.value)}
            disabled={option.disabled}
          >
            {option.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}

export { Calendar }
