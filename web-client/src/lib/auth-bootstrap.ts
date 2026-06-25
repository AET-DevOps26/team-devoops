import { KEYCLOAK_URL } from '@/lib/keycloak'

export type AuthError = 'network' | 'config' | 'timeout' | 'unknown'

export const AUTH_INIT_TIMEOUT_MS = 15000

export function createAuthInitTimeoutError(timeoutMs = AUTH_INIT_TIMEOUT_MS): Error {
  return new Error(
    `Authentication timed out after ${timeoutMs}ms while contacting ${KEYCLOAK_URL}`,
  )
}

export function classifyAuthError(error: unknown): AuthError {
  if (!(error instanceof Error)) {
    return 'unknown'
  }

  const message = error.message.toLowerCase()

  if (message.includes('timed out') || message.includes('timeout')) {
    return 'timeout'
  }

  if (
    error.message === 'Failed to fetch' ||
    message.includes('network') ||
    message.includes('fetch')
  ) {
    return 'network'
  }

  if (
    message.includes('realm') ||
    message.includes('client') ||
    message.includes('url') ||
    message.includes('config')
  ) {
    return 'config'
  }

  return 'unknown'
}

export async function withTimeout<T>(
  promise: Promise<T>,
  timeoutMs: number,
  errorFactory: () => Error = () => createAuthInitTimeoutError(timeoutMs),
): Promise<T> {
  return await Promise.race([
    promise,
    new Promise<T>((_, reject) => {
      window.setTimeout(() => reject(errorFactory()), timeoutMs)
    }),
  ])
}
