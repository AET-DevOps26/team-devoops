import { act } from 'react'
import { createRoot, type Root } from 'react-dom/client'
import { MemoryRouter } from 'react-router-dom'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

type PersonaKey = 'member' | 'coach' | 'director' | 'admin'

const mockState = vi.hoisted(() => ({
  persona: 'admin' as PersonaKey,
  transactionsError: null as Error | null,
}))

const mutationMocks = vi.hoisted(() => ({
  createTransaction: vi.fn(),
  deleteTransaction: vi.fn(),
}))

vi.mock('@/features/auth', async () => {
  const { MOCK_PERSONAS } = await import('@/mocks/personas')

  return {
    useAuth: () => ({ user: MOCK_PERSONAS[mockState.persona] }),
  }
})

vi.mock('@/features/payments/api/queries', async () => {
  const { balanceFixtures, transactionFixtures } = await import('@/mocks/fixtures')
  const { MOCK_PERSONAS } = await import('@/mocks/personas')
  const { scopeBalances, scopeTransactions } = await import('@/mocks/scope')

  return {
    useTransactions: (enabled = true) => ({
      data: enabled
        ? scopeTransactions(transactionFixtures, MOCK_PERSONAS[mockState.persona])
        : undefined,
      isLoading: false,
      error: mockState.transactionsError,
    }),
    useBalances: (enabled = true) => ({
      data:
        enabled && MOCK_PERSONAS[mockState.persona].role !== 'member'
          ? scopeBalances(balanceFixtures, MOCK_PERSONAS[mockState.persona])
          : undefined,
      isLoading: false,
      error: null,
    }),
    useCreateTransaction: () => ({
      mutateAsync: mutationMocks.createTransaction,
      isPending: false,
    }),
    useDeleteTransaction: () => ({
      mutateAsync: mutationMocks.deleteTransaction,
      isPending: false,
    }),
  }
})

vi.mock('@/features/members/api/queries', async () => {
  const { memberSummaryFixtures } = await import('@/mocks/fixtures')

  return {
    useMembers: () => ({ data: memberSummaryFixtures, isLoading: false, error: null }),
  }
})

vi.mock('@/features/organization/api/queries', async () => {
  const { sportFixtures, teamFixtures } = await import('@/mocks/fixtures/organization')

  return {
    useSportsList: () => ({ data: sportFixtures, isLoading: false, error: null }),
    useTeamsList: () => ({ data: teamFixtures, isLoading: false, error: null }),
  }
})

const { PaymentsPage } = await import('./PaymentsPage')
const { usePaymentsUiStore } = await import('../model/paymentsUiStore')
const { balanceFixtures, transactionFixtures } = await import('@/mocks/fixtures')
const { mockHttpError } = await import('@/mocks/mockSwitch')
const { MOCK_PERSONAS } = await import('@/mocks/personas')
const { scopeBalances, scopeTransactions } = await import('@/mocks/scope')

