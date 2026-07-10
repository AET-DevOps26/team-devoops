import { afterEach, describe, expect, it, vi } from 'vitest'

import type { KeycloakTokenParsed } from 'keycloak-js'

const mockState = vi.hoisted(() => ({
  useMocks: true,
  tokenParsed: undefined as (KeycloakTokenParsed & Record<string, unknown>) | undefined,
}))

vi.mock('@/mocks/mockSwitch', () => ({
  get USE_MOCKS() {
    return mockState.useMocks
  },
}))

vi.mock('@/lib/keycloak', () => ({
  default: {
    get tokenParsed() {
      return mockState.tokenParsed
    },
  },
}))

const { getCurrentUser } = await import('./currentUser')
const { MOCK_PERSONAS } = await import('@/mocks/personas')

describe('getCurrentUser', () => {
  afterEach(() => {
    vi.unstubAllEnvs()
    mockState.useMocks = true
    mockState.tokenParsed = undefined
  })

  it('returns the persona named by VITE_MOCK_PERSONA under mocks', () => {
    vi.stubEnv('VITE_MOCK_PERSONA', 'director')

    expect(getCurrentUser()).toEqual(MOCK_PERSONAS.director)
  })

  it('falls back to the member persona when the env var is unset or unknown', () => {
    vi.stubEnv('VITE_MOCK_PERSONA', '')
    expect(getCurrentUser()).toEqual(MOCK_PERSONAS.member)

    vi.stubEnv('VITE_MOCK_PERSONA', 'not-a-persona')
    expect(getCurrentUser()).toEqual(MOCK_PERSONAS.member)
  })

  it('reads the token and collapses member_roles to the highest role when mocks are off', () => {
    mockState.useMocks = false
    mockState.tokenParsed = {
      sub: 'token-sub',
      name: 'Token User',
      email: 'token.user@club.de',
      member_roles: ['Coach', 'Admin'],
    }

    expect(getCurrentUser()).toEqual({
      id: 'token-sub',
      name: 'Token User',
      email: 'token.user@club.de',
      role: 'admin',
    })
  })

  it('prefers preferred_username, then email, as the display name fallback', () => {
    mockState.useMocks = false
    mockState.tokenParsed = {
      sub: 'token-sub',
      preferred_username: 'token.user',
      member_roles: ['Trainee'],
    }
    expect(getCurrentUser().name).toBe('token.user')

    mockState.tokenParsed = { sub: 'token-sub', email: 'only.email@club.de' }
    expect(getCurrentUser().name).toBe('only.email@club.de')
  })

  it('yields an anonymous member when no token is present', () => {
    mockState.useMocks = false
    mockState.tokenParsed = undefined

    expect(getCurrentUser()).toEqual({ id: '', name: 'Unknown', email: '', role: 'member' })
  })
})
