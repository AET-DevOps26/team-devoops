import { type FormEvent, useMemo, useState } from 'react'
import { toast } from 'sonner'

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { type DialogStep, DialogStepperFooter, DialogStepperNav } from '@/components/ui/dialog-stepper'
import { ErrorNotice } from '@/components/ui/ErrorNotice'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { useEventsList } from '@/features/sport-events'
import { formatDateShort } from '@/lib/format'
import { formMutationErrorFields } from '@/lib/mutation-feedback'
import { serverErrorMessage } from '@/lib/server-error'
import { fieldError } from '@/lib/validation'
import { mutationFeedbackCopy } from '@/lib/mutation-feedback-copy'
import { useCreateFeedback } from '../api/queries'
import {
  parseFeedbackRating,
  validateFeedbackComposeForm,
} from '../model/feedbackEditor'
import {
  type FeedbackComposeTarget,
  useFeedbackUiStore,
} from '../model/feedbackUiStore'

export function FeedbackComposeDialog() {
  const target = useFeedbackUiStore((state) => state.composeTarget)
  const closeCompose = useFeedbackUiStore((state) => state.closeCompose)

  return (
    <Dialog open={target !== null} onOpenChange={(open) => !open && closeCompose()}>
      {target && <FeedbackComposeForm key={`${target.id}:${target.eventId ?? ''}`} target={target} />}
    </Dialog>
  )
}

function FeedbackComposeForm({ target }: { target: FeedbackComposeTarget }) {
  const closeCompose = useFeedbackUiStore((state) => state.closeCompose)
  const [eventId, setEventId] = useState(target.eventId ?? '')
  const [feedback, setFeedback] = useState('')
  const [rating, setRating] = useState('')
  const [fieldErrors, setFieldErrors] = useState<Record<string, string> | null>(null)
  const eventsQuery = useEventsList()
  const createFeedback = useCreateFeedback()
  const skipEventStep = target.eventId !== undefined
  const steps: DialogStep[] = useMemo(
    () =>
      skipEventStep
        ? [{ id: 'details', label: 'Details' }]
        : [
            { id: 'event', label: 'Event' },
            { id: 'details', label: 'Details' },
          ],
    [skipEventStep],
  )
  const [stepIndex, setStepIndex] = useState(0)
  const isFirstStep = stepIndex === 0
  const isLastStep = stepIndex === steps.length - 1
  const eventError = fieldError(fieldErrors, 'eventId', 'event')
  const feedbackError = fieldError(fieldErrors, 'feedback')
  const ratingError = fieldError(fieldErrors, 'rating')

  const eventOptions = useMemo(
    () =>
      (eventsQuery.data ?? [])
        .map((event) => ({
          value: event.id,
          label: `${event.name} - ${formatDateShort(event.start_time)}`,
        }))
        .toSorted((a, b) => a.label.localeCompare(b.label)),
    [eventsQuery.data],
  )

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setFieldErrors(null)

    if (steps[stepIndex].id === 'event') {
      const validationErrors = validateFeedbackComposeForm(
        { eventId, feedback, rating },
        ['eventId'],
      )
      if (validationErrors) {
        setFieldErrors(validationErrors)
        return
      }
      setStepIndex((current) => current + 1)
      return
    }

    const validationErrors = validateFeedbackComposeForm({ eventId, feedback, rating })
    if (validationErrors) {
      setFieldErrors(validationErrors)
      return
    }

    const parsedRating = parseFeedbackRating(rating)
    if (parsedRating === null) return

    try {
      await createFeedback.mutateAsync({
        event: eventId,
        member: target.id,
        feedback: feedback.trim(),
        rating: parsedRating,
      })
      toast.success(`Feedback added for ${target.name}.`)
      closeCompose()
    } catch (error) {
      setFieldErrors(formMutationErrorFields(error, mutationFeedbackCopy.feedback.create))
    }
  }

  return (
    <DialogContent dismissOnInteractOutside={false}>
      <DialogHeader>
        <DialogTitle>Give Feedback</DialogTitle>
        <DialogDescription className="sr-only">
          Choose an event, write feedback, and assign a rating.
        </DialogDescription>
      </DialogHeader>

      <div className="space-y-1.5">
        <Label>Subject</Label>
        <p className="border-b border-input py-2 text-body-sm font-medium">{target.name}</p>
      </div>

      {steps.length > 1 && <DialogStepperNav steps={steps} currentStep={stepIndex} />}

      <form className="space-y-5" onSubmit={handleSubmit} noValidate>
        {steps[stepIndex].id === 'event' && (
          <div className="space-y-1.5">
            <Label htmlFor="feedback-event">Event</Label>
            <Select
              value={eventId}
              onValueChange={setEventId}
              disabled={eventsQuery.isLoading || createFeedback.isPending}
            >
              <SelectTrigger
                id="feedback-event"
                className="w-full"
                aria-invalid={eventError !== undefined}
              >
                <SelectValue
                  placeholder={eventsQuery.isLoading ? 'Loading events' : 'Select event'}
                />
              </SelectTrigger>
              <SelectContent>
                {eventOptions.map((event) => (
                  <SelectItem key={event.value} value={event.value}>
                    {event.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {eventError && (
              <p className="text-caption text-destructive">{eventError}</p>
            )}
            {eventsQuery.error && (
              <ErrorNotice
                message={serverErrorMessage(eventsQuery.error)}
                onRetry={() => void eventsQuery.refetch()}
                compact
              />
            )}
            {!eventsQuery.isLoading && !eventsQuery.error && eventOptions.length === 0 && (
              <p className="text-caption text-text-tertiary">No events available.</p>
            )}
          </div>
        )}

        {steps[stepIndex].id === 'details' && (
          <div className="space-y-5">
            <div className="space-y-1.5">
              <Label htmlFor="feedback-body">Feedback</Label>
              <Textarea
                id="feedback-body"
                value={feedback}
                onChange={(event) => setFeedback(event.target.value)}
                required
                disabled={createFeedback.isPending}
                aria-invalid={feedbackError !== undefined}
                className="min-h-28"
              />
              {feedbackError && (
                <p className="text-caption text-destructive">{feedbackError}</p>
              )}
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="feedback-rating">Rating</Label>
              <Input
                id="feedback-rating"
                type="number"
                min={0}
                max={10}
                step={1}
                inputMode="numeric"
                value={rating}
                onChange={(event) => setRating(event.target.value)}
                required
                disabled={createFeedback.isPending}
                aria-invalid={ratingError !== undefined}
              />
              {ratingError && (
                <p className="text-caption text-destructive">{ratingError}</p>
              )}
            </div>
          </div>
        )}

        <DialogStepperFooter
          isFirstStep={isFirstStep}
          isLastStep={isLastStep}
          isPending={createFeedback.isPending}
          nextLabel="Next"
          submitLabel="Save Feedback"
          onCancel={closeCompose}
          onBack={() => {
            setStepIndex((current) => Math.max(current - 1, 0))
          }}
        />
      </form>
    </DialogContent>
  )
}
