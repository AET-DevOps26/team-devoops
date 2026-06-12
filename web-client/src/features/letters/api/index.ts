export * from './client'
export * from './queries'

import { lettersClient } from './client'

export async function getLettersHello(): Promise<string> {
  const res = await lettersClient.get<string>('/hello')

  return res.data
}
