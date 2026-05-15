import type { HelloResponse } from '@/features/events/types'

function mockEventsHello(): Promise<HelloResponse> {
  return Promise.resolve({
    service: 'event-service',
    message: 'Hello from event-service (mock placeholder)',
  })
}

export async function getEventsHello(): Promise<string> {
  // TODO: Replace mock with real endpoint when backend is available.
  const data = await mockEventsHello()
  return `${data.service}: ${data.message}`
}
