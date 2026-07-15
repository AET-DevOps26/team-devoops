import { useEffect } from 'react'
import { isRouteErrorResponse, useRouteError } from 'react-router-dom'
import { RotateCw } from 'lucide-react'
import { Alert, AlertAction, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Button } from '@/components/ui/button'

// Route-level errorElement: catches render crashes inside the routed tree so they land
// here (inside AppShell, sidebar intact) instead of react-router's default dev overlay.
export function RouteErrorPage() {
  const error = useRouteError()

  useEffect(() => {
    if (import.meta.env.DEV) {
      console.error('RouteErrorPage caught a routing/render error', error)
    }
  }, [error])

  const description = isRouteErrorResponse(error)
    ? `${error.status}${error.statusText ? ` ${error.statusText}` : ''}`
    : 'An unexpected error occurred while loading this page.'

  return (
    <div className="flex min-h-[calc(100dvh-3rem)] flex-col items-center justify-center gap-4 text-center">
      <div className="w-full max-w-sm text-left">
        <Alert variant="destructive">
          <AlertTitle>Something went wrong</AlertTitle>
          <AlertDescription>{description}</AlertDescription>
          <AlertAction>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => window.location.reload()}
            >
              <RotateCw />
              Reload
            </Button>
          </AlertAction>
        </Alert>
      </div>
    </div>
  )
}
