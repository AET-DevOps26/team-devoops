import Keycloak from 'keycloak-js'
import axios, { AxiosError, type AxiosInstance } from 'axios'

export const KEYCLOAK_URL = import.meta.env.VITE_KEYCLOAK_URL || 'http://localhost:8081/auth'
export const TOKEN_REFRESH_MIN_VALIDITY_SECONDS = 30

const keycloak = new Keycloak({
  url: KEYCLOAK_URL,
  realm: 'devops',
  clientId: 'devops-client',
})

let inFlightRefresh: Promise<boolean> | null = null

export function resetKeycloakRefreshStateForTests(): void {
  inFlightRefresh = null
}

function shouldRefreshToken(minValidity: number): boolean {
  if (!keycloak.token) {
    return false
  }

  const expiresAt = keycloak.tokenParsed?.exp
  if (typeof expiresAt !== 'number') {
    return true
  }

  const nowInSeconds = Math.floor(Date.now() / 1000)
  return expiresAt - nowInSeconds <= minValidity
}

async function refreshTokenIfNeeded(minValidity: number): Promise<void> {
  if (!shouldRefreshToken(minValidity)) {
    return
  }

  // Concurrent requests can all observe the same near-expiry token, so they
  // share one refresh instead of racing separate updateToken() calls.
  if (!inFlightRefresh) {
    inFlightRefresh = keycloak.updateToken(minValidity).finally(() => {
      inFlightRefresh = null
    })
  }

  await inFlightRefresh
}

export function createApiClient(baseURL: string): AxiosInstance {
  const client = axios.create({ baseURL })

  client.interceptors.request.use(async (config) => {
    try {
      await refreshTokenIfNeeded(TOKEN_REFRESH_MIN_VALIDITY_SECONDS)
    } catch {
      // Let the backend's 401 decide when we need a full re-auth redirect.
    }
    if (keycloak.token) {
      config.headers.Authorization = `Bearer ${keycloak.token}`
    }
    return config
  })

  client.interceptors.response.use(
    (response) => response,
    async (error: AxiosError) => {
      if (error.response?.status === 401) {
        await keycloak.login()
      }

      return Promise.reject(error)
    },
  )

  return client
}

export default keycloak
