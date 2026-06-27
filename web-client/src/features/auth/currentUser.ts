import type { KeycloakTokenParsed } from 'keycloak-js'

import keycloak from '@/lib/keycloak'
import { USE_MOCKS } from '@/mocks/mockSwitch'
import { MOCK_PERSONAS, type MockPersonaKey } from '@/mocks/personas'
import type { AuthUser, Role } from '@/types'

type AuthTokenSnapshot = KeycloakTokenParsed & {
  email?: string
  name?: string
  preferred_username?: string
  realm_access?: { roles?: string[] }
}

const ROLE_POWER: Record<Role, number> = {
  member: 0,
  trainer: 1,
  director: 2,
  admin: 3,
}

function isRole(role: string): role is Role {
  return role === 'member' || role === 'trainer' || role === 'director' || role === 'admin'
}

function tokenRole(roles: string[] | undefined): Role {
  if (!roles?.length) return 'member'

  return roles.reduce<Role>((resolved, role) => {
    if (!isRole(role)) return resolved

    return ROLE_POWER[role] > ROLE_POWER[resolved] ? role : resolved
  }, 'member')
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
    role: tokenRole(parsed?.realm_access?.roles),
  }
}

export function getCurrentUser(): AuthUser {
  return mockPersona() ?? tokenUser()
}
