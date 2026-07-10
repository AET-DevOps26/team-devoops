import { act } from 'react'
import { createRoot, type Root } from 'react-dom/client'
import { MemoryRouter } from 'react-router-dom'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

type PersonaKey = 'member' | 'coach' | 'director' | 'admin'

const mockState = vi.hoisted(() => ({
  persona: 'admin' as PersonaKey,
  feedbackError: null as Error | null,
  feedbackLoading: false,
}))

vi.mock('@/features/auth', async () => {
  const { TEST_PERSONAS } = await import('@/testing/personas')

  return {
    useAuth: () => ({ user: TEST_PERSONAS[mockState.persona] }),
  }
})

vi.mock('@/features/feedback/api/queries', async () => {
  const { feedbackSummaryFixtures } = await import('@/testing/fixtures')
  const { TEST_PERSONAS } = await import('@/testing/personas')
  const { scopeFeedback } = await import('@/testing/scope')

  return {
    useFeedbackList: () => ({
      data: mockState.feedbackLoading
        ? undefined
        : scopeFeedback(feedbackSummaryFixtures, TEST_PERSONAS[mockState.persona]),
      isLoading: mockState.feedbackLoading,
      error: mockState.feedbackError,
    }),
    useFeedback: () => ({ data: undefined, isLoading: false, error: null }),
    useCreateFeedback: () => ({ mutateAsync: vi.fn(), isPending: false }),
    useUpdateFeedback: () => ({ mutateAsync: vi.fn(), isPending: false }),
    useDeleteFeedback: () => ({ mutateAsync: vi.fn(), isPending: false }),
  }
})

vi.mock('@/features/members/api/queries', async () => {
  const { memberSummaryFixtures } = await import('@/testing/fixtures')

  return {
    useMembers: () => ({ data: memberSummaryFixtures, isLoading: false, error: null }),
  }
})

vi.mock('@/features/sport-events/api/queries', async () => {
  const { eventSummaryFixtures } = await import('@/testing/fixtures')
  const { TEST_PERSONAS } = await import('@/testing/personas')
  const { scopeEvents } = await import('@/testing/scope')

  return {
    useEventsList: () => ({
      data: scopeEvents(eventSummaryFixtures, TEST_PERSONAS[mockState.persona]),
      isLoading: false,
      error: null,
    }),
  }
})

vi.mock('@/features/organization/api/queries', async () => {
  const { sportFixtures, teamFixtures } = await import('@/testing/fixtures/organization')

  return {
    useSportsList: () => ({ data: sportFixtures, isLoading: false, error: null }),
    useTeamsList: () => ({ data: teamFixtures, isLoading: false, error: null }),
  }
})

const { FeedbackPage } = await import('./FeedbackPage')
const { feedbackSummaryFixtures } = await import('@/testing/fixtures')
const { TEST_PERSONAS } = await import('@/testing/personas')
const { scopeFeedback } = await import('@/testing/scope')

describe('FeedbackPage', () => {
  let container: HTMLDivElement
  let root: Root

  beforeEach(() => {
    vi.clearAllMocks()
    mockState.persona = 'admin'
    mockState.feedbackError = null
    mockState.feedbackLoading = false
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
          <FeedbackPage />
        </MemoryRouter>,
      )
    })
  }

  function bodyRowCount(): number {
    return container.querySelectorAll('table tbody tr').length
  }

  function buttonNamed(name: string): HTMLButtonElement | undefined {
    return Array.from(container.querySelectorAll('button')).find((button) =>
      button.textContent?.includes(name),
    )
  }

  it('shows all rows and the compose entry point for the admin', async () => {
    await render()

    expect(bodyRowCount()).toBe(feedbackSummaryFixtures.length)
    expect(buttonNamed('New feedback')).toBeDefined()
    expect(container.textContent).toContain('Feedback coaches have given, by event.')
  })

  it('scopes rows to the coach and shows the coverage stat', async () => {
    mockState.persona = 'coach'
    const scoped = scopeFeedback(feedbackSummaryFixtures, TEST_PERSONAS.coach)

    await render()

    expect(bodyRowCount()).toBe(scoped.length)
    expect(scoped.length).toBeGreaterThan(0)
    expect(container.textContent).toContain("Feedback you've given, by event.")
    expect(container.textContent).toContain('Coverage')
    // Coach view drops the redundant "From" column.
    expect(container.textContent).not.toContain('From')
  })

  it('shows the member persona only their own feedback', async () => {
    mockState.persona = 'member'
    const scoped = scopeFeedback(feedbackSummaryFixtures, TEST_PERSONAS.member)

    await render()

    expect(container.textContent).toContain('Feedback coaches have given you, by event.')
    if (scoped.length === 0) {
      expect(container.textContent).toContain('No feedback is listed yet.')
    } else {
      expect(bodyRowCount()).toBe(scoped.length)
    }
    expect(buttonNamed('New feedback')).toBeUndefined()
  })

  it('shows the director the empty state and no compose button', async () => {
    mockState.persona = 'director'

    await render()

    expect(container.textContent).toContain('No feedback is listed yet.')
    expect(buttonNamed('New feedback')).toBeUndefined()
  })

  it('surfaces a query error', async () => {
    mockState.feedbackError = new Error('Request failed with status code 403')

    await render()

    expect(container.textContent).toContain('Request failed with status code 403')
  })
})
