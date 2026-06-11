import { createApiClient } from '@/lib/keycloak'

export const lettersClient = createApiClient('/api/v1/letters')
