interface PageHeaderProps {
  eyebrow?: string
  title: string
  subtitle?: string
  action?: React.ReactNode
}

export function PageHeader({ eyebrow, title, subtitle, action }: PageHeaderProps) {
  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
      <div className="min-w-0">
        {eyebrow && (
          <p className="text-caption font-semibold uppercase tracking-[0.2em] text-text-tertiary">
            {eyebrow}
          </p>
        )}
        <h1 className="font-display text-display-lg uppercase tracking-wide text-text-primary">
          {title}
        </h1>
        {subtitle && <p className="mt-1 text-body-sm text-text-tertiary">{subtitle}</p>}
      </div>
      {action && <div className="shrink-0">{action}</div>}
    </div>
  )
}
