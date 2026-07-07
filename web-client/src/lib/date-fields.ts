import type { DateRange } from 'react-day-picker'

export function dateToInputValue(date: Date): string {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')

  return `${year}-${month}-${day}`
}

export function inputValueToDate(value: string): Date | undefined {
  if (!value) return undefined

  return new Date(`${value}T00:00:00`)
}

export function dateRangeFromFilters(fromDate: string, toDate: string): DateRange | undefined {
  if (!fromDate && !toDate) return undefined

  return {
    from: inputValueToDate(fromDate),
    to: inputValueToDate(toDate),
  }
}

export function dateRangeLabel(fromDate: string, toDate: string): string {
  if (fromDate && toDate) return `${fromDate} - ${toDate}`
  if (fromDate) return `From ${fromDate}`
  if (toDate) return `Until ${toDate}`

  return 'Date range'
}
