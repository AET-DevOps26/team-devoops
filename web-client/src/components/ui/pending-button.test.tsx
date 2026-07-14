import { act } from 'react'
import { createRoot, type Root } from 'react-dom/client'
import { afterEach, beforeEach, describe, expect, it } from 'vitest'

import { PendingButton } from './pending-button'

describe('PendingButton', () => {
  let container: HTMLDivElement
  let root: Root

  beforeEach(() => {
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

  it('renders the label and stays enabled when not pending', async () => {
    await act(async () => {
      root.render(
        <PendingButton isPending={false} pendingLabel="Saving…">
          Save profile
        </PendingButton>,
      )
    })

    const button = container.querySelector('button')
    expect(button?.disabled).toBe(false)
    expect(button?.textContent).toBe('Save profile')
  })

  it('disables the button and shows the spinner and pending label when pending', async () => {
    await act(async () => {
      root.render(
        <PendingButton isPending={true} pendingLabel="Saving…">
          Save profile
        </PendingButton>,
      )
    })

    const button = container.querySelector('button')
    expect(button?.disabled).toBe(true)
    expect(button?.textContent).toBe('Saving…')
    expect(button?.querySelector('[data-slot="spinner"]')).not.toBeNull()
  })
})
