import keycloak from '@/lib/keycloak'
import type { AuthUser } from '@/types'
import { getCurrentUser } from './currentUser'

export function useAuth(): { user: AuthUser; logout: () => void } {
  // Render-time snapshot of the current identity (persona under mocks, token otherwise).
  // getCurrentUser is the single source of identity — do not re-derive it here.
  const user = getCurrentUser()
  const logout = () => keycloak.logout({ redirectUri: window.location.origin })
  return { user, logout }
}
