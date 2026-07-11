import type { KeycloakTokenParsed } from 'keycloak-js'

import keycloak from '@/lib/keycloak'
import { highestRole, type AuthUser } from '@/types'

type AuthTokenSnapshot = KeycloakTokenParsed & {
  email?: string
  name?: string
  preferred_username?: string
  // Keycloak client-role claim: display labels (Trainee/Coach/Director/Admin), unordered.
  // Collapse to a single Role with `highestRole(member_roles)` — never rely on array order.
  member_roles?: string[]
}

// Identity comes solely from the Keycloak token.
export function getCurrentUser(): AuthUser {
  const parsed = keycloak.tokenParsed as AuthTokenSnapshot | undefined

  return {
    id: parsed?.sub ?? '',
    name: parsed?.name ?? parsed?.preferred_username ?? parsed?.email ?? 'Unknown',
    email: parsed?.email ?? '',
    role: highestRole(parsed?.member_roles ?? []),
  }
}
