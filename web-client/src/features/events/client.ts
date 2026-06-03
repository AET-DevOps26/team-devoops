import { createApiClient } from '@/lib/keycloak'

export const eventsClient = createApiClient('/api/v1/events')
