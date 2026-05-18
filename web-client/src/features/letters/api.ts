import type { HelloResponse } from '@/features/letters/types'

function mockLettersHello(): Promise<HelloResponse> {
  return Promise.resolve({
    service: 'letter-service',
    message: 'Hello from letter-service (mock placeholder)',
  })
}

export async function getLettersHello(): Promise<string> {
  // TODO: Replace mock with real endpoint when backend is available.
  const data = await mockLettersHello()
  return `${data.service}: ${data.message}`
}
