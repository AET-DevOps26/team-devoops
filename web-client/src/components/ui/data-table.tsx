import { cn } from '@/lib/utils'

// Shared table shell; scrolls horizontally before columns collapse too far.
export function DataTable({ className, ...props }: React.ComponentProps<'table'>) {
  return (
    <div className="overflow-x-auto border bg-card">
      <table className={cn('w-full min-w-[42rem] border-collapse', className)} {...props} />
    </div>
  )
}

export function THead({ className, ...props }: React.ComponentProps<'th'>) {
  return (
    <th
      className={cn(
        'border-b bg-surface-sunken/55 px-4 py-3 text-left text-body-sm font-medium text-text-secondary first:pl-5 last:pr-5',
        className,
      )}
      {...props}
    />
  )
}

export function TCell({ className, ...props }: React.ComponentProps<'td'>) {
  return (
    <td
      className={cn('px-4 py-3.5 text-body-sm align-top first:pl-5 last:pr-5', className)}
      {...props}
    />
  )
}

export function TRow({ className, ...props }: React.ComponentProps<'tr'>) {
  return (
    <tr
      className={cn('border-b last:border-b-0 hover:bg-surface-sunken/70', className)}
      {...props}
    />
  )
}
