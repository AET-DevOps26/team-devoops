import { cn } from '@/lib/utils'

interface StatCardProps {
  label: string
  value: string
  meta?: string
  tone?: 'default' | 'positive' | 'negative'
}

const toneClass: Record<NonNullable<StatCardProps['tone']>, string> = {
  default: 'text-text-primary',
  positive: 'text-[oklch(0.55_0.17_145)] dark:text-[oklch(0.72_0.17_145)]',
  negative: 'text-destructive',
}

/** KPI tile: small label, prominent value (sans, not display), optional sub-line. */
export function StatCard({ label, value, meta, tone = 'default' }: StatCardProps) {
  return (
    <div className="flex h-full min-w-0 flex-col justify-between gap-3 border bg-card px-4 py-4 sm:px-5">
      <p className="text-caption uppercase tracking-[0.12em] text-text-tertiary">{label}</p>
      <p className={cn('text-h2 font-semibold leading-none tracking-tight', toneClass[tone])}>
        {value}
      </p>
      {meta && <p className="text-caption leading-relaxed text-text-tertiary">{meta}</p>}
    </div>
  )
}
