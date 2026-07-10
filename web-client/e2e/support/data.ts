// Node-side imports of the SAME fixture modules the app serves under
// VITE_USE_MOCKS=true, so E2E assertions are derived from data, never
// hard-coded. Only runtime-safe modules are imported (their '@/types'
// imports are type-only, and all runtime imports are relative).
export { MOCK_PERSONAS } from '../../src/mocks/personas'
export { ALL_ROLES, NAV_ITEMS } from '../../src/app/navPolicy'
export { memberFixtures, memberSummaryFixtures } from '../../src/mocks/fixtures/members'
export { eventSummaryFixtures } from '../../src/mocks/fixtures/events'
export { feedbackSummaryFixtures } from '../../src/mocks/fixtures/feedback'
export { balanceFixtures, transactionFixtures } from '../../src/mocks/fixtures/finance'
export { sportFixtures, teamFixtures } from '../../src/mocks/fixtures/organization'
export { dashboardFixtures } from '../../src/mocks/fixtures/dashboard'

import { MOCK_PERSONAS } from '../../src/mocks/personas'

// The E2E suite runs as the admin persona (see playwright.config.ts webServer env).
export const ADMIN = MOCK_PERSONAS.admin
