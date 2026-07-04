import type { ComponentProps } from 'react'
import type { LucideIcon } from 'lucide-react'

import { Button } from '@/components/ui/button'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import { cn } from '@/lib/utils'

type RowActionsProps = ComponentProps<'div'>

type RowActionButtonProps = Omit<
  ComponentProps<typeof Button>,
  'children' | 'size' | 'variant'
> & {
  icon: LucideIcon
  label: string
  destructive?: boolean
}

export function RowActions({ className, ...props }: RowActionsProps) {
  return (
    <TooltipProvider>
      <div className={cn('flex items-center justify-end gap-1', className)} {...props} />
    </TooltipProvider>
  )
}

export function RowActionButton({
  className,
  destructive = false,
  icon: Icon,
  label,
  type = 'button',
  'aria-label': ariaLabel,
  ...props
}: RowActionButtonProps) {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button
          type={type}
          variant="ghost"
          size="icon-sm"
          aria-label={ariaLabel ?? label}
          className={cn(
            'text-text-tertiary hover:text-text-primary',
            destructive && 'text-destructive hover:text-destructive',
            className,
          )}
          {...props}
        >
          <Icon aria-hidden="true" />
          <span className="sr-only">{label}</span>
        </Button>
      </TooltipTrigger>
      <TooltipContent sideOffset={4}>{label}</TooltipContent>
    </Tooltip>
  )
}
