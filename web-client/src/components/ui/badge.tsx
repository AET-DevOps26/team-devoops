import { cn } from '@/lib/utils'

type BadgeTone = 'default' | 'positive' | 'negative' | 'accent'
type BadgeSize = 'default' | 'sm'

const toneClass: Record<BadgeTone, string> = {
  default: 'bg-muted/70 text-text-secondary',
  positive:
    'bg-[oklch(0.55_0.17_145_/_0.16)] text-[oklch(0.5_0.17_145)] dark:text-[oklch(0.72_0.17_145)]',
  negative: 'bg-destructive/15 text-destructive',
  accent: 'bg-primary/10 text-text-secondary',
}

const sizeClass: Record<BadgeSize, string> = {
  default: 'min-h-7 px-2.5 py-1 text-caption font-medium',
  sm: 'min-h-6 px-2 py-0.5 text-[0.6875rem] font-medium',
}

interface BadgeProps extends React.ComponentProps<'span'> {
  tone?: BadgeTone
  size?: BadgeSize
}

export function Badge({ tone = 'default', size = 'default', className, ...props }: BadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center justify-center whitespace-nowrap leading-none',
        sizeClass[size],
        toneClass[tone],
        className,
      )}
      {...props}
    />
  )
}
