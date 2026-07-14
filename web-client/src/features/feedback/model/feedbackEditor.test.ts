import { describe, expect, it } from 'vitest'

import {
  parseFeedbackRating,
  validateFeedbackComposeForm,
  validateFeedbackEditForm,
} from './feedbackEditor'

describe('feedback editor validation', () => {
  it('accepts valid compose and edit forms', () => {
    expect(
      validateFeedbackComposeForm({
        eventId: 'event-1',
        feedback: 'Strong session.',
        rating: '9',
      }),
    ).toBeNull()
    expect(validateFeedbackEditForm({ feedback: 'Strong session.', rating: '9' })).toBeNull()
    expect(parseFeedbackRating('9')).toBe(9)
  })

  it('validates compose fields by form-state key', () => {
    expect(
      validateFeedbackComposeForm({
        eventId: '',
        feedback: 'Strong session.',
        rating: '9',
      }),
    ).toEqual({ eventId: 'Select an event.' })
    expect(
      validateFeedbackComposeForm({
        eventId: 'event-1',
        feedback: ' ',
        rating: '9',
      }),
    ).toEqual({ feedback: 'Feedback is required.' })
    expect(
      validateFeedbackComposeForm({
        eventId: 'event-1',
        feedback: 'Strong session.',
        rating: '11',
      }),
    ).toEqual({ rating: 'Rating must be an integer from 0 to 10.' })
  })

  it('validates edit fields by form-state key', () => {
    expect(validateFeedbackEditForm({ feedback: '', rating: '9' })).toEqual({
      feedback: 'Feedback is required.',
    })
    expect(validateFeedbackEditForm({ feedback: 'Strong session.', rating: '4.5' })).toEqual({
      rating: 'Rating must be an integer from 0 to 10.',
    })
  })

  it('can scope compose validation to the event step', () => {
    expect(
      validateFeedbackComposeForm(
        { eventId: '', feedback: '', rating: '' },
        ['eventId'],
      ),
    ).toEqual({ eventId: 'Select an event.' })
  })
})
