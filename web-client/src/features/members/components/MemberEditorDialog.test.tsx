import { act } from 'react'
import { createRoot, type Root } from 'react-dom/client'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

type PersonaKey = 'member' | 'coach' | 'director' | 'admin'

const mockState = vi.hoisted(() => ({
  persona: 'admin' as PersonaKey,
}))

const mutationMocks = vi.hoisted(() => ({
  createMember: vi.fn(),
  updateMember: vi.fn(),
}))

const toastMocks = vi.hoisted(() => ({
  success: vi.fn(),
  error: vi.fn(),
}))

vi.mock('sonner', () => ({
  toast: toastMocks,
}))

vi.mock('@/features/auth', async () => {
  const { TEST_PERSONAS } = await import('@/testing/personas')

  return {
    useAuth: () => ({ user: TEST_PERSONAS[mockState.persona] }),
  }
})

vi.mock('@/features/members/api/queries', () => ({
  useMember: () => ({ data: undefined, isLoading: false, error: null }),
  useCreateMember: () => ({ mutateAsync: mutationMocks.createMember, isPending: false }),
  useUpdateMember: () => ({ mutateAsync: mutationMocks.updateMember, isPending: false }),
}))

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
}))

const { MemberEditorDialog } = await import('./MemberEditorDialog')
const { useMembersUiStore } = await import('../model/membersUiStore')
const { httpError } = await import('@/testing/httpError')

describe('MemberEditorDialog', () => {
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
      useMembersUiStore.getState().closeEditor()
      root.unmount()
    })
    document.body.innerHTML = ''
  })

  async function renderOpenCreate() {
    await act(async () => {
      root.render(<MemberEditorDialog />)
    })
    await act(async () => {
      useMembersUiStore.getState().openCreateMember()
    })
  }

  async function fillField(id: string, value: string) {
    const element = document.body.querySelector<HTMLInputElement>(`#${id}`)
    expect(element, `#${id} should be rendered`).not.toBeNull()
    const valueSetter = Object.getOwnPropertyDescriptor(
      window.HTMLInputElement.prototype,
      'value',
    )?.set

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

  it('refuses non-admin personas', async () => {
    mockState.persona = 'coach'
    await renderOpenCreate()

    expect(document.body.textContent).toContain('You are not allowed to create members.')
    expect(document.body.querySelector('#member-first-name')).toBeNull()
  })

  it('blocks a blank identity step with a validation message', async () => {
    await renderOpenCreate()
    await submitForm()

    expect(document.body.textContent).toContain('First name is required.')
    expect(mutationMocks.createMember).not.toHaveBeenCalled()
  })

  it('requires a valid email and an eight-character password on create', async () => {
    await renderOpenCreate()
    await fillField('member-first-name', 'Nina')
    await fillField('member-last-name', 'Neu')
    await fillField('member-email', 'not-an-email')
    await submitForm()
    expect(document.body.textContent).toContain('A valid email is required.')

    await fillField('member-email', 'nina.neu@club.de')
    await submitForm()
    expect(document.body.textContent).toContain('Password must be at least 8 characters.')
  })

  it('walks the stepper and submits the create payload', async () => {
    mutationMocks.createMember.mockResolvedValue({ id: 'new-member' })

    await renderOpenCreate()
    await fillField('member-first-name', 'Nina')
    await fillField('member-last-name', 'Neu')
    await fillField('member-email', 'nina.neu@club.de')
    await fillField('member-password', 'initial-secret')
    await submitForm() // -> contact step
    expect(document.body.querySelector('#member-phone')).not.toBeNull()
    await fillField('member-phone', '+49 111 2223334')
    await submitForm() // -> notes step
    expect(document.body.querySelector('#member-information')).not.toBeNull()
    await submitForm() // -> create

    expect(mutationMocks.createMember).toHaveBeenCalledWith({
      first_name: 'Nina',
      last_name: 'Neu',
      email: 'nina.neu@club.de',
      password: 'initial-secret',
      // react-phone-number-input normalises the entry to E.164 (no spaces).
      phone_number: '+491112223334',
    })
    expect(useMembersUiStore.getState().editorTarget).toBeNull()
    expect(toastMocks.success).toHaveBeenCalledWith('Member created.')
  })

  it('surfaces a server 409 as an error toast', async () => {
    mutationMocks.createMember.mockRejectedValue(
      httpError(409, 'Email already in use: nina.neu@club.de'),
    )

    await renderOpenCreate()
    await fillField('member-first-name', 'Nina')
    await fillField('member-last-name', 'Neu')
    await fillField('member-email', 'nina.neu@club.de')
    await fillField('member-password', 'initial-secret')
    await submitForm()
    await submitForm()
    await submitForm()

    expect(toastMocks.error).toHaveBeenCalledWith('Member not created', {
      description: 'Email already in use: nina.neu@club.de',
    })
    expect(useMembersUiStore.getState().editorTarget).not.toBeNull()
  })

  it('maps bean-validation field errors onto the form', async () => {
    mutationMocks.createMember.mockRejectedValue(
      httpError(400, 'Validation failed', [{ message: 'first_name: must not be blank' }]),
    )

    await renderOpenCreate()
    await fillField('member-first-name', 'Nina')
    await fillField('member-last-name', 'Neu')
    await fillField('member-email', 'nina.neu@club.de')
    await fillField('member-password', 'initial-secret')
    await submitForm()
    await submitForm()
    await submitForm()

    expect(toastMocks.error).not.toHaveBeenCalled()

    // The field error lives on the identity step (step 0); the mutation fired from the last
    // step (notes), so step back to see it rendered next to the input.
    async function clickBack() {
      const backButton = Array.from(document.body.querySelectorAll('button')).find(
        (button) => button.textContent === 'Back',
      )
      expect(backButton).not.toBeUndefined()
      await act(async () => {
        backButton?.dispatchEvent(new MouseEvent('click', { bubbles: true }))
      })
    }

    await clickBack() // notes -> contact
    await clickBack() // contact -> identity

    expect(document.body.querySelector('#member-first-name')?.getAttribute('aria-invalid')).toBe(
      'true',
    )
    expect(document.body.textContent).toContain('must not be blank')
  })
})
