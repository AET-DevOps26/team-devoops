import { NavLink, Outlet } from 'react-router-dom'
import { LayoutGrid } from 'lucide-react'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { ThemeToggle } from '@/app/theme/ThemeToggle'
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

const NAV_ITEMS = [
  { to: '/members', label: 'Members' },
  { to: '/sport-events', label: 'Sport Events' },
  { to: '/payments', label: 'Payments' },
  { to: '/letters', label: 'Letters' },
  { to: '/organization', label: 'Organization' },
  { to: '/feedback', label: 'Feedback' },
  { to: '/helper', label: 'GenAI Helper' },
]

export function AppShell() {
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
            <ThemeToggle />
          </div>
        </SidebarFooter>
      </Sidebar>

      <SidebarInset>
        <header className="flex h-12 items-center gap-2 border-b border-border px-4">
          <SidebarTrigger />
        </header>
        <main className="min-w-0 px-page-x py-page-y">
          <Outlet />
        </main>
      </SidebarInset>

      <ReactQueryDevtools initialIsOpen={false} />
    </SidebarProvider>
  )
}
