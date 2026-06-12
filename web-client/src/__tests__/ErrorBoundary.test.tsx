import { Component, useState, type ReactNode, act } from 'react'
import { createRoot, type Root } from 'react-dom/client'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { GlobalErrorBoundary } from '@/app/ErrorBoundary'

type ThrowingChildProps = {
  shouldThrow: boolean
}

function ThrowingChild({ shouldThrow }: ThrowingChildProps) {
  if (shouldThrow) {
    throw new Error('Boom')
  }

  return <div>Child rendered</div>
}

let remountCount = 0

function RemountSensitiveHarness() {
  const [mountId] = useState(() => {
    remountCount += 1
    return remountCount
  })

  return <ThrowOnFirstMount mountId={mountId} />
}

type ThrowOnFirstMountProps = {
  mountId: number
}

class ThrowOnFirstMount extends Component<ThrowOnFirstMountProps> {
  componentDidMount() {
    if (this.props.mountId === 1) {
      throw new Error('Boom')
    }
  }

  render() {
    return <div>Child rendered</div>
  }
}

describe('GlobalErrorBoundary', () => {
  let container: HTMLDivElement
  let root: Root
  let consoleErrorSpy: ReturnType<typeof vi.spyOn>

  beforeEach(() => {
    document.body.innerHTML = '<div id="root"></div>'
    container = document.getElementById('root') as HTMLDivElement
    root = createRoot(container)
    consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {})
    remountCount = 0
  })

  afterEach(async () => {
    await act(async () => {
      root.unmount()
    })
    consoleErrorSpy.mockRestore()
    document.body.innerHTML = ''
  })

  async function render(node: ReactNode) {
    await act(async () => {
      root.render(node)
    })
  }

  async function click(element: Element) {
    await act(async () => {
      element.dispatchEvent(new MouseEvent('click', { bubbles: true }))
    })
  }

  it('renders children when no error is thrown', async () => {
    await render(
      <GlobalErrorBoundary>
        <ThrowingChild shouldThrow={false} />
      </GlobalErrorBoundary>,
    )

    expect(container.textContent).toContain('Child rendered')
  })

  it('renders the fallback when a child throws', async () => {
    await render(
      <GlobalErrorBoundary>
        <ThrowingChild shouldThrow />
      </GlobalErrorBoundary>,
    )

    expect(container.textContent).toContain('Go home')
    expect(container.textContent).toContain('Try again')
  })

  it('does not render children when in error state', async () => {
    await render(
      <GlobalErrorBoundary>
        <ThrowingChild shouldThrow />
      </GlobalErrorBoundary>,
    )

    expect(container.textContent).not.toContain('Child rendered')
  })

  it('clicking "Try again" remounts the child subtree', async () => {
    await render(
      <GlobalErrorBoundary>
        <RemountSensitiveHarness />
      </GlobalErrorBoundary>,
    )

    const tryAgainButton = Array.from(container.querySelectorAll('button')).find(
      (button) => button.textContent === 'Try again',
    )
    expect(tryAgainButton).toBeTruthy()

    await click(tryAgainButton as Element)

    expect(container.textContent).toContain('Child rendered')
    expect(container.textContent).not.toContain('Try again')
    expect(remountCount).toBe(2)
  })
})
