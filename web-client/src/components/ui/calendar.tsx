import * as React from 'react'
import {
  ChevronDownIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
} from 'lucide-react'
import { DayPicker, getDefaultClassNames } from 'react-day-picker'

import { Button, buttonVariants } from '@/components/ui/button'
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
        nav: cn('absolute inset-x-0 top-3 flex items-center justify-between px-3'),
        button_previous: cn(
          buttonVariants({ variant: buttonVariant, size: 'icon-sm' }),
          'size-8 bg-transparent p-0',
        ),
        button_next: cn(
          buttonVariants({ variant: buttonVariant, size: 'icon-sm' }),
          'size-8 bg-transparent p-0',
        ),
        month_caption: cn('flex h-8 items-center justify-center px-8'),
        caption_label: cn('text-body-sm font-semibold'),
        dropdowns: cn('flex items-center justify-center gap-1 text-body-sm'),
        dropdown: cn('absolute inset-0 opacity-0'),
        dropdown_root: cn('relative inline-flex items-center gap-1'),
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
      }}
      {...props}
    />
  )
}

export { Calendar }
