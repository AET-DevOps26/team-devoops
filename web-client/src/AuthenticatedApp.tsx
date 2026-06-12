import { useEffect, useRef, useState } from 'react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { GlobalErrorBoundary } from '@/app/ErrorBoundary'
import App from '@/App'
import { ErrorCard } from '@/components/ui/ErrorCard'
import { LoadingSpinner } from '@/components/ui/LoadingSpinner'
import keycloak, { KEYCLOAK_URL } from '@/lib/keycloak'
import {
  AUTH_INIT_TIMEOUT_MS,
  classifyAuthError,
  type AuthError,
  withTimeout,
} from '@/lib/auth-bootstrap'

function removeSplash() {
  document.getElementById('splash')?.remove()
}

interface AuthenticatedAppProps {
  queryClient: QueryClient
}

export default function AuthenticatedApp({ queryClient }: AuthenticatedAppProps) {
  const [status, setStatus] = useState<'loading' | 'ready' | 'error'>('loading')
  const [authError, setAuthError] = useState<AuthError | null>(null)
  const didInitRef = useRef(false)

  useEffect(() => {
    removeSplash()
  }, [])

  useEffect(() => {
    if (didInitRef.current) {
      return
    }

    didInitRef.current = true

    async function initializeAuth() {
      try {
        const authenticated = await withTimeout(
          keycloak.init({
            onLoad: 'check-sso',
            silentCheckSsoRedirectUri: window.location.origin + '/silent-check-sso.html',
            pkceMethod: 'S256',
            checkLoginIframe: false,
          }),
          AUTH_INIT_TIMEOUT_MS,
        )

        if (!authenticated) {
          await keycloak.login()
          return
        }

        setAuthError(null)
        setStatus('ready')
      } catch (error) {
        setAuthError(classifyAuthError(error))
        setStatus('error')
      }
    }

    void initializeAuth()

    return () => {
    }
  }, [])

  useEffect(() => {
    if (status !== 'ready') {
      return
    }

    keycloak.onTokenExpired = () => {
      keycloak.updateToken(30).catch(() => keycloak.login())
    }

    return () => {
      keycloak.onTokenExpired = undefined
    }
  }, [status])

  if (status === 'loading') {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <LoadingSpinner />
      </div>
    )
  }

  if (status === 'error') {
    const messages: Record<AuthError, { title: string; description: string }> = {
      network: {
        title: 'Cannot reach authentication server',
        description: 'Check your connection and try again.',
      },
      config: {
        title: 'Authentication misconfigured',
        description: 'Contact your administrator — the auth server may be misconfigured.',
      },
      timeout: {
        title: 'Authentication is stuck',
        description: `Sign-in never finished. Verify that Keycloak is reachable at ${KEYCLOAK_URL} and that the login redirect is not being blocked.`,
      },
      unknown: {
        title: 'Authentication failed',
        description: 'An unexpected error occurred. Please try again.',
      },
    }
    const { title, description } = messages[authError ?? 'unknown']

    return <ErrorCard title={title} description={description} alertTitle="Sign-in error" />
  }

  return (
    <QueryClientProvider client={queryClient}>
      <GlobalErrorBoundary>
        <App />
      </GlobalErrorBoundary>
    </QueryClientProvider>
  )
}
