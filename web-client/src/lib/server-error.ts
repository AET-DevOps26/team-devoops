import { isAxiosError } from 'axios'

type ServerErrorBody = {
  message?: string
  errors?: { message?: string }[]
}

export function serverErrorMessage(error: unknown, fallback = 'Something went wrong.'): string {
  if (isAxiosError<ServerErrorBody>(error)) {
    return error.response?.data?.message ?? error.message
  }

  return error instanceof Error ? error.message : fallback
}

/**
 * Bean-validation 400s carry `errors: [{message: "field: reason"}]` — map each onto its
 * field name so a form can highlight the specific input. Returns null when the error isn't
 * that shape (e.g. a top-level 409/403 message), so callers fall back to serverErrorMessage.
 */
export function serverErrorFieldMessages(error: unknown): Record<string, string> | null {
  if (!isAxiosError<ServerErrorBody>(error)) return null

  const errors = error.response?.data?.errors
  if (!errors || errors.length === 0) return null

  const fields: Record<string, string> = {}
  for (const item of errors) {
    if (!item.message) continue
    const separatorIndex = item.message.indexOf(':')
    if (separatorIndex === -1) continue
    const field = item.message.slice(0, separatorIndex).trim()
    const reason = item.message.slice(separatorIndex + 1).trim()
    if (field) fields[field] = reason || item.message
  }

  return Object.keys(fields).length > 0 ? fields : null
}
