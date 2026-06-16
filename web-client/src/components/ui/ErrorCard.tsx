import { AlertCircle } from 'lucide-react'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'

interface ErrorCardAction {
  label: string
  onClick: () => void
}

interface ErrorCardProps {
  title: string
  description: string
  alertTitle?: string
  alertDescription?: string
  actions?: ErrorCardAction[]
}

export function ErrorCard({
  title,
  description,
  alertTitle = 'Error',
  alertDescription = 'If this keeps happening, contact support.',
  actions = [{ label: 'Try again', onClick: () => window.location.reload() }],
}: ErrorCardProps) {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-4">
      <Card className="w-full max-w-sm">
        <CardHeader>
          <CardTitle>{title}</CardTitle>
          <CardDescription>{description}</CardDescription>
        </CardHeader>
        <CardContent>
          <Alert variant="destructive">
            <AlertCircle className="size-4" />
            <AlertTitle>{alertTitle}</AlertTitle>
            <AlertDescription>{alertDescription}</AlertDescription>
          </Alert>
        </CardContent>
        <CardFooter className="gap-3">
          {actions.map((action) => (
            <Button key={action.label} className="flex-1" onClick={action.onClick}>
              {action.label}
            </Button>
          ))}
        </CardFooter>
      </Card>
    </div>
  )
}
