import { createApiClient } from '@/lib/keycloak'

export const paymentsClient = createApiClient('/api/v1/finances')
