import { createBrowserRouter } from 'react-router-dom'
import { AppShell } from '@/app/layout/AppShell'
import { DashboardPage } from '@/app/pages/DashboardPage'
import { MembersPage } from '@/features/members'
import { SportEventsPage } from '@/features/sport-events'
import { PaymentsPage } from '@/features/payments'
import { LettersPage } from '@/features/letters'
import { OrganizationPage } from '@/features/organization'
import { FeedbackPage } from '@/features/feedback'
import { HelperPage } from '@/features/helper'
import { NotFoundPage } from '@/app/pages/NotFoundPage'

export const router = createBrowserRouter([
  {
    path: '/',
    element: <AppShell />,
    children: [
      { index: true, element: <DashboardPage /> },
      { path: 'members', element: <MembersPage /> },
      { path: 'sport-events', element: <SportEventsPage /> },
      { path: 'payments', element: <PaymentsPage /> },
      { path: 'letters', element: <LettersPage /> },
      { path: 'organization', element: <OrganizationPage /> },
      { path: 'feedback', element: <FeedbackPage /> },
      { path: 'helper', element: <HelperPage /> },
      { path: '*', element: <NotFoundPage /> },
    ],
  },
])
