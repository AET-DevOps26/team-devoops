import { createApiClient } from '@/lib/keycloak'

export const sportEventsClient = createApiClient('/api/v1/events')
