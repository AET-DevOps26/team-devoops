import { NavLink, Outlet } from 'react-router-dom'
import { ChevronsUpDown, HelpCircle, LayoutGrid, LogOut, Settings, User } from 'lucide-react'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { ThemeToggle } from '@/app/theme/ThemeToggle'
import { useAuth } from '@/features/auth'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
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
  const { user, logout } = useAuth()
  const userInitial = user.name.trim().charAt(0).toUpperCase() || 'U'

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
          <div className="space-y-3 px-2">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button
                  type="button"
                  className="flex w-full items-center gap-3 border border-sidebar-border px-3 py-2 text-left text-sidebar-foreground transition-colors outline-none hover:bg-sidebar-accent hover:text-sidebar-accent-foreground focus-visible:ring-2 focus-visible:ring-sidebar-primary/30"
                >
                  <Avatar className="bg-sidebar-accent text-sidebar-foreground">
                    <AvatarFallback className="bg-sidebar-accent text-sidebar-foreground">
                      {userInitial}
                    </AvatarFallback>
                  </Avatar>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium text-sidebar-foreground">
                      {user.name}
                    </p>
                    <p className="truncate text-xs text-text-tertiary">
                      {user.email}
                    </p>
                  </div>
                  <ChevronsUpDown className="size-4 shrink-0 text-text-tertiary" />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                side="right"
                align="end"
                className="border border-sidebar-border"
              >
                <DropdownMenuItem disabled>
                  <User className="size-4" />
                  Profile
                </DropdownMenuItem>
                <DropdownMenuItem disabled>
                  <Settings className="size-4" />
                  Settings
                </DropdownMenuItem>
                <DropdownMenuItem disabled>
                  <HelpCircle className="size-4" />
                  Help
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem variant="destructive" onClick={logout}>
                  <LogOut className="size-4" />
                  Log out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

          </div>
        </SidebarFooter>
      </Sidebar>

      <SidebarInset>
        <header className="flex h-12 items-center gap-2 border-b border-border px-4">
          <SidebarTrigger />
          <div className="ml-auto">
            <ThemeToggle />
          </div>
        </header>
        <main className="min-w-0 px-page-x py-page-y">
          <Outlet />
        </main>
      </SidebarInset>

      <ReactQueryDevtools initialIsOpen={false} />
    </SidebarProvider>
  )
}
