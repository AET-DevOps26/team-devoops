import { describe, expect, it } from 'vitest'

import {
  parseEuroAmountCents,
  validateTransactionCreateForm,
} from './transactionEditor'

describe('transaction editor validation', () => {
  it('accepts a valid transaction form and parses cents', () => {
    expect(
      validateTransactionCreateForm({
        memberId: 'member-1',
        amount: '25.50',
        title: 'Court fee',
        description: '',
      }),
    ).toBeNull()
    expect(parseEuroAmountCents('25.50')).toBe(2550)
    expect(parseEuroAmountCents('25,5')).toBe(2550)
  })

  it('requires a selected member', () => {
    expect(
      validateTransactionCreateForm({
        memberId: '',
        amount: '25',
        title: 'Court fee',
        description: '',
      }),
    ).toEqual({ memberId: 'Select a member.' })
  })

  it('requires a positive amount with up to two decimals', () => {
    expect(
      validateTransactionCreateForm({
        memberId: 'member-1',
        amount: '0',
        title: 'Court fee',
        description: '',
      }),
    ).toEqual({ amount: 'Enter an amount in euros with up to two decimals.' })
    expect(parseEuroAmountCents('1.234')).toBeNull()
  })

  it('requires a title', () => {
    expect(
      validateTransactionCreateForm({
        memberId: 'member-1',
        amount: '25',
        title: ' ',
        description: '',
      }),
    ).toEqual({ title: 'Title is required.' })
  })
})
