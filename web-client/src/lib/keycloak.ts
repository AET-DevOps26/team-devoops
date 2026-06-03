import Keycloak from 'keycloak-js'
import axios, { type AxiosInstance } from 'axios'

const keycloak = new Keycloak({
  url: import.meta.env.VITE_KEYCLOAK_URL ?? 'http://localhost:8081',
  realm: 'devops',
  clientId: 'devops-client',
})

export function createApiClient(baseURL: string): AxiosInstance {
  const client = axios.create({ baseURL })

  client.interceptors.request.use(async (config) => {
    try {
      await keycloak.updateToken(30)
    } catch {
      await keycloak.login()
    }
    if (keycloak.token) {
      config.headers.Authorization = `Bearer ${keycloak.token}`
    }
    return config
  })

  return client
}

export default keycloak
