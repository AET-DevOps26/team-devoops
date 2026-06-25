import { describe, expect, it } from 'vitest'
import {
  AUTH_INIT_TIMEOUT_MS,
  classifyAuthError,
  createAuthInitTimeoutError,
  withTimeout,
} from '@/lib/auth-bootstrap'

describe('auth bootstrap helpers', () => {
  it('classifies auth init timeouts explicitly', () => {
    expect(classifyAuthError(createAuthInitTimeoutError())).toBe('timeout')
  })

  it('preserves existing network classification', () => {
    expect(classifyAuthError(new Error('Failed to fetch'))).toBe('network')
  })

  it('rejects when a promise never settles', async () => {
    await expect(
      withTimeout(new Promise<never>(() => {}), 1, () => createAuthInitTimeoutError(1)),
    ).rejects.toThrow('Authentication timed out after 1ms')
  })

  it('exposes the configured auth timeout constant', () => {
    expect(AUTH_INIT_TIMEOUT_MS).toBe(15000)
  })
})
