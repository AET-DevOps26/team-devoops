import { useEffect, useState } from 'react'
import keycloak, { onTokenRefreshed } from '@/lib/keycloak'
import type { AuthUser } from '@/types'
import { getCurrentUser } from './currentUser'

export function useAuth(): { user: AuthUser; logout: () => void } {
  // getCurrentUser is the single source of identity — do not re-derive it here.
  // It reads a snapshot of the token, so this component must re-render whenever
  // the token is refreshed (e.g. after a profile edit forces a token update) for
  // the snapshot to pick up new claims like `name`.
  const [user, setUser] = useState(getCurrentUser)

  // Many components call useAuth() at once; each gets its own subscription rather than
  // taking over keycloak's single onAuthRefreshSuccess slot, so unmounting one (a closing
  // dialog, a route change) can't unsubscribe the others.
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
