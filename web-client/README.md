# Web Client

React + TypeScript single-page application for the team-devoops club management platform.

It is the only user-facing surface of the repo. It talks to the Spring/Python services
exclusively over `/api/v1/*` (never to a service host directly), and its request/response
types are generated from the same `api/openapi.yaml` those services are generated from —
so the contract is shared, not re-described here. See the [root README](../README.md) for
the wider architecture.

## Stack

| | |
|---|---|
| Framework | React 19, TypeScript 6 |
| Build tool | Vite 8 (Rolldown) |
| Package manager | pnpm 9.15.9 (pinned via `packageManager`) |
| Node | 24 (`engines`: `>=22 <25`, `.nvmrc`: 24) |
| Routing | React Router 7 (`createBrowserRouter`) |
| Server state | TanStack Query 5 |
| Client state | Zustand 5 |
| HTTP | Axios |
| Forms | React Hook Form + Zod 4 |
| Auth | keycloak-js 26 (PKCE S256) |
| Styling | Tailwind CSS 4 + shadcn/ui (`radix-sera` style) |
| Unit tests | Vitest + jsdom |
| E2E | Playwright (Chromium) |
| Linting | ESLint 10 (flat config) |

## Prerequisites

- **Node 24** (`nvm use` reads `.nvmrc`) and **pnpm 9** (`corepack enable` picks up the pinned version)
- **The backend stack**, for anything other than E2E: `docker compose up -d --build` from `infra/`.
  The app has no offline/mock mode — see [Working without the backend](#working-without-the-backend).
- **Chromium for Playwright**, only if you run E2E: `pnpm exec playwright install chromium`

## Getting started

```bash
pnpm install
pnpm dev            # Vite dev server on http://localhost:3000 (opens a browser)
```

On load the app runs `keycloak.init({ onLoad: 'check-sso' })` and redirects to the Keycloak
login page if there is no session. It renders nothing until auth resolves, so Keycloak must be
reachable at `VITE_KEYCLOAK_URL` (default `http://localhost:8081/auth`).

Local test users come from the realm import in `infra/`:

| User | Password | Realm roles |
|---|---|---|
| `admin` | `admin123` | `admin`, `member` |
| `user` | `user123` | `member` |

### Working without the backend

**`pnpm dev` cannot fully work on its own, and there is no mock mode.** Two things get in the way:

1. Every `/api/v1/*` route is behind Traefik's `forward-auth` middleware, which needs a session
   cookie established by a full-page login *through Traefik*. Vite serves the SPA itself on port
   3000, so that cookie is never set and live API calls fail.
2. Vite's dev proxy forwards `/api` to `http://localhost` (see `vite.config.ts`), which only
   exists when the compose stack is up.

Two ways to actually see the app:

- **Full stack:** run `docker compose up -d --build` from `infra/` and browse
  **`http://localhost/`** (the Traefik-served build) rather than `pnpm dev`. This is the path
  that works end-to-end.
- **Offline UI work:** run the Playwright E2E suite, which serves the whole API in memory and
  stubs Keycloak. `pnpm e2e:ui` gives you a live, clickable app with no services running.

## Environment variables

The app reads exactly **one** `VITE_*` variable. Vite inlines `VITE_*` at build time, so in
Docker they are build `ARG`s, not runtime env.

| Name | Purpose | Required | Example |
|---|---|---|---|
| `VITE_KEYCLOAK_URL` | Base URL of the Keycloak server. Realm (`devops`) and client (`devops-client`) are hard-coded in `src/lib/keycloak.ts`. | No — defaults to `http://localhost:8081/auth` | `https://your-host/auth` |

Local overrides go in `.env.development` (gitignored; copy `.env.development.example`).

`Dockerfile` also declares `VITE_MEMBERS_URL`, `VITE_EVENTS_URL`, `VITE_FINANCE_URL` and
`VITE_LETTERS_URL` as build args. **No code reads them** — they are leftovers from before
path-based proxy routing, when each service had its own host. CD only passes `VITE_KEYCLOAK_URL`
(see the `build_args` matrix entry in `.github/workflows/cd.yml`).

## Scripts

| Command | What it does |
|---|---|
| `pnpm dev` | Vite dev server on :3000, proxying `/api` → `http://localhost` |
| `pnpm build` | `tsc -b` then `vite build` → `dist/` |
| `pnpm preview` | Serve the built `dist/` |
| `pnpm typecheck` | `tsc -b` across the app, node and e2e tsconfig projects; no emit |
| `pnpm lint` / `pnpm lint:fix` | ESLint (flat config) |
| `pnpm test` | Vitest, single run |
| `pnpm test:watch` | Vitest in watch mode |
| `pnpm test:coverage` | Vitest with v8 coverage (this is what CI runs) |
| `pnpm e2e` | `pnpm build`, then Playwright against a `vite preview` server |
| `pnpm e2e:ui` | Playwright UI mode |
| `pnpm verify` | lint + typecheck + test + build — run this before pushing |

CI (`.github/workflows/ci.yml`) runs typecheck, lint, `test:coverage` and build. **It does not
run E2E** — that is a local gate.

## Project structure

```
src/
├── main.tsx              # Entry: QueryClient config, ThemeProvider, mounts AuthenticatedApp
├── AuthenticatedApp.tsx  # Runs keycloak.init(); renders spinner → error card → the app
├── App.tsx               # RouterProvider
├── api.ts                # ⚠ GENERATED from api/openapi.yaml — do not edit (eslint-ignored)
├── types.ts              # Hand-written aliases/unions over the generated schemas
├── app/                  # App-level shell, not a feature
│   ├── layout/           #   AppShell: sidebar, user menu, theme switch, toaster
│   ├── router/           #   routes.tsx + RouteRoleGuard (role-gated routes)
│   ├── pages/            #   Dashboard, 404, route-error page
│   ├── theme/            #   ThemeProvider/useTheme (light | dark | system)
│   ├── navPolicy.ts      #   SINGLE source of which roles may use which route
│   └── ErrorBoundary.tsx
├── features/             # One folder per domain; see "Feature anatomy" below
│   ├── auth/  feedback/  helper/  letters/  members/
│   ├── organization/  payments/  profile/  sport-events/
├── components/ui/        # shadcn primitives + local ones (data-table, stat-card, …)
├── lib/                  # Cross-cutting: keycloak/axios, query keys & cache, forms, formatting
├── hooks/                # Shared React hooks (use-mobile)
├── store/                # Zustand store for app-wide UI state
├── testing/              # Test-only fixtures, personas, role-scoping helpers
└── index.css             # Tailwind 4 theme: CSS variables, fonts, typography scale

e2e/                      # Playwright specs + in-memory server (see e2e/README.md)
```

### Feature anatomy

Every feature under `src/features/` follows the same shape, and an `index.ts` barrel is the
only thing other modules should import from:

| Folder | Holds |
|---|---|
| `api/client.ts` | The axios instance and its `/api/v1/<service>` base URL |
| `api/queries.ts` | TanStack Query hooks (`useMembers`, `useCreateMember`, …) |
| `model/` | View-models and form/editor logic — the testable part, no JSX |
| `components/` | Feature-local dialogs and widgets |
| `pages/` | The routed page component |
| `types/` | Re-exports of the generated types this feature uses |

Base URLs per feature (all proxied through Traefik): `members` → `/api/v1/members`,
`organization` → `/api/v1/organization`, `sport-events` → `/api/v1/events`,
`payments` → `/api/v1/finance`, `feedback` → `/api/v1/feedback`, `letters` → `/api/v1/letters`,
`helper` → `/api/v1/helper`. The dashboard is served by the members service
(`/api/v1/members/dashboard`).

## How it fits together

### Auth and identity

`src/lib/keycloak.ts` owns the Keycloak singleton (realm `devops`, client `devops-client`,
public, PKCE S256) and `createApiClient(baseURL)`, the axios factory every feature uses:

- A request interceptor refreshes the token when it expires within 30s, sharing one in-flight
  refresh across concurrent requests, and sets `Authorization: Bearer <token>`.
- A response interceptor calls `keycloak.login()` on any 401.
- Default request timeout is 15s.

**Identity comes only from the Keycloak token.** `getCurrentUser()`
(`src/features/auth/currentUser.ts`) reads the parsed token's `member_roles` claim and collapses
it to a single `Role` via `highestRole()` — there is no separate "who am I" request. `useAuth()`
re-reads that snapshot on every token refresh, so a profile edit that mints a new token updates
the UI.

### Roles and routing

`src/app/navPolicy.ts` is the single source of truth for role access: `NAV_ITEMS` drives both the
sidebar and `ROUTE_ROLES`, which `RouteRoleGuard` enforces in `routes.tsx`. Add a route there and
both stay in sync. Roles are `member | trainer | director | admin`; a member has exactly one.

Rows are additionally *scoped* per role (a trainer sees only their teams' members, etc.). The
server does this for real; `src/testing/scope.ts` mirrors it for tests and the E2E server.

### Server state

TanStack Query is the cache; there is no Redux-style store for server data. Two files carry the
non-obvious rules and are worth reading before adding a mutation:

- **`src/lib/query-keys.ts`** — every query key *and* the cross-resource dependency map. Keys live
  here rather than beside their hooks because mutating one resource invalidates others (a member
  rename changes every roster; a transaction changes a balance), and keeping keys next to hooks
  would make feature modules import each other in a cycle.
- **`src/lib/query-cache.ts`** — `settleMutation`, the single entry point mutations call in
  `onSuccess`. The server is authoritative: lists are never re-sorted or spliced locally (only
  replace-by-id and remove-by-id), and everything a mutation touches indirectly is refetched.

Zustand (`src/store/ui.ts`, plus a `*UiStore.ts` per feature) holds only ephemeral UI state —
which dialog is open, which row is selected. Never server data.

### Theming

Tailwind 4 with CSS-variable tokens in `src/index.css`; shadcn `radix-sera` style, zinc base,
`--radius: 0`. `ThemeProvider` cycles `light → dark → system`, persists to `localStorage`
(`ui-theme`), toggles `.dark` on `<html>`, and follows the OS in `system` mode. Fonts: Poppins
(body), Bebas Neue (`font-display`). Prefer semantic tokens (`bg-card`, `text-text-tertiary`,
`text-h2`) over raw colors.

### Generated types

`src/api.ts` is generated by `openapi-typescript` from `api/openapi.yaml` via
`./api/scripts/gen-all.sh` (also wired into the repo's pre-commit hook). Do not edit it; it is in
ESLint's ignore list. `src/types.ts` is the hand-written layer on top — aliases, the `EventListItem`
augmentation, and the dashboard union.

## Testing

### Unit / component (Vitest + jsdom)

```bash
pnpm test                                   # all
pnpm test src/features/members              # one folder
pnpm test -t "creates a member"             # by test name
pnpm test:watch
```

Tests are **colocated** with the code (`memberEditor.test.ts` next to `memberEditor.ts`); Vitest
picks up `src/**/*.{test,spec}.{ts,tsx}`. A handful of app-level tests still sit in
`src/__tests__/`. Setup lives in `src/setupTests.ts`, fixtures in `src/testing/fixtures/`.

These cover what E2E deliberately doesn't: the per-role sweep (nav visibility, route-guard deny,
scoping), dialog validation branches, and view-model logic.

### E2E (Playwright)

```bash
pnpm exec playwright install chromium   # one-time
pnpm e2e                                # build + headless run
pnpm e2e:ui                             # interactive
pnpm exec playwright test e2e/members.spec.ts          # one spec (build first)
pnpm exec playwright test e2e/members.spec.ts -g "creates a member"
```

**No services and no Keycloak are needed.** The suite drives the real production bundle and stubs
everything below it, per browser context, before the app loads:

- **API** — `e2e/support/api.ts` intercepts `**/api/v1/**` with `context.route` and answers from
  an in-memory server (`e2e/support/server/*`, one module per resource). Its state is a deep clone
  of the same fixtures the unit tests use, reset before every test, so specs are order-independent.
- **Keycloak** — `e2e/support/auth.ts` intercepts the three requests keycloak-js makes (the
  third-party-cookie probe, the silent-check-sso authorization request, the code-for-token
  exchange) and mints an **unsigned** JWT echoing the request's `nonce`. keycloak-js doesn't verify
  signatures client-side, so this is enough for `init()` to resolve as authenticated.
- **Identity** — since identity is read from the token, the minted token *is* the identity. It is
  the seeded **admin** persona (`src/testing/personas.ts`), and the in-memory server answers as that
  same admin. The suite therefore runs as **one identity, admin — there is no persona switching and
  no env var that selects one.** Role variation is covered by unit tests instead.

`pnpm e2e` builds first and serves `dist/` via `vite preview` on :5199 (Vite's per-worker transform
contention was starving the auth handshake); workers are capped at 4. `e2e/README.md` has the detail.

## Conventions

- Import from `src` with the `@/` alias.
- Import a feature through its barrel (`@/features/members`), not deep paths.
- New shared primitives go in `src/components/ui`. Look components up with the **`shadcn` MCP
  server** before hand-writing them (see the root `CLAUDE.md`).
- Prefer semantic theme tokens over hard-coded colors.
- Run `pnpm verify` before pushing.

## Build & deploy

```bash
pnpm build      # → dist/
```

`Dockerfile` is a two-stage build (Node 24 builder → `nginx-unprivileged` on port 8080). Keycloak's
silent-check-sso iframe needs `X-Frame-Options` omitted for `/silent-check-sso.html` — `nginx.conf`
special-cases exactly that, so don't "tidy" it into the global header block.

```bash
docker build --build-arg VITE_KEYCLOAK_URL=https://your-host/auth -t web-client .
```
