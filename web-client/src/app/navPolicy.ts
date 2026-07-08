import type { Role } from '@/types'

export interface NavItem {
  to: string
  label: string
  roles: Role[]
  end?: boolean
}

// Dashboard stays pinned at the top, then role-eligible destinations render as
// one flat list. This is the single source of which roles may use which route —
// both the sidebar nav and the router's RouteRoleGuard read from here.
export const ALL_ROLES: Role[] = ['member', 'trainer', 'director', 'admin']

export const NAV_ITEMS: NavItem[] = [
  {
    to: '/',
    label: 'Dashboard',
    roles: ALL_ROLES,
    end: true,
  },
  { to: '/sport-events', label: 'Events', roles: ALL_ROLES },
  {
    to: '/feedback',
    label: 'Feedback',
    roles: ['member', 'trainer', 'admin'],
  },
  {
    to: '/organization',
    label: 'Teams',
    roles: ALL_ROLES,
  },
  {
    to: '/payments',
    label: 'Payments',
    roles: ['member', 'director', 'admin'],
  },
  {
    to: '/helper',
    label: 'Development',
    roles: ['member', 'trainer', 'admin'],
  },
  {
    to: '/members',
    label: 'Members',
    roles: ['trainer', 'director', 'admin'],
  },
  {
    to: '/letters',
    label: 'Letters',
    roles: ['trainer', 'director', 'admin'],
  },
]

export const ROUTE_ROLES: Record<string, Role[]> = Object.fromEntries(
  NAV_ITEMS.map(({ to, roles }) => [to, roles]),
)
