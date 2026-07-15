import type { BrowserContext, Route } from '@playwright/test'
import { TEST_PERSONAS } from '../../src/testing/personas'

// Must match VITE_KEYCLOAK_URL in playwright.config.ts.
const KEYCLOAK_URL = 'http://localhost:8081/auth'
const REALM_URL = `${KEYCLOAK_URL}/realms/devops`

// Token identity mirrors the `admin` entry in src/testing/personas.ts so the stubbed
// Keycloak session and the in-memory server describe the same person.
const ADMIN = TEST_PERSONAS.admin

export const E2E_USER = {
  sub: ADMIN.id,
  name: ADMIN.name,
  email: ADMIN.email,
  memberRoles: ['Admin'],
}

function base64Url(value: string): string {
  return Buffer.from(value)
    .toString('base64')
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/, '')
}

// keycloak-js only base64-decodes token payloads client-side (it never verifies
// signatures), so an unsigned JWT with the right claims is enough. The nonce must
// echo the one keycloak-js generated for the login URL or setToken discards the
// session as a replay.
function mintToken(nonce: string): string {
  const now = Math.floor(Date.now() / 1000)
  const header = { alg: 'none', typ: 'JWT' }
  const payload = {
    exp: now + 3600,
    iat: now,
    jti: 'e2e-token',
    iss: REALM_URL,
    aud: 'devops-client',
    sub: E2E_USER.sub,
    typ: 'Bearer',
    azp: 'devops-client',
    nonce,
    session_state: 'e2e-session',
    sid: 'e2e-session',
    scope: 'openid',
    realm_access: { roles: ['admin', 'member'] },
    preferred_username: 'admin.devoops',
    name: E2E_USER.name,
    email: E2E_USER.email,
    member_roles: E2E_USER.memberRoles,
  }
  return `${base64Url(JSON.stringify(header))}.${base64Url(JSON.stringify(payload))}.e2e-signature`
}

// Intercepts the three requests keycloak-js makes during
// init({ onLoad: 'check-sso', silentCheckSsoRedirectUri, pkceMethod: 'S256' }):
//   1. the hidden-iframe authorization request  -> 302 back to
//      /silent-check-sso.html with the standard OIDC fragment (state + code),
//   2. the authorization-code token exchange    -> minted JWT set,
//   3. anything else on the Keycloak origin     -> 404 (nothing should reach it).
export async function stubKeycloak(context: BrowserContext, appOrigin: string): Promise<void> {
  let nonce = ''

  // Registered first = matched last: catch-all for the Keycloak origin.
  await context.route(
    (url) => url.href.startsWith(KEYCLOAK_URL),
    (route) => route.fulfill({ status: 404, body: '' }),
  )

  // keycloak-js probes third-party-cookie support in a hidden iframe before the
  // silent check-sso flow; it waits for a "supported"/"unsupported" postMessage
  // from a document on the Keycloak origin.
  await context.route(
    (url) => url.href.startsWith(REALM_URL) && url.pathname.includes('/3p-cookies/'),
    (route) =>
      route.fulfill({
        status: 200,
        headers: { 'content-type': 'text/html' },
        body: '<!doctype html><html><body><script>parent.postMessage("supported", "*")</script></body></html>',
      }),
  )

  await context.route(
    (url) => url.href.startsWith(REALM_URL) && url.pathname.endsWith('/protocol/openid-connect/auth'),
    (route) => {
      const url = new URL(route.request().url())
      nonce = url.searchParams.get('nonce') ?? ''
      const state = url.searchParams.get('state') ?? ''
      const redirectUri = url.searchParams.get('redirect_uri') ?? ''
      const fragment = new URLSearchParams({
        state,
        session_state: 'e2e-session',
        iss: REALM_URL,
        code: 'e2e-authorization-code',
      })
      return route.fulfill({
        status: 302,
        headers: { location: `${redirectUri}#${fragment.toString()}` },
      })
    },
  )

  await context.route(
    (url) => url.href.startsWith(REALM_URL) && url.pathname.endsWith('/protocol/openid-connect/token'),
    (route: Route) => {
      const cors = {
        'access-control-allow-origin': appOrigin,
        'access-control-allow-credentials': 'true',
        'access-control-allow-methods': 'POST, OPTIONS',
        'access-control-allow-headers': 'content-type, authorization',
      }
      if (route.request().method() === 'OPTIONS') {
        return route.fulfill({ status: 204, headers: cors })
      }
      const token = mintToken(nonce)
      return route.fulfill({
        status: 200,
        headers: { 'content-type': 'application/json', ...cors },
        body: JSON.stringify({
          access_token: token,
          id_token: token,
          refresh_token: token,
          token_type: 'Bearer',
          expires_in: 3600,
          refresh_expires_in: 7200,
          'not-before-policy': 0,
          session_state: 'e2e-session',
          scope: 'openid',
        }),
      })
    },
  )
}
