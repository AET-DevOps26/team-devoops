import { dashboardForUser } from '@/testing/fixtures/dashboard'
import type { AuthUser, Dashboard } from '@/types'

export function getDashboard(user: AuthUser): Dashboard {
  return dashboardForUser(user)
}
