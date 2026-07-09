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
| Grafana | `/dashboard` (admin only) | 3000 | Grafana 11 |
| Prometheus | internal only | 9090 | Prometheus v2 |
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
| <http://localhost/dashboard> | Grafana (monitoring, admin only) |
| <http://localhost/api/v1/&lt;service&gt;/…> | APIs (organization, members, events, feedback, finance, letters, helper) |
| <http://localhost/auth> | Keycloak (via Traefik) |
| <http://localhost:8081/auth> | Keycloak (direct, for admin console) |
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

The stack runs on a single Azure VM in **Poland Central**, fronted by Traefik with a
real TLS certificate from Let's Encrypt (production CA). Everything is
automated; no manual VM access is required for normal deploys.

**Live URL:** <https://team-devoops.polandcentral.cloudapp.azure.com>

### Infrastructure stack

| Layer | Tool | What it does |
|---|---|---|
| Provisioning | **Terraform** (AzureRM ~> 4.0) | Resource group, VNet, NSG (22/80/443), static public IP + free Azure FQDN, Ubuntu 24.04 VM |
| Configuration | **Ansible** | Installs Docker, clones repo, writes `.env`, runs `docker compose up` |
| CI/CD | **GitHub Actions** (OIDC, no client secrets) | `infra.yml` (manual: plan/apply/destroy) and `cd.yml` (auto on push to `main`) |
| Remote state | **Azure Blob Storage** (`stdevoops26tfstate/tfstate`) | Shared, locked Terraform state — survives between CI runs |
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
| Secret | `LETTER_ENV_CONTENT` | Contents of `services/spring-letter/.env` (mail credentials) |
| Secret | `KUBECONFIG` | Kubeconfig for the RKE2 cluster (used by the `deploy-k8s` job) |
| Secret | `DB_ADMIN_PASSWORD` | Shared Postgres admin password. VM: `POSTGRES_PASSWORD` in `infra/.env`. K8s: Helm `database.password` |
| Secret | `DB_ORGANIZATION_PASSWORD` | `organization_user` DB password. VM: `ORGANIZATION_DB_PASSWORD`. K8s: Helm `database.users.organization.password` |
| Secret | `DB_MEMBER_PASSWORD` | `member_user` DB password. VM: `MEMBER_DB_PASSWORD`. K8s: Helm `database.users.member.password` |
| Secret | `DB_EVENT_PASSWORD` | `event_user` DB password. VM: `EVENT_DB_PASSWORD`. K8s: Helm `database.users.event.password` |
| Secret | `DB_FEEDBACK_PASSWORD` | `feedback_user` DB password. VM: `FEEDBACK_DB_PASSWORD`. K8s: Helm `database.users.feedback.password` |
| Secret | `DB_FINANCE_PASSWORD` | `finance_user` DB password. VM: `FINANCE_DB_PASSWORD`. K8s: Helm `database.users.finance.password` |
| Secret | `DB_LETTER_PASSWORD` | `letter_user` DB password. VM: `LETTER_DB_PASSWORD`. K8s: Helm `database.users.letter.password` |
| Secret | `DB_REPORTS_PASSWORD` | `reports_user` DB password. VM: `REPORTS_DB_PASSWORD`. K8s: Helm `database.users.reports.password` |
| Secret | `KEYCLOAK_ADMIN_PASSWORD` | Keycloak bootstrap admin console password. VM: `KEYCLOAK_ADMIN_PASSWORD`. K8s: Helm `keycloak.adminPassword` |
| Secret | `KEYCLOAK_DB_PASSWORD` | Keycloak's own Postgres password. VM: `KEYCLOAK_DB_PASSWORD`. K8s: Helm `keycloak.db.password` |
| Secret | `KEYCLOAK_REALM_ADMIN_PASSWORD` | Password for the seeded `admin` realm user. VM: `KEYCLOAK_REALM_ADMIN_PASSWORD`. K8s: Helm `keycloak.users.admin.password` |
| Secret | `KEYCLOAK_REALM_USER_PASSWORD` | Password for the seeded `user` realm user. VM: `KEYCLOAK_REALM_USER_PASSWORD`. K8s: Helm `keycloak.users.user.password` |
| Secret | `FORWARD_AUTH_COOKIE_SECRET` | 32+ char random string signing forward-auth session cookies. VM: `FORWARD_AUTH_COOKIE_SECRET`. K8s: Helm `forwardAuth.cookieSecret` |
| Secret | `KEYCLOAK_ADMIN_CLIENT_SECRET` | Secret for the `org-role-sync` Keycloak service-account client (`manage-users`/`view-clients` — used by organization-service and member-service to call the Keycloak Admin REST API). VM: `KEYCLOAK_ADMIN_CLIENT_SECRET`. K8s: Helm `services.organization-service.env.KEYCLOAK_ADMIN_CLIENT_SECRET` and `services.member-service.env.KEYCLOAK_SERVICE_ACCOUNT_CLIENT_SECRET` (same value, two consumers) |
| Secret | `FORWARD_AUTH_CLIENT_SECRET` | Secret for the `traefik-forward-auth` Keycloak client (Traefik/oauth2-proxy's OIDC client, gates every proxied route). VM: `FORWARD_AUTH_CLIENT_SECRET`. K8s: Helm `forwardAuth.clientSecret` |
| Secret | `GRAFANA_OAUTH_CLIENT_SECRET` | Secret for the `grafana` Keycloak client (Grafana's own generic-OAuth login). VM: `GRAFANA_OAUTH_CLIENT_SECRET`. K8s: Helm `monitoring.grafana.oauthClientSecret` |

Each of these 16 secrets is the single source of truth for that value across **both** deploy targets — the `deploy` job's "Write compose .env file" step assembles `infra/.env` from them for the VM, and the `deploy-k8s` job passes them individually via `--set` for Helm. No GitHub secret's value is duplicated by a *different* GitHub secret (`KEYCLOAK_ADMIN_CLIENT_SECRET` is intentionally passed to two `--set` targets, since organization-service and member-service both authenticate to Keycloak as the same `org-role-sync` client).

The OIDC service principal needs `Contributor` on the subscription (to manage
resources in `rg-team-devoops`) and `Storage Blob Data Contributor` on the
state account `stdevoops26tfstate` (to read/write tfstate).

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
| Monitoring | in-cluster Prometheus + Grafana, each with its own PVC (see [Monitoring](#monitoring)) |
| Local LLM | in-cluster Ollama + PVC, reachable only by `py-genai-helper` (see [`services/py-genai-helper/README.md`](services/py-genai-helper/README.md)) |

The `cd` workflow's `docker-push` job builds and pushes all service images to
ghcr (tagged with the commit SHA), then `deploy-k8s` runs `helm upgrade
--install` against the cluster. On pull requests, the `ci` workflow's
`helm-validate` job lints and schema-validates the chart with `kubeconform`.

See [`infra/helm/README.md`](infra/helm/README.md) for the chart layout, required
one-time secrets (`genai-env`, `ghcr-pull`), the Prometheus/Grafana ConfigMaps,
and manual deploy instructions.

## Database

All five Spring services share a single **PostgreSQL 15** instance (`app_db`) but each owns a dedicated schema and a least-privilege user:

| Service | Schema | User |
|---|---|---|
| Organization | `organization` | `organization_user` |
| Member | `member` | `member_user` |
| Event | `event` | `event_user` |
| Feedback | `feedback` | `feedback_user` |
| Finance | `finance` | `finance_user` |

Schemas and users are created at DB init time by [`infra/postgres/init-db.sh`](infra/postgres/init-db.sh). Each service runs its own **Flyway** migrations on startup:

- `V1__create_tables.sql` — creates all tables for that schema
- `V2__add_foreign_keys.sql` — adds cross-schema foreign keys (e.g. `event.events.creator_id → member.members.id`)

Cross-schema `REFERENCES` privileges are granted via `ALTER DEFAULT PRIVILEGES` in `init-db.sh`, so foreign-key constraints across schemas work on fresh deploys without manual intervention.

The letter service has no database (`spring.flyway.enabled=false`). The GenAI service uses file-based storage for RAG documents.

## Authentication (Keycloak)

All services are protected by [Keycloak 26](https://www.keycloak.org) via OIDC/JWT. Keycloak is included in both the Docker Compose stack and the Helm chart — no separate installation is needed.

### Realm & users

| Realm | `devops` |
|---|---|
| Admin user | `admin` / `admin123` locally (roles: `admin`, `member`) |
| Regular user | `user` / `user123` locally (role: `member`) |

Passwords shown are the local-dev defaults from [`infra/.env.example`](infra/.env.example). On the VM and Kubernetes they come from the `KEYCLOAK_REALM_ADMIN_PASSWORD`/`KEYCLOAK_REALM_USER_PASSWORD` GitHub secrets instead — see [Required GitHub secrets / variables](#required-github-secrets--variables). ("Realm" distinguishes these two application-level accounts from the Keycloak server's own bootstrap console admin, `KEYCLOAK_ADMIN_PASSWORD`.) `infra/keycloak/realm-config.json` stores these as `__KEYCLOAK_REALM_ADMIN_PASSWORD__`/`__KEYCLOAK_REALM_USER_PASSWORD__` placeholders, substituted at container start (Compose) or chart render (Helm).

### Clients

| Client | Type | Used by |
|---|---|---|
| `devops-client` | public, PKCE S256 | React frontend |
| `traefik-forward-auth` | confidential | Traefik forward-auth middleware |
| `grafana` | confidential | Grafana's own generic-OAuth login (admin-only, see [Monitoring](#monitoring)) |
| `org-role-sync` | confidential, service account (`manage-users`/`view-clients`) | organization-service and member-service, to call the Keycloak Admin REST API |

The three confidential clients' secrets are local-dev defaults from `infra/.env.example` (matching what's committed in `infra/keycloak/realm-config.json`'s `__KEYCLOAK_ADMIN_CLIENT_SECRET__`/`__FORWARD_AUTH_CLIENT_SECRET__`/`__GRAFANA_OAUTH_CLIENT_SECRET__` placeholders); on the VM and Kubernetes they come from the `KEYCLOAK_ADMIN_CLIENT_SECRET`/`FORWARD_AUTH_CLIENT_SECRET`/`GRAFANA_OAUTH_CLIENT_SECRET` GitHub secrets — see [Required GitHub secrets / variables](#required-github-secrets--variables).

### Local login

When running with Docker Compose, Keycloak is available at <http://localhost:8081/auth>. The realm is auto-imported on first start from [`infra/keycloak/realm-config.json`](infra/keycloak/realm-config.json).

The web client redirects to Keycloak automatically (`login-required` strategy). Log in with any of the test users above.

### Production admin console

Keycloak is publicly accessible via Traefik at <https://team-devoops.polandcentral.cloudapp.azure.com/auth>. Admin console: `/auth/admin`.

### Spring services — JWT validation

Each Spring service is a stateless OAuth2 resource server. It validates Bearer JWTs against Keycloak's JWK set and extracts roles from the `realm_access.roles` claim, mapping them to Spring `ROLE_*` authorities (e.g. `"admin"` → `ROLE_admin`).

| Property | Purpose |
|---|---|
| `spring.security.oauth2.resourceserver.jwt.issuer-uri` | Validates the `iss` claim in incoming JWTs |
| `spring.security.oauth2.resourceserver.jwt.jwk-set-uri` | URL to fetch Keycloak's public signing keys |

These are set in each service's `src/main/resources/application.properties` as defaults (pointing at the local Keycloak on `localhost:8081/auth`). On the Azure VM, `docker-compose.yml` overrides `SPRING_SECURITY_OAUTH2_RESOURCESERVER_JWT_ISSUER_URI` with the public HTTPS issuer so it matches the `iss` claim in tokens issued by production Keycloak. The JWK set URI always uses the internal Docker hostname `http://keycloak:8080/auth/realms/devops/protocol/openid-connect/certs`. On Kubernetes they are injected via the `env:` block in `infra/helm/team-devoops/values.yaml` using the internal `keycloak` ClusterIP DNS name.

## Monitoring

Monitoring runs in **all three environments** (local, Azure VM, and the
Kubernetes cluster) from the same underlying config.

**Prometheus** scrapes request count, latency, and error-rate metrics from
every Spring service (`/actuator/prometheus`, via Micrometer), the GenAI
service (`/metrics`, via `prometheus-flask-exporter`), Keycloak (`/metrics` on
its management port, `KC_METRICS_ENABLED=true`), and Traefik itself
(edge-level metrics; Kubernetes uses the cluster's own nginx ingress instead of
Traefik, so this one is compose-only). Scrape targets are statically
configured in [`infra/prometheus/prometheus.yml`](infra/prometheus/prometheus.yml)
— the same file is used unchanged across all three environments, since
Docker Compose service names and Kubernetes Service names are identical
strings and both resolve the same way. Prometheus itself is never exposed
outside the internal network/cluster in any environment.

**Grafana** visualizes these metrics and is reachable at `/dashboard`
(`http://localhost/dashboard` locally, `https://team-devoops.polandcentral.cloudapp.azure.com/dashboard`
on the Azure VM, `https://ge83mom-devops26.stud.k8s.aet.cit.tum.de/dashboard`
on Kubernetes). Dashboards and datasources are provisioned as code from
[`infra/grafana/`](infra/grafana/) — nothing is configured by hand in the
running instance.

Grafana is **admin-only**: it authenticates exclusively through its own
Keycloak generic-OAuth login (client `grafana`, no local username/password
form). `GF_AUTH_GENERIC_OAUTH_ROLE_ATTRIBUTE_PATH` maps the realm `admin`
role to Grafana's `Admin` org role and everything else to an empty string;
combined with `GF_AUTH_GENERIC_OAUTH_ROLE_ATTRIBUTE_STRICT=true`, logging in
with any account that doesn't hold the `admin` realm role is rejected
outright. (Mapping the non-admin branch to the literal string `"None"`
instead does *not* reject the login — verified locally: Grafana treats
`"None"` as a real, if content-less, org role and still creates a session;
only an empty string actually triggers `role_attribute_strict`'s rejection.)
Prometheus itself is never routed through Traefik/ingress at all, so it has
no login of its own to configure.

Three dashboards ship out of the box ([`infra/grafana/dashboards/`](infra/grafana/dashboards/)):

| Dashboard | Covers |
|---|---|
| `service-overview.json` | Request rate, p95 latency, and error rate per Spring service (dropdown to filter), plus up/down status, Keycloak login rate, and letters sent/generated |
| `genai-service.json` | Request rate, p95 latency, and error rate for the GenAI service, plus RAG query rate/latency and report-generation rate by kind/status, each broken out by LLM provider (OpenAI vs. local Ollama) |
| `logs.json` | Centralized logs from every service (Loki), filterable by container, plus a log-volume graph |

Beyond the generic per-request metrics above, a few **business-level custom
metrics** are tracked so the dashboards reflect what the system is actually
doing, not just HTTP noise:

| Metric | Service | What it shows |
|---|---|---|
| `letters_sent_total{status}` | letter-service | Actual mail delivery outcomes — ties directly to the mail credentials/health-check work above |
| `letters_generated_total` | letter-service | PDF letters generated |
| `genai_rag_queries_total{status,provider}`, `genai_rag_query_duration_seconds{provider}` | py-genai-helper | RAG question-answering usage and latency, split by OpenAI vs. local Ollama |
| `genai_report_generation_total{kind,status,provider}` | py-genai-helper | Member/team AI report generation attempts, split by OpenAI vs. local Ollama |
| `http_server_requests_seconds_count{job="keycloak", uri=".../protocol/openid-connect/token"}` | Keycloak | Login rate — Keycloak already exposes Micrometer-style HTTP metrics on its management port (`KC_METRICS_ENABLED=true`), reused as-is rather than building a separate login-tracking mechanism |

Two alert rules are provisioned in Grafana's unified alerting
([`infra/grafana/provisioning/alerting/rules.yaml`](infra/grafana/provisioning/alerting/rules.yaml))
and surface directly in the Grafana UI/dashboards — no notification
channel is configured, by design:

- **Service down** — any scraped target reporting `up == 0` for 1 minute
- **High p95 latency** — a Spring service's p95 request latency above 1s for 5 minutes

### Log aggregation

**Loki** centralizes logs from every container/pod, browsable and searchable
in Grafana's `logs.json` dashboard (or Grafana's Explore view) instead of
`docker logs`/`kubectl logs` one container at a time. Same three-environment
scope as everything else above, with **Grafana Alloy** as the log shipper —
but the shipping mechanism deliberately differs by environment:

- **Local/VM**: Alloy uses `discovery.docker` + `loki.source.docker`
  ([`infra/alloy/config.alloy`](infra/alloy/config.alloy)), reading every
  container's logs via the Docker socket.
- **Kubernetes**: Alloy uses `loki.source.kubernetes`
  ([`infra/helm/team-devoops/files/alloy-config.alloy`](infra/helm/team-devoops/files/alloy-config.alloy)),
  which fetches pod logs **through the Kubernetes API** (the `pods/log`
  subresource) rather than reading node-local log files. This is a deliberate
  choice, not the more common Promtail-as-DaemonSet setup: a DaemonSet reading
  `/var/log/pods` via hostPath needs a `ClusterRole` and would also be able to
  read *every other team's* pod logs on the same shared node — neither is
  appropriate (or, for the `ClusterRole` part, even possible: verified against
  the actual cluster that this identity can create namespaced `Role`/
  `RoleBinding` but not `ClusterRole`/`ClusterRoleBinding`). Alloy instead runs
  as a plain namespace-scoped `Deployment` with a `Role` granting only
  `list pods` / `get pods/log` inside `ge83mom-devops26`.

Both variants need explicit relabeling (`discovery.relabel`) to turn
`__meta_docker_container_name` / `__meta_kubernetes_pod_name` into real
`container`/`pod` log labels — without it, every container's logs land in one
indistinguishable `service_name="unknown_service"` stream, which was caught
by actually querying Loki's label set while testing, not by inspection.

## Docs

- [Problem Statement](docs/problem-statement.md)
- [System Architecture](docs/system-architecture.md)
- [Backlog](docs/backlog.md)
