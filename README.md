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
├── infra/                      # docker-compose, Traefik config, Terraform, Ansible, Helm
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
| Keycloak | `/auth` | 8080 | Keycloak 26 |
| Traefik dashboard | `http://localhost:8080` (local only) | — | Traefik v3 |
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

## Running Locally

Spin up the full stack on your machine with Docker Compose:

```bash
cd infra
docker compose up -d --build
```

This auto-merges [`infra/docker-compose.override.yml`](infra/docker-compose.override.yml),
which strips TLS / Let's Encrypt / Host-based routing from the base file so
everything is reachable on plain HTTP:

| URL | Service |
|---|---|
| <http://localhost/> | Web client |
| <http://localhost/docs> | Swagger UI |
| <http://localhost/api/v1/&lt;service&gt;/…> | APIs (organization, members, events, feedback, finance, letters, helper) |
| <http://localhost:8080> | Traefik dashboard |

> **Do not run** `docker compose -f infra/docker-compose.yml up` locally — that
> skips the override, causing Traefik to request a real Let's Encrypt cert for
> the production hostname from your laptop. Failed challenges count toward the
> production rate limit.

Tear down:
```bash
cd infra && docker compose down            # keeps the postgres volume
cd infra && docker compose down -v         # wipes the postgres volume too
```

## Production Deployment

The stack runs on a single Azure VM in **UAE North**, fronted by Traefik with a
real TLS certificate from Let's Encrypt (production CA). Everything is
automated; no manual VM access is required for normal deploys.

**Live URL:** <https://team-devoops.uaenorth.cloudapp.azure.com>

### Infrastructure stack

| Layer | Tool | What it does |
|---|---|---|
| Provisioning | **Terraform** (AzureRM ~> 4.0) | Resource group, VNet, NSG (22/80/443), static public IP + free Azure FQDN, Ubuntu 24.04 VM |
| Configuration | **Ansible** | Installs Docker, clones repo, writes `.env`, runs `docker compose up` |
| CI/CD | **GitHub Actions** (OIDC, no client secrets) | `infra.yml` (manual: plan/apply/destroy) and `cd.yml` (auto on push to `main`) |
| Remote state | **Azure Blob Storage** (`stteamdevoopstfstate/tfstate`) | Shared, locked Terraform state — survives between CI runs |
| TLS | **Let's Encrypt** (HTTP-01 via Traefik) | Cert persisted in a Docker volume; auto-renewed |

### GitHub Actions workflows

