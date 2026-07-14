import type { MemberSummary } from '@/types'

// Money is integer cents with no currency field; we display the agreed EUR.
const EUR = new Intl.NumberFormat('en-IE', {
  style: 'currency',
  currency: 'EUR',
})

export function formatCents(amountCents: number): string {
  return EUR.format(amountCents / 100)
}


export function formatCentsAbs(amountCents: number): string {
  return EUR.format(Math.abs(amountCents) / 100)
}

export function memberSummaryName(member: MemberSummary): string {
  const name = `${member.first_name} ${member.last_name}`.trim()
  return name || member.email
}

const DATE = new Intl.DateTimeFormat('en-GB', {
  day: '2-digit',
  month: 'short',
  year: 'numeric',
})

const DATE_SHORT = new Intl.DateTimeFormat('en-GB', {
  day: '2-digit',
  month: 'short',
})

const TIME = new Intl.DateTimeFormat('en-GB', {
  hour: '2-digit',
  minute: '2-digit',
  hour12: false,
})

const WEEKDAY = new Intl.DateTimeFormat('en-GB', { weekday: 'short' })

function toValidDate(iso: string): Date | null {
  const d = new Date(iso)
  return Number.isNaN(d.getTime()) ? null : d
}

export function formatDate(iso: string): string {
  const d = toValidDate(iso)
  return d ? DATE.format(d) : '—'
}

export function formatDateShort(iso: string): string {
  const d = toValidDate(iso)
  return d ? DATE_SHORT.format(d) : '—'
}

export function formatDateTime(iso: string): string {
  const d = toValidDate(iso)
  return d ? `${WEEKDAY.format(d)} ${DATE_SHORT.format(d)} · ${TIME.format(d)}` : '—'
}

export function formatTime(iso: string): string {
  const d = toValidDate(iso)
  return d ? TIME.format(d) : '—'
}

export function formatDuration(startIso: string, endIso: string): string {
  const minutes = Math.round(
    (new Date(endIso).getTime() - new Date(startIso).getTime()) / 60000,
  )
  return `${minutes} min`
}
