import { act } from 'react'
import { createRoot, type Root } from 'react-dom/client'
import {
  createMemoryRouter,
  Outlet,
  RouterProvider,
  type RouteObject,
} from 'react-router-dom'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { RouteErrorPage } from '@/app/pages/RouteErrorPage'

function AppShell() {
  return (
    <div>
      <nav>App navigation</nav>
      <Outlet />
    </div>
  )
}

function CrashingPage(): never {
  throw new Error('Page render failed')
}

function createTestRouter(childRoute: RouteObject, routeError?: unknown) {
  return createMemoryRouter(
    [
      {
        element: <AppShell />,
        children: [
          {
            id: 'page-boundary',
            errorElement: <RouteErrorPage />,
            children: [childRoute],
          },
        ],
      },
    ],
    {
      initialEntries: ['/'],
      hydrationData:
        routeError === undefined
          ? undefined
          : {
              loaderData: {},
              errors: { 'page-boundary': routeError },
            },
    },
  )
}

describe('RouteErrorPage', () => {
  let container: HTMLDivElement
  let root: Root

  beforeEach(() => {
    vi.spyOn(console, 'error').mockImplementation(() => {})
    document.body.innerHTML = '<div id="root"></div>'
    container = document.getElementById('root') as HTMLDivElement
    root = createRoot(container)
  })

  afterEach(async () => {
    await act(async () => {
      root.unmount()
    })
    document.body.innerHTML = ''
    vi.restoreAllMocks()
  })

  async function renderRouter(routes: RouteObject, routeError?: unknown) {
    const router = createTestRouter(routes, routeError)

    await act(async () => {
      root.render(<RouterProvider router={router} />)
    })
  }

  it('keeps the app shell mounted when a routed page crashes', async () => {
    await renderRouter({ index: true, element: <CrashingPage /> })

    expect(container.querySelector('nav')?.textContent).toBe('App navigation')
    expect(container.textContent).toContain('Something went wrong')
    expect(container.textContent).toContain(
      'An unexpected error occurred while loading this page.',
    )
  })

  it('shows the status for a thrown route response', async () => {
    await renderRouter(
      { index: true, element: <div>Page content</div> },
      {
        status: 404,
        statusText: 'Not Found',
        internal: false,
        data: null,
      },
    )

    expect(container.querySelector('nav')?.textContent).toBe('App navigation')
    expect(container.textContent).toContain('404 Not Found')
  })
})
