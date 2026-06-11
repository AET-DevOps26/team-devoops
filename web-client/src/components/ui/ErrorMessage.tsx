import { AlertCircle } from 'lucide-react'

export function ErrorMessage({ message }: { message: string }) {
  return (
    <div className="flex items-center gap-2 text-destructive text-body-sm">
      <AlertCircle className="size-4 shrink-0" />
      <span>{message}</span>
    </div>
  )
}
