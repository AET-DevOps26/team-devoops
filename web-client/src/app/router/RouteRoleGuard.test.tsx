import { act } from 'react'
import { createRoot, type Root } from 'react-dom/client'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

import type { Role } from '@/types'

const mockState = vi.hoisted(() => ({
  role: 'member' as Role,
}))

vi.mock('@/features/auth', async () => {
  const { TEST_PERSONAS } = await import('@/testing/personas')
  const personaByRole = {
    member: 'member',
    trainer: 'coach',
    director: 'director',
    admin: 'admin',
  } as const

  return {
    useAuth: () => ({ user: TEST_PERSONAS[personaByRole[mockState.role]] }),
  }
})

const { RouteRoleGuard } = await import('@/app/router/RouteRoleGuard')
const { ROUTE_ROLES } = await import('@/app/navPolicy')

describe('RouteRoleGuard', () => {
  let container: HTMLDivElement
  let root: Root

  beforeEach(() => {
    mockState.role = 'member'
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

  async function render(allow: Role[]) {
    await act(async () => {
      root.render(
        <RouteRoleGuard allow={allow}>
          <p>guarded content</p>
        </RouteRoleGuard>,
      )
    })
  }

  it('renders children when the role is allowed', async () => {
    mockState.role = 'trainer'
    await render(['trainer', 'admin'])

    expect(container.textContent).toContain('guarded content')
    expect(container.textContent).not.toContain("isn't available for your role")
  })

  it('renders the not-available card when the role is denied', async () => {
    mockState.role = 'director'
    await render(ROUTE_ROLES['/feedback'])

    expect(container.textContent).toContain("This page isn't available for your role.")
    expect(container.textContent).toContain('Contact your organization admin')
    expect(container.textContent).not.toContain('guarded content')
  })

  it('follows the navPolicy table for every role and route', async () => {
    const roles: Role[] = ['member', 'trainer', 'director', 'admin']

    for (const [route, allow] of Object.entries(ROUTE_ROLES)) {
      for (const role of roles) {
        mockState.role = role
        await render(allow)

        const shouldAllow = allow.includes(role)
        expect(
          container.textContent?.includes('guarded content'),
          `${role} on ${route} should be ${shouldAllow ? 'allowed' : 'denied'}`,
        ).toBe(shouldAllow)
      }
    }
  })
})
