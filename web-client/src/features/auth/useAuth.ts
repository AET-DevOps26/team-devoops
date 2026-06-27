import keycloak from '@/lib/keycloak'
import type { AuthUser } from '@/types'
import { getCurrentUser } from './currentUser'

export function useAuth(): { user: AuthUser; logout: () => void } {
  const logout = () => keycloak.logout({ redirectUri: window.location.origin })
  return { user: getCurrentUser(), logout }
}
