# Claude Code Guidelines

## UI components

This project uses shadcn/ui. When adding or modifying UI components, always use the `shadcn` MCP server to look up component APIs, variants, and usage before writing or editing component code.

## Branch naming

Pattern: `<type>/<issue-number>-<short-slug>`

Types observed in this repo:
- `client/` — web-client only changes (UI, components, pages, theme, client deps)
- `feature/` — new functionality that touches backend or crosses client/server layers
- `chore/` — tooling, deps, config, migrations
- `infra/` — Docker, CI, proxy, infrastructure
- `docs/` — documentation only

Examples:
- `client/44-members-page`
- `client/43-app-shell`
- `chore/53-web-client-ci`
- `feature/27-hook-client-to-server-end-points` — client+server change, so feature/

## Commit messages

Conventional commit prefix, lowercase, imperative, no period. Short and specific.

Prefixes:
- `feat:` — new feature or behaviour
- `fix:` — bug fix
- `chore:` — tooling, deps, config, no production code change
- `refactor:` — restructuring without behaviour change
- `style:` — formatting, CSS, theme, no logic change
- `docs:` — documentation only
- `test:` — adding or updating tests
- `ci:` — CI/CD pipeline changes

Good:
- `feat: add sidebar layout component`
- `fix: axios interceptor on 401`
- `chore: migrate auth token storage to zustand`
- `style: apply bebas neue to page titles`

Bad:
- `Add sidebar layout component` — missing prefix
- `Fixed the thing` — vague, past tense
- `WIP`

## PR titles

Pattern: `<Type> #<issue>: <short description>`

Type is title-case, matching the branch type:
- `Client #44: Members page`
- `Client #43: App shell with sidebar layout`
- `Chore #53: Web client CI pipeline`
- `Infra #31: Implemented path routing for services`
- `Feature #27: Hook client to server endpoints` — crosses layers, so Feature

Always include the issue number.

## PR body

Use this structure every time:

```
## Why
One or two sentences. What problem does this solve, or what goal does it serve?
Not what the code does — why it exists.

## What changed
- Bullet per meaningful change, grouped by area if needed
- Keep each line scannable (one idea, one line)

## Notes
Non-obvious decisions, tradeoffs, known limitations, or follow-up issues.
Omit this section if there is nothing worth flagging.

## Testing
How was this verified? (e.g. "pnpm build passes", "manually tested dark mode toggle", "all routes navigate correctly")

Closes #<issue>
```

Rules:
- Always close the linked issue with `Closes #<issue>`
- **Why** is mandatory — never skip it
- **Notes** is optional — only include if there is something a reviewer would otherwise have to figure out themselves
- No walls of prose; no vague "various improvements" bullets
- If setup steps are needed (migrations, one-time installs), add them under **Notes**
