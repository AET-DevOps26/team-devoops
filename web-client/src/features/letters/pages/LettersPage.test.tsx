import { act } from 'react'
import { createRoot, type Root } from 'react-dom/client'
import { MemoryRouter } from 'react-router-dom'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

type PersonaKey = 'member' | 'coach' | 'director' | 'admin'

const mockState = vi.hoisted(() => ({
  persona: 'admin' as PersonaKey,
}))

const mutationMocks = vi.hoisted(() => ({
  sendMail: vi.fn(),
  generatePdf: vi.fn(),
}))

vi.mock('@/features/auth', async () => {
  const { MOCK_PERSONAS } = await import('@/mocks/personas')

  return {
    useAuth: () => ({ user: MOCK_PERSONAS[mockState.persona] }),
  }
})

vi.mock('@/features/letters/api', () => ({
  useSendMail: () => ({ mutateAsync: mutationMocks.sendMail, isPending: false }),
  useGeneratePdf: () => ({ mutateAsync: mutationMocks.generatePdf, isPending: false }),
}))

vi.mock('@/features/organization/api/queries', async () => {
  const { sportFixtures, teamFixtures } = await import('@/mocks/fixtures/organization')

  return {
    useSportsList: (enabled = true) => ({
      data: enabled ? sportFixtures : undefined,
      isLoading: false,
      error: null,
    }),
    useTeamsList: (enabled = true) => ({
      data: enabled ? teamFixtures : undefined,
      isLoading: false,
      error: null,
    }),
  }
})

const { LettersPage } = await import('./LettersPage')
const { MOCK_PERSONAS } = await import('@/mocks/personas')
const { teamFixtures } = await import('@/mocks/fixtures/organization')

describe('LettersPage', () => {
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
      root.unmount()
    })
    document.body.innerHTML = ''
  })

  async function render() {
    await act(async () => {
      root.render(
        <MemoryRouter>
          <LettersPage />
        </MemoryRouter>,
      )
    })
  }

  async function fillField(id: string, value: string) {
    const element = container.querySelector<HTMLInputElement | HTMLTextAreaElement>(`#${id}`)
    expect(element).not.toBeNull()
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
    const form = container.querySelector('form')
    expect(form).not.toBeNull()
    await act(async () => {
      form?.dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }))
    })
  }

  it('blocks the member persona with the role empty state', async () => {
    mockState.persona = 'member'

    await render()

    expect(container.textContent).toContain('Letters are not available for this role.')
    expect(container.querySelector('form')).toBeNull()
  })

  it('describes the coach audience as their coached teams', async () => {
    mockState.persona = 'coach'
    const coachedTeams = teamFixtures.filter((team) =>
      team.trainers.some((trainer) => trainer.id === MOCK_PERSONAS.coach.id),
    )

    await render()

    expect(coachedTeams.length).toBeGreaterThan(0)
    expect(container.textContent).toContain(coachedTeams[0].name)
  })

  it('requires a subject for mail letters', async () => {
    await render()
    await fillField('letter-template', '<p>Hello</p>')
    await submitForm()

    expect(container.textContent).toContain('Subject is required.')
    expect(mutationMocks.sendMail).not.toHaveBeenCalled()
  })

  it('requires a template body', async () => {
    await render()
    await fillField('letter-subject', 'Newsletter')
    await submitForm()

    expect(container.textContent).toContain('Template is required.')
    expect(mutationMocks.sendMail).not.toHaveBeenCalled()
  })

  it('sends the trimmed subject and raw template on submit', async () => {
    mutationMocks.sendMail.mockResolvedValue(undefined)

    await render()
    await fillField('letter-subject', '  Newsletter  ')
    await fillField('letter-template', '<p>Hello {{first_name}}</p>')
    await submitForm()

    expect(mutationMocks.sendMail).toHaveBeenCalledWith({
      subject: 'Newsletter',
      template: '<p>Hello {{first_name}}</p>',
    })
    expect(container.textContent).toContain('Mail sent to all members.')
  })

  it('surfaces a send failure as a form error', async () => {
    mutationMocks.sendMail.mockRejectedValue(new Error('Mail delivery failed'))

    await render()
    await fillField('letter-subject', 'Newsletter')
    await fillField('letter-template', '<p>Hello</p>')
    await submitForm()

    expect(container.textContent).toContain('Mail delivery failed')
  })

  it('renders the live preview iframe once a template exists', async () => {
    await render()

    expect(container.querySelector('iframe')).toBeNull()
    await fillField('letter-template', '<p>Hello {{first_name}}</p>')

    const iframe = container.querySelector<HTMLIFrameElement>('iframe')
    expect(iframe).not.toBeNull()
    // Tokens are replaced with sample values inside the srcdoc document.
    expect(iframe?.getAttribute('srcdoc')).toContain('Hello Alex')
  })
})
