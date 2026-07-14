import { z } from 'zod'

import { type FieldErrors, validateZodSchema } from '@/lib/validation'

export interface TransactionCreateFormState {
  memberId: string
  amount: string
  title: string
  description: string
}

const transactionCreateSchema = z.object({
  memberId: z.string().trim().min(1, { message: 'Select a member.' }),
  amount: z.string().refine((value) => parseEuroAmountCents(value) !== null, {
    message: 'Enter an amount in euros with up to two decimals.',
  }),
  title: z.string().trim().min(1, { message: 'Title is required.' }),
  description: z.string(),
})

export function validateTransactionCreateForm(
  form: TransactionCreateFormState,
): FieldErrors | null {
  return validateZodSchema(transactionCreateSchema, form)
}

export function parseEuroAmountCents(value: string): number | null {
  const normalized = value.trim().replace(',', '.')
  if (!/^\d+(\.\d{1,2})?$/.test(normalized)) return null

  const [euros, cents = ''] = normalized.split('.')
  const amountCents = Number(euros) * 100 + Number(cents.padEnd(2, '0'))

  return amountCents > 0 ? amountCents : null
}
