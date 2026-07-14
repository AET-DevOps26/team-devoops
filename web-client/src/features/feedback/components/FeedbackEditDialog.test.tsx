import { act } from 'react'
import { createRoot, type Root } from 'react-dom/client'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

const mutationMocks = vi.hoisted(() => ({
  updateFeedback: vi.fn(),
}))

vi.mock('@/features/feedback/api/queries', () => ({
  useUpdateFeedback: () => ({ mutateAsync: mutationMocks.updateFeedback, isPending: false }),
}))

const { FeedbackEditDialog } = await import('./FeedbackEditDialog')
const { useFeedbackUiStore } = await import('../model/feedbackUiStore')
const { httpError } = await import('@/testing/httpError')

const TARGET = {
  id: 'feedback-1',
  memberName: 'Lena Roth',
  eventName: 'Football Juniors Match',
  feedback: 'Solid defending.',
  rating: 7,
}

describe('FeedbackEditDialog', () => {
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
      useFeedbackUiStore.getState().closeEdit()
      root.unmount()
    })
    document.body.innerHTML = ''
  })

  async function renderOpen() {
    await act(async () => {
      root.render(<FeedbackEditDialog />)
    })
    await act(async () => {
      useFeedbackUiStore.getState().openEdit(TARGET)
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

  it('prefills the target feedback and shows the read-only context', async () => {
    await renderOpen()

    expect(document.body.textContent).toContain(TARGET.eventName)
    expect(document.body.textContent).toContain(TARGET.memberName)
    expect(
      document.body.querySelector<HTMLTextAreaElement>('#feedback-edit-body')?.value,
    ).toBe(TARGET.feedback)
    expect(
      document.body.querySelector<HTMLInputElement>('#feedback-edit-rating')?.value,
    ).toBe(String(TARGET.rating))
  })

  it('requires feedback text and an in-range rating', async () => {
    await renderOpen()

    await fillField('feedback-edit-body', '   ')
    await submitForm()
    expect(document.body.textContent).toContain('Feedback is required.')

    await fillField('feedback-edit-body', 'Better positioning now.')
    await fillField('feedback-edit-rating', '11')
    await submitForm()
    expect(document.body.textContent).toContain('Rating must be an integer from 0 to 10.')
    expect(mutationMocks.updateFeedback).not.toHaveBeenCalled()
  })

  it('submits the trimmed update and closes on success', async () => {
    mutationMocks.updateFeedback.mockResolvedValue({ id: TARGET.id })

    await renderOpen()
    await fillField('feedback-edit-body', '  Better positioning now.  ')
    await fillField('feedback-edit-rating', '9')
    await submitForm()

    expect(mutationMocks.updateFeedback).toHaveBeenCalledWith({
      id: TARGET.id,
      feedback: 'Better positioning now.',
      rating: 9,
    })
    expect(useFeedbackUiStore.getState().editTarget).toBeNull()
  })

  it('surfaces a server 403 and stays open', async () => {
    mutationMocks.updateFeedback.mockRejectedValue(
      httpError(403, 'You are not allowed to update this feedback'),
    )

    await renderOpen()
    await submitForm()

    expect(document.body.textContent).toContain('You are not allowed to update this feedback')
    expect(useFeedbackUiStore.getState().editTarget).not.toBeNull()
  })
})
