import { NavLink, Navigate, Route, Routes } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { getEventsHello } from '@/features/events/api'
import { getFeedbackHello } from '@/features/feedback/api'
import { getLettersHello } from '@/features/letters/api'
import { getMembersHello, getMembersAdminHello } from '@/features/members/api'
import { getOrganizationHello } from '@/features/organization/api'
import { getPaymentsHello } from '@/features/payments/api'
import { ThemeToggle } from '@/app/theme/ThemeToggle'

type ServicePlaceholderPageProps = {
  title: string
  loadMessage: () => Promise<string>
}

function ServicePlaceholderPage({ title, loadMessage }: ServicePlaceholderPageProps) {
  const [message, setMessage] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let isMounted = true

    loadMessage()
      .then((response) => {
        if (isMounted) {
          setMessage(response)
          setError(null)
        }
      })
      .catch((err: unknown) => {
        if (isMounted) {
          setMessage(null)
          setError(err instanceof Error ? err.message : 'Unknown error')
        }
      })
      .finally(() => {
        if (isMounted) setLoading(false)
      })

    return () => {
      isMounted = false
    }
  }, [loadMessage])

  return (
    <section className="card bg-base-200 shadow-md">
      <div className="card-body">
        <h1 className="font-display text-display-md uppercase tracking-wide text-base-content">{title}</h1>
        <p className="text-body-sm text-base-content/70">
          Placeholder page for initial client navigation.
        </p>

        <div className="mt-4 rounded-lg bg-base-300 p-4">
          {loading && <p className="text-body text-base-content">Loading hello endpoint response...</p>}
          {message && <p className="font-mono text-base-content">{message}</p>}
          {error && <p className="text-error">Failed to load response: {error}</p>}
        </div>
      </div>
    </section>
  )
}

const navLinkClass = ({ isActive }: { isActive: boolean }) =>
  `btn btn-sm ${isActive ? 'btn-primary' : 'btn-ghost'}`

export function AppRouter() {
  return (
    <div className="min-h-screen bg-base-100 text-base-content">
      <header className="border-b border-base-300">
        <div className="mx-auto flex max-w-5xl flex-col gap-4 px-4 py-4 sm:flex-row sm:items-center sm:justify-between">
          <h1 className="font-display text-display-sm uppercase tracking-wide">Team Devoops</h1>
          <nav className="flex flex-wrap items-center gap-2">
            <NavLink to="/members" className={navLinkClass}>Members</NavLink>
            <NavLink to="/events" className={navLinkClass}>Events</NavLink>
            <NavLink to="/payments" className={navLinkClass}>Payments</NavLink>
            <NavLink to="/letters" className={navLinkClass}>Letters</NavLink>
            <NavLink to="/organization" className={navLinkClass}>Organization</NavLink>
            <NavLink to="/feedback" className={navLinkClass}>Feedback</NavLink>
            <ThemeToggle />
          </nav>
        </div>
      </header>

      <main className="mx-auto max-w-5xl px-4 py-8">
        <Routes>
          <Route path="/" element={<Navigate to="/members" replace />} />
          <Route
            path="/members"
            element={<>
              <ServicePlaceholderPage title="Member Service" loadMessage={getMembersHello} />
              <ServicePlaceholderPage title="Member Service Admin" loadMessage={getMembersAdminHello} />
            </>}
          />
          <Route
            path="/events"
            element={<ServicePlaceholderPage title="Event Service" loadMessage={getEventsHello} />}
          />
          <Route
            path="/payments"
            element={<ServicePlaceholderPage title="Payment Service" loadMessage={getPaymentsHello} />}
          />
          <Route
            path="/letters"
            element={<ServicePlaceholderPage title="Letter Service" loadMessage={getLettersHello} />}
          />
          <Route
            path="/organization"
            element={<ServicePlaceholderPage title="Organization Service" loadMessage={getOrganizationHello} />}
          />
          <Route
            path="/feedback"
            element={<ServicePlaceholderPage title="Feedback Service" loadMessage={getFeedbackHello} />}
          />
        </Routes>
      </main>
    </div>
  )
}
