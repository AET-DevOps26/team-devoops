import { isAxiosError } from 'axios'

export type ErrorKind =
  | 'validation'
  | 'unauthenticated'
  | 'forbidden'
  | 'notFound'
  | 'conflict'
  | 'server'
  | 'network'
  | 'unknown'

export interface ParsedServerError {
  kind: ErrorKind
  status?: number
  message: string
  fieldErrors: Record<string, string> | null
}

const FALLBACK_MESSAGE = 'Something went wrong.'

const STATUS_COPY: Partial<Record<number, string>> = {
  400: 'Check the highlighted fields and try again.',
  401: 'Your session expired. Sign in again.',
  403: 'You do not have access to this content.',
  404: 'This item could not be found.',
  409: 'This changed while you were working. Refresh and try again.',
}

function classifyStatus(status: number): ErrorKind {
  if (status === 400) return 'validation'
  if (status === 401) return 'unauthenticated'
  if (status === 403) return 'forbidden'
  if (status === 404) return 'notFound'
  if (status === 409) return 'conflict'
  if (status >= 500) return 'server'
  return 'unknown'
}

function safeCopyForStatus(status: number): string {
  if (status >= 500) return 'The service is unavailable right now. Try again in a moment.'
  return STATUS_COPY[status] ?? FALLBACK_MESSAGE
}

export function classifyError(error: unknown): ErrorKind {
  if (isAxiosError(error)) {
    if (!error.response) return 'network'
    return classifyStatus(error.response.status)
  }

  return 'unknown'
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null
}

function extractServerMessage(body: unknown): string | undefined {
  if (!isRecord(body)) return undefined
  if (typeof body.message === 'string') return body.message
  return typeof body.error === 'string' ? body.error : undefined
}

function extractFieldErrors(body: unknown): Record<string, string> | null {
  if (!isRecord(body) || !Array.isArray(body.errors) || body.errors.length === 0) return null

  const fields: Record<string, string> = {}
  for (const item of body.errors) {
    if (!isRecord(item) || typeof item.message !== 'string' || !item.message) continue
    const separatorIndex = item.message.indexOf(':')
    if (separatorIndex === -1) continue
    const field = item.message.slice(0, separatorIndex).trim()
    const reason = item.message.slice(separatorIndex + 1).trim()
    if (field) fields[field] = reason || item.message
  }

  return Object.keys(fields).length > 0 ? fields : null
}

export function parseServerError(error: unknown): ParsedServerError {
  if (isAxiosError<unknown>(error)) {
    const body = error.response?.data
    const status = error.response?.status

    if (status === undefined) {
      return {
        kind: 'network',
        message: 'Could not reach the server. Check your connection and try again.',
        fieldErrors: null,
      }
    }

    const fieldErrors = status === 400 ? extractFieldErrors(body) : null
    const serverMessage = extractServerMessage(body)
    // Never expose 5xx details; 401 always requires re-authentication. Other 4xx copy is intentional.
    // Spring's "Validation failed" detail lives in `errors` instead.
    const trustServerMessage =
      status !== 401 && status < 500 && serverMessage !== 'Validation failed'
    const message =
      serverMessage && trustServerMessage ? serverMessage : safeCopyForStatus(status)

    return {
      kind: classifyStatus(status),
      status,
      message,
      fieldErrors,
    }
  }

  if (error instanceof Error) {
    return { kind: 'unknown', message: error.message, fieldErrors: null }
  }

  return { kind: 'unknown', message: FALLBACK_MESSAGE, fieldErrors: null }
}

export function serverErrorMessage(error: unknown, fallback = FALLBACK_MESSAGE): string {
  if (!isAxiosError(error) && !(error instanceof Error)) return fallback

  return parseServerError(error).message
}

export function serverErrorFieldMessages(error: unknown): Record<string, string> | null {
  return parseServerError(error).fieldErrors
}
