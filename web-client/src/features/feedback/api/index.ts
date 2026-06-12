export * from './client'
export * from './queries'

import { feedbackClient } from './client'

export async function getFeedbackHello(): Promise<string> {
  const res = await feedbackClient.get<string>('/hello')

  return res.data
}
