import { useNavigate } from 'react-router-dom'
import { Button } from '@/components/ui/button'

export function NotFoundPage() {
  const navigate = useNavigate()

  return (
    <div className="flex min-h-[calc(100dvh-3rem)] flex-col items-center justify-center gap-4 text-center">
      <div className="space-y-2">
        <h1 className="font-display text-display-md uppercase tracking-wide text-balance text-foreground">
          404 - Page not found
        </h1>
        <p className="text-body-sm text-muted-foreground sm:text-body">
          The page you&apos;re looking for doesn&apos;t exist.
        </p>
      </div>
      <Button variant="outline" onClick={() => window.history.back()}>
        Go back
      </Button>
      <Button onClick={() => void navigate('/')}>
        Go home
      </Button>
    </div>
  )
}
