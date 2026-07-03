import { act } from 'react'
import { createRoot, type Root } from 'react-dom/client'
import { MemoryRouter } from 'react-router-dom'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

type PersonaKey = 'member' | 'coach' | 'director' | 'admin'

const mockState = vi.hoisted(() => ({
  persona: 'coach' as PersonaKey,
}))

vi.mock('@/features/auth', async () => {
  const { MOCK_PERSONAS } = await import('@/mocks/personas')

  return {
    useAuth: () => ({ user: MOCK_PERSONAS[mockState.persona] }),
  }
})

vi.mock('@/app/pages/api/dashboardQueries', async () => {
  const { dashboardFixtures } = await import('@/mocks/fixtures/dashboard')

  return {
    useDashboard: () => ({
      data: dashboardFixtures[mockState.persona],
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
      data: scopeEvents(eventSummaryFixtures, MOCK_PERSONAS[mockState.persona]),
      isLoading: false,
      error: null,
    }),
  }
})

vi.mock('@/features/organization/api/queries', async () => {
  const { sportFixtures, teamFixtures } = await import('@/mocks/fixtures/organization')

  return {
    useSportsList: () => ({
      data: sportFixtures,
      isLoading: false,
      error: null,
    }),
    useTeamsList: () => ({
      data: teamFixtures,
      isLoading: false,
      error: null,
    }),
  }
})

const { DashboardPage } = await import('@/app/pages/DashboardPage')
const { dashboardFixtures } = await import('@/mocks/fixtures/dashboard')
const { formatCents } = await import('@/lib/format')

describe('DashboardPage', () => {
  let container: HTMLDivElement
  let root: Root

  beforeEach(() => {
    vi.clearAllMocks()
    mockState.persona = 'coach'
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

  it('renders director sport stats and team breakdown from the dashboard fixture', async () => {
    mockState.persona = 'director'
    const dashboard = dashboardFixtures.director

    expect(dashboard.role).toBe('director')

    await render()

    if (dashboard.role === 'director') {
      const firstTeam = dashboard.teams[0]
      const text = container.textContent ?? ''

      expect(text).toContain('My Sport')
      expect(text).toContain(dashboard.sport.name)
      expect(text).toContain(String(dashboard.total_teams))
      expect(text).toContain(String(dashboard.total_members))
      expect(text).toContain(formatCents(dashboard.sport_balance_cents))
      expect(text).toContain('Team Breakdown')

      expect(firstTeam).toBeDefined()
      expect(text).toContain(firstTeam.team.name)
      expect(text).toContain(`${firstTeam.member_count} members`)
      expect(text).toContain(formatCents(firstTeam.balance_cents))
    }
  })

  it('renders admin club balance and weekly event count from the dashboard fixture', async () => {
    mockState.persona = 'admin'
    const dashboard = dashboardFixtures.admin

    expect(dashboard.role).toBe('admin')

    await render()

    if (dashboard.role === 'admin') {
      const text = container.textContent ?? ''

      expect(text).toContain('Total Teams')
      expect(text).toContain('Club Balance')
      expect(text).toContain(formatCents(dashboard.total_balance_cents))
      expect(text).toContain('Events This Week')
      expect(text).toContain(String(dashboard.events_this_week))
    }
  })
})
