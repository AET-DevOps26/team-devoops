import { z } from 'zod'

import { type FieldErrors, pickFieldErrors, validateZodSchema } from '@/lib/validation'

export interface FeedbackComposeFormState {
  eventId: string
  feedback: string
  rating: string
}

export interface FeedbackEditFormState {
  feedback: string
  rating: string
}

const feedbackDetailsSchema = z.object({
  feedback: z.string().trim().min(1, { message: 'Feedback is required.' }),
  rating: z.string().refine((value) => parseFeedbackRating(value) !== null, {
    message: 'Rating must be an integer from 0 to 10.',
  }),
})

const feedbackComposeSchema = feedbackDetailsSchema.extend({
  eventId: z.string().trim().min(1, { message: 'Select an event.' }),
})

export function parseFeedbackRating(value: string): number | null {
  if (value.trim() === '') return null

  const rating = Number(value)
  return Number.isInteger(rating) && rating >= 0 && rating <= 10 ? rating : null
}

export function validateFeedbackComposeForm(
  form: FeedbackComposeFormState,
  fields?: readonly (keyof FeedbackComposeFormState)[],
): FieldErrors | null {
  return pickFieldErrors(validateZodSchema(feedbackComposeSchema, form), fields ?? Object.keys(form))
}

export function validateFeedbackEditForm(form: FeedbackEditFormState): FieldErrors | null {
  return validateZodSchema(feedbackDetailsSchema, form)
}
