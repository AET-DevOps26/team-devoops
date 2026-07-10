# team-devoops: Hierarchical Club Management System

A centralized sports club management platform that combines member administration, event scheduling, payment tracking, and AI-powered personalized feedback into a single application.

Club organizers get an all-in-one tool for managing members, automating billing, and overseeing events. Members and trainers benefit from structured training overviews and AI-generated progress reports based on attendance records, trainer notes, and member profiles.

**Live deployments:**

| Environment | URL |
|---|---|
| Kubernetes (TUM RKE2 / Rancher) | <https://ge83mom-devops26.stud.k8s.aet.cit.tum.de> |
| Azure VM | <https://team-devoops.polandcentral.cloudapp.azure.com> |

## Features

- **Organization service** — CRUD for sports, teams and roles (e.g. member, trainer, admin)
- **Member management** — CRUD for members, member data and profiles
- **Event service** — training scheduling, attendance tracking, trainer notes
- **Feedback service** — personalized feedback and progress reports
- **Finance service** — one-time and recurring billing linked to members
- **Letter service** — PDF/email generation from templates with dynamic member data
- **GenAI helper** — analyzes member data and trainer notes to generate personalized feedback and progress reports; supports both a cloud provider (OpenAI) and a local model (Ollama), selectable per request, and answers questions over uploaded documents via RAG (Chroma vector store)

## Repository Structure

```
repo/
├── api/                        # Single source of truth for API contracts
│   ├── openapi.yaml            # Versioned OpenAPI spec (OpenAPI 3.0.3)
│   └── scripts/                # Code-gen scripts (gen-all.sh, gen-spring.sh, …)
├── docs/                       # Project documentation (see "Docs" below)
├── services/
│   ├── spring-*/               # Java 21, Spring Boot 3 microservices
│   │   └── src/generated/      # ⚠ Generated — do not edit by hand
│   └── py-genai-helper/        # Python 3.12, Flask + LangChain GenAI service
│       └── generated/          # ⚠ Generated — do not edit by hand
├── web-client/                 # React SPA (Vite, TypeScript)
│   └── src/api.ts              # ⚠ Generated — do not edit by hand
├── infra/                      # docker-compose, Traefik config, Terraform, Ansible, Helm
└── .github/workflows/          # CI/CD pipelines
```

## Architecture

The system is a set of independently deployable services behind a single reverse proxy — Traefik in Docker Compose / on the Azure VM, the cluster's own nginx ingress on Kubernetes. The proxy routes by path prefix and strips it before forwarding, so e.g. `GET /api/v1/organization/sports` reaches organization-service as `GET /sports`.

