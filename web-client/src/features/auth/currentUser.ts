import type { KeycloakTokenParsed } from 'keycloak-js'

import keycloak from '@/lib/keycloak'
import { USE_MOCKS } from '@/mocks/mockSwitch'
import { MOCK_PERSONAS, type MockPersonaKey } from '@/mocks/personas'
import type { AuthUser } from '@/types'

type AuthTokenSnapshot = KeycloakTokenParsed & {
  email?: string
  name?: string
  preferred_username?: string
  // Keycloak client-role claim: display labels (Trainee/Coach/Director/Admin), unordered.
  // Collapse to a single Role with `highestRole(roles)` — never rely on array order.
  member_roles?: string[]
}

// Identity is coupled to the mock switch: mocks on => persona identity (matches
// fixtures), mocks off => real token. Defaults to 'member' so fixtures always resolve.
function mockPersona(): AuthUser | null {
  if (!USE_MOCKS) return null

  const persona = import.meta.env.VITE_MOCK_PERSONA
  const key: MockPersonaKey =
    typeof persona === 'string' && persona in MOCK_PERSONAS
      ? (persona as MockPersonaKey)
      : 'member'

  return MOCK_PERSONAS[key]
}

function tokenUser(): AuthUser {
  const parsed = keycloak.tokenParsed as AuthTokenSnapshot | undefined

  return {
    id: parsed?.sub ?? '',
    name: parsed?.name ?? parsed?.preferred_username ?? parsed?.email ?? 'Unknown',
    email: parsed?.email ?? '',
    roles: parsed?.member_roles ?? [],
  }
}

export function getCurrentUser(): AuthUser {
  return mockPersona() ?? tokenUser()
}
