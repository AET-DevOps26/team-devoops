import { z } from 'zod'

import { type FieldErrors, validateZodSchema } from '@/lib/validation'

export type LetterComposerMode = 'mail' | 'pdf'

export interface LetterComposerFormState {
  mode: LetterComposerMode
  subject: string
  template: string
}

const letterComposerSchema = z
  .object({
    mode: z.enum(['mail', 'pdf']),
    subject: z.string(),
    template: z.string().trim().min(1, { message: 'Template is required.' }),
  })
  .superRefine((value, ctx) => {
    if (value.mode === 'mail' && value.subject.trim() === '') {
      ctx.addIssue({ code: 'custom', path: ['subject'], message: 'Subject is required.' })
    }
  })

export function validateLetterComposerForm(
  form: LetterComposerFormState,
): FieldErrors | null {
  return validateZodSchema(letterComposerSchema, form)
}
