# Web Client

This app is the React frontend for the Team Devoops club-management project.

## Design System

The client now uses:

- `shadcn` primitives for reusable UI building blocks
- Tailwind CSS v4 with CSS variable theming
- the `Sera` style preset configured in `components.json`

The global theme lives in `src/index.css`. Light and dark mode are driven by semantic tokens such as `--background`, `--primary`, and `--card`.

## Scripts

- `pnpm dev` starts the Vite dev server
- `pnpm lint` runs ESLint
- `pnpm typecheck` runs TypeScript in build mode without emitting files
- `pnpm test` runs Vitest
- `pnpm build` creates the production bundle
- `pnpm verify` runs lint, typecheck, tests, and build

## Notes

- Use the `@/` alias for imports from `src`
- Add new reusable primitives under `src/components/ui`
- Prefer semantic theme tokens over hard-coded colors when extending the UI
