import { act } from 'react'
import { createRoot, type Root } from 'react-dom/client'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

const mutationMocks = vi.hoisted(() => ({
  createFeedback: vi.fn(),
}))

vi.mock('@/features/feedback/api/queries', () => ({
  useCreateFeedback: () => ({ mutateAsync: mutationMocks.createFeedback, isPending: false }),
}))

vi.mock('@/features/sport-events', async () => {
  const { eventSummaryFixtures } = await import('@/mocks/fixtures')

  return {
    useEventsList: () => ({ data: eventSummaryFixtures, isLoading: false, error: null }),
  }
})

const { FeedbackComposeDialog } = await import('./FeedbackComposeDialog')
const { useFeedbackUiStore } = await import('../model/feedbackUiStore')
const { eventSummaryFixtures } = await import('@/mocks/fixtures')
const { mockHttpError } = await import('@/mocks/mockSwitch')

const TARGET = { id: 'member-1', name: 'Lena Roth', eventId: eventSummaryFixtures[0].id }

describe('FeedbackComposeDialog', () => {
  let container: HTMLDivElement
  let root: Root

  beforeEach(() => {
    vi.clearAllMocks()
    document.body.innerHTML = '<div id="root"></div>'
    container = document.getElementById('root') as HTMLDivElement
    root = createRoot(container)
  })

  afterEach(async () => {
    await act(async () => {
      useFeedbackUiStore.getState().closeCompose()
      root.unmount()
    })
    document.body.innerHTML = ''
  })

  async function renderOpen() {
    await act(async () => {
      root.render(<FeedbackComposeDialog />)
    })
    await act(async () => {
      useFeedbackUiStore.getState().openCompose(TARGET)
    })
  }

  async function fillField(id: string, value: string) {
    const element = document.body.querySelector<HTMLInputElement | HTMLTextAreaElement>(`#${id}`)
    expect(element, `#${id} should be rendered`).not.toBeNull()
    const prototype =
      element instanceof HTMLTextAreaElement
        ? window.HTMLTextAreaElement.prototype
        : window.HTMLInputElement.prototype
    const valueSetter = Object.getOwnPropertyDescriptor(prototype, 'value')?.set

    await act(async () => {
      valueSetter?.call(element, value)
      element?.dispatchEvent(new Event('input', { bubbles: true }))
    })
  }

  async function submitForm() {
    const form = document.body.querySelector('[role="dialog"] form')
    expect(form).not.toBeNull()
    await act(async () => {
      form?.dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }))
    })
  }

  it('shows the subject and skips the event step when an event is preselected', async () => {
    await renderOpen()

    expect(document.body.textContent).toContain('Give Feedback')
    expect(document.body.textContent).toContain(TARGET.name)
    // No event selector — straight to the details step.
    expect(document.body.querySelector('#feedback-event')).toBeNull()
    expect(document.body.querySelector('#feedback-body')).not.toBeNull()
  })

  it('requires the feedback text', async () => {
    await renderOpen()
    await submitForm()

    expect(document.body.textContent).toContain('Feedback is required.')
    expect(mutationMocks.createFeedback).not.toHaveBeenCalled()
  })

  it('rejects an out-of-range rating', async () => {
    await renderOpen()
    await fillField('feedback-body', 'Strong session.')
    await fillField('feedback-rating', '11')
    await submitForm()

    expect(document.body.textContent).toContain('Rating must be an integer from 0 to 10.')
    expect(mutationMocks.createFeedback).not.toHaveBeenCalled()
  })

  it('submits the trimmed feedback with the parsed rating and closes', async () => {
    mutationMocks.createFeedback.mockResolvedValue({ id: 'new-feedback' })

    await renderOpen()
    await fillField('feedback-body', '  Strong session.  ')
    await fillField('feedback-rating', '9')
    await submitForm()

    expect(mutationMocks.createFeedback).toHaveBeenCalledWith({
      event: TARGET.eventId,
      member: TARGET.id,
      feedback: 'Strong session.',
      rating: 9,
    })
    expect(useFeedbackUiStore.getState().composeTarget).toBeNull()
    expect(useFeedbackUiStore.getState().composeNotice).toBe(`Feedback added for ${TARGET.name}.`)
  })

  it('surfaces a server 403 as the form error and stays open', async () => {
    mutationMocks.createFeedback.mockRejectedValue(
      mockHttpError(403, 'You are not allowed to create feedback for this member'),
    )

    await renderOpen()
    await fillField('feedback-body', 'Strong session.')
    await fillField('feedback-rating', '9')
    await submitForm()

    expect(document.body.textContent).toContain(
      'You are not allowed to create feedback for this member',
    )
    expect(useFeedbackUiStore.getState().composeTarget).not.toBeNull()
  })
})
