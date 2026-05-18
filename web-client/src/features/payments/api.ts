import type { HelloResponse } from '@/features/payments/types'

function mockPaymentsHello(): Promise<HelloResponse> {
  return Promise.resolve({
    service: 'payment-service',
    message: 'Hello from payment-service (mock placeholder)',
  })
}

export async function getPaymentsHello(): Promise<string> {
  // TODO: Replace mock with real endpoint when backend is available.
  const data = await mockPaymentsHello()
  return `${data.service}: ${data.message}`
}
