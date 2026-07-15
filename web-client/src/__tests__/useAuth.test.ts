import { act, createElement } from 'react'
import { createRoot, type Root } from 'react-dom/client'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

const keycloakMock = {
  tokenParsed: undefined as unknown,
  logout: vi.fn(),
}

// Mirrors the real module: one listener set, fanned out on refresh.
const tokenRefreshListeners = new Set<() => void>()
let beforeTokenRefreshSubscription: (() => void) | undefined

function emitTokenRefresh() {
  for (const listener of tokenRefreshListeners) listener()
}

vi.mock('@/lib/keycloak', () => ({
  default: keycloakMock,
  onTokenRefreshed: (listener: () => void) => {
    beforeTokenRefreshSubscription?.()
    tokenRefreshListeners.add(listener)
    return () => tokenRefreshListeners.delete(listener)
  },
}))

const { useAuth } = await import('@/features/auth/useAuth')

function renderUseAuth(container: HTMLDivElement) {
  let result!: ReturnType<typeof useAuth>

  function Host() {
    result = useAuth()
    return null
  }

  const root = createRoot(container)
  act(() => {
    root.render(createElement(Host))
  })

  return { result: () => result, root }
}

describe('useAuth', () => {
  let container: HTMLDivElement
  let root: Root | null = null

  beforeEach(() => {
    container = document.createElement('div')
    document.body.append(container)
  })

  afterEach(() => {
    act(() => {
      root?.unmount()
    })
    container.remove()
    tokenRefreshListeners.clear()
    beforeTokenRefreshSubscription = undefined
    root = null
  })

  it('collapses the member_roles claim into user.role', () => {
    keycloakMock.tokenParsed = {
      name: 'Jane Coach',
      email: 'jane@example.com',
      member_roles: ['Coach', 'Admin'],
    }

    const rendered = renderUseAuth(container)
    root = rendered.root

    expect(rendered.result().user.role).toBe('admin')
  })

  it('defaults role to member when the claim is absent', () => {
    keycloakMock.tokenParsed = { name: 'Jane', email: 'jane@example.com' }

    const rendered = renderUseAuth(container)
    root = rendered.root

    expect(rendered.result().user.role).toBe('member')
  })

  it('picks up new token claims on refresh', () => {
    keycloakMock.tokenParsed = { name: 'Jane', email: 'jane@example.com' }

    const rendered = renderUseAuth(container)
    root = rendered.root

    keycloakMock.tokenParsed = { name: 'Jane Renamed', email: 'jane@example.com' }
    act(() => {
      emitTokenRefresh()
    })

    expect(rendered.result().user.name).toBe('Jane Renamed')
  })

  it('reconciles a refresh that lands before its subscription is installed', () => {
    keycloakMock.tokenParsed = { name: 'Jane', email: 'jane@example.com' }
    beforeTokenRefreshSubscription = () => {
      keycloakMock.tokenParsed = { name: 'Jane Renamed', email: 'jane@example.com' }
    }

    const rendered = renderUseAuth(container)
    root = rendered.root

    expect(rendered.result().user.name).toBe('Jane Renamed')
  })

  it('keeps refreshing the surviving consumer when another one unmounts', () => {
    keycloakMock.tokenParsed = { name: 'Jane', email: 'jane@example.com' }

    const survivor = renderUseAuth(container)
    root = survivor.root

    const shortLivedContainer = document.createElement('div')
    document.body.append(shortLivedContainer)
    const shortLived = renderUseAuth(shortLivedContainer)

    act(() => {
      shortLived.root.unmount()
    })
    shortLivedContainer.remove()

    keycloakMock.tokenParsed = { name: 'Jane Renamed', email: 'jane@example.com' }
    act(() => {
      emitTokenRefresh()
    })

    expect(survivor.result().user.name).toBe('Jane Renamed')
  })
})
