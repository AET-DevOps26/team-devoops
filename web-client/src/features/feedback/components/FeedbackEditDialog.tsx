import { type FormEvent, useState } from 'react'

import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { serverErrorMessage } from '@/lib/server-error'
import { useUpdateFeedback } from '../api/queries'
import {
  type FeedbackEditTarget,
  useFeedbackUiStore,
} from '../model/feedbackUiStore'

function validateRating(value: string): number | null {
  if (value.trim() === '') return null

  const rating = Number(value)
  return Number.isInteger(rating) && rating >= 0 && rating <= 10 ? rating : null
}

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
  const [formError, setFormError] = useState<string | null>(null)
  const updateFeedback = useUpdateFeedback()

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    const parsedRating = validateRating(rating)

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
      await updateFeedback.mutateAsync({
        id: target.id,
        feedback: feedback.trim(),
        rating: parsedRating,
      })
      closeEdit()
    } catch (error) {
      setFormError(serverErrorMessage(error))
    }
  }

  return (
    <DialogContent>
      <DialogHeader>
        <DialogTitle>Edit feedback</DialogTitle>
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

      <form className="space-y-5" onSubmit={handleSubmit}>
        <div className="space-y-1.5">
          <Label htmlFor="feedback-edit-body">Feedback</Label>
          <Textarea
            id="feedback-edit-body"
            value={feedback}
            onChange={(event) => setFeedback(event.target.value)}
            required
            disabled={updateFeedback.isPending}
            aria-invalid={formError !== null && feedback.trim() === ''}
            className="min-h-28"
          />
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
            aria-invalid={formError !== null && validateRating(rating) === null}
          />
        </div>

        {formError && (
          <p className="border border-destructive/30 bg-destructive/10 px-3 py-2 text-body-sm text-destructive">
            {formError}
          </p>
        )}

        <DialogFooter>
          <Button
            type="button"
            variant="outline"
            onClick={closeEdit}
            disabled={updateFeedback.isPending}
          >
            Cancel
          </Button>
          <Button type="submit" disabled={updateFeedback.isPending}>
            {updateFeedback.isPending ? 'Saving' : 'Save changes'}
          </Button>
        </DialogFooter>
      </form>
    </DialogContent>
  )
}
