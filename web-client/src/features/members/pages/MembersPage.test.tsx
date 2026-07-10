import { act } from 'react'
import { createRoot, type Root } from 'react-dom/client'
import { MemoryRouter } from 'react-router-dom'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

import type { MemberSummary } from '@/types'

type PersonaKey = 'member' | 'coach' | 'director' | 'admin'

const mockState = vi.hoisted(() => ({
  persona: 'admin' as PersonaKey,
  membersOverride: null as MemberSummary[] | null,
  membersError: null as Error | null,
  membersLoading: false,
}))

const mutationMocks = vi.hoisted(() => ({
  deleteMember: vi.fn(),
}))

vi.mock('@/features/auth', async () => {
  const { MOCK_PERSONAS } = await import('@/mocks/personas')

  return {
    useAuth: () => ({ user: MOCK_PERSONAS[mockState.persona] }),
  }
})

vi.mock('@/features/members/api/queries', async () => {
  const { memberSummaryFixtures } = await import('@/mocks/fixtures')
  const { MOCK_PERSONAS } = await import('@/mocks/personas')
  const { scopeMembers } = await import('@/mocks/scope')

  return {
    useMembers: () => ({
      data: mockState.membersLoading
        ? undefined
        : (mockState.membersOverride ??
          scopeMembers(memberSummaryFixtures, MOCK_PERSONAS[mockState.persona])),
      isLoading: mockState.membersLoading,
      error: mockState.membersError,
    }),
    useMember: () => ({ data: undefined, isLoading: false, error: null }),
    useCreateMember: () => ({ mutateAsync: vi.fn(), isPending: false }),
    useUpdateMember: () => ({ mutateAsync: vi.fn(), isPending: false }),
    useDeleteMember: () => ({ mutateAsync: mutationMocks.deleteMember, isPending: false }),
  }
})

vi.mock('@/features/organization/api/queries', async () => {
  const { sportFixtures, teamFixtures } = await import('@/mocks/fixtures/organization')

  return {
    useSportsList: () => ({ data: sportFixtures, isLoading: false, error: null }),
    useTeamsList: () => ({ data: teamFixtures, isLoading: false, error: null }),
  }
})

const { MembersPage } = await import('./MembersPage')
const { memberSummaryFixtures } = await import('@/mocks/fixtures')
const { MOCK_PERSONAS } = await import('@/mocks/personas')
const { scopeMembers } = await import('@/mocks/scope')

describe('MembersPage', () => {
  let container: HTMLDivElement
  let root: Root

  beforeEach(() => {
    vi.clearAllMocks()
    mockState.persona = 'admin'
    mockState.membersOverride = null
    mockState.membersError = null
    mockState.membersLoading = false
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
          <MembersPage />
        </MemoryRouter>,
      )
    })
  }

  function bodyRowCount(): number {
    return container.querySelectorAll('table tbody tr').length
  }

  function buttonNamed(name: string): HTMLButtonElement | undefined {
    return Array.from(container.querySelectorAll('button')).find(
      (button) => button.textContent?.includes(name) || button.getAttribute('aria-label') === name,
    )
  }

  it('renders every member with admin actions for the admin persona', async () => {
    await render()

    expect(bodyRowCount()).toBe(memberSummaryFixtures.length)
    expect(buttonNamed('New member')).toBeDefined()
    expect(buttonNamed('Edit Lena Roth')).toBeDefined()
    expect(buttonNamed('Delete Lena Roth')).toBeDefined()
  })

  it('renders only the coach-scoped members without admin actions', async () => {
    mockState.persona = 'coach'
    const scoped = scopeMembers(memberSummaryFixtures, MOCK_PERSONAS.coach)
    const outsideScope = memberSummaryFixtures.find(
      (member) => !scoped.some((row) => row.id === member.id),
    )

    await render()

    expect(bodyRowCount()).toBe(scoped.length)
    expect(scoped.length).toBeGreaterThan(0)
    expect(outsideScope).toBeDefined()
    expect(container.textContent).not.toContain(
      `${outsideScope?.first_name} ${outsideScope?.last_name}`,
    )
    expect(buttonNamed('New member')).toBeUndefined()
    expect(buttonNamed('Edit Lena Roth')).toBeUndefined()
  })

  it('shows only the member themself for the member persona', async () => {
    mockState.persona = 'member'

    await render()

    expect(bodyRowCount()).toBe(1)
    expect(container.textContent).toContain('Lena Roth')
  })

  it('shows the empty state when no members are visible', async () => {
    mockState.membersOverride = []

    await render()

    expect(container.textContent).toContain('No members are listed yet.')
    expect(container.querySelector('table')).toBeNull()
  })

  it('shows the error message when the query fails', async () => {
    mockState.membersError = new Error('Request failed with status code 500')

    await render()

    expect(container.textContent).toContain('Request failed with status code 500')
  })

  it('shows the loading skeleton while fetching', async () => {
    mockState.membersLoading = true

    await render()

    expect(container.querySelector('table')).toBeNull()
    expect(container.textContent).not.toContain('No members are listed yet.')
  })
})
