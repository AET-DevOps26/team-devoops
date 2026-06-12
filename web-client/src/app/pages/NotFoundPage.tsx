import { router } from '@/app/router/routes'
import { Button } from '@/components/ui/button'

export function NotFoundPage() {
  return (
    <div className="flex min-h-[calc(100vh-8rem)] flex-col items-center justify-center gap-4 text-center">
      <div className="space-y-2">
        <h1 className="text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
          Page not found
        </h1>
        <p className="text-sm text-muted-foreground sm:text-base">
          The page you&apos;re looking for doesn&apos;t exist.
        </p>
      </div>
      <Button variant="outline" onClick={() => window.history.back()}>
        Go back
      </Button>
      <Button onClick={() => void router.navigate('/')}>
        Go home
      </Button>
    </div>
  )
}
