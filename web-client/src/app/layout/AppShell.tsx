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
  Settings,
  Sun,
  User,
  Users,
} from 'lucide-react'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { useTheme } from '@/app/theme/useTheme'
import type { Theme } from '@/app/theme/ThemeContext'
import { useAuth } from '@/features/auth'
import { highestRole, type Role } from '@/types'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
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
} from '@/components/ui/sidebar'

interface NavItem {
  to: string
  label: string
  icon: LucideIcon
  roles: Role[]
  end?: boolean
}

// Dashboard stays pinned at the top, then role-eligible destinations render as
// one flat list. Icons let the sidebar collapse to an icon rail.
const ALL_ROLES: Role[] = ['member', 'trainer', 'director', 'admin']

const NAV_ITEMS: NavItem[] = [
  {
    to: '/',
    label: 'Dashboard',
    icon: LayoutDashboard,
    roles: ALL_ROLES,
    end: true,
  },
  { to: '/sport-events', label: 'Events', icon: CalendarDays, roles: ALL_ROLES },
  {
    to: '/feedback',
    label: 'Feedback',
    icon: MessageSquareText,
    roles: ['member', 'trainer', 'admin'],
  },
  {
    to: '/organization',
    label: 'Teams',
    icon: Users,
    roles: ALL_ROLES,
  },
  {
    to: '/payments',
    label: 'Payments',
    icon: CreditCard,
    roles: ['member', 'director', 'admin'],
  },
  {
    to: '/helper',
    label: 'Development',
    icon: LineChart,
    roles: ['member', 'trainer', 'admin'],
  },
  {
    to: '/members',
    label: 'Members',
    icon: Users,
    roles: ['trainer', 'director', 'admin'],
  },
  {
    to: '/letters',
    label: 'Letters',
    icon: Mail,
    roles: ['trainer', 'director', 'admin'],
  },
]

const THEME_OPTIONS: { value: Theme; label: string; icon: LucideIcon }[] = [
  { value: 'light', label: 'Light', icon: Sun },
  { value: 'dark', label: 'Dark', icon: Moon },
  { value: 'system', label: 'System', icon: Monitor },
]

export function AppShell() {
  const { user, logout } = useAuth()
  const { theme, setTheme } = useTheme()
  const userInitial = user.name.trim().charAt(0).toUpperCase() || 'U'
  const role = highestRole(user.roles)
  const visibleNavItems = NAV_ITEMS.filter((item) => item.roles.includes(role))

  return (
    <SidebarProvider>
      <Sidebar collapsible="icon">
        <SidebarHeader className="gap-0">
          <div className="flex items-start justify-between gap-2 px-2 group-data-[collapsible=icon]:justify-center group-data-[collapsible=icon]:px-0">
            <div className="min-w-0 pt-6 group-data-[collapsible=icon]:hidden">
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

        <SidebarContent>
          <SidebarMenu className="gap-1.5">
            {visibleNavItems.map(({ to, label, icon: Icon, end }) => (
              <SidebarMenuItem key={to}>
                <SidebarMenuButton
                  asChild
                  tooltip={label}
                  className="group-data-[collapsible=icon]:mx-auto"
                >
                  <NavLink to={to} end={end}>
                    <Icon />
                    <span>{label}</span>
                  </NavLink>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
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
                  <DropdownMenuItem disabled>
                    <User className="size-4" />
                    Profile
                  </DropdownMenuItem>
                  <DropdownMenuItem disabled>
                    <Settings className="size-4" />
                    Settings
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
        <main className="min-w-0 px-page-x py-page-y">
          <Outlet />
        </main>
      </SidebarInset>

      <ReactQueryDevtools initialIsOpen={false} />
    </SidebarProvider>
  )
}
