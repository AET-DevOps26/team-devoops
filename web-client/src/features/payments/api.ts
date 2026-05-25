import { paymentsClient } from '@/features/payments/client'

export async function getPaymentsHello(): Promise<string> {
  const res = await paymentsClient.get<string>('/hello')
  return res.data
}
