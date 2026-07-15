import { describe, expect, it } from 'vitest'
import { httpError } from '@/testing/httpError'
import { classifyError, parseServerError, serverErrorFieldMessages, serverErrorMessage } from './server-error'

function networkError(message = 'Network Error'): Error {
  return Object.assign(new Error(message), { isAxiosError: true, response: undefined })
}

function helperError(status: number, error: string): Error {
  return Object.assign(new Error(error), {
    isAxiosError: true,
    response: { status, data: { error } },
  })
}

function responseError(status: number, data: unknown): Error {
  return Object.assign(new Error('Request failed'), {
    isAxiosError: true,
    response: { status, data },
  })
}

describe('parseServerError', () => {
  it('reads a Spring { message } body', () => {
    const parsed = parseServerError(httpError(409, 'Member already exists'))
    expect(parsed.kind).toBe('conflict')
    expect(parsed.status).toBe(409)
    expect(parsed.message).toBe('Member already exists')
    expect(parsed.fieldErrors).toBeNull()
  })

  it('reads a helper Flask { error } body, using safe copy for 5xx', () => {
    const parsed = parseServerError(helperError(502, 'Upstream model unavailable'))
    expect(parsed.kind).toBe('server')
    expect(parsed.message).toBe('The service is unavailable right now. Try again in a moment.')
  })

  it('reads a helper Flask { error } body for a 4xx status', () => {
    const parsed = parseServerError(helperError(404, 'No summary available for this member'))
    expect(parsed.kind).toBe('notFound')
    expect(parsed.message).toBe('No summary available for this member')
  })

  it('maps errors: [{ message: "field: reason" }] onto field names', () => {
    const parsed = parseServerError(
      httpError(400, 'Validation failed', [
        { message: 'first_name: must not be blank' },
        { message: 'email: must be a valid email' },
      ]),
    )
    expect(parsed.kind).toBe('validation')
    expect(parsed.fieldErrors).toEqual({
      first_name: 'must not be blank',
      email: 'must be a valid email',
    })
  })

  it('only exposes field errors from validation responses', () => {
    const data = {
      message: 'Internal Server Error',
      errors: [{ message: 'stack: internal implementation detail' }],
    }

    const parsed = parseServerError(responseError(500, data))
    expect(parsed.message).toBe('The service is unavailable right now. Try again in a moment.')
    expect(parsed.fieldErrors).toBeNull()
  })

  it('falls back safely when the response body has malformed fields', () => {
    const parsed = parseServerError(
      responseError(400, {
        message: { internal: true },
        errors: [null, { message: 42 }],
      }),
    )

    expect(parsed.message).toBe('Check the highlighted fields and try again.')
    expect(parsed.fieldErrors).toBeNull()
  })

  it('reads the helper error when the Spring message has the wrong type', () => {
    const parsed = parseServerError(
      responseError(403, { message: { internal: true }, error: 'Access is restricted' }),
    )

    expect(parsed.message).toBe('Access is restricted')
  })

  it('keeps the server message on a 403', () => {
    const parsed = parseServerError(
      httpError(403, 'You are not allowed to create feedback for this member'),
    )
    expect(parsed.kind).toBe('forbidden')
    expect(parsed.message).toBe('You are not allowed to create feedback for this member')
  })

  it('falls back to safe copy-by-status when the message is generic', () => {
    expect(parseServerError(httpError(400, 'Validation failed')).message).toBe(
      'Check the highlighted fields and try again.',
    )
    expect(parseServerError(httpError(401, 'Unauthorized')).message).toBe(
      'Your session expired. Sign in again.',
    )
    expect(parseServerError(httpError(403, '')).message).toBe(
      'You do not have access to this content.',
    )
    expect(parseServerError(httpError(404, '')).message).toBe(
      'This item could not be found.',
    )
    expect(parseServerError(httpError(409, 'Validation failed')).message).toBe(
      'This changed while you were working. Refresh and try again.',
    )
    expect(parseServerError(httpError(500, 'Internal Server Error')).message).toBe(
      'The service is unavailable right now. Try again in a moment.',
    )
  })

  it('prefers a specific, user-safe server message over the generic fallback', () => {
    const parsed = parseServerError(httpError(404, 'No team found with id 42'))
    expect(parsed.message).toBe('No team found with id 42')
  })

  it('classifies a network error with no response', () => {
    const parsed = parseServerError(networkError())
    expect(parsed.kind).toBe('network')
    expect(parsed.message).toBe('Could not reach the server. Check your connection and try again.')
    expect(parsed.status).toBeUndefined()
  })

  it('falls back to a generic message for non-Error throw values', () => {
    expect(parseServerError('boom').message).toBe('Something went wrong.')
    expect(parseServerError(undefined).message).toBe('Something went wrong.')
    expect(parseServerError({ weird: true }).message).toBe('Something went wrong.')
  })

  it('uses the Error message for plain JS errors', () => {
    const parsed = parseServerError(new Error('Unexpected token'))
    expect(parsed.kind).toBe('unknown')
    expect(parsed.message).toBe('Unexpected token')
  })
})

describe('classifyError', () => {
  it('classifies by HTTP status', () => {
    expect(classifyError(httpError(400, 'x'))).toBe('validation')
    expect(classifyError(httpError(401, 'x'))).toBe('unauthenticated')
    expect(classifyError(httpError(403, 'x'))).toBe('forbidden')
    expect(classifyError(httpError(404, 'x'))).toBe('notFound')
    expect(classifyError(httpError(409, 'x'))).toBe('conflict')
    expect(classifyError(httpError(500, 'x'))).toBe('server')
  })

  it('classifies a response-less axios error as network', () => {
    expect(classifyError(networkError())).toBe('network')
  })

  it('classifies anything else as unknown', () => {
    expect(classifyError(new Error('x'))).toBe('unknown')
    expect(classifyError('boom')).toBe('unknown')
  })
})

describe('serverErrorMessage', () => {
  it('unwraps parseServerError.message', () => {
    expect(serverErrorMessage(httpError(404, 'Team not found'))).toBe('Team not found')
  })

  it('uses the provided fallback for non-Error throw values', () => {
    expect(serverErrorMessage('boom', 'Custom fallback')).toBe('Custom fallback')
  })
})

describe('serverErrorFieldMessages', () => {
  it('unwraps parseServerError.fieldErrors', () => {
    expect(
      serverErrorFieldMessages(httpError(400, 'Validation failed', [{ message: 'name: required' }])),
    ).toEqual({ name: 'required' })
  })

  it('returns null when there are no field errors', () => {
    expect(serverErrorFieldMessages(httpError(409, 'Conflict'))).toBeNull()
  })
})
