import { describe, it, expect, vi, beforeEach } from 'vitest'
import type { AxiosError, InternalAxiosRequestConfig } from 'axios'

// Shared mock state — must be declared before vi.mock so the factory can close over it.
const mock = {
  token: 'mock-token' as string | undefined,
  tokenParsed: { exp: Math.floor(Date.now() / 1000) + 10 } as { exp?: number } | undefined,
  updateToken: vi.fn<(n: number) => Promise<boolean>>(),
  login: vi.fn<() => Promise<void>>(),
  onAuthRefreshSuccess: undefined as (() => void) | undefined,
}

// vi.mock is hoisted before static imports, so keycloak-js is replaced before
// keycloak.ts creates the singleton.
vi.mock('keycloak-js', () => ({
  default: vi.fn(() => mock),
}))

const {
  createApiClient,
  DEFAULT_REQUEST_TIMEOUT_MS,
  onTokenRefreshed,
  resetKeycloakRefreshStateForTests,
} = await import('@/lib/keycloak')

function captureAdapter(captured: { config?: InternalAxiosRequestConfig }) {
  return async (config: InternalAxiosRequestConfig) => {
    captured.config = config
    return { data: {}, status: 200, statusText: 'OK', headers: {}, config }
  }
}

function deferred<T>() {
  let resolve!: (value: T | PromiseLike<T>) => void
  let reject!: (reason?: unknown) => void
  const promise = new Promise<T>((res, rej) => {
    resolve = res
    reject = rej
  })
  return { promise, resolve, reject }
}

describe('createApiClient', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    resetKeycloakRefreshStateForTests()
    mock.token = 'mock-token'
    mock.tokenParsed = { exp: Math.floor(Date.now() / 1000) + 10 }
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

  it('uses the default request timeout', () => {
    const client = createApiClient('/api/test')

    expect(client.defaults.timeout).toBe(DEFAULT_REQUEST_TIMEOUT_MS)
  })

  it('accepts a per-client request timeout', () => {
    const client = createApiClient('/api/test', 60_000)

    expect(client.defaults.timeout).toBe(60_000)
  })

  it('skips updateToken() when the token is not close to expiring', async () => {
    mock.tokenParsed = { exp: Math.floor(Date.now() / 1000) + 120 }
    const client = createApiClient('/api/test')
    const captured: { config?: InternalAxiosRequestConfig } = {}
    client.defaults.adapter = captureAdapter(captured)

    await client.get('/something')

    expect(mock.updateToken).not.toHaveBeenCalled()
  })

  it('deduplicates concurrent refreshes for near-expiry requests', async () => {
    const refresh = deferred<boolean>()
    mock.updateToken.mockReturnValue(refresh.promise)
    const client = createApiClient('/api/test')
    client.defaults.adapter = captureAdapter({})

    const firstRequest = client.get('/first')
    const secondRequest = client.get('/second')
    await Promise.resolve()

    expect(mock.updateToken).toHaveBeenCalledTimes(1)

    refresh.resolve(true)

    await Promise.all([firstRequest, secondRequest])
  })

  it('sets Authorization: Bearer header when token is present', async () => {
    const client = createApiClient('/api/test')
    const captured: { config?: InternalAxiosRequestConfig } = {}
    client.defaults.adapter = captureAdapter(captured)

    await client.get('/something')

    expect(captured.config?.headers?.Authorization).toBe('Bearer mock-token')
  })

  it('does not call login() when updateToken rejects', async () => {
    mock.updateToken.mockRejectedValue(new Error('session expired'))
    const client = createApiClient('/api/test')
    const captured: { config?: InternalAxiosRequestConfig } = {}
    client.defaults.adapter = captureAdapter(captured)

    await client.get('/something')

    expect(mock.login).not.toHaveBeenCalled()
  })

  it('does not set Authorization header when token is undefined', async () => {
    mock.token = undefined
    const client = createApiClient('/api/test')
    const captured: { config?: InternalAxiosRequestConfig } = {}
    client.defaults.adapter = captureAdapter(captured)

    await client.get('/something')

    expect(captured.config?.headers?.Authorization).toBeUndefined()
  })

  it('calls login() when the API responds with 401', async () => {
    const client = createApiClient('/api/test')
    client.defaults.adapter = async (config) => {
      const error = new Error('Unauthorized') as AxiosError
      error.config = config
      error.response = { data: {}, status: 401, statusText: 'Unauthorized', headers: {}, config }
      throw error
    }

    await expect(client.get('/something')).rejects.toMatchObject({
      response: { status: 401 },
    })

    expect(mock.login).toHaveBeenCalledTimes(1)
  })
})

describe('onTokenRefreshed', () => {
  it('fans out refreshes and unsubscribes listeners independently', () => {
    const firstListener = vi.fn()
    const secondListener = vi.fn()
    const unsubscribeFirst = onTokenRefreshed(firstListener)
    const unsubscribeSecond = onTokenRefreshed(secondListener)

    mock.onAuthRefreshSuccess?.()
    unsubscribeFirst()
    mock.onAuthRefreshSuccess?.()
    unsubscribeSecond()

    expect(firstListener).toHaveBeenCalledTimes(1)
    expect(secondListener).toHaveBeenCalledTimes(2)
  })
})
