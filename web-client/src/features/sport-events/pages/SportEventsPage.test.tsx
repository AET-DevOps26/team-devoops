import { act } from 'react'
import { createRoot, type Root } from 'react-dom/client'
import { MemoryRouter } from 'react-router-dom'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

type PersonaKey = 'member' | 'coach' | 'director' | 'admin'

const mockState = vi.hoisted(() => ({
  persona: 'admin' as PersonaKey,
  eventsError: null as Error | null,
  eventsLoading: false,
}))

vi.mock('@/features/auth', async () => {
  const { TEST_PERSONAS } = await import('@/testing/personas')

  return {
    useAuth: () => ({ user: TEST_PERSONAS[mockState.persona] }),
  }
})

vi.mock('@/features/sport-events/api/queries', async () => {
  const { eventSummaryFixtures } = await import('@/testing/fixtures')
  const { TEST_PERSONAS } = await import('@/testing/personas')
  const { scopeEvents } = await import('@/testing/scope')

  return {
    useEventsList: () => ({
      data: mockState.eventsLoading
        ? undefined
        : scopeEvents(eventSummaryFixtures, TEST_PERSONAS[mockState.persona]),
      isLoading: mockState.eventsLoading,
      error: mockState.eventsError,
    }),
    useEvent: () => ({ data: undefined, isLoading: false, error: null }),
    useCreateSportEvent: () => ({ mutateAsync: vi.fn(), isPending: false }),
    useUpdateSportEvent: () => ({ mutateAsync: vi.fn(), isPending: false }),
    useDeleteSportEvent: () => ({ mutateAsync: vi.fn(), isPending: false }),
  }
})

vi.mock('@/features/organization/api/queries', async () => {
  const { sportFixtures, teamFixtures } = await import('@/testing/fixtures/organization')

  return {
    useSportsList: () => ({ data: sportFixtures, isLoading: false, error: null }),
    useTeamsList: () => ({ data: teamFixtures, isLoading: false, error: null }),
  }
})

const { SportEventsPage } = await import('./SportEventsPage')
const { eventSummaryFixtures } = await import('@/testing/fixtures')
const { TEST_PERSONAS } = await import('@/testing/personas')
const { scopeEvents } = await import('@/testing/scope')

describe('SportEventsPage', () => {
  let container: HTMLDivElement
  let root: Root

  beforeEach(() => {
    vi.clearAllMocks()
    mockState.persona = 'admin'
    mockState.eventsError = null
    mockState.eventsLoading = false
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
          <SportEventsPage />
        </MemoryRouter>,
      )
    })
  }

  function buttonNamed(name: string): HTMLButtonElement | undefined {
    return Array.from(container.querySelectorAll('button')).find((button) =>
      button.textContent?.includes(name),
    )
  }

  function bodyRowCount(): number {
    return container.querySelectorAll('table tbody tr').length
  }

  it('shows every event and the create button for the admin', async () => {
    await render()

    expect(bodyRowCount()).toBe(eventSummaryFixtures.length)
    expect(buttonNamed('New event')).toBeDefined()
    expect(
      container.querySelector(`button[aria-label="Delete ${eventSummaryFixtures[0].name}"]`),
    ).not.toBeNull()
  })

  it('scopes rows to the member persona team events and hides the create button', async () => {
    mockState.persona = 'member'
    const scoped = scopeEvents(eventSummaryFixtures, TEST_PERSONAS.member)

    await render()

    expect(bodyRowCount()).toBe(scoped.length)
    expect(scoped.length).toBeGreaterThan(0)
    expect(scoped.length).toBeLessThan(eventSummaryFixtures.length)
    expect(buttonNamed('New event')).toBeUndefined()
  })

  it('shows the coach persona their scoped events with a create button', async () => {
    mockState.persona = 'coach'
    const scoped = scopeEvents(eventSummaryFixtures, TEST_PERSONAS.coach)

    await render()

    expect(bodyRowCount()).toBe(scoped.length)
    expect(buttonNamed('New event')).toBeDefined()
  })

  it('surfaces a query error', async () => {
    mockState.eventsError = new Error('Request failed with status code 500')

    await render()

    expect(container.textContent).toContain('Request failed with status code 500')
  })

  it('renders the loading skeleton while fetching', async () => {
    mockState.eventsLoading = true

    await render()

    expect(container.querySelector('table')).toBeNull()
  })
})
