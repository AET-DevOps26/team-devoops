import { type FormEvent, useMemo, useState } from 'react'

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { type DialogStep, DialogStepperFooter, DialogStepperNav } from '@/components/ui/dialog-stepper'
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
import { serverErrorMessage } from '@/lib/server-error'
import { useCreateFeedback } from '../api/queries'
import {
  type FeedbackComposeTarget,
  useFeedbackUiStore,
} from '../model/feedbackUiStore'

function validateRating(value: string): number | null {
  if (value.trim() === '') return null

  const rating = Number(value)
  return Number.isInteger(rating) && rating >= 0 && rating <= 10 ? rating : null
}

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
  const setComposeNotice = useFeedbackUiStore((state) => state.setComposeNotice)
  const [eventId, setEventId] = useState(target.eventId ?? '')
  const [feedback, setFeedback] = useState('')
  const [rating, setRating] = useState('')
  const [formError, setFormError] = useState<string | null>(null)
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

    if (steps[stepIndex].id === 'event') {
      if (!eventId) {
        setFormError('Select an event.')
        return
      }
      setFormError(null)
      setStepIndex((current) => current + 1)
      return
    }

    const parsedRating = validateRating(rating)

    if (!eventId) {
      setFormError('Select an event.')
      return
    }
    if (!feedback.trim()) {
      setFormError('Feedback is required.')
      return
    }
    if (parsedRating === null) {
      setFormError('Rating must be an integer from 0 to 10.')
      return
    }

    setFormError(null)

    try {
      await createFeedback.mutateAsync({
        event: eventId,
        member: target.id,
        feedback: feedback.trim(),
        rating: parsedRating,
      })
      setComposeNotice(`Feedback added for ${target.name}.`)
      closeCompose()
    } catch (error) {
      setFormError(serverErrorMessage(error))
    }
  }

  return (
    <DialogContent>
      <DialogHeader>
        <DialogTitle>Give Feedback</DialogTitle>
      </DialogHeader>

      <div className="space-y-1.5">
        <Label>Subject</Label>
        <p className="border-b border-input py-2 text-body-sm font-medium">{target.name}</p>
      </div>

      {steps.length > 1 && <DialogStepperNav steps={steps} currentStep={stepIndex} />}

      <form className="space-y-5" onSubmit={handleSubmit}>
        {steps[stepIndex].id === 'event' && (
          <div className="space-y-1.5">
            <Label htmlFor="feedback-event">Event</Label>
            <Select
              value={eventId}
              onValueChange={setEventId}
              disabled={eventsQuery.isLoading || createFeedback.isPending}
            >
              <SelectTrigger id="feedback-event" className="w-full">
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
            {eventsQuery.error && (
              <p className="text-caption text-destructive">
                {serverErrorMessage(eventsQuery.error)}
              </p>
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
                aria-invalid={formError !== null && feedback.trim() === ''}
                className="min-h-28"
              />
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
                aria-invalid={formError !== null && validateRating(rating) === null}
              />
            </div>
          </div>
        )}

        {formError && (
          <p className="border border-destructive/30 bg-destructive/10 px-3 py-2 text-body-sm text-destructive">
            {formError}
          </p>
        )}

        <DialogStepperFooter
          isFirstStep={isFirstStep}
          isLastStep={isLastStep}
          isPending={createFeedback.isPending}
          nextLabel="Next"
          submitLabel="Save Feedback"
          onCancel={closeCompose}
          onBack={() => {
            setFormError(null)
            setStepIndex((current) => Math.max(current - 1, 0))
          }}
        />
      </form>
    </DialogContent>
  )
}

export function FeedbackComposeNotice() {
  const notice = useFeedbackUiStore((state) => state.composeNotice)

  if (!notice) return null

  return (
    <p
      role="status"
      className="border border-primary/25 bg-primary/8 px-4 py-3 text-body-sm text-text-primary"
    >
      {notice}
    </p>
  )
}
