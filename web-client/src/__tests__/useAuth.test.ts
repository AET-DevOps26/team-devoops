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
  it('collapses the member_roles claim into user.role', () => {
    keycloakMock.tokenParsed = {
      name: 'Jane Coach',
      email: 'jane@example.com',
      member_roles: ['Coach', 'Admin'],
    }

    const { user } = useAuth()

    expect(user.role).toBe('admin')
  })

  it('defaults role to member when the claim is absent', () => {
    keycloakMock.tokenParsed = { name: 'Jane', email: 'jane@example.com' }

    const { user } = useAuth()

    expect(user.role).toBe('member')
  })
})
