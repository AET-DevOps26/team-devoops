import { eventsClient } from '@/features/events/client'

export async function getEventsHello(): Promise<string> {
  const res = await eventsClient.get<string>('/hello')
  return res.data
}
