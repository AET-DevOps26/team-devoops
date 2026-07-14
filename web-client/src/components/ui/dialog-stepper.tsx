import { CheckIcon } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { DialogFooter } from '@/components/ui/dialog'
import { PendingButton } from '@/components/ui/pending-button'
import { cn } from '@/lib/utils'

export interface DialogStep {
  id: string
  label: string
}

interface DialogStepperProps {
  steps: DialogStep[]
  currentStep: number
}

export function DialogStepperNav({ steps, currentStep }: DialogStepperProps) {
  const gapClass = stepGapClass(steps.length)
  const connectorWidthClass = stepConnectorWidthClass(steps.length)

  return (
    <ol aria-label="Progress" className={cn('flex items-center justify-center py-2', gapClass)}>
      {steps.map((step, index) => {
        const isComplete = index < currentStep
        const isCurrent = index === currentStep

        return (
          <li
            key={step.id}
            className="flex items-center gap-2"
            aria-current={isCurrent ? 'step' : undefined}
          >
            <div className="flex items-center gap-2">
              <span
                className={cn(
                  'flex size-6 shrink-0 items-center justify-center rounded-full border text-[0.6875rem] font-semibold',
                  isComplete && 'border-primary bg-primary text-primary-foreground',
                  isCurrent && 'border-primary text-primary',
                  !isComplete && !isCurrent && 'border-border text-text-tertiary',
                )}
              >
                {isComplete ? <CheckIcon className="size-3.5" /> : index + 1}
              </span>
              <span
                className={cn(
                  'hidden text-caption font-medium sm:inline',
                  isCurrent ? 'text-text-primary' : 'text-text-tertiary',
                )}
              >
                {step.label}
              </span>
            </div>
            {index < steps.length - 1 && (
              <span
                className={cn('h-px', connectorWidthClass, isComplete ? 'bg-primary' : 'bg-border')}
                aria-hidden="true"
              />
            )}
          </li>
        )
      })}
    </ol>
  )
}

// Fewer steps get more breathing room per gap/connector; more steps compact down so the
// row still fits the dialog width instead of overflowing or wrapping.
function stepGapClass(stepCount: number): string {
  if (stepCount <= 3) return 'gap-4'
  if (stepCount <= 5) return 'gap-2'
  return 'gap-1'
}

function stepConnectorWidthClass(stepCount: number): string {
  if (stepCount <= 3) return 'w-12 sm:w-20'
  if (stepCount <= 5) return 'w-8 sm:w-12'
  return 'w-4 sm:w-8'
}

interface DialogStepperFooterProps {
  isFirstStep: boolean
  isLastStep: boolean
  isPending: boolean
  nextLabel?: string
  submitLabel: string
  onCancel: () => void
  onBack: () => void
}

export function DialogStepperFooter({
  isFirstStep,
  isLastStep,
  isPending,
  nextLabel = 'Next',
  submitLabel,
  onCancel,
  onBack,
}: DialogStepperFooterProps) {
  return (
    <DialogFooter>
      <Button
        type="button"
        variant="outline"
        onClick={isFirstStep ? onCancel : onBack}
        disabled={isPending}
      >
        {isFirstStep ? 'Cancel' : 'Back'}
      </Button>
      <PendingButton type="submit" isPending={isPending} pendingLabel="Saving…">
        {isLastStep ? submitLabel : nextLabel}
      </PendingButton>
    </DialogFooter>
  )
}
