import { beforeEach, describe, expect, it, vi } from 'vitest'

import { httpError } from '@/testing/httpError'

const toastMocks = vi.hoisted(() => ({
  error: vi.fn(),
}))

vi.mock('sonner', () => ({ toast: toastMocks }))

const { formMutationErrorFields, notifyMutationError } = await import('./mutation-feedback')

describe('mutation feedback', () => {
  beforeEach(() => {
    toastMocks.error.mockReset()
  })

  it('shows action failures as a titled error toast', () => {
    notifyMutationError(httpError(409, 'The member is still assigned to a team.'), 'Member not deleted')

    expect(toastMocks.error).toHaveBeenCalledWith('Member not deleted', {
      description: 'The member is still assigned to a team.',
    })
  })

  it('returns form field errors without showing a duplicate toast', () => {
    const fields = formMutationErrorFields(
      httpError(400, 'Validation failed', [{ message: 'first_name: must not be blank' }]),
      'Member not saved',
    )

    expect(fields).toEqual({ first_name: 'must not be blank' })
    expect(toastMocks.error).not.toHaveBeenCalled()
  })

  it('shows non-field form failures as error toasts', () => {
    const fields = formMutationErrorFields(
      httpError(503, 'Internal upstream detail'),
      'Profile not updated',
    )

    expect(fields).toBeNull()
    expect(toastMocks.error).toHaveBeenCalledWith('Profile not updated', {
      description: 'The service is unavailable right now. Try again in a moment.',
    })
  })
})
