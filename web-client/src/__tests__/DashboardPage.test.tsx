import { act } from 'react'
import { createRoot, type Root } from 'react-dom/client'
import { MemoryRouter } from 'react-router-dom'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

vi.mock('@/features/auth', async () => {
  const { MOCK_PERSONAS } = await import('@/mocks/personas')

  return {
    useAuth: () => ({ user: MOCK_PERSONAS.coach }),
  }
})

vi.mock('@/app/pages/api/dashboardQueries', async () => {
  const { dashboardFixtures } = await import('@/mocks/fixtures/dashboard')

  return {
    useDashboard: () => ({
      data: dashboardFixtures.coach,
      isLoading: false,
      error: null,
    }),
  }
})

vi.mock('@/features/sport-events/api/queries', async () => {
  const { eventSummaryFixtures } = await import('@/mocks/fixtures')
  const { MOCK_PERSONAS } = await import('@/mocks/personas')
  const { scopeEvents } = await import('@/mocks/scope')

  return {
    useEventsList: () => ({
      data: scopeEvents(eventSummaryFixtures, MOCK_PERSONAS.coach),
      isLoading: false,
      error: null,
    }),
  }
})

vi.mock('@/features/organization/api/queries', () => ({
  useSportsList: () => ({
    data: [],
    isLoading: false,
    error: null,
  }),
  useTeamsList: () => ({
    data: [],
    isLoading: false,
    error: null,
  }),
}))

const { DashboardPage } = await import('@/app/pages/DashboardPage')
const { dashboardFixtures } = await import('@/mocks/fixtures/dashboard')

describe('DashboardPage', () => {
  let container: HTMLDivElement
  let root: Root

  beforeEach(() => {
    vi.clearAllMocks()
    document.body.innerHTML = '<div id="root"></div>'
    container = document.getElementById('root') as HTMLDivElement
    root = createRoot(container)
  })

  afterEach(async () => {
    await act(async () => {
      root.unmount()
    })
    document.body.innerHTML = ''
  })

  async function render() {
    await act(async () => {
      root.render(
        <MemoryRouter>
          <DashboardPage />
        </MemoryRouter>,
      )
    })
  }

  it('renders the coach team and roster size from the dashboard fixture', async () => {
    const dashboard = dashboardFixtures.coach

    expect(dashboard.role).toBe('trainer')

    await render()

    if (dashboard.role === 'trainer') {
      expect(container.textContent).toContain(dashboard.team.name)
      expect(container.textContent).toContain(`${dashboard.total_members} roster members`)
    }
  })
})
