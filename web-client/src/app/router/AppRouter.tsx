import { NavLink, Navigate, Route, Routes } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { getEventsHello } from '@/features/events/api'
import { getFeedbackHello } from '@/features/feedback/api'
import { getLettersHello } from '@/features/letters/api'
import { getMembersHello } from '@/features/members/api'
import { getOrganizationHello } from '@/features/organization/api'
import { getPaymentsHello } from '@/features/payments/api'

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
    <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
      <h1 className="text-2xl font-semibold text-slate-900">{title}</h1>
      <p className="mt-2 text-sm text-slate-500">
        Placeholder page for initial client navigation.
      </p>

      <div className="mt-6 rounded-lg bg-slate-50 p-4">
        {loading && <p className="text-slate-700">Loading hello endpoint response...</p>}
        {message && <p className="font-mono text-slate-900">{message}</p>}
        {error && <p className="text-red-700">Failed to load response: {error}</p>}
      </div>
    </section>
  )
}

const navLinkClass = ({ isActive }: { isActive: boolean }) =>
  `rounded-md px-3 py-2 text-sm ${isActive ? 'bg-slate-900 text-white' : 'bg-slate-200 text-slate-700'}`

export function AppRouter() {
  return (
    <div className="min-h-screen bg-slate-100 text-slate-900">
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-5xl flex-col gap-4 px-4 py-4 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-lg font-semibold">Team Devoops Client</p>
          <nav className="flex flex-wrap gap-2">
            <NavLink to="/members" className={navLinkClass}>Members</NavLink>
            <NavLink to="/events" className={navLinkClass}>Events</NavLink>
            <NavLink to="/payments" className={navLinkClass}>Payments</NavLink>
            <NavLink to="/letters" className={navLinkClass}>Letters</NavLink>
            <NavLink to="/organization" className={navLinkClass}>Organization</NavLink>
            <NavLink to="/feedback" className={navLinkClass}>Feedback</NavLink>
          </nav>
        </div>
      </header>

      <main className="mx-auto max-w-5xl px-4 py-8">
        <Routes>
          <Route path="/" element={<Navigate to="/members" replace />} />
          <Route
            path="/members"
            element={<ServicePlaceholderPage title="Member Service" loadMessage={getMembersHello} />}
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
