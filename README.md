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
│   ├── openapi.yaml            # Versioned OpenAPI spec
│   └── scripts/                # Code-gen helper scripts
├── docs/                       # Project documentation
├── services/
│   ├── spring-*/               # Java 21, Spring Boot 3 microservices
│   └── py-*/                   # Python 3.12, Flask + LangChain GenAI service
├── web-client/                 # React single-page application
├── infra/                      # docker-compose, Traefik config, Helm/Terraform
└── .github/workflows/          # CI/CD pipelines
```

## Architecture

All services sit behind a **Traefik** reverse proxy that handles routing and authentication (OAuth2). The Spring Boot services and the GenAI service share **PostgreSQL** databases. The web client communicates with the backend services via REST APIs defined in the OpenAPI spec. The GenAI service can call external LLM APIs (like OpenAI) or use local models to generate personalized feedback based on member data and trainer notes.

| Service | Port | Stack |
|---|---|---|
| Organization Service | 8001 | Java 21, Spring Boot 3 |
| Member Service | 8002 | Java 21, Spring Boot 3 |
| Event Service | 8003 | Java 21, Spring Boot 3 |
| Feedback Service | 8004 | Java 21, Spring Boot 3 |
| Finance Service | 8005 | Java 21, Spring Boot 3 |
| Letter Service | 8006 | Java 21, Spring Boot 3 |
| GenAI Service | 5000 | Python 3.12, Flask, LangChain |
| Web Client | 3000 | React, Vite |
| PostgreSQL | 5432 | — |
| Traefik | 80/443 | — |

## Developer Setup

This repo uses [`pre-commit`](https://pre-commit.com) to run the same fast lint
checks locally that CI gates on (ruff, eslint, end-of-file fixer, npm lockfile
sync, etc.). One-time setup per developer:

```bash
pip install pre-commit          # or: pipx install pre-commit
pre-commit install              # installs the pre-commit git hook
pre-commit install --hook-type pre-push   # installs the pre-push hook
pre-commit run --all-files      # optional one-time clean-up pass
```

What runs when:

| Stage | Hooks |
|---|---|
| `pre-commit` (every commit) | end-of-file-fixer, trailing-whitespace, check-yaml/json, merge-conflict guard, large-file guard, **ruff** (lint + format, py-recommender), **eslint --fix** (web-client), **npm-lock-sync** (regenerates `web-client/package-lock.json` when `package.json` changes) |
| `pre-push` (only on push) | **Spectral** lint of `api/openapi.yaml` (if changed), **Checkstyle** for `member-service` (if Java sources changed) |

Auto-fixing hooks (ruff, eslint, npm-lock-sync, end-of-file-fixer, etc.) will
modify files and **abort the commit** so you can re-stage and re-commit.

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
