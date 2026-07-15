import type { ZodError } from 'zod'

export type FieldErrors = Record<string, string>

type SafeParseResult = { success: true } | { success: false; error: ZodError }

interface SafeParseSchema<TForm> {
  safeParse: (form: TForm) => SafeParseResult
}

export function flattenZodFieldErrors(error: ZodError): FieldErrors | null {
  const fields: FieldErrors = {}

  for (const issue of error.issues) {
    const [field] = issue.path
    if (field === undefined) continue

    const fieldName = String(field)
    if (fields[fieldName] === undefined) fields[fieldName] = issue.message
  }

  return Object.keys(fields).length > 0 ? fields : null
}

export function validateZodSchema<TForm>(
  schema: SafeParseSchema<TForm>,
  form: TForm,
): FieldErrors | null {
  const result = schema.safeParse(form)
  return result.success ? null : flattenZodFieldErrors(result.error)
}

export function pickFieldErrors(
  errors: FieldErrors | null,
  fieldNames: readonly string[],
): FieldErrors | null {
  if (!errors) return null

  const picked: FieldErrors = {}
  for (const field of fieldNames) {
    if (errors[field] !== undefined) picked[field] = errors[field]
  }

  return Object.keys(picked).length > 0 ? picked : null
}

export function fieldError(
  errors: FieldErrors | null,
  ...fieldNames: readonly string[]
): string | undefined {
  for (const field of fieldNames) {
    const message = errors?.[field]
    if (message !== undefined) return message
  }

  return undefined
}
