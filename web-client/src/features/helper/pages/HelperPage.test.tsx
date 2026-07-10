import { act } from 'react'
import { createRoot, type Root } from 'react-dom/client'
import { MemoryRouter } from 'react-router-dom'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

type PersonaKey = 'member' | 'coach' | 'director' | 'admin'

const mockState = vi.hoisted(() => ({
  persona: 'member' as PersonaKey,
}))

const mutationMocks = vi.hoisted(() => ({
  generateMember: vi.fn(),
  generateTeam: vi.fn(),
}))

vi.mock('@/features/auth', async () => {
  const { MOCK_PERSONAS } = await import('@/mocks/personas')

  return {
    useAuth: () => ({ user: MOCK_PERSONAS[mockState.persona] }),
  }
})

vi.mock('@/features/helper/api/queries', async () => {
  const { memberReportSummariesById, teamReportSummariesById } = await import('@/mocks/fixtures')
  const { MOCK_PERSONAS } = await import('@/mocks/personas')

  return {
    helperKeys: {
      memberReports: (memberId: string) => ['helper', 'reports', 'member', memberId] as const,
      teamReports: (teamId: string) => ['helper', 'reports', 'team', teamId] as const,
      report: (reportId: string) => ['helper', 'reports', reportId] as const,
    },
    useMemberReports: (memberId: string, enabled = true) => ({
      data:
        enabled && memberId === MOCK_PERSONAS[mockState.persona].id
          ? (memberReportSummariesById[memberId] ?? [])
          : undefined,
      isLoading: false,
      isError: false,
    }),
    useTeamReports: (teamId: string, enabled = true) => ({
      data: enabled ? (teamReportSummariesById[teamId] ?? []) : undefined,
      isLoading: false,
      isError: false,
    }),
    useReport: () => ({ data: undefined, isLoading: false, error: null }),
    useGenerateMemberReport: () => ({
      mutate: mutationMocks.generateMember,
      isPending: false,
      error: null,
    }),
    useGenerateTeamReport: () => ({
      mutate: mutationMocks.generateTeam,
      isPending: false,
      error: null,
    }),
    useDeleteReport: () => ({ mutateAsync: vi.fn(), isPending: false }),
  }
})

vi.mock('@/features/organization/api/queries', async () => {
  const { teamFixtures } = await import('@/mocks/fixtures/organization')

  return {
    useTeamsList: (enabled = true) => ({
      data: enabled ? teamFixtures : undefined,
      isLoading: false,
      error: null,
    }),
  }
})

const { HelperPage } = await import('./HelperPage')
const { teamFixtures } = await import('@/mocks/fixtures/organization')
const { MOCK_PERSONAS } = await import('@/mocks/personas')

describe('HelperPage', () => {
  let container: HTMLDivElement
  let root: Root

  beforeEach(() => {
    vi.clearAllMocks()
    mockState.persona = 'member'
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
          <HelperPage />
        </MemoryRouter>,
      )
    })
  }

  it('scopes the member persona to their own development reports', async () => {
    await render()

    // Member scope: the subject is the signed-in user, not a team.
    expect(container.textContent).toContain('Your progress reports from the coaching staff.')
  })

  it('scopes the coach persona to their coached team', async () => {
    mockState.persona = 'coach'
    const coachedTeam = teamFixtures.find((team) =>
      team.trainers.some((trainer) => trainer.id === MOCK_PERSONAS.coach.id),
    )

    await render()

    expect(coachedTeam).toBeDefined()
    expect(container.textContent).toContain(coachedTeam?.name ?? '')
  })

  it('triggers a report generation from the page action', async () => {
    await render()

    const generateButton = Array.from(container.querySelectorAll('button')).find((button) =>
      button.textContent?.toLowerCase().includes('generate'),
    )
    expect(generateButton).toBeDefined()

    await act(async () => {
      generateButton?.dispatchEvent(new MouseEvent('click', { bubbles: true }))
    })

    expect(mutationMocks.generateMember).toHaveBeenCalled()
  })
})
