import { organizationClient } from '@/features/organization/client'

export async function getOrganizationHello(): Promise<string> {
  const res = await organizationClient.get<string>('/hello')
  return res.data
}