- **Client** — a React SPA that talks to every backend service directly over REST through the proxy (including the GenAI service — there's no server-side fan-out on its behalf).
- **Server** — six Spring Boot 3 microservices (organization, member, event, feedback, finance, letter), each owning one schema in a shared PostgreSQL instance and validating requests as a stateless OAuth2 resource server against Keycloak.
- **GenAI** — a Python/Flask + LangChain service (`py-genai-helper`) that is itself a REST client of feedback-service (to pull the data it summarizes) and of either OpenAI or a local Ollama instance (to run inference).
- **Auth** — Keycloak issues JWTs; Traefik's forward-auth middleware gates browser sessions, and each Spring/Flask service independently validates the Bearer token against Keycloak's JWK set.

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
| Keycloak | `/auth` | 8080 | Keycloak 26 |
| Grafana | `/dashboard` (admin only) | 3000 | Grafana 11 |
| Prometheus | internal only | 9090 | Prometheus v2 |
| PostgreSQL | internal only | 5432 | postgres:15 |

Full per-service responsibilities, interface contracts, and the request/auth lifecycle: **[docs/architecture.md](docs/architecture.md)**.

## API

`api/openapi.yaml` (OpenAPI 3.0.3) is the single source of truth for every REST contract. Three generators derive code from it that must never be edited by hand: Spring interfaces/models (`openapitools/openapi-generator-cli`), Pydantic v2 models (`datamodel-code-generator`), and TypeScript types (`openapi-typescript`). Run all three with:

```bash
./api/scripts/gen-all.sh
```

The `openapi-codegen` pre-commit hook re-runs this automatically whenever `api/openapi.yaml` changes and aborts the commit so the diff can be reviewed. A live Swagger UI is served at `/docs` in every environment.

## Database

All five schema-owning Spring services share a single **PostgreSQL 15** instance (`app_db`), each with a dedicated schema and a least-privilege user:

| Service | Schema | User |
|---|---|---|
| Organization | `organization` | `organization_user` |
| Member | `member` | `member_user` |
| Event | `event` | `event_user` |
| Feedback | `feedback` | `feedback_user` |
| Finance | `finance` | `finance_user` |

Schemas and users are created at DB init time by [`infra/postgres/init-db.sh`](infra/postgres/init-db.sh). Each service runs its own **Flyway** migrations on startup (`V1__create_tables.sql`, `V2__add_foreign_keys.sql` for cross-schema references, granted via `ALTER DEFAULT PRIVILEGES`). The letter service has no database; the GenAI service persists RAG documents in a Chroma vector store instead of PostgreSQL.

## Authentication (Keycloak)

All services are protected by [Keycloak 26](https://www.keycloak.org) via OIDC/JWT, included in both the Docker Compose stack and the Helm chart.

| Realm | `devops` |
|---|---|
| Admin user | `admin` / `admin123` locally (roles: `admin`, `member`) |
| Regular user | `user` / `user123` locally (role: `member`) |

Passwords shown are the local-dev defaults from [`infra/.env.example`](infra/.env.example); on the VM and Kubernetes they come from GitHub Secrets instead — nothing is hardcoded in `docker-compose.yml`, `infra/keycloak/realm-config.json`, or the Helm chart. The web client (`devops-client`, public/PKCE S256) redirects to Keycloak automatically (`login-required`). Traefik's forward-auth middleware, Grafana's own OAuth login, and the organization/member services' Keycloak Admin API client (`org-role-sync`) each use their own confidential client. Locally, Keycloak's admin console is at <http://localhost:8081/auth/admin>; in production it's behind the proxy at `/auth/admin`. Full JWT-validation, client, and per-environment issuer-URI details: [docs/architecture.md](docs/architecture.md).

## Developer Setup

This repo uses [`pre-commit`](https://pre-commit.com) to run the same fast checks locally that CI gates on (ruff, eslint, checkstyle, Spectral, end-of-file fixer, pnpm lockfile sync, OpenAPI codegen, …):

```bash
pip install pre-commit datamodel-code-generator
pre-commit install
pre-commit install --hook-type pre-push
```

Auto-fixing hooks modify files and abort the commit so you can re-stage. Bypass only in emergencies (`git commit --no-verify` / `git push --no-verify`) — CI still gates. Full hook config: [`.pre-commit-config.yaml`](.pre-commit-config.yaml).

## Running Locally

```bash
cd infra
cp .env.example .env   # first time only — local-dev secrets, gitignored
docker compose up -d --build
```

This auto-merges [`infra/docker-compose.override.yml`](infra/docker-compose.override.yml), which strips TLS/Let's-Encrypt/Host-routing so everything is reachable on plain HTTP:

| URL | Service |
|---|---|
| <http://localhost/> | Web client |
| <http://localhost/docs> | Swagger UI |
| <http://localhost/dashboard> | Grafana (admin only) |
| <http://localhost/api/v1/&lt;service&gt;/…> | APIs |
| <http://localhost/auth> | Keycloak |
| <http://localhost:8080> | Traefik dashboard |

> **Do not run** `docker compose -f infra/docker-compose.yml up` directly — that skips the override and Traefik will try to request a real Let's Encrypt cert for the production hostname from your laptop.

Tear down with `docker compose down` (keeps the Postgres volume) or `docker compose down -v` (wipes it too).

## CI/CD

**CI** (`.github/workflows/ci.yml`) runs on every pull request: build + test + lint (Checkstyle/ruff/ESLint) for each of the six Spring services, `py-genai-helper`, and `web-client`; a whole-system `docker compose build`; CodeQL SAST across Java/Python/TypeScript; OpenAPI linting (Spectral); and Helm chart linting + `kubeconform` schema validation. A single `ci-success` job aggregates all of these into one required check.

**CD** (`.github/workflows/cd.yml`) runs on every push to `main` and deploys to both live environments in parallel: the Azure VM via Ansible, and the Kubernetes cluster via `helm upgrade --install` (after building and pushing every image to GHCR). All credentials are injected from GitHub Secrets — nothing is hardcoded in the workflows.

Full job-by-job breakdown and the required secrets table: **[docs/cicd.md](docs/cicd.md)**.

## Deployment environments

Besides local Docker Compose (above), the system runs continuously in two more places:

- **Azure VM** — a single Ubuntu VM provisioned by Terraform, configured by Ansible, running the same `docker-compose.yml` stack with a real Let's Encrypt certificate.
- **Kubernetes (TUM RKE2 / Rancher)** — a Helm umbrella chart ([`infra/helm/team-devoops`](infra/helm/team-devoops)) deploying every service, PostgreSQL, Ollama, and the monitoring stack into namespace `ge83mom-devops26`, with autoscaling (HPA) and rolling-update self-healing configured per service.

Provisioning details, Ansible/Terraform/Helm internals, and per-environment secrets: **[docs/deployment.md](docs/deployment.md)**.

## Monitoring

**Prometheus** tracks request count, latency, and error rate for every Spring service, the GenAI service, and Keycloak, plus a handful of business-level custom metrics (letters sent/generated, RAG query rate, report-generation rate — each split by LLM provider). **Grafana** (admin-only, OAuth via Keycloak) visualizes them across three dashboards provisioned as code, and two alert rules (service down, high p95 latency) are wired into Grafana's unified alerting. **Loki + Grafana Alloy** centralize logs from every service/pod so they're searchable in Grafana instead of `docker logs`/`kubectl logs`.

Runs identically in all three environments from the same config. Full metrics table, dashboard breakdown, and alert definitions: **[docs/monitoring.md](docs/monitoring.md)**.

## Testing

| Layer | Tool | Scope |
|---|---|---|
| Spring services (×6) | JUnit (via `./gradlew build`) | Service/controller logic per domain |
| GenAI (`py-genai-helper`) | pytest | RAG pipeline, report generation, LLM provider selection |
| Web client | Vitest + jsdom | Core user workflows (auth, CRUD flows per feature area) |

All of the above run automatically in CI on every pull request (see [CI/CD](#cicd)); a PR cannot merge if any of them fail.

```bash
# Spring service, from services/spring-<name>/
./gradlew build

# GenAI service, from services/py-genai-helper/
pytest -q

# Web client, from web-client/
pnpm test
```

## Team & Responsibilities

Each team member owns a primary subsystem, with cross-cutting collaboration on integration and deployment:

- **Raphael Frank** — infrastructure and CI/CD pipeline (Docker Compose, Traefik, Terraform/Ansible, Kubernetes/Helm, GitHub Actions, monitoring stack), plus contributions across the Spring services and the GenAI service.
- **Fady Samman** — web client (React SPA: routing, auth integration, all feature pages and API wiring).
- **Fabian Heinrich** — GenAI service (LangChain/RAG/LLM provider integration) and Spring service implementation.

## Docs

- [Architecture](docs/architecture.md) — subsystem responsibilities, interface contracts, request/auth lifecycle
- [Deployment](docs/deployment.md) — Terraform, Ansible, Helm chart reference, per-environment secrets
- [CI/CD](docs/cicd.md) — workflow job breakdown, required GitHub secrets
- [Monitoring](docs/monitoring.md) — metrics table, dashboard panels, alert rule definitions
- [Problem Statement](docs/problem-statement.md)
- [Outdated](docs/outdated/) — early architecture doc, UML diagrams, and backlog, kept for history but superseded by the above
