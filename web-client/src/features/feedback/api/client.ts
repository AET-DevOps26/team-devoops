import { createApiClient } from '@/lib/keycloak'

export const feedbackClient = createApiClient('/api/v1/feedback')
