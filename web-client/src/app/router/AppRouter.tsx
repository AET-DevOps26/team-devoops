import { useEffect, useState } from 'react'
import { NavLink, Navigate, Route, Routes } from 'react-router-dom'
import { ArrowRight, LayoutGrid, Orbit, Sparkles } from 'lucide-react'
import { getEventsHello } from '@/features/events/api'
import { getFeedbackHello } from '@/features/feedback/api'
import { getLettersHello } from '@/features/letters/api'
import { getMembersHello, getMembersAdminHello } from '@/features/members/api'
import { getOrganizationHello } from '@/features/organization/api'
import { getPaymentsHello } from '@/features/payments/api'
import { ThemeToggle } from '@/app/theme/ThemeToggle'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarInset,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarTrigger,
} from '@/components/ui/sidebar'


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
    <section className="grid gap-6 lg:grid-cols-[minmax(0,1.5fr)_minmax(18rem,0.9fr)]">
      <Card className="border-2">
        <CardHeader className="gap-4">
          <div className="flex items-center gap-3 text-caption uppercase tracking-[0.28em] text-text-tertiary">
            <Orbit className="size-4 text-primary" />
            Connected service
          </div>
          <div className="space-y-3">
            <CardTitle className="font-display text-display-lg uppercase tracking-wide text-balance">
              {title}
            </CardTitle>
            <CardDescription className="max-w-2xl text-body-sm text-text-secondary">
              The navigation and design system are wired up. This page is still a service
              placeholder, but it now lives inside the new Sera-inspired shell and shadcn
              components.
            </CardDescription>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="border-l-4 border-primary bg-surface-raised px-5 py-4">
              <p className="text-caption uppercase tracking-[0.24em] text-text-tertiary">
                Endpoint status
              </p>
              <div className="mt-3 min-h-24 bg-surface-sunken p-4">
                {loading && <p className="text-body text-text-secondary">Loading hello endpoint response...</p>}
                {message && <p className="font-mono text-mono text-text-primary">{message}</p>}
                {error && <p className="text-body text-destructive">Failed to load response: {error}</p>}
              </div>
            </div>
            <div className="flex flex-col justify-between gap-6 bg-surface-overlay p-5">
              <div>
                <p className="text-caption uppercase tracking-[0.24em] text-text-tertiary">
                  What changed
                </p>
                <p className="mt-3 text-h4 text-text-primary">
                  DaisyUI primitives are out, semantic tokens and reusable UI building blocks are in.
                </p>
              </div>
              <div className="flex items-center gap-2 text-body-sm text-text-secondary">
                <Sparkles className="size-4 text-primary" />
                Ready for real feature screens using the same component foundation.
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="border-2 bg-sidebar">
        <CardHeader className="gap-3">
          <CardTitle className="text-h3">Migration Notes</CardTitle>
          <CardDescription className="text-body-sm text-text-secondary">
            The shell is now driven by the Sera theme variables and shadcn components.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4 text-body-sm text-sidebar-foreground">
          <div className="border-b border-sidebar-border pb-4">
            <p className="text-caption uppercase tracking-[0.24em] text-text-tertiary">
              Tokens
            </p>
            <p className="mt-2">Light and dark mode both resolve through CSS variables instead of DaisyUI themes.</p>
          </div>
          <div className="border-b border-sidebar-border pb-4">
            <p className="text-caption uppercase tracking-[0.24em] text-text-tertiary">
              Components
            </p>
            <p className="mt-2">Navigation, cards, and actions use shadcn-style primitives with shared variants.</p>
          </div>
          <div>
            <p className="text-caption uppercase tracking-[0.24em] text-text-tertiary">
              Next build step
            </p>
            <p className="mt-2">Feature pages can now expand from this foundation without carrying DaisyUI utility debt forward.</p>
          </div>
        </CardContent>
      </Card>
    </section>
  )
}

const NAV_ITEMS = [
  { to: '/members', label: 'Members' },
  { to: '/events', label: 'Events' },
  { to: '/payments', label: 'Payments' },
  { to: '/letters', label: 'Letters' },
  { to: '/organization', label: 'Organization' },
  { to: '/feedback', label: 'Feedback' },
]

export function AppRouter() {
  return (
    <SidebarProvider>
      <Sidebar>
        <SidebarHeader>
          <div className="flex items-center gap-2 px-2 text-caption uppercase tracking-[0.32em] text-text-tertiary">
            <LayoutGrid className="size-4 text-sidebar-primary" />
            Sports Club Platform
          </div>
          <div className="space-y-1 px-2">
            <h1 className="font-display text-display-lg uppercase tracking-wide text-balance text-sidebar-foreground">
              Team Devoops
            </h1>
          </div>
        </SidebarHeader>

        <SidebarContent>
          <SidebarMenu>
            {NAV_ITEMS.map(({ to, label }) => (
              <SidebarMenuItem key={to}>
                <NavLink to={to}>
                  {({ isActive }) => (
                    <SidebarMenuButton isActive={isActive}>
                      {label}
                    </SidebarMenuButton>
                  )}
                </NavLink>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarContent>

        <SidebarFooter>
          <div className="flex items-center justify-between gap-3 px-2">
            <div className="flex items-center gap-2 text-caption uppercase tracking-[0.22em] text-text-tertiary">
              Active shell
              <ArrowRight className="size-4 text-sidebar-primary" />
            </div>
            <ThemeToggle />
          </div>
        </SidebarFooter>
      </Sidebar>

      <SidebarInset>
        <header className="flex h-12 items-center gap-2 border-b border-border px-4">
          <SidebarTrigger />
        </header>
        <main className="min-w-0 px-page-x py-page-y">
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
      </SidebarInset>
    </SidebarProvider>
  )
}
