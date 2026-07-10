import type { GeneratePdfRequest } from '@/features/letters/types'

// In-memory letters resource: acknowledges sends and echoes a PDF blob from the template.

export function lettersHello(): string {
  return 'letters'
}

export function sendMail(): void {
  // no-op: accepts any send
}

export function generatePdf(data: GeneratePdfRequest): Blob {
  return new Blob([data.template], { type: 'application/pdf' })
}
