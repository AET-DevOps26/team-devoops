import { membersClient } from '@/features/members/client'

export async function getMembersHello(): Promise<string> {
  const res = await membersClient.get<string>('/hello')
  return res.data
}

export async function getMembersAdminHello(): Promise<string> {
  try {
    const res = await membersClient.get<string>('/helloAdmin')
    return res.data
  }
  catch {
    return "You are not logged into an administrator account"
  }
}
