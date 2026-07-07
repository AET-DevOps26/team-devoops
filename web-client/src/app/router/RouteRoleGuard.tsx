import type { ReactNode } from 'react'
import { useAuth } from '@/features/auth'
import type { Role } from '@/types'

export function RouteRoleGuard({ allow, children }: { allow: Role[]; children: ReactNode }) {
  const { user } = useAuth()
  if (!allow.includes(user.role)) {
    return <RoleNotAllowed />
  }
  return <>{children}</>
}

function RoleNotAllowed() {
  return (
    <div className="border bg-card px-4 py-8 text-center">
      <p className="text-body-sm font-medium text-text-primary">
        This page isn't available for your role.
      </p>
      <p className="mt-1 text-caption text-text-tertiary">
        Contact your organization admin if you think this is a mistake.
      </p>
    </div>
  )
}
