# Web Client

React + TypeScript single-page application for the team-devoops club management platform.

## Stack

| | |
|---|---|
| Framework | React 19, TypeScript 5 |
| Build tool | Vite 6 |
| Package manager | `pnpm` |
| Routing | React Router v7 |
| HTTP client | Axios |
| Auth | keycloak-js 26 (PKCE S256) |
| Tests | Vitest + jsdom |
| Linting | ESLint (flat config) |

## Design System

The client uses:

- `shadcn` primitives for reusable UI building blocks
- Tailwind CSS v4 with CSS variable theming
- the `Sera` style preset configured in `components.json`

The global theme lives in `src/index.css`. Light and dark mode are driven by semantic tokens such as `--background`, `--primary`, and `--card`.

## Prerequisites

- **Node.js 20+** and **pnpm** (`npm install -g pnpm`)
- **Keycloak running locally** on port 8081 — start it with `docker compose up -d keycloak` from `infra/` (see root README)

## Local development

```bash
pnpm install
pnpm dev        # Vite dev server at http://localhost:5173
```

The app requires Keycloak to be reachable at `VITE_KEYCLOAK_URL` (default `http://localhost:8081`) before it renders. On first load it redirects to the Keycloak login page.

To override the Keycloak URL:

```bash
VITE_KEYCLOAK_URL=http://localhost:8081 pnpm dev
```

## Authentication

Authentication is handled by [`src/lib/keycloak.ts`](src/lib/keycloak.ts):

- The Keycloak singleton connects to realm `devops`, client `devops-client` (public, PKCE S256).
- `main.tsx` initialises Keycloak with `onLoad: 'login-required'` — the app only mounts after the user is authenticated.
- `createApiClient(baseURL)` returns an Axios instance whose request interceptor refreshes the token (if it expires within 30 s) and injects `Authorization: Bearer <token>` on every outgoing request.

Local test users (auto-imported from realm config):

| User | Password | Roles |
|---|---|---|
| `admin` | `admin123` | `admin`, `member` |
| `user` | `user123` | `member` |

## Build & deploy

```bash
pnpm build      # outputs to dist/
```

The `Dockerfile` accepts a `VITE_KEYCLOAK_URL` build argument so the production Keycloak URL is baked in at image build time:

```bash
docker build \
  --build-arg VITE_KEYCLOAK_URL=https://your-host/auth \
  -t web-client .
```

In the CD pipeline this is set automatically to the cluster hostname via the `build_args` matrix entry in `.github/workflows/cd.yml`.

## Scripts

- `pnpm dev` starts the Vite dev server
- `pnpm lint` runs ESLint
- `pnpm typecheck` runs TypeScript in build mode without emitting files
- `pnpm test` runs Vitest
- `pnpm build` creates the production bundle
- `pnpm verify` runs lint, typecheck, tests, and build

## Running tests

```bash
pnpm test          # run once
pnpm test --watch  # watch mode
```

Tests live in `src/__tests__/` and use Vitest with jsdom.

## Notes

- Use the `@/` alias for imports from `src`
- Add new reusable primitives under `src/components/ui`
- Prefer semantic theme tokens over hard-coded colors when extending the UI
