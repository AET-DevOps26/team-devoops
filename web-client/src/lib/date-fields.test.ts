import { describe, expect, it } from 'vitest'

import {
  dateRangeFromFilters,
  dateRangeLabel,
  dateToInputValue,
  inputValueToDate,
} from './date-fields'

describe('dateToInputValue', () => {
  it('formats a date as YYYY-MM-DD', () => {
    expect(dateToInputValue(new Date(2026, 0, 5))).toBe('2026-01-05')
  })
})

describe('inputValueToDate', () => {
  it('parses a YYYY-MM-DD string back to a local midnight date', () => {
    const date = inputValueToDate('2026-01-05')
    expect(date).toBeInstanceOf(Date)
    expect(dateToInputValue(date as Date)).toBe('2026-01-05')
  })

  it('returns undefined for an empty string', () => {
    expect(inputValueToDate('')).toBeUndefined()
  })
})

describe('dateRangeFromFilters', () => {
  it('returns undefined when both dates are empty', () => {
    expect(dateRangeFromFilters('', '')).toBeUndefined()
  })

  it('builds a range from both dates', () => {
    const range = dateRangeFromFilters('2026-01-01', '2026-01-10')
    expect(range?.from && dateToInputValue(range.from)).toBe('2026-01-01')
    expect(range?.to && dateToInputValue(range.to)).toBe('2026-01-10')
  })
})

describe('dateRangeLabel', () => {
  it('labels an empty range', () => {
    expect(dateRangeLabel('', '')).toBe('Date range')
  })

  it('labels a from-only range', () => {
    expect(dateRangeLabel('2026-01-01', '')).toBe('From 2026-01-01')
  })

  it('labels a to-only range', () => {
    expect(dateRangeLabel('', '2026-01-10')).toBe('Until 2026-01-10')
  })

  it('labels a full range', () => {
    expect(dateRangeLabel('2026-01-01', '2026-01-10')).toBe('2026-01-01 - 2026-01-10')
  })
})
