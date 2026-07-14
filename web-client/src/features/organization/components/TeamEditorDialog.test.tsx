import { act } from 'react'
import { createRoot, type Root } from 'react-dom/client'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

import type { MemberSummary, Sport, Team } from '@/types'

type PersonaKey = 'member' | 'coach' | 'director' | 'admin'

const mockState = vi.hoisted(() => ({
  persona: 'admin' as PersonaKey,
  sports: [] as Sport[],
  teams: [] as Team[],
  members: [] as MemberSummary[],
}))

const mutationMocks = vi.hoisted(() => ({
  createTeam: vi.fn(),
  updateTeam: vi.fn(),
}))

vi.mock('sonner', () => ({
  toast: {
    success: vi.fn(),
    error: vi.fn(),
  },
}))

vi.mock('@/features/auth', async () => {
  const { TEST_PERSONAS } = await import('@/testing/personas')

  return {
    useAuth: () => ({ user: TEST_PERSONAS[mockState.persona] }),
  }
})

vi.mock('@/features/organization/api/queries', () => ({
  useSportsList: () => ({ data: mockState.sports, isLoading: false, error: null }),
  useTeamsList: () => ({ data: mockState.teams, isLoading: false, error: null }),
  useCreateTeam: () => ({ mutateAsync: mutationMocks.createTeam, isPending: false }),
  useUpdateTeam: () => ({ mutateAsync: mutationMocks.updateTeam, isPending: false }),
}))

vi.mock('@/features/members/api/queries', () => ({
  useMembers: () => ({ data: mockState.members, isLoading: false, error: null }),
}))

const { TeamEditorDialog } = await import('./TeamEditorDialog')
const { useOrganizationUiStore } = await import('../model/organizationUiStore')

describe('TeamEditorDialog', () => {
  let container: HTMLDivElement
  let root: Root

  beforeEach(() => {
    vi.clearAllMocks()
    mockState.persona = 'admin'
    mockState.sports = []
    mockState.teams = []
    mockState.members = []
    useOrganizationUiStore.setState({
      editorTarget: null,
      sportEditorTarget: null,
      deleteTargetId: null,
      sportDeleteTargetId: null,
    })
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

  async function renderOpenCreate() {
    await act(async () => {
      root.render(<TeamEditorDialog />)
    })
    await act(async () => {
      useOrganizationUiStore.getState().openCreateTeam()
    })
  }

  function buttonNamed(name: string): HTMLButtonElement | undefined {
    return Array.from(document.body.querySelectorAll('button')).find(
      (button) => button.textContent?.trim() === name,
    )
  }

  it('explains that admins need a sport before creating teams and opens sport creation', async () => {
    await renderOpenCreate()

    expect(document.body.textContent).toContain(
      'No sports yet. Create a sport first, then add teams to it.',
    )
    expect(document.body.textContent).not.toContain('You are not allowed to create teams.')

    await act(async () => {
      buttonNamed('Create sport')?.dispatchEvent(new MouseEvent('click', { bubbles: true }))
    })

    expect(useOrganizationUiStore.getState().editorTarget).toBeNull()
    expect(useOrganizationUiStore.getState().sportEditorTarget).toEqual({ mode: 'create' })
  })

  it('explains that directors need a directed sport before creating teams', async () => {
    mockState.persona = 'director'
    mockState.sports = [
      {
        id: 'sport-1',
        name: 'Football',
        description: 'Football squads.',
        created_at: '2026-01-01',
        directors: [],
      },
    ]

    await renderOpenCreate()

    expect(document.body.textContent).toContain(
      "You don't direct any sport yet. Ask an admin to add you as a director of a sport.",
    )
    expect(document.body.textContent).not.toContain('You are not allowed to create teams.')
    expect(buttonNamed('Create sport')).toBeUndefined()
  })

  it('keeps the generic denial for roles that cannot create teams', async () => {
    mockState.persona = 'coach'

    await renderOpenCreate()

    expect(document.body.textContent).toContain('You are not allowed to create teams.')
    expect(document.body.textContent).not.toContain('Create a sport first')
  })
})
