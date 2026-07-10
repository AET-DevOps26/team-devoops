import { useQuery } from '@tanstack/react-query'

import { membersClient } from '@/features/members/api/client'
import type { Dashboard } from '@/types'

export const dashboardKeys = {
  me: ['dashboard', 'me'] as const,
}

export function useDashboard(enabled = true) {
  return useQuery<Dashboard>({
    queryKey: dashboardKeys.me,
    staleTime: 30_000,
    enabled,
    queryFn: () => membersClient.get<Dashboard>('/dashboard').then((r) => r.data),
  })
}
