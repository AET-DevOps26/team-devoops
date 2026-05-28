# team-devoops: Hierarchical Club Management System

A centralized sports club management platform that combines member administration, event scheduling, payment tracking, and AI-powered personalized feedback into a single application.

Club organizers get an all-in-one tool for managing members, automating billing, and overseeing events. Members and trainers benefit from structured training overviews and AI-generated progress reports based on attendance records, trainer notes, and member profiles.

## Features

- **Organization service** — CRUD for sports, teams and roles (e.g. member, trainer, admin)
- **Member management** — CRUD for members, member data and profiles
- **Event service** — training scheduling, attendance tracking, trainer notes
- **Feedback service** — personalized feedback and progress reports
- **Finance service** — one-time and recurring billing linked to members
- **Letter service** — PDF/email generation from templates with dynamic member data
- **GenAI helper** — analyzes member data and trainer notes to generate personalized feedback and progress reports (supports OpenAI and local LLMs)

## Repository Structure

```
repo/
├── api/                        # Single source of truth for API contracts
│   ├── openapi.yaml            # Versioned OpenAPI spec (OpenAPI 3.0.3)
│   └── scripts/                # Code-gen scripts (gen-all.sh, gen-spring.sh, …)
├── docs/                       # Project documentation
├── services/
│   ├── spring-*/               # Java 21, Spring Boot 3 microservices
│   │   └── src/generated/      # ⚠ Generated — do not edit by hand
│   └── py-genai-helper/        # Python 3.12, Flask + LangChain GenAI service
│       └── generated/          # ⚠ Generated — do not edit by hand
├── web-client/                 # React SPA (Vite, TypeScript)
│   └── src/api.ts              # ⚠ Generated — do not edit by hand
├── infra/                      # docker-compose, Traefik config, Helm/Terraform
└── .github/workflows/          # CI/CD pipelines
```

## Architecture

All services run in Docker and are exposed through a single **Traefik** reverse
proxy on port **80**. Traefik routes requests by path prefix and strips the full
prefix before forwarding, so each service receives only the resource path (e.g.
`GET /api/v1/organization/sports` → organization-service receives `GET /sports`).
The Spring Boot services and the GenAI service share a **PostgreSQL** database.

| Service | External route | Internal port | Stack |
|---|---|---|---|
| Organization Service | `/api/v1/organization/…` | 8080 | Java 21, Spring Boot 3 |
| Member Service | `/api/v1/members/…` | 8080 | Java 21, Spring Boot 3 |
| Event Service | `/api/v1/events/…` | 8080 | Java 21, Spring Boot 3 |
| Feedback Service | `/api/v1/feedback/…` | 8080 | Java 21, Spring Boot 3 |
| Finance Service | `/api/v1/finance/…` | 8080 | Java 21, Spring Boot 3 |
| Letter Service | `/api/v1/letters/…` | 8080 | Java 21, Spring Boot 3 |
| GenAI Service | `/api/v1/helper/…` | 5000 | Python 3.12, Flask, LangChain |
| Web Client | `/` | 8080 | React, Vite |
| Swagger UI | `/docs` | 8080 | swaggerapi/swagger-ui |
| Traefik dashboard | `http://localhost:8080` | — | Traefik v3 |
| PostgreSQL | internal only | 5432 | postgres:15 |

## Code Generation

`api/openapi.yaml` is the single source of truth. Three generators derive code
from it that **must never be edited by hand**:

| Generator | Tool | Output |
|---|---|---|
| Spring Boot API interfaces + models | `openapitools/openapi-generator-cli:v7.14.0` (Docker) | `services/spring-*/src/generated/java/` |
| Pydantic v2 models | `datamodel-code-generator` (pip) | `services/py-genai-helper/generated/models.py` |
| TypeScript types | `openapi-typescript` (pnpm devDep) | `web-client/src/api.ts` |

Run all generators at once:

```bash
./api/scripts/gen-all.sh
```

The `openapi-codegen` pre-commit hook runs this automatically whenever
`api/openapi.yaml` is staged. If any generated file changes, the hook re-stages
the output and aborts so you can review the diff before re-committing.

Prerequisites: **Docker** (Spring generator), **`datamodel-code-generator`**
(`pip install datamodel-code-generator`), **`pnpm`** (already a devDependency
in `web-client/`).

## Developer Setup

This repo uses [`pre-commit`](https://pre-commit.com) to run the same fast lint
checks locally that CI gates on (ruff, eslint, end-of-file fixer, pnpm lockfile
sync, etc.). One-time setup per developer:

```bash
pip install pre-commit datamodel-code-generator   # or: pipx install pre-commit
pre-commit install                                 # installs the pre-commit git hook
pre-commit install --hook-type pre-push            # installs the pre-push hook
pre-commit run --all-files                         # optional one-time clean-up pass
```

What runs when:

| Stage | Hooks |
|---|---|
| `pre-commit` (every commit) | end-of-file-fixer, trailing-whitespace, check-yaml/json, merge-conflict guard, large-file guard, **ruff** (lint + format, py-genai-helper), **eslint --fix** (web-client), **pnpm-lock-sync** (regenerates `web-client/pnpm-lock.yaml` when `package.json` changes), **openapi-codegen** (regenerates all generated sources when `api/openapi.yaml` changes) |
| `pre-push` (only on push) | **Spectral** lint of `api/openapi.yaml` (if changed), **Checkstyle** for all Spring services (if Java sources changed) |

Auto-fixing hooks (ruff, eslint, pnpm-lock-sync, openapi-codegen,
end-of-file-fixer, etc.) will modify files and **abort the commit** so you can
re-stage and re-commit.

Bypass (emergencies only -- CI will still gate):

```bash
git commit --no-verify
git push   --no-verify
```

The full hook configuration lives in [`.pre-commit-config.yaml`](.pre-commit-config.yaml)
and the helper scripts under [`scripts/hooks/`](scripts/hooks/).

## Docs

- [Problem Statement](docs/problem-statement.md)
- [System Architecture](docs/system-architecture.md)
- [Backlog](docs/backlog.md)