- **`infra` workflow** — manual (`workflow_dispatch`). Choose `plan`, `apply`, or `destroy`.
- **`cd` workflow** — runs automatically on every push to `main` (and is also `workflow_dispatch`-able). Deploys the current `main` to the VM via Ansible **and** to the Kubernetes cluster via Helm (see [Kubernetes deployment](#kubernetes-deployment-helm)).

### Required GitHub secrets / variables

| Kind | Name | Purpose |
|---|---|---|
| Variable | `AZURE_CLIENT_ID` | OIDC app registration (Service Principal) |
| Variable | `AZURE_TENANT_ID` | Azure AD tenant |
| Variable | `AZURE_SUBSCRIPTION_ID` | Target subscription |
| Secret | `VM_SSH_PUBLIC_KEY` | Public key planted on the VM by Terraform |
| Secret | `SSH_PRIVATE_KEY` | Matching private key for Ansible to SSH in |
| Secret | `VM_HOST` | Host Ansible connects to — use the FQDN above |
| Secret | `GENAI_ENV_CONTENT` | Contents of `services/py-genai-helper/.env` |
| Secret | `KUBECONFIG` | Kubeconfig for the RKE2 cluster (used by the `deploy-k8s` job) |

The OIDC service principal needs `Contributor` on the subscription (to manage
resources in `rg-team-devoops`) and `Storage Blob Data Contributor` on the
state account `stteamdevoopstfstate` (to read/write tfstate).

### Typical workflow

1. **Change infra** → push to `main` (or any branch), trigger `infra` workflow with `apply`.
2. **Change app code** → merge to `main`; `cd` runs automatically and redeploys.
3. **Tear down** → trigger `infra` workflow with `destroy`.

### Running Terraform locally

```bash
az login
az account set --subscription <AZURE_SUBSCRIPTION_ID>
export ARM_SUBSCRIPTION_ID=<AZURE_SUBSCRIPTION_ID>
export ARM_USE_AZUREAD=true
cd infra/terraform
echo "admin_ssh_public_key = \"$(cat ~/.ssh/team-devoops-azure.pub)\"" > terraform.tfvars
terraform init
terraform plan
```

Local and CI share the same remote state, so do not run `apply` in both at the
same time (the backend's blob lease will block one, but coordinate anyway).

### Kubernetes deployment (Helm)

In addition to the Azure VM, the stack is also deployed to a **Kubernetes
cluster** (TUM RKE2) via a Helm umbrella chart. Both deploys run in parallel on
push to `main`; the VM path is unchanged.

| Aspect | Value |
|---|---|
| Chart | [`infra/helm/team-devoops`](infra/helm/team-devoops) |
| Namespace | `ge83mom-devops26` |
| Host | <https://ge83mom-devops26.stud.k8s.aet.cit.tum.de> |
| Ingress | cluster `nginx` ingress (path-prefix routing, prefix stripped per service) |
| Images | built and pushed to `ghcr.io/aet-devops26/team-devoops/<service>` |
| Database | in-cluster PostgreSQL `StatefulSet` + PVC (cluster default StorageClass) |

The `cd` workflow's `docker-push` job builds and pushes all service images to
ghcr (tagged with the commit SHA), then `deploy-k8s` runs `helm upgrade
--install` against the cluster. On pull requests, the `ci` workflow's
`helm-validate` job lints and schema-validates the chart with `kubeconform`.

See [`infra/helm/README.md`](infra/helm/README.md) for the chart layout, required
one-time secrets (`genai-env`, `ghcr-pull`), and manual deploy instructions.

## Authentication (Keycloak)

All services are protected by [Keycloak 26](https://www.keycloak.org) via OIDC/JWT. Keycloak is included in both the Docker Compose stack and the Helm chart — no separate installation is needed.

### Realm & users

| Realm | `devops` |
|---|---|
| Admin user | `admin` / `admin123` (roles: `admin`, `member`) |
| Regular user | `user` / `user123` (role: `member`) |

### Clients

| Client | Type | Used by |
|---|---|---|
| `devops-client` | public, PKCE S256 | React frontend |
| `traefik-forward-auth` | confidential | Traefik forward-auth middleware |

### Local login

When running with Docker Compose, Keycloak is available at <http://localhost:8081/auth>. The realm is auto-imported on first start from [`infra/keycloak/realm-config.json`](infra/keycloak/realm-config.json).

The web client redirects to Keycloak automatically (`login-required` strategy). Log in with any of the test users above.

### Production admin console

Keycloak is publicly accessible via Traefik at <https://team-devoops.uaenorth.cloudapp.azure.com/auth>. Admin console: `/auth/admin`.

### Spring services — JWT validation

Each Spring service is a stateless OAuth2 resource server. It validates Bearer JWTs against Keycloak's JWK set and extracts roles from the `realm_access.roles` claim, mapping them to Spring `ROLE_*` authorities (e.g. `"admin"` → `ROLE_admin`).

| Property | Purpose |
|---|---|
| `spring.security.oauth2.resourceserver.jwt.issuer-uri` | Validates the `iss` claim in incoming JWTs |
| `spring.security.oauth2.resourceserver.jwt.jwk-set-uri` | URL to fetch Keycloak's public signing keys |

These are set in each service's `src/main/resources/application.properties` as defaults (pointing at the local Keycloak on `localhost:8081/auth`). On the Azure VM, `docker-compose.yml` overrides `SPRING_SECURITY_OAUTH2_RESOURCESERVER_JWT_ISSUER_URI` with the public HTTPS issuer so it matches the `iss` claim in tokens issued by production Keycloak. The JWK set URI always uses the internal Docker hostname `http://keycloak:8080/auth/realms/devops/protocol/openid-connect/certs`. On Kubernetes they are injected via the `env:` block in `infra/helm/team-devoops/values.yaml` using the internal `keycloak` ClusterIP DNS name.

## Docs

- [Problem Statement](docs/problem-statement.md)
- [System Architecture](docs/system-architecture.md)
- [Backlog](docs/backlog.md)
