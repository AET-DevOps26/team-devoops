import { useEffect, useRef, useState } from 'react'
import { AlertCircle } from 'lucide-react'
import App from '@/App'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { LoadingSpinner } from '@/components/ui/LoadingSpinner'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
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

export default function AuthenticatedApp() {
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

    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <Card className="w-full max-w-sm">
          <CardHeader>
            <CardTitle>{title}</CardTitle>
            <CardDescription>{description}</CardDescription>
          </CardHeader>
          <CardContent>
            <Alert variant="destructive">
              <AlertCircle className="size-4" />
              <AlertTitle>Sign-in error</AlertTitle>
              <AlertDescription>
                If this keeps happening, contact support.
              </AlertDescription>
            </Alert>
          </CardContent>
          <CardFooter>
            <Button className="w-full" onClick={() => window.location.reload()}>
              Try again
            </Button>
          </CardFooter>
        </Card>
      </div>
    )
  }

  return <App />
}
