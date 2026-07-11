import { dashboardForUser } from '@/testing/fixtures/dashboard'
import type { AuthUser, Dashboard } from '@/types'

// In-memory dashboard resource.
export function getDashboard(user: AuthUser): Dashboard {
  return dashboardForUser(user)
}
