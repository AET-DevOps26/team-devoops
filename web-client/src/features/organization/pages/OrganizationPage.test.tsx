import { act } from 'react'
import { createRoot, type Root } from 'react-dom/client'
import { MemoryRouter } from 'react-router-dom'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

type PersonaKey = 'member' | 'coach' | 'director' | 'admin'

const mockState = vi.hoisted(() => ({
  persona: 'member' as PersonaKey,
  teamsError: null as Error | null,
  teamsLoading: false,
}))

vi.mock('@/features/auth', async () => {
  const { MOCK_PERSONAS } = await import('@/mocks/personas')

  return {
    useAuth: () => ({ user: MOCK_PERSONAS[mockState.persona] }),
  }
})

vi.mock('@/features/organization/api/queries', async () => {
  const { sportFixtures, teamFixtures } = await import('@/mocks/fixtures/organization')

  const mutation = () => ({ mutateAsync: vi.fn(), isPending: false })

  return {
    useSportsList: () => ({ data: sportFixtures, isLoading: false, error: null }),
    useTeamsList: () => ({
      data: mockState.teamsLoading ? undefined : teamFixtures,
      isLoading: mockState.teamsLoading,
      error: mockState.teamsError,
    }),
    useSport: () => ({ data: undefined, isLoading: false, error: null }),
    useTeam: () => ({ data: undefined, isLoading: false, error: null }),
    useCreateSport: mutation,
    useUpdateSport: mutation,
    useDeleteSport: mutation,
    useCreateTeam: mutation,
    useUpdateTeam: mutation,
    useDeleteTeam: mutation,
  }
})

vi.mock('@/features/members/api/queries', async () => {
  const { memberSummaryFixtures } = await import('@/mocks/fixtures')

  return {
    useMembers: () => ({ data: memberSummaryFixtures, isLoading: false, error: null }),
  }
})

const { OrganizationPage } = await import('./OrganizationPage')
const { sportFixtures, teamFixtures } = await import('@/mocks/fixtures/organization')

describe('OrganizationPage', () => {
  let container: HTMLDivElement
  let root: Root

  beforeEach(() => {
    vi.clearAllMocks()
    mockState.persona = 'member'
    mockState.teamsError = null
    mockState.teamsLoading = false
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
          <OrganizationPage />
        </MemoryRouter>,
      )
    })
  }

  function buttonNamed(name: string): HTMLButtonElement | undefined {
    return Array.from(container.querySelectorAll('button')).find(
      (button) => button.textContent?.trim() === name,
    )
  }

  it('lists every sport and its teams for the member persona without manage actions', async () => {
    await render()

    for (const sport of sportFixtures) {
      expect(container.textContent).toContain(sport.name)
    }
    expect(container.textContent).toContain(teamFixtures[0].name)
    expect(buttonNamed('New sport')).toBeUndefined()
    expect(buttonNamed('New team')).toBeUndefined()
  })

  it('gives the admin sport and team creation entry points', async () => {
    mockState.persona = 'admin'

    await render()

    expect(buttonNamed('New sport')).toBeDefined()
    expect(buttonNamed('New team')).toBeDefined()
  })

  it('gives the director a team creation entry point but no sport creation', async () => {
    mockState.persona = 'director'

    await render()

    expect(buttonNamed('New sport')).toBeUndefined()
    expect(buttonNamed('New team')).toBeDefined()
  })

  it('renders the loading state while the teams query is in flight', async () => {
    // The page has no dedicated query-error branch — it renders loading, empty,
    // or the sports list; deletion errors are surfaced per-dialog instead.
    mockState.teamsLoading = true

    await render()

    expect(container.textContent).not.toContain(teamFixtures[0].name)
  })
})
