import { createApiClient } from '@/lib/keycloak'

export const organizationClient = createApiClient('/api/v1/organization')
