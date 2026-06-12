export * from './client'
export * from './queries'

import { paymentsClient } from './client'

export async function getPaymentsHello(): Promise<string> {
  const res = await paymentsClient.get<string>('/hello')

  return res.data
}
