import { afterEach, describe, expect, it, vi } from 'vitest'

import type { KeycloakTokenParsed } from 'keycloak-js'

const mockState = vi.hoisted(() => ({
  tokenParsed: undefined as (KeycloakTokenParsed & Record<string, unknown>) | undefined,
}))

vi.mock('@/lib/keycloak', () => ({
  default: {
    get tokenParsed() {
      return mockState.tokenParsed
    },
  },
}))

const { getCurrentUser } = await import('./currentUser')

describe('getCurrentUser', () => {
  afterEach(() => {
    mockState.tokenParsed = undefined
  })

  it('reads the token and collapses member_roles to the highest role', () => {
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
    mockState.tokenParsed = undefined

    expect(getCurrentUser()).toEqual({ id: '', name: 'Unknown', email: '', role: 'member' })
  })
})
