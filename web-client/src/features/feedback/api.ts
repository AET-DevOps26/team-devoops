import { feedbackClient } from '@/features/feedback/client'

export async function getFeedbackHello(): Promise<string> {
  const res = await feedbackClient.get<string>('/hello')
  return res.data
}
