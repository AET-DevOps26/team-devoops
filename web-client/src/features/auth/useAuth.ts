import { useEffect, useState } from 'react'
import keycloak, { onTokenRefreshed } from '@/lib/keycloak'
import type { AuthUser } from '@/types'
import { getCurrentUser } from './currentUser'

export function useAuth(): { user: AuthUser; logout: () => void } {
  // Token claims are snapshots, so refreshes must trigger a new read.
  const [user, setUser] = useState(getCurrentUser)

  // Each consumer subscribes independently because keycloak exposes only one callback slot.
  useEffect(() => {
    const refreshUser = () => setUser(getCurrentUser())
    const unsubscribe = onTokenRefreshed(refreshUser)

    // Reconcile after subscribing so a refresh that lands between the initial render and this
    // effect cannot leave this consumer holding the old token claims until the next refresh.
    refreshUser()

    return unsubscribe
  }, [])

  const logout = () => keycloak.logout({ redirectUri: window.location.origin })
  return { user, logout }
}
