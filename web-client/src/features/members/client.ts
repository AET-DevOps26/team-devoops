import { createApiClient } from '@/lib/keycloak'

export const membersClient = createApiClient('/api/v1/members')