describe('PaymentsPage', () => {
  let container: HTMLDivElement
  let root: Root

  beforeEach(() => {
    vi.clearAllMocks()
    mockState.persona = 'admin'
    mockState.transactionsError = null
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
          <PaymentsPage />
        </MemoryRouter>,
      )
    })
  }

  function buttonNamed(name: string): HTMLButtonElement | undefined {
    return Array.from(container.querySelectorAll('button')).find((button) =>
      button.textContent?.includes(name),
    )
  }

  it('renders the managed lens with balances for the admin', async () => {
    await render()

    const scopedBalances = scopeBalances(balanceFixtures, MOCK_PERSONAS.admin)

    expect(container.textContent).toContain('Member balances and transaction history.')
    expect(container.textContent).toContain('Balances')
    expect(buttonNamed('New Transaction')).toBeDefined()
    expect(container.textContent).toContain(scopedBalances[0].member.name)
  })

  it('renders the managed lens scoped to the director sports', async () => {
    mockState.persona = 'director'
    const scopedBalances = scopeBalances(balanceFixtures, MOCK_PERSONAS.director)

    await render()

    expect(container.textContent).toContain('Member balances and transaction history.')
    expect(scopedBalances.length).toBeGreaterThan(0)
    expect(container.textContent).toContain(scopedBalances[0].member.name)
  })

  it('renders the self view for the member persona', async () => {
    mockState.persona = 'member'
    const scoped = scopeTransactions(transactionFixtures, MOCK_PERSONAS.member)

    await render()

    expect(container.textContent).toContain('Your balance and transaction history.')
    expect(buttonNamed('New Transaction')).toBeUndefined()
    if (scoped.length === 0) {
      expect(container.textContent).toContain('No transactions are listed yet.')
    } else {
      expect(container.querySelectorAll('table tbody tr').length).toBe(scoped.length)
    }
  })

  it('surfaces a transactions query error', async () => {
    mockState.transactionsError = new Error('Request failed with status code 500')

    await render()

    expect(container.textContent).toContain('Request failed with status code 500')
  })

  describe('transaction create dialog', () => {
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

    async function submitDialogForm() {
      const form = document.body.querySelector('[role="dialog"] form')
      expect(form).not.toBeNull()
      await act(async () => {
        form?.dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }))
      })
    }

    async function openDialog() {
      await render()
      await act(async () => {
        usePaymentsUiStore.getState().openCreateDialog()
      })
    }

    afterEach(async () => {
      await act(async () => {
        usePaymentsUiStore.getState().closeCreateDialog()
      })
    })

    it('requires a member selection before anything else', async () => {
      await openDialog()
      await fillField('payment-amount', '25')
      await fillField('payment-title', 'Court fee')
      await submitDialogForm()

      expect(document.body.textContent).toContain('Select a member.')
      expect(mutationMocks.createTransaction).not.toHaveBeenCalled()
    })

    it('rejects a malformed amount', async () => {
      await openDialog()
      await pickMember('Marie Wolf')
      await fillField('payment-amount', 'twelve')
      await fillField('payment-title', 'Court fee')
      await submitDialogForm()

      expect(document.body.textContent).toContain(
        'Enter an amount in euros with up to two decimals.',
      )
      expect(mutationMocks.createTransaction).not.toHaveBeenCalled()
    })

    it('sends charges as negative cents and closes on success', async () => {
      mutationMocks.createTransaction.mockResolvedValue({
        id: 'new-transaction',
        member: { id: 'member-marie', name: 'Marie Wolf' },
      })

      await openDialog()
      await pickMember('Marie Wolf')
      await fillField('payment-amount', '25.50')
      await fillField('payment-title', 'Court fee')
      await submitDialogForm()

      expect(mutationMocks.createTransaction).toHaveBeenCalledWith(
        expect.objectContaining({
          amount_cents: -2550,
          title: 'Court fee',
        }),
      )
      expect(usePaymentsUiStore.getState().isCreateDialogOpen).toBe(false)
      expect(usePaymentsUiStore.getState().mutationNotice).toBe(
        'Transaction recorded for Marie Wolf.',
      )
    })

    it('maps server field errors onto the form', async () => {
      mutationMocks.createTransaction.mockRejectedValue(
        mockHttpError(400, 'Validation failed', [{ message: 'title: must not be blank' }]),
      )

      await openDialog()
      await pickMember('Marie Wolf')
      await fillField('payment-amount', '25')
      await fillField('payment-title', 'x')
      await submitDialogForm()

      expect(document.body.textContent).toContain('Validation failed')
      expect(document.body.textContent).toContain('must not be blank')
      expect(usePaymentsUiStore.getState().isCreateDialogOpen).toBe(true)
    })

    // Opens the member combobox popover and clicks the named option. Radix
    // triggers listen for the pointer sequence, not just a bare click.
    async function pickMember(name: string) {
      const trigger = document.body.querySelector<HTMLButtonElement>('#payment-member')
      expect(trigger).not.toBeNull()
      await act(async () => {
        trigger?.dispatchEvent(new MouseEvent('pointerdown', { bubbles: true }))
        trigger?.dispatchEvent(new MouseEvent('pointerup', { bubbles: true }))
        trigger?.dispatchEvent(new MouseEvent('click', { bubbles: true, detail: 1 }))
      })

      // The picker caps visible results, so narrow via the popover's own search
      // input (the only <input> with a combobox role; toolbar searches are plain).
      const search = document.body.querySelector<HTMLInputElement>('input[role="combobox"]')
      expect(search).not.toBeNull()
      const valueSetter = Object.getOwnPropertyDescriptor(
        window.HTMLInputElement.prototype,
        'value',
      )?.set
      await act(async () => {
        valueSetter?.call(search, name)
        search?.dispatchEvent(new Event('input', { bubbles: true }))
      })

      const option = Array.from(
        document.body.querySelectorAll<HTMLButtonElement>('[role="option"]'),
      ).find((candidate) => candidate.textContent?.includes(name))
      expect(option, `member option ${name} should be listed`).toBeDefined()
      await act(async () => {
        option?.dispatchEvent(new MouseEvent('click', { bubbles: true }))
      })
    }
  })
})
