import type * as React from 'react'

import { cn } from '@/lib/utils'

export interface BarListItem {
  id: string
  label: string
  value: number
  percentage: number
  description?: string
  tooltip?: string
  color?: string
}

interface BarListProps extends React.ComponentProps<'div'> {
  items: BarListItem[]
  ariaLabel: string
  maxValue?: number
  valueLabel?: string
}

const gridMarkers = [0, 25, 50, 75, 100]

export function BarList({
  items,
  ariaLabel,
  maxValue,
  valueLabel = 'value',
  className,
  ...props
}: BarListProps) {
  const resolvedMax = Math.max(1, maxValue ?? 0, ...items.map((item) => item.value))

  return (
    <div
      role="img"
      aria-label={ariaLabel}
      className={cn('space-y-3', className)}
      {...props}
    >
      <div className="hidden grid-cols-[minmax(8rem,12rem)_minmax(0,1fr)_5rem] items-end gap-3 sm:grid">
        <span aria-hidden="true" />
        <div
          className="relative h-lh text-[0.6875rem] font-medium text-text-tertiary"
          aria-hidden="true"
        >
          <span className="absolute left-0">0</span>
          <span className="absolute left-1/2 -translate-x-1/2">50%</span>
          <span className="absolute right-0">100%</span>
        </div>
        <span className="text-right text-[0.6875rem] font-medium text-text-tertiary">
          {valueLabel}
        </span>
      </div>

      <div className="space-y-3">
        {items.map((item) => {
          const barWidth = Math.max(item.value > 0 ? 2 : 0, (item.value / resolvedMax) * 100)
          const tooltip =
            item.tooltip ??
            `${item.label}: ${item.value} ${valueLabel}, ${item.percentage}%`

          return (
            <div
              key={item.id}
              className="grid gap-2 sm:grid-cols-[minmax(8rem,12rem)_minmax(0,1fr)_5rem] sm:items-center sm:gap-3"
              title={tooltip}
            >
              <div className="min-w-0">
                <p className="truncate text-body-sm font-semibold text-text-primary">
                  {item.label}
                </p>
                {item.description && (
                  <p className="text-caption text-text-tertiary">{item.description}</p>
                )}
              </div>

              <svg
                viewBox="0 0 100 22"
                preserveAspectRatio="none"
                className="h-7 w-full overflow-visible"
                aria-hidden="true"
              >
                <title>{tooltip}</title>
                {gridMarkers
                  .filter((marker) => marker !== 0 && marker !== 100)
                  .map((marker) => (
                    <line
                      key={marker}
                      x1={marker}
                      x2={marker}
                      y1="1"
                      y2="21"
                      vectorEffect="non-scaling-stroke"
                      stroke="var(--border)"
                      strokeDasharray="3 4"
                    />
                  ))}
                <rect x="0" y="6" width="100" height="10" fill="var(--surface-sunken)" />
                <rect
                  x="0"
                  y="6"
                  width={barWidth}
                  height="10"
                  fill={item.color ?? 'var(--primary)'}
                />
                {[0, 100].map((marker) => (
                  <line
                    key={marker}
                    x1={marker}
                    x2={marker}
                    y1="1"
                    y2="21"
                    vectorEffect="non-scaling-stroke"
                    stroke="var(--text-tertiary)"
                    strokeWidth="1.5"
                  />
                ))}
              </svg>

              <div className="flex items-baseline justify-between gap-2 sm:block sm:text-right">
                <p className="text-body-sm font-semibold tabular-nums text-text-primary">
                  {item.value.toLocaleString()}
                </p>
                <p className="text-caption tabular-nums text-text-tertiary">
                  {item.percentage}%
                </p>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

export interface DonutSegment {
  id: string
  label: string
  value: number
  percentage: number
  color: string
}

interface DonutChartProps extends React.ComponentProps<'div'> {
  segments: DonutSegment[]
  ariaLabel: string
  centerValue: string
  centerLabel: string
}

const donutRadius = 50
const donutStrokeWidth = 10
const donutCircumference = 2 * Math.PI * donutRadius

export function DonutChart({
  segments,
  ariaLabel,
  centerValue,
  centerLabel,
  className,
  ...props
}: DonutChartProps) {
  const total = segments.reduce((sum, segment) => sum + segment.value, 0)
  const arcs = segments.reduce<{
    offset: number
    items: { segment: DonutSegment; length: number; dashOffset: number }[]
  }>(
    (acc, segment) => {
      const length = total === 0 ? 0 : (segment.value / total) * donutCircumference

      return {
        offset: acc.offset + length,
        items: [...acc.items, { segment, length, dashOffset: -acc.offset }],
      }
    },
    { offset: 0, items: [] },
  ).items

  return (
    <div
      role="img"
      aria-label={ariaLabel}
      className={cn('relative flex aspect-square items-center justify-center', className)}
      {...props}
    >
      <svg viewBox="0 0 120 120" className="absolute inset-0 h-full w-full" aria-hidden="true">
        <circle
          cx="60"
          cy="60"
          r={donutRadius}
          fill="none"
          stroke="var(--surface-sunken)"
          strokeWidth={donutStrokeWidth}
        />
        {arcs.map(({ segment, length, dashOffset }) => {
          if (length === 0) return null

          return (
            <circle
              key={segment.id}
              cx="60"
              cy="60"
              r={donutRadius}
              fill="none"
              stroke={segment.color}
              strokeWidth={donutStrokeWidth}
              strokeDasharray={`${length} ${Math.max(0, donutCircumference - length)}`}
              strokeDashoffset={dashOffset}
              transform="rotate(-90 60 60)"
            >
              <title>
                {segment.label}: {segment.value.toLocaleString()} ({segment.percentage}%)
              </title>
            </circle>
          )
        })}
      </svg>

      <div className="relative text-center">
        <p className="text-h3 font-semibold leading-none text-text-primary">{centerValue}</p>
        <p className="mt-1 text-caption text-text-tertiary">{centerLabel}</p>
      </div>
    </div>
  )
}
