# web-client

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

## Running tests

```bash
pnpm test          # run once
pnpm test --watch  # watch mode
```

Tests live in `src/__tests__/` and use Vitest with jsdom.

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type-aware lint rules:

```js
export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...

      // Remove tseslint.configs.recommended and replace with this
      tseslint.configs.recommendedTypeChecked,
      // Alternatively, use this for stricter rules
      tseslint.configs.strictTypeChecked,
      // Optionally, add this for stylistic rules
      tseslint.configs.stylisticTypeChecked,

      // Other configs...
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```

You can also install [eslint-plugin-react-x](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-x) and [eslint-plugin-react-dom](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-dom) for React-specific lint rules:

```js
// eslint.config.js
import reactX from 'eslint-plugin-react-x'
import reactDom from 'eslint-plugin-react-dom'

export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...
      // Enable lint rules for React
      reactX.configs['recommended-typescript'],
      // Enable lint rules for React DOM
      reactDom.configs.recommended,
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```
