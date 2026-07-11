import { act } from 'react'
import { createRoot, type Root } from 'react-dom/client'
import { MemoryRouter } from 'react-router-dom'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

type PersonaKey = 'member' | 'coach' | 'director' | 'admin'

const mockState = vi.hoisted(() => ({
  persona: 'member' as PersonaKey,
  logout: vi.fn(),
}))

vi.mock('@/features/auth', async () => {
  const { TEST_PERSONAS } = await import('@/testing/personas')

  return {
    useAuth: () => ({ user: TEST_PERSONAS[mockState.persona], logout: mockState.logout }),
  }
})

vi.mock('@tanstack/react-query-devtools', () => ({
  ReactQueryDevtools: () => null,
}))

const { AppShell } = await import('@/app/layout/AppShell')
const { ThemeProvider } = await import('@/app/theme/ThemeProvider')
const { NAV_ITEMS } = await import('@/app/navPolicy')
const { TEST_PERSONAS } = await import('@/testing/personas')

describe('AppShell', () => {
  let container: HTMLDivElement
  let root: Root

  beforeEach(() => {
    vi.stubGlobal(
      'matchMedia',
      vi.fn().mockImplementation((query: string) => ({
        matches: false,
        media: query,
        addListener: vi.fn(),
        removeListener: vi.fn(),
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
        dispatchEvent: vi.fn(),
      })),
    )
    localStorage.clear()
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
    vi.unstubAllGlobals()
  })

  async function render() {
    await act(async () => {
      root.render(
        <ThemeProvider>
          <MemoryRouter>
            <AppShell />
          </MemoryRouter>
        </ThemeProvider>,
      )
    })
  }

  function sidebarNavLabels(): string[] {
    return Array.from(container.querySelectorAll('a[data-sidebar="menu-button"]')).map(
      (link) => link.textContent?.trim() ?? '',
    )
  }

  const personas: PersonaKey[] = ['member', 'coach', 'director', 'admin']

  for (const persona of personas) {
    it(`shows exactly the ${persona} persona's allowed nav items`, async () => {
      mockState.persona = persona
      const user = TEST_PERSONAS[persona]
      const expected = NAV_ITEMS.filter((item) => item.roles.includes(user.role)).map(
        (item) => item.label,
      )

      await render()

      expect(sidebarNavLabels()).toEqual(expected)
    })
  }

  it('shows the signed-in user name and email in the sidebar footer', async () => {
    mockState.persona = 'coach'
    const user = TEST_PERSONAS.coach

    await render()

    expect(container.textContent).toContain(user.name)
    expect(container.textContent).toContain(user.email)
  })

  it('hides feedback and development from the director persona', async () => {
    mockState.persona = 'director'

    await render()

    const labels = sidebarNavLabels()
    expect(labels).not.toContain('Feedback')
    expect(labels).not.toContain('Development')
    expect(labels).toContain('Payments')
    expect(labels).toContain('Members')
  })
})
