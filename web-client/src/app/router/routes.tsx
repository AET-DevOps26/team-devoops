import { createBrowserRouter, Navigate } from 'react-router-dom'
import { AppShell } from '@/app/layout/AppShell'
import { MembersPage } from '@/features/members'
import { SportEventsPage } from '@/features/sport-events'
import { PaymentsPage } from '@/features/payments'
import { LettersPage } from '@/features/letters'
import { OrganizationPage } from '@/features/organization'
import { FeedbackPage } from '@/features/feedback'
import { HelperPage } from '@/features/helper'

export const router = createBrowserRouter([
  {
    path: '/',
    element: <AppShell />,
    children: [
      { index: true, element: <Navigate to="/members" replace /> },
      { path: 'members', element: <MembersPage /> },
      { path: 'sport-events', element: <SportEventsPage /> },
      { path: 'payments', element: <PaymentsPage /> },
      { path: 'letters', element: <LettersPage /> },
      { path: 'organization', element: <OrganizationPage /> },
      { path: 'feedback', element: <FeedbackPage /> },
      { path: 'helper', element: <HelperPage /> },
    ],
  },
])
