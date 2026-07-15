import { StrictMode, act } from 'react'
import { createRoot, type Root } from 'react-dom/client'
import { QueryClient } from '@tanstack/react-query'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

const keycloakMock = {
  init: vi.fn<(options?: unknown) => Promise<boolean>>(),
  login: vi.fn<() => Promise<void>>(),
  updateToken: vi.fn<(minValidity: number) => Promise<boolean>>(),
  onTokenExpired: undefined as (() => void) | undefined,
}

vi.mock('@/App', () => ({
  default: () => <div>App ready</div>,
}))

vi.mock('@/lib/keycloak', () => ({
  KEYCLOAK_URL: 'http://keycloak.test',
  TOKEN_REFRESH_MIN_VALIDITY_SECONDS: 30,
  createApiClient: vi.fn(() => ({ get: vi.fn(), post: vi.fn(), put: vi.fn(), delete: vi.fn() })),
  default: keycloakMock,
}))

const { default: AuthenticatedApp } = await import('@/AuthenticatedApp')

describe('AuthenticatedApp', () => {
  let container: HTMLDivElement
  let root: Root
  let queryClient: QueryClient

  beforeEach(() => {
    vi.clearAllMocks()
    keycloakMock.onTokenExpired = undefined
    keycloakMock.login.mockResolvedValue(undefined)
    keycloakMock.updateToken.mockResolvedValue(true)
    queryClient = new QueryClient()
    document.body.innerHTML = '<div id="root"></div><div id="splash"></div>'
    container = document.getElementById('root') as HTMLDivElement
    root = createRoot(container)
  })

  afterEach(async () => {
    await act(async () => {
      root.unmount()
    })
    document.body.innerHTML = ''
  })

  async function render() {
    await act(async () => {
      root.render(<AuthenticatedApp queryClient={queryClient} />)
      await new Promise((r) => setTimeout(r, 0))
    })
  }

  async function renderInStrictMode() {
    await act(async () => {
      root.render(
        <StrictMode>
          <AuthenticatedApp queryClient={queryClient} />
        </StrictMode>,
      )
      await new Promise((r) => setTimeout(r, 0))
    })
  }

  it('renders the app when keycloak init resolves authenticated', async () => {
    keycloakMock.init.mockResolvedValue(true)

    await render()

    expect(container.textContent).toContain('App ready')
  })

  it('removes the splash screen on successful auth', async () => {
    keycloakMock.init.mockResolvedValue(true)

    await render()

    expect(document.getElementById('splash')).toBeNull()
  })

  it('registers onTokenExpired handler after successful auth', async () => {
    keycloakMock.init.mockResolvedValue(true)

    await render()

    expect(keycloakMock.onTokenExpired).toBeTypeOf('function')
  })

  it('re-registers onTokenExpired after StrictMode effect cleanup without re-initializing auth', async () => {
    keycloakMock.init.mockResolvedValue(true)

    await renderInStrictMode()

    expect(keycloakMock.init).toHaveBeenCalledTimes(1)
    expect(keycloakMock.onTokenExpired).toBeTypeOf('function')
  })

  it('calls updateToken(30) when token expires', async () => {
    keycloakMock.init.mockResolvedValue(true)

    await render()

    await act(async () => {
      keycloakMock.onTokenExpired?.()
      await new Promise((r) => setTimeout(r, 0))
    })

    expect(keycloakMock.updateToken).toHaveBeenCalledWith(30)
  })

  it('does not call login() when token refresh fails on expiry', async () => {
    keycloakMock.init.mockResolvedValue(true)
    keycloakMock.updateToken.mockRejectedValue(new Error('session gone'))

    await render()

    await act(async () => {
      keycloakMock.onTokenExpired?.()
      await new Promise((r) => setTimeout(r, 0))
    })

    expect(keycloakMock.login).not.toHaveBeenCalled()
  })

  it('calls keycloak.login() when init resolves not-authenticated', async () => {
    keycloakMock.init.mockResolvedValue(false)

    await render()

    expect(keycloakMock.login).toHaveBeenCalledTimes(1)
    expect(container.textContent).not.toContain('App ready')
  })

  it('shows network error heading when fetch fails', async () => {
    keycloakMock.init.mockRejectedValue(new Error('Failed to fetch'))

    await render()

    expect(container.textContent).toContain('Cannot reach authentication server')
    expect(container.textContent).not.toContain('App ready')
  })

  it('shows config error heading when realm is invalid', async () => {
    keycloakMock.init.mockRejectedValue(new Error('realm not found'))

    await render()

    expect(container.textContent).toContain('Authentication misconfigured')
  })

  it('shows timeout error heading and keycloak URL when init times out', async () => {
    keycloakMock.init.mockRejectedValue(
      new Error('Authentication timed out after 15000ms while contacting http://keycloak.test'),
    )

    await render()

    expect(container.textContent).toContain('Authentication is stuck')
    expect(container.textContent).toContain('http://keycloak.test')
  })

  it('shows generic error heading for unknown failures', async () => {
    keycloakMock.init.mockRejectedValue(new Error('something completely unexpected'))

    await render()

    expect(container.textContent).toContain('Authentication failed')
  })

  it('removes the splash screen on auth error', async () => {
    keycloakMock.init.mockRejectedValue(new Error('Failed to fetch'))

    await render()

    expect(document.getElementById('splash')).toBeNull()
  })

  it('shows a retry button on auth error', async () => {
    keycloakMock.init.mockRejectedValue(new Error('Failed to fetch'))

    await render()

    expect(container.textContent).toContain('Try again')
  })
})
