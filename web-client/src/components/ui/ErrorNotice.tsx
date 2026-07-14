import { AlertCircle, RotateCw } from 'lucide-react'

import { Alert, AlertAction, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

interface ErrorNoticeProps {
  title?: string
  message: string
  onRetry?: () => void
  retryLabel?: string
  compact?: boolean
  className?: string
}

/**
 * Shared inline error UI for query/detail failures. Not for render crashes (GlobalErrorBoundary)
 * or auth bootstrap failures (AuthenticatedApp) — those keep using ErrorCard.
 */
export function ErrorNotice({
  title = 'Something went wrong',
  message,
  onRetry,
  retryLabel = 'Try again',
  compact = false,
  className,
}: ErrorNoticeProps) {
  return (
    <Alert variant="destructive" className={cn(compact && 'px-3 py-2', className)}>
      <AlertCircle />
      {!compact && <AlertTitle>{title}</AlertTitle>}
      <AlertDescription>{message}</AlertDescription>
      {onRetry && (
        <AlertAction>
          <Button
            type="button"
            variant="outline"
            size={compact ? 'icon-xs' : 'sm'}
            aria-label={compact ? retryLabel : undefined}
            onClick={onRetry}
          >
            {compact ? <RotateCw /> : retryLabel}
          </Button>
        </AlertAction>
      )}
    </Alert>
  )
}
