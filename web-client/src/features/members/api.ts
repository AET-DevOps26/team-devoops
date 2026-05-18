import type { HelloResponse } from '@/features/members/types'

function mockMembersHello(): Promise<HelloResponse> {
  return Promise.resolve({
    service: 'member-service',
    message: 'Hello from member-service (mock placeholder)',
  })
}

export async function getMembersHello(): Promise<string> {
  // TODO: Replace mock with real endpoint when backend is available.
  const data = await mockMembersHello()
  return `${data.service}: ${data.message}`
}
