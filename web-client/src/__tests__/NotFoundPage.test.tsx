import { act } from 'react'
import { createRoot, type Root } from 'react-dom/client'
import { MemoryRouter } from 'react-router-dom'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { NotFoundPage } from '@/app/pages/NotFoundPage'

describe('NotFoundPage', () => {
  let container: HTMLDivElement
  let root: Root

  beforeEach(() => {
    vi.clearAllMocks()
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
          <NotFoundPage />
        </MemoryRouter>,
      )
    })
  }

  it('renders the "404 - Page not found" text in the heading', async () => {
    await render()

    const heading = container.querySelector('h1')

    expect(heading?.textContent).toContain('404 - Page not found')
  })

  it('renders a Go back button', async () => {
    await render()

    const button = container.querySelector('button')

    expect(button?.textContent).toBe('Go back')
  })

  it('clicking Go back calls window.history.back()', async () => {
    const backSpy = vi.spyOn(window.history, 'back').mockImplementation(() => {})

    await render()

    const button = container.querySelector('button')

    expect(button).not.toBeNull()

    await act(async () => {
      button?.dispatchEvent(new MouseEvent('click', { bubbles: true }))
    })

    expect(backSpy).toHaveBeenCalledTimes(1)
  })
})
