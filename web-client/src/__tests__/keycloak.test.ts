import { describe, it, expect, vi, beforeEach } from 'vitest'
import type { InternalAxiosRequestConfig } from 'axios'

// Shared mock state — must be declared before vi.mock so the factory can close over it.
const mock = {
  token: 'mock-token' as string | undefined,
  updateToken: vi.fn<[number], Promise<boolean>>(),
  login: vi.fn<[], Promise<void>>(),
}

// vi.mock is hoisted before static imports, so keycloak-js is replaced before
// keycloak.ts creates the singleton.
vi.mock('keycloak-js', () => ({
  default: vi.fn(() => mock),
}))

const { createApiClient } = await import('@/lib/keycloak')

/** Minimal axios adapter that captures the final request config. */
function captureAdapter(captured: { config?: InternalAxiosRequestConfig }) {
  return async (config: InternalAxiosRequestConfig) => {
    captured.config = config
    return { data: {}, status: 200, statusText: 'OK', headers: {}, config }
  }
}

describe('createApiClient', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    mock.token = 'mock-token'
    mock.updateToken.mockResolvedValue(true)
    mock.login.mockResolvedValue(undefined)
  })

  it('calls updateToken(30) before each request', async () => {
    const client = createApiClient('/api/test')
    const captured: { config?: InternalAxiosRequestConfig } = {}
    client.defaults.adapter = captureAdapter(captured)

    await client.get('/something')

    expect(mock.updateToken).toHaveBeenCalledWith(30)
  })

  it('sets Authorization: Bearer header when token is present', async () => {
    const client = createApiClient('/api/test')
    const captured: { config?: InternalAxiosRequestConfig } = {}
    client.defaults.adapter = captureAdapter(captured)

    await client.get('/something')

    expect(captured.config?.headers?.Authorization).toBe('Bearer mock-token')
  })

  it('calls login() when updateToken rejects', async () => {
    mock.updateToken.mockRejectedValue(new Error('session expired'))
    const client = createApiClient('/api/test')
    const captured: { config?: InternalAxiosRequestConfig } = {}
    client.defaults.adapter = captureAdapter(captured)

    await client.get('/something')

    expect(mock.login).toHaveBeenCalled()
  })

  it('does not set Authorization header when token is undefined', async () => {
    mock.token = undefined
    const client = createApiClient('/api/test')
    const captured: { config?: InternalAxiosRequestConfig } = {}
    client.defaults.adapter = captureAdapter(captured)

    await client.get('/something')

    expect(captured.config?.headers?.Authorization).toBeUndefined()
  })
})
