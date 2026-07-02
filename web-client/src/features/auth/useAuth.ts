import type { KeycloakTokenParsed } from 'keycloak-js'
import keycloak from '@/lib/keycloak'
import type { AuthUser } from '@/types'

type AuthTokenSnapshot = KeycloakTokenParsed & {
  email?: string
  name?: string
  preferred_username?: string
  member_roles?: string[]
}

export function useAuth(): { user: AuthUser; logout: () => void } {
  // This is a render-time snapshot of the current token, not reactive auth state.
  const parsed = keycloak.tokenParsed as AuthTokenSnapshot | undefined
  const user: AuthUser = {
    name: parsed?.name ?? parsed?.preferred_username ?? parsed?.email ?? 'Unknown',
    email: parsed?.email ?? '',
    roles: parsed?.member_roles ?? [],
  }
  const logout = () => keycloak.logout({ redirectUri: window.location.origin })
  return { user, logout }
}
