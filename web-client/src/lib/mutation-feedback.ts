import { toast } from 'sonner'

import { parseServerError } from '@/lib/server-error'

function showMutationErrorToast(title: string, message: string) {
  toast.error(title, { description: message })
}

/**
 * Presents a failed action that has no editable fields, such as delete or generate.
 */
export function notifyMutationError(error: unknown, title: string): void {
  const parsed = parseServerError(error)
  showMutationErrorToast(title, parsed.message)
}

/**
 * Keeps validation feedback next to its fields. Non-validation failures become a toast,
 * matching the success feedback while leaving the form open so the action can be retried.
 */
export function formMutationErrorFields(
  error: unknown,
  title: string,
): Record<string, string> | null {
  const parsed = parseServerError(error)

  if (parsed.fieldErrors) return parsed.fieldErrors

  showMutationErrorToast(title, parsed.message)
  return null
}
