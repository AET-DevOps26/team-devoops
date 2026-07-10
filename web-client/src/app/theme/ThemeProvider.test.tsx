import { act, useContext } from 'react'
import { createRoot, type Root } from 'react-dom/client'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

import { ThemeProvider } from './ThemeProvider'
import { ThemeContext, type Theme } from './ThemeContext'

function stubMatchMedia(prefersDark: boolean) {
  vi.stubGlobal(
    'matchMedia',
    vi.fn().mockImplementation((query: string) => ({
      matches: prefersDark,
      media: query,
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
    })),
  )
}

function ThemeProbe() {
  const context = useContext(ThemeContext)
  if (!context) return null

  return (
    <div>
      <span data-testid="theme">{context.theme}</span>
      {(['light', 'dark', 'system'] as Theme[]).map((theme) => (
        <button key={theme} onClick={() => context.setTheme(theme)}>
          set-{theme}
        </button>
      ))}
    </div>
  )
}

describe('ThemeProvider', () => {
  let container: HTMLDivElement
  let root: Root

  beforeEach(() => {
    stubMatchMedia(false)
    localStorage.clear()
    document.documentElement.classList.remove('dark')
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
          <ThemeProbe />
        </ThemeProvider>,
      )
    })
  }

  async function setTheme(theme: Theme) {
    const button = Array.from(container.querySelectorAll('button')).find(
      (candidate) => candidate.textContent === `set-${theme}`,
    )
    expect(button).toBeDefined()
    await act(async () => {
      button?.dispatchEvent(new MouseEvent('click', { bubbles: true }))
    })
  }

  it('defaults to system and applies the light OS preference', async () => {
    await render()

    expect(container.querySelector('[data-testid="theme"]')?.textContent).toBe('system')
    expect(document.documentElement.classList.contains('dark')).toBe(false)
  })

  it('setting dark flips the html class and persists to localStorage', async () => {
    await render()
    await setTheme('dark')

    expect(document.documentElement.classList.contains('dark')).toBe(true)
    expect(localStorage.getItem('ui-theme')).toBe('dark')
  })

  it('restores the stored theme on mount', async () => {
    localStorage.setItem('ui-theme', 'dark')
    await render()

    expect(container.querySelector('[data-testid="theme"]')?.textContent).toBe('dark')
    expect(document.documentElement.classList.contains('dark')).toBe(true)
  })

  it('system theme follows a dark OS preference', async () => {
    stubMatchMedia(true)
    await render()

    expect(document.documentElement.classList.contains('dark')).toBe(true)
    await setTheme('light')
    expect(document.documentElement.classList.contains('dark')).toBe(false)
    expect(localStorage.getItem('ui-theme')).toBe('light')
  })
})
