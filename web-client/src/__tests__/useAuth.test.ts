import { describe, expect, it, vi } from 'vitest'

const keycloakMock = {
  tokenParsed: undefined as unknown,
  logout: vi.fn(),
}

vi.mock('@/lib/keycloak', () => ({
  default: keycloakMock,
}))

const { useAuth } = await import('@/features/auth/useAuth')

describe('useAuth', () => {
  it('reads the member_roles claim into user.roles', () => {
    keycloakMock.tokenParsed = {
      name: 'Jane Coach',
      email: 'jane@example.com',
      member_roles: ['Coach', 'Admin'],
    }

    const { user } = useAuth()

    expect(user.roles).toEqual(['Coach', 'Admin'])
  })

  it('defaults roles to an empty array when the claim is absent', () => {
    keycloakMock.tokenParsed = { name: 'Jane', email: 'jane@example.com' }

    const { user } = useAuth()

    expect(user.roles).toEqual([])
  })
})
