import keycloak from '@/lib/keycloak'
import type { AuthUser } from '@/types'

export function useAuth(): { user: AuthUser; logout: () => void } {
  const parsed = keycloak.tokenParsed as Record<string, string> | undefined
  const user: AuthUser = {
    name: parsed?.name ?? parsed?.preferred_username ?? parsed?.email ?? 'Unknown',
    email: parsed?.email ?? '',
  }
  const logout = () => keycloak.logout({ redirectUri: window.location.origin })
  return { user, logout }
}
