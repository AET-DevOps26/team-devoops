import { lazy, Suspense } from 'react'
import { NavLink, Outlet } from 'react-router-dom'
import {
  CalendarDays,
  ChevronsUpDown,
  CreditCard,
  LayoutDashboard,
  LineChart,
  LogOut,
  Mail,
  type LucideIcon,
  MessageSquareText,
  Monitor,
  Moon,
  Sun,
  User,
  Users,
} from 'lucide-react'
import { useTheme } from '@/app/theme/useTheme'
import type { Theme } from '@/app/theme/ThemeContext'
import { NAV_ITEMS } from '@/app/navPolicy'
import { useAuth } from '@/features/auth'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Toaster } from '@/components/ui/sonner'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
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
  SidebarRail,
  SidebarTrigger,
  useSidebar,
} from '@/components/ui/sidebar'

const ReactQueryDevtools = import.meta.env.DEV
  ? lazy(() =>
      import('@tanstack/react-query-devtools').then((module) => ({
        default: module.ReactQueryDevtools,
      })),
    )
  : null

// Icons are a presentational concern, so they're kept local to the sidebar
// rather than in the shared nav policy.
const NAV_ICONS: Record<string, LucideIcon> = {
  '/': LayoutDashboard,
  '/sport-events': CalendarDays,
  '/feedback': MessageSquareText,
  '/organization': Users,
  '/payments': CreditCard,
  '/helper': LineChart,
  '/members': Users,
  '/letters': Mail,
}

const THEME_OPTIONS: { value: Theme; label: string; icon: LucideIcon }[] = [
  { value: 'light', label: 'Light', icon: Sun },
  { value: 'dark', label: 'Dark', icon: Moon },
  { value: 'system', label: 'System', icon: Monitor },
]

function AppShellContent() {
  const { user, logout } = useAuth()
  const { theme, setTheme } = useTheme()
  const { isMobile, setOpenMobile } = useSidebar()
  const userInitial = user.name.trim().charAt(0).toUpperCase() || 'U'
  const visibleNavItems = NAV_ITEMS.filter((item) => item.roles.includes(user.role))

  // On mobile the sidebar is an off-canvas overlay, so it must close itself
  // once the user navigates; on desktop it stays put.
  const handleNavClick = () => {
    if (isMobile) setOpenMobile(false)
  }

  return (
    <>
      <Sidebar collapsible="icon">
        <SidebarHeader className="gap-0">
          <div className="flex items-start justify-between gap-2 px-2 group-data-[collapsible=icon]:justify-center group-data-[collapsible=icon]:px-0">
            <div className="min-w-0 pt-3 group-data-[collapsible=icon]:hidden">
              <div className="flex items-center gap-1.5">
                <img
                  src="/RoostIcon.svg"
                  alt=""
                  aria-hidden
                  className="h-11 w-11 shrink-0 -translate-y-1"
                />
                <h1 className="font-display text-display-lg uppercase tracking-wide text-balance text-sidebar-foreground">
                  Roost
                </h1>
              </div>
            </div>
            <SidebarTrigger className="text-text-tertiary" />
          </div>
          <img
            src="/RoostIcon.svg"
            alt="Roost"
            className="mx-auto hidden size-6 group-data-[collapsible=icon]:block"
          />
        </SidebarHeader>

        <SidebarContent className="mt-6 px-2 group-data-[collapsible=icon]:mt-4 group-data-[collapsible=icon]:px-0">
          <SidebarMenu className="gap-3 group-data-[collapsible=icon]:gap-2">
            {visibleNavItems.map(({ to, label, end }) => {
              const Icon = NAV_ICONS[to]
              return (
                <SidebarMenuItem key={to}>
                  <SidebarMenuButton
                    asChild
                    tooltip={label}
                    className="group-data-[collapsible=icon]:mx-auto aria-[current=page]:bg-sidebar-primary aria-[current=page]:text-sidebar-primary-foreground aria-[current=page]:hover:bg-sidebar-primary aria-[current=page]:hover:text-sidebar-primary-foreground"
                  >
                    <NavLink to={to} end={end} onClick={handleNavClick}>
                      <Icon />
                      <span>{label}</span>
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              )
            })}
          </SidebarMenu>
        </SidebarContent>

        <SidebarFooter>
          <SidebarMenu>
            <SidebarMenuItem>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <SidebarMenuButton
                    size="lg"
                    className="gap-3 group-data-[collapsible=icon]:mx-auto"
                  >
                    <Avatar className="bg-sidebar-accent text-sidebar-foreground">
                      <AvatarFallback className="bg-sidebar-accent text-sidebar-foreground">
                        {userInitial}
                      </AvatarFallback>
                    </Avatar>
                    <div className="min-w-0 flex-1 group-data-[collapsible=icon]:hidden">
                      <p className="truncate text-sm font-medium text-sidebar-foreground">
                        {user.name}
                      </p>
                      <p className="truncate text-xs text-text-tertiary">{user.email}</p>
                    </div>
                    <ChevronsUpDown className="size-4 shrink-0 text-text-tertiary group-data-[collapsible=icon]:hidden" />
                  </SidebarMenuButton>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  side="right"
                  align="end"
                  className="w-56 border border-sidebar-border"
                >
                  <DropdownMenuItem asChild>
                    <NavLink to="/profile" onClick={handleNavClick}>
                      <User className="size-4" />
                      Profile
                    </NavLink>
                  </DropdownMenuItem>

                  <DropdownMenuSeparator />
                  <DropdownMenuLabel className="text-caption uppercase tracking-[0.12em] text-text-tertiary">
                    Theme
                  </DropdownMenuLabel>
                  <DropdownMenuRadioGroup
                    value={theme}
                    onValueChange={(v) => setTheme(v as Theme)}
                  >
                    {THEME_OPTIONS.map(({ value, label, icon: Icon }) => (
                      <DropdownMenuRadioItem key={value} value={value}>
                        <Icon className="size-4" />
                        {label}
                      </DropdownMenuRadioItem>
                    ))}
                  </DropdownMenuRadioGroup>

                  <DropdownMenuSeparator />
                  <DropdownMenuItem variant="destructive" onClick={logout}>
                    <LogOut className="size-4" />
                    Log out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarFooter>
        <SidebarRail />
      </Sidebar>

      <SidebarInset>
        <header className="sticky top-0 z-10 flex h-14 items-center gap-2 border-b border-sidebar-border bg-background px-4 md:hidden">
          <SidebarTrigger className="text-text-tertiary" />
          <img src="/RoostIcon.svg" alt="" aria-hidden className="h-8 w-8" />
        </header>
        <main className="min-w-0 px-page-x py-page-y">
          <Outlet />
        </main>
      </SidebarInset>

      {ReactQueryDevtools && (
        <Suspense fallback={null}>
          <ReactQueryDevtools initialIsOpen={false} />
        </Suspense>
      )}
      <Toaster />
    </>
  )
}

export function AppShell() {
  return (
    <SidebarProvider>
      <AppShellContent />
    </SidebarProvider>
  )
}
