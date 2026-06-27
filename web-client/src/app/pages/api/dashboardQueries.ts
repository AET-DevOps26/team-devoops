import { useQuery } from '@tanstack/react-query'

import { getCurrentUser } from '@/features/auth/currentUser'
import { membersClient } from '@/features/members/api/client'
import { dashboardForUser } from '@/mocks/fixtures/dashboard'
import { mockOr } from '@/mocks/mockSwitch'
import type { DashboardAggregate } from '@/types'

export const dashboardKeys = {
  me: ['dashboard', 'me'] as const,
}

export function useDashboard(enabled = true) {
  return useQuery<DashboardAggregate>({
    queryKey: dashboardKeys.me,
    staleTime: 30_000,
    enabled,
    queryFn: () =>
      mockOr(
        () => Promise.resolve(dashboardForUser(getCurrentUser())),
        () => membersClient.get<DashboardAggregate>('/dashboard').then((r) => r.data),
      ),
  })
}
