import { act } from 'react'
import { createRoot, type Root } from 'react-dom/client'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

import type { AuthUser, Member, MemberPartialUpdate } from '@/types'

const currentUserMock = vi.hoisted(() => ({
  user: {
    id: 'current-user-sub',
    name: 'Lena Roth',
    email: 'lena.roth@club.de',
    role: 'member',
  } as AuthUser,
}))

const memberQueryMocks = vi.hoisted(() => ({
  useMember: vi.fn(),
  mutateAsync: vi.fn(),
}))

vi.mock('@/features/auth/currentUser', () => ({
  getCurrentUser: () => currentUserMock.user,
}))

vi.mock('@/features/members/api/queries', () => ({
  useMember: memberQueryMocks.useMember,
  useUpdateMember: () => ({
    mutateAsync: memberQueryMocks.mutateAsync,
    isPending: false,
  }),
}))

vi.mock('@/components/ui/date-picker', () => ({
  DatePicker: ({
    id,
    ariaLabel,
    value,
    onChange,
    disabled,
    'aria-invalid': ariaInvalid,
  }: {
    id?: string
    ariaLabel?: string
    value: string
    onChange: (value: string) => void
    disabled?: boolean
    'aria-invalid'?: boolean
  }) => (
    <input
      id={id}
      aria-label={ariaLabel}
      value={value}
      disabled={disabled}
      aria-invalid={ariaInvalid}
      onChange={(event) => onChange(event.target.value)}
    />
  ),
}))

const { ProfilePage } = await import('./ProfilePage')

const loadedMember: Member = {
  id: 'member-id-returned-by-server',
  first_name: 'Lena',
  last_name: 'Roth',
  email: 'lena.roth@club.de',
  birthday: '2008-02-19',
  phone_number: '+49 177 1914194',
  address: 'Rosenstrasse 4, 80469 Munich',
  joining_date: '2021-07-15',
  information: 'U16 squad. Left midfield.',
}

describe('ProfilePage', () => {
  let container: HTMLDivElement
  let root: Root

  beforeEach(() => {
    vi.clearAllMocks()
    memberQueryMocks.useMember.mockReturnValue({
      data: loadedMember,
      isLoading: false,
      error: null,
    })
    memberQueryMocks.mutateAsync.mockImplementation(
      async (variables: { id: string } & MemberPartialUpdate) => ({
        ...loadedMember,
        birthday: variables.birthday ?? loadedMember.birthday,
        phone_number: variables.phone_number ?? loadedMember.phone_number,
        address: variables.address ?? loadedMember.address,
        information: variables.information ?? loadedMember.information,
      }),
    )
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
      root.render(<ProfilePage />)
    })
  }

  function field(id: string) {
    const element = container.querySelector<HTMLInputElement | HTMLTextAreaElement>(`#${id}`)
    expect(element).not.toBeNull()
    return element as HTMLInputElement | HTMLTextAreaElement
  }

  async function changeField(id: string, value: string) {
    const element = field(id)
    const prototype =
      element instanceof HTMLTextAreaElement
        ? window.HTMLTextAreaElement.prototype
        : window.HTMLInputElement.prototype
    const valueSetter = Object.getOwnPropertyDescriptor(prototype, 'value')?.set

    await act(async () => {
      valueSetter?.call(element, value)
      element.dispatchEvent(new Event('input', { bubbles: true }))
      element.dispatchEvent(new Event('change', { bubbles: true }))
    })
  }

  async function submitProfileForm() {
    const form = container.querySelector('form')
    expect(form).not.toBeNull()

    await act(async () => {
      form?.dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }))
    })
  }

  it('loads and saves only the current token subject', async () => {
    await render()

    expect(memberQueryMocks.useMember).toHaveBeenCalledWith(currentUserMock.user.id)

    await changeField('profile-birthday', '2009-01-01')
    await changeField('profile-phone', '+49 111 222333')
    await changeField('profile-address', 'Updated street 7')
    await changeField('profile-information', 'Updated profile note')
    await submitProfileForm()

    expect(memberQueryMocks.mutateAsync).toHaveBeenCalledWith({
      id: currentUserMock.user.id,
      birthday: '2009-01-01',
      phone_number: '+49 111 222333',
      address: 'Updated street 7',
      information: 'Updated profile note',
    })
  })

  it('lets the member edit identity fields and sends only the changed ones', async () => {
    await render()

    expect((field('profile-first-name') as HTMLInputElement).readOnly).toBe(false)
    expect((field('profile-last-name') as HTMLInputElement).readOnly).toBe(false)
    expect((field('profile-email') as HTMLInputElement).readOnly).toBe(false)
    expect(container.textContent).not.toContain('Password')
    expect(container.textContent).not.toContain('Role')
    expect(container.textContent).not.toContain('Team')

    await changeField('profile-first-name', 'Magda')
    await changeField('profile-email', 'magda.roth@club.de')
    await submitProfileForm()

    expect(memberQueryMocks.mutateAsync).toHaveBeenCalledWith({
      id: currentUserMock.user.id,
      first_name: 'Magda',
      email: 'magda.roth@club.de',
    })
  })

  it('blocks submit with a validation message when identity fields are blanked', async () => {
    await render()

    await changeField('profile-first-name', '')
    await submitProfileForm()

    expect(memberQueryMocks.mutateAsync).not.toHaveBeenCalled()
    expect(container.textContent).toContain('First name is required.')
  })

  it('resets unsaved app-owned edits on cancel', async () => {
    await render()
    await changeField('profile-phone', '+49 111 222333')

    const cancelButton = Array.from(container.querySelectorAll('button')).find((button) =>
      button.textContent?.includes('Cancel'),
    )
    expect(cancelButton).toBeDefined()

    await act(async () => {
      cancelButton?.dispatchEvent(new MouseEvent('click', { bubbles: true }))
    })

    expect(field('profile-phone').value).toBe(loadedMember.phone_number)
    expect(memberQueryMocks.mutateAsync).not.toHaveBeenCalled()
  })
})
