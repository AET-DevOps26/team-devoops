import { membersClient } from '@/features/members/client'

export async function getMembersHello(): Promise<string> {
  const res = await membersClient.get<string>('/hello')
  return res.data
}
