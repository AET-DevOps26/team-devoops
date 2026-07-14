import { type FormEvent, useState } from 'react'
import { toast } from 'sonner'

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { PendingButton } from '@/components/ui/pending-button'
import { Textarea } from '@/components/ui/textarea'
import { formMutationErrorFields } from '@/lib/mutation-feedback'
import { fieldError } from '@/lib/validation'
import { mutationFeedbackCopy } from '@/lib/mutation-feedback-copy'
import { useUpdateFeedback } from '../api/queries'
import { parseFeedbackRating, validateFeedbackEditForm } from '../model/feedbackEditor'
import {
  type FeedbackEditTarget,
  useFeedbackUiStore,
} from '../model/feedbackUiStore'

export function FeedbackEditDialog() {
  const target = useFeedbackUiStore((state) => state.editTarget)
  const closeEdit = useFeedbackUiStore((state) => state.closeEdit)

  return (
    <Dialog open={target !== null} onOpenChange={(open) => !open && closeEdit()}>
      {target && <FeedbackEditForm key={target.id} target={target} />}
    </Dialog>
  )
}

function FeedbackEditForm({ target }: { target: FeedbackEditTarget }) {
  const closeEdit = useFeedbackUiStore((state) => state.closeEdit)
  const [feedback, setFeedback] = useState(target.feedback)
  const [rating, setRating] = useState(String(target.rating))
  const [fieldErrors, setFieldErrors] = useState<Record<string, string> | null>(null)
  const updateFeedback = useUpdateFeedback()
  const feedbackError = fieldError(fieldErrors, 'feedback')
  const ratingError = fieldError(fieldErrors, 'rating')

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setFieldErrors(null)

    const validationErrors = validateFeedbackEditForm({ feedback, rating })
    if (validationErrors) {
      setFieldErrors(validationErrors)
      return
    }

    const parsedRating = parseFeedbackRating(rating)
    if (parsedRating === null) return

    try {
      await updateFeedback.mutateAsync({
        id: target.id,
        feedback: feedback.trim(),
        rating: parsedRating,
      })
      toast.success('Feedback updated.')
      closeEdit()
    } catch (error) {
      setFieldErrors(formMutationErrorFields(error, mutationFeedbackCopy.feedback.update))
    }
  }

  return (
    <DialogContent dismissOnInteractOutside={false}>
      <DialogHeader>
        <DialogTitle>Edit feedback</DialogTitle>
        <DialogDescription className="sr-only">
          Update the feedback text and rating.
        </DialogDescription>
      </DialogHeader>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="space-y-1.5">
          <Label>Event</Label>
          <p className="border-b border-input py-2 text-body-sm font-medium">{target.eventName}</p>
        </div>
        <div className="space-y-1.5">
          <Label>About</Label>
          <p className="border-b border-input py-2 text-body-sm font-medium">{target.memberName}</p>
        </div>
      </div>

      <form className="space-y-5" onSubmit={handleSubmit} noValidate>
        <div className="space-y-1.5">
          <Label htmlFor="feedback-edit-body">Feedback</Label>
          <Textarea
            id="feedback-edit-body"
            value={feedback}
            onChange={(event) => setFeedback(event.target.value)}
            required
            disabled={updateFeedback.isPending}
            aria-invalid={feedbackError !== undefined}
            className="min-h-28"
          />
          {feedbackError && (
            <p className="text-caption text-destructive">{feedbackError}</p>
          )}
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="feedback-edit-rating">Rating</Label>
          <Input
            id="feedback-edit-rating"
            type="number"
            min={0}
            max={10}
            step={1}
            inputMode="numeric"
            value={rating}
            onChange={(event) => setRating(event.target.value)}
            required
            disabled={updateFeedback.isPending}
            aria-invalid={ratingError !== undefined}
          />
          {ratingError && (
            <p className="text-caption text-destructive">{ratingError}</p>
          )}
        </div>

        <DialogFooter>
          <Button
            type="button"
            variant="outline"
            onClick={closeEdit}
            disabled={updateFeedback.isPending}
          >
            Cancel
          </Button>
          <PendingButton
            type="submit"
            isPending={updateFeedback.isPending}
            pendingLabel="Saving…"
          >
            Save changes
          </PendingButton>
        </DialogFooter>
      </form>
    </DialogContent>
  )
}
