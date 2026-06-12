export * from './client'
export * from './queries'

import { organizationClient } from './client'

export async function getOrganizationHello(): Promise<string> {
  const res = await organizationClient.get<string>('/hello')

  return res.data
}
