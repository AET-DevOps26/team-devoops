# Web-client E2E suite (Playwright)

Drives the real app against the fixture/mock layer — **no backend and no Keycloak
server needed**.

## Run it

```bash
pnpm -C web-client e2e        # headless run (boots its own Vite dev server on :5199)
pnpm -C web-client e2e:ui     # Playwright UI mode
```

`playwright.config.ts` boots `vite` with `VITE_USE_MOCKS=true` and
`VITE_MOCK_PERSONA=admin` set as **process env**, which beats any local
`.env.development`, so the run is deterministic regardless of developer env files.
Browsers: chromium (installed via `pnpm exec playwright install chromium`).

## Auth decision (§ how the app gets past Keycloak)

`AuthenticatedApp` always runs `keycloak.init({ onLoad: 'check-sso' })`, even under
mocks. The suite uses the **test-side-only option (Option A)** — zero production code
change: `e2e/support/auth.ts` intercepts the three requests keycloak-js makes
(3p-cookie probe iframe, silent-check-sso authorization request, code-for-token
exchange) with `context.route(...)` and answers them like a real Keycloak would,
minting an unsigned JWT whose `nonce` echoes the login request (keycloak-js never
verifies signatures client-side, but does verify the nonce). The app reaches
`status: 'ready'` in ~1s.

**Identity note:** under `VITE_USE_MOCKS=true`, `getCurrentUser()` returns the mock
persona (defaulting to `member` when `VITE_MOCK_PERSONA` is unset) — the token is
only used to satisfy the auth bootstrap, never for identity. So the running role is
selected once, at server boot, via `VITE_MOCK_PERSONA=admin`; the stubbed token
mirrors the same admin persona so both identities agree. The suite runs as **one
identity (admin)** — no persona matrix, no runtime switching.

Because the admin may use every route, the **route-guard deny branch cannot be
observed in E2E**; it is covered by unit tests (`RouteRoleGuard.test.tsx`), along
with the per-role nav/scoping sweep (`AppShell.test.tsx`, `scope.test.ts`).

## Fixture-reset assumption

Mock mutations mutate in-memory fixture arrays **inside the browser bundle**; that
state resets on every full page load (fresh module graph). Every test begins with
`gotoApp(page, path)` (a full navigation), so tests are independent and safe to run
fully parallel. Do not chain assertions across `page.goto` boundaries expecting
mutated state to survive.

Assertions are derived from the fixtures themselves (`e2e/support/data.ts` imports
the same fixture modules the app serves), not hard-coded strings.

## Fixtures validated against server @ `bc356ac` (2026-07-10)

Per the §1.5 validation pass, on top of the 2026-07-03 audits (`progress/codex-tasks/24`, `25`):

- **Shape** ✓ — `api/scripts/gen-typescript.sh` regenerated `src/api.ts` byte-identical
  to the committed file; fixtures are typed against it and `pnpm typecheck` passes.
- **Endpoints** ✓ — every `queries.ts` live branch path/verb matches the current
  controllers (members/feedback/events use `''` — the task-26 trailing-slash fix is
  in place; letters `/mail` + `/pdf` are now server-real per PR #100; helper routes
  match `py-genai-helper/app.py`; dashboard is `GET /members/dashboard`).
- **Authorization** — one **new** post-audit drift found and fixed
  (`fix: mirror server relational scoping in mock event creation`): commit `c0f205c`
  (2026-07-06) made `POST /events` enforce trainer-of-linked-team ∨
  director-of-linked-sport ∨ admin; the mock previously allowed any
  trainer/director. The mock now mirrors `EventService.canCreateEvent`.
- **Mock render bug fixed** (`fix: return fresh arrays from admin scope branches`):
  admin branches of `scope.ts` returned the fixture array by reference; the live API
  returns a fresh array per response, and TanStack Query's structural sharing hid
  in-place mock mutations from memoized views until reload.
- **Known, deliberate divergences (unchanged, documented in the audits):**
  - live `GET /members` is unscoped (everyone sees all); `scopeMembers` keeps the
    role lens for mock/demo purposes.
  - live `GET /events` scopes to created-∪-attending; `scopeEvents` implements the
    spec's team/sport linkage (target contract) — server decision pending.
  - the server grants trainers finance access; `scopeTransactions`/`scopeBalances`
    return `[]` for trainers per the product decision to hide Payments from coaches
    (nav + route guard enforce it; the scope branch is unreachable UI-wise).
  - `scopeReport` is broader than the server (self ∨ admin only for member reports),
    but the Helper page only ever requests the signed-in user's own reports.
  - mock 400s for blank member/transaction fields are stricter than the server
    (generated DTOs only reject `null`); the client-side form validation fires
    first, so that surface is unreachable in real flows — form-error tests assert
    the client validation and the reachable mock 409/403 paths instead.

## What lives where

- **E2E (this suite):** boot past auth, sidebar nav set for the admin role, user-menu
  identity, theme persistence, 404, per-page fixture-scoped rendering, and the full
  happy paths of members CRUD (+409 duplicate email), feedback compose/edit/delete,
  events create/edit/delete, payments create (+2 form-error paths)/delete, letters
  preview/send/PDF-mode.
- **Unit/component tests:** the per-role sweep (nav visibility, route guard,
  scoping), dialog validation/error branches, and view-model logic.
