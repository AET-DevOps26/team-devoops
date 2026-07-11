// Node-side re-exports of the shared test data the stub server serves, so E2E
// assertions derive from the same fixtures rather than hard-coded strings.
export { TEST_PERSONAS } from '../../src/testing/personas'
export { ALL_ROLES, NAV_ITEMS } from '../../src/app/navPolicy'
export { memberFixtures, memberSummaryFixtures } from '../../src/testing/fixtures/members'
export { eventSummaryFixtures } from '../../src/testing/fixtures/events'
export { feedbackSummaryFixtures } from '../../src/testing/fixtures/feedback'
export { balanceFixtures, transactionFixtures } from '../../src/testing/fixtures/finance'
export { sportFixtures, teamFixtures } from '../../src/testing/fixtures/organization'
export { dashboardFixtures } from '../../src/testing/fixtures/dashboard'

import { TEST_PERSONAS } from '../../src/testing/personas'

// The suite runs as the admin identity (see auth.ts).
export const ADMIN = TEST_PERSONAS.admin
