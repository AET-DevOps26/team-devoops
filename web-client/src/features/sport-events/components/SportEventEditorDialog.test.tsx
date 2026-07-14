import { act } from 'react'
import { createRoot, type Root } from 'react-dom/client'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

type PersonaKey = 'member' | 'coach' | 'director' | 'admin'

const mockState = vi.hoisted(() => ({
  persona: 'admin' as PersonaKey,
}))

const mutationMocks = vi.hoisted(() => ({
  createEvent: vi.fn(),
  updateEvent: vi.fn(),
}))

vi.mock('@/features/auth', async () => {
  const { TEST_PERSONAS } = await import('@/testing/personas')

  return {
    useAuth: () => ({ user: TEST_PERSONAS[mockState.persona] }),
  }
})

vi.mock('@/features/sport-events/api/queries', () => ({
  useEvent: () => ({ data: undefined, isLoading: false, error: null }),
  useCreateSportEvent: () => ({ mutateAsync: mutationMocks.createEvent, isPending: false }),
  useUpdateSportEvent: () => ({ mutateAsync: mutationMocks.updateEvent, isPending: false }),
}))

vi.mock('@/features/organization/api/queries', async () => {
  const { sportFixtures, teamFixtures } = await import('@/testing/fixtures/organization')

  return {
    useSportsList: () => ({ data: sportFixtures, isLoading: false, error: null }),
    useTeamsList: () => ({ data: teamFixtures, isLoading: false, error: null }),
  }
})

vi.mock('@/components/ui/date-picker', () => ({
  DatePicker: ({
    id,
    value,
    onChange,
  }: {
    id?: string
    value: string
    onChange: (value: string) => void
  }) => <input id={id} value={value} onChange={(event) => onChange(event.target.value)} />,
  DateTimePicker: ({
    id,
    value,
    onChange,
  }: {
    id?: string
    value: string
    onChange: (value: string) => void
  }) => <input id={id} value={value} onChange={(event) => onChange(event.target.value)} />,
}))

const { SportEventEditorDialog } = await import('./SportEventEditorDialog')
const { useEventsUiStore } = await import('../model/eventsUiStore')

describe('SportEventEditorDialog', () => {
  let container: HTMLDivElement
  let root: Root

  beforeEach(() => {
    vi.clearAllMocks()
    mockState.persona = 'admin'
    document.body.innerHTML = '<div id="root"></div>'
    container = document.getElementById('root') as HTMLDivElement
    root = createRoot(container)
  })

  afterEach(async () => {
    await act(async () => {
      useEventsUiStore.getState().closeEditor()
      root.unmount()
    })
    document.body.innerHTML = ''
  })

  async function renderOpenCreate() {
    await act(async () => {
      root.render(<SportEventEditorDialog />)
    })
    await act(async () => {
      useEventsUiStore.getState().openCreate()
    })
  }

  async function fillField(id: string, value: string) {
    const element = document.body.querySelector<HTMLInputElement | HTMLTextAreaElement>(`#${id}`)
    expect(element, `#${id} should be rendered`).not.toBeNull()
    const prototype =
      element instanceof HTMLTextAreaElement
        ? window.HTMLTextAreaElement.prototype
        : window.HTMLInputElement.prototype
    const valueSetter = Object.getOwnPropertyDescriptor(prototype, 'value')?.set

    await act(async () => {
      valueSetter?.call(element, value)
      element?.dispatchEvent(new Event('input', { bubbles: true }))
    })
  }

  async function submitForm() {
    const form = document.body.querySelector('[role="dialog"] form')
    expect(form).not.toBeNull()
    await act(async () => {
      form?.dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }))
    })
  }

  it('requires a name on the details step', async () => {
    await renderOpenCreate()
    await submitForm()

    expect(document.body.textContent).toContain('Name is required.')
    expect(mutationMocks.createEvent).not.toHaveBeenCalled()
  })

  it('rejects an end time before the start time on the schedule step', async () => {
    await renderOpenCreate()
    await fillField('event-name', 'Friendly Match')
    await submitForm() // -> schedule

    await fillField('event-start', '2026-08-01T18:00')
    await fillField('event-end', '2026-08-01T17:00')
    await submitForm()

    expect(document.body.textContent).toContain('End time must be after start time.')
    expect(mutationMocks.createEvent).not.toHaveBeenCalled()
  })

  it('submits the create payload with ISO times', async () => {
    mutationMocks.createEvent.mockResolvedValue({ id: 'new-event' })

    await renderOpenCreate()
    await fillField('event-name', 'Friendly Match')
    await submitForm() // -> schedule
    await fillField('event-start', '2026-08-01T18:00')
    await fillField('event-end', '2026-08-01T19:30')
    await submitForm() // -> sports & teams
    await submitForm() // -> attendees
    await submitForm() // -> create

    expect(mutationMocks.createEvent).toHaveBeenCalledWith({
      name: 'Friendly Match',
      description: undefined,
      start_time: new Date('2026-08-01T18:00').toISOString(),
      end_time: new Date('2026-08-01T19:30').toISOString(),
      sports_linked: [],
      teams_linked: [],
      attendees: [],
    })
    expect(useEventsUiStore.getState().editorTarget).toBeNull()
    expect(useEventsUiStore.getState().mutationNotice).toBe('Event created.')
  })

  it('pre-links the coach persona teams and roster on create', async () => {
    mockState.persona = 'coach'
    const { TEST_PERSONAS } = await import('@/testing/personas')
    const { teamFixtures } = await import('@/testing/fixtures/organization')
    const coachTeamIds = teamFixtures
      .filter((team) => team.trainers.some((trainer) => trainer.id === TEST_PERSONAS.coach.id))
      .map((team) => team.id)
    mutationMocks.createEvent.mockResolvedValue({ id: 'new-event' })

    await renderOpenCreate()
    await fillField('event-name', 'Team Training')
    await submitForm()
    await submitForm()
    await submitForm()
    await submitForm()

    const payload = mutationMocks.createEvent.mock.calls[0][0]
    expect(payload.teams_linked).toEqual(coachTeamIds)
    expect(payload.attendees.length).toBeGreaterThan(0)
  })
})
