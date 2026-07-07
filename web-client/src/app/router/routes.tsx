import { createBrowserRouter } from 'react-router-dom'
import { AppShell } from '@/app/layout/AppShell'
import { ROUTE_ROLES } from '@/app/navPolicy'
import { DashboardPage } from '@/app/pages/DashboardPage'
import { MembersPage } from '@/features/members'
import { SportEventsPage } from '@/features/sport-events'
import { PaymentsPage } from '@/features/payments'
import { LettersPage } from '@/features/letters'
import { OrganizationPage } from '@/features/organization'
import { FeedbackPage } from '@/features/feedback'
import { HelperPage } from '@/features/helper'
import { ProfilePage } from '@/features/profile'
import { NotFoundPage } from '@/app/pages/NotFoundPage'
import { RouteRoleGuard } from '@/app/router/RouteRoleGuard'

export const router = createBrowserRouter([
  {
    path: '/',
    element: <AppShell />,
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
])
