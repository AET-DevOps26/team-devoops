import { lettersClient } from '@/features/letters/client'

export async function getLettersHello(): Promise<string> {
  const res = await lettersClient.get<string>('/hello')
  return res.data
}
