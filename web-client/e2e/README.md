# Web-client E2E suite (Playwright)

Drives the real, server-only app with its `/api/v1` calls answered at the network
layer by an in-memory server — no real services and no Keycloak server needed.

## Run it

```bash
pnpm -C web-client e2e        # headless run (boots its own Vite dev server on :5199)
pnpm -C web-client e2e:ui     # Playwright UI mode
```

The app makes real axios calls to `/api/v1/*`; `e2e/support/api.ts` intercepts them per
test context and answers from `e2e/support/server/*` (one module per resource). Browser:
chromium (`pnpm exec playwright install chromium`).

## How the app gets past Keycloak

`AuthenticatedApp` always runs `keycloak.init({ onLoad: 'check-sso' })`. The suite uses a
test-side-only approach with zero production changes: `e2e/support/auth.ts` intercepts the
three requests keycloak-js makes (3p-cookie probe iframe, silent-check-sso authorization
request, code-for-token exchange) with `context.route(...)` and answers them like a real
Keycloak would, minting an unsigned JWT whose `nonce` echoes the login request (keycloak-js
does not verify signatures client-side, but does verify the nonce). The app reaches
`status: 'ready'` in ~1s.

**Identity:** `getCurrentUser()` reads the Keycloak token only. The stubbed token is minted
for the seeded **admin**, and the server answers every request as that same admin, so the
suite runs as one identity (admin) — no persona switching. Because the admin may use every
route, the route-guard deny branch is covered by unit tests (`RouteRoleGuard.test.tsx`),
along with the per-role nav/scoping sweep (`AppShell.test.tsx`, `scope.test.ts`).

## State isolation

The in-memory server keeps its mutable state (deep clones of the fixtures) in the
Playwright/Node process, shared across a worker's tests. `stubApi()` calls each resource's
`reset()` before wiring the routes, so every test starts from a pristine copy — one test's
create/edit/delete never leaks into the next. Tests run fully parallel (each Playwright
worker is its own process, and tests within a worker run serially, so the shared state is
safe). Do not chain assertions across tests expecting mutated state to survive.

Assertions derive from the fixtures themselves (`e2e/support/data.ts` re-exports the same
fixtures the server serves), not hard-coded strings.

## What lives where

- **E2E (this suite):** boot past auth, sidebar nav for the admin role, user-menu identity,
  theme persistence, 404, per-page fixture-scoped rendering, and the full happy paths of
  members CRUD (+409 duplicate email), feedback compose/edit/delete, events
  create/edit/delete, payments create (+2 form-error paths)/delete, letters
  preview/send/PDF-mode.
- **Unit/component tests:** the per-role sweep (nav visibility, route guard, scoping),
  dialog validation/error branches, and view-model logic.
