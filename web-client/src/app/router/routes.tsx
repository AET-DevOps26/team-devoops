import { createBrowserRouter } from 'react-router-dom'
import { AppShell } from '@/app/layout/AppShell'
import { ROUTE_ROLES } from '@/app/navPolicy'
import { DashboardPage } from '@/app/pages/DashboardPage'
import { NotFoundPage } from '@/app/pages/NotFoundPage'
import { RouteErrorPage } from '@/app/pages/RouteErrorPage'
import { RouteRoleGuard } from '@/app/router/RouteRoleGuard'
import { FeedbackPage } from '@/features/feedback'
import { HelperPage } from '@/features/helper'
import { LettersPage } from '@/features/letters'
import { MembersPage } from '@/features/members'
import { OrganizationPage } from '@/features/organization'
import { PaymentsPage } from '@/features/payments'
import { ProfilePage } from '@/features/profile'
import { SportEventsPage } from '@/features/sport-events'

export const router = createBrowserRouter([
  {
    path: '/',
    element: <AppShell />,
    children: [
      {
        // Keep routed page failures inside AppShell so the sidebar remains usable.
        errorElement: <RouteErrorPage />,
        children: [
          { index: true, element: <DashboardPage /> },
          {
            path: 'members',
            element: (
              <RouteRoleGuard allow={ROUTE_ROLES['/members']}>
                <MembersPage />
              </RouteRoleGuard>
            ),
          },
          { path: 'profile', element: <ProfilePage /> },
          { path: 'sport-events', element: <SportEventsPage /> },
          {
            path: 'payments',
            element: (
              <RouteRoleGuard allow={ROUTE_ROLES['/payments']}>
                <PaymentsPage />
              </RouteRoleGuard>
            ),
          },
          {
            path: 'letters',
            element: (
              <RouteRoleGuard allow={ROUTE_ROLES['/letters']}>
                <LettersPage />
              </RouteRoleGuard>
            ),
          },
          { path: 'organization', element: <OrganizationPage /> },
          {
            path: 'feedback',
            element: (
              <RouteRoleGuard allow={ROUTE_ROLES['/feedback']}>
                <FeedbackPage />
              </RouteRoleGuard>
            ),
          },
          {
            path: 'helper',
            element: (
              <RouteRoleGuard allow={ROUTE_ROLES['/helper']}>
                <HelperPage />
              </RouteRoleGuard>
            ),
          },
          { path: '*', element: <NotFoundPage /> },
        ],
      },
    ],
  },
])
