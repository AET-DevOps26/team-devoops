import { Check, Info, TriangleAlert, XCircle } from 'lucide-react'
import { Toaster as Sonner, type ToasterProps } from 'sonner'

import { useTheme } from '@/app/theme/useTheme'

// Toasts share the app's crisp, square geometry. A quiet tinted rail and icon tile make the
// status scannable without turning the whole notification into a loud coloured surface.
//
// Sonner already renders its toasts inside an aria-live="polite" region labelled by
// `containerAriaLabel`, so we must NOT wrap it in a live region of our own — nesting two makes
// announcements duplicate or drop. Tests reach toasts through that region (see e2e toastRegion).
export const TOAST_CONTAINER_LABEL = 'Notifications'

function Toaster({ ...props }: ToasterProps) {
  const { theme } = useTheme()

  return (
    <Sonner
      containerAriaLabel={TOAST_CONTAINER_LABEL}
      theme={theme}
      className="toaster group"
      position="top-right"
      duration={4000}
      gap={10}
      offset={{ top: 20, right: 20 }}
      mobileOffset={{ top: 12, right: 12, left: 12 }}
      icons={{
        success: <Check className="size-4" strokeWidth={2.5} />,
        error: <XCircle className="size-5" />,
        warning: <TriangleAlert className="size-5" />,
        info: <Info className="size-5" />,
      }}
      toastOptions={{
        unstyled: true,
        classNames: {
          toast:
            'group relative flex min-h-16 w-[calc(100vw-1.5rem)] max-w-[25rem] items-center gap-3 overflow-hidden border border-border/90 bg-popover/95 py-3 pl-3 pr-4 text-text-primary shadow-[0_14px_40px_-18px_oklch(0.14_0.01_286/0.45)] backdrop-blur-md ' +
            'before:absolute before:inset-y-0 before:left-0 before:w-1 before:bg-border before:content-[""]',
          icon: 'flex size-9 shrink-0 items-center justify-center bg-surface-sunken text-text-secondary [&>svg]:size-4.5',
          content: 'flex min-w-0 flex-1 flex-col justify-center gap-0.5',
          title: 'text-body-sm font-semibold leading-5 tracking-[-0.015em]',
          description: 'text-caption leading-4 text-text-secondary',
          success: 'before:bg-primary [&_[data-icon]]:bg-primary/12 [&_[data-icon]]:text-[oklch(0.48_0.16_130.85)] dark:[&_[data-icon]]:text-primary',
          error:
            'before:bg-destructive [&_[data-icon]]:bg-destructive/10 [&_[data-icon]]:text-destructive',
          // No warning token in the theme; use the same amber the StatCard "positive/negative"
          // tones use inline, so warnings still read as amber without an unbacked utility.
          warning:
            'before:bg-[oklch(0.75_0.15_75)] [&_[data-icon]]:bg-[oklch(0.75_0.15_75/0.12)] [&_[data-icon]]:text-[oklch(0.55_0.14_75)] dark:[&_[data-icon]]:text-[oklch(0.8_0.14_75)]',
          info: 'before:bg-accent-foreground [&_[data-icon]]:bg-accent [&_[data-icon]]:text-accent-foreground',
          actionButton:
            'shrink-0 border border-primary bg-primary px-3 py-1.5 text-caption font-semibold text-primary-foreground transition-opacity hover:opacity-90',
          cancelButton:
            'shrink-0 border border-border bg-surface-sunken px-3 py-1.5 text-caption font-semibold text-text-secondary transition-colors hover:text-text-primary',
        },
      }}
      {...props}
    />
  )
}

export { Toaster }
