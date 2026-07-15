import type { GeneratePdfRequest } from '@/features/letters/types'


export function lettersHello(): string {
  return 'letters'
}

export function sendMail(): void {
}

export function generatePdf(data: GeneratePdfRequest): Blob {
  return new Blob([data.template], { type: 'application/pdf' })
}
