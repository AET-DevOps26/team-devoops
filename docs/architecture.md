# Architecture

This is the detailed companion to the [README's Architecture section](../README.md#architecture): per-service responsibilities, who calls whom, and how a request is authenticated end to end. There is deliberately no UML diagram here — see [`docs/outdated/`](outdated/) for why the previous ones were retired.

## Subsystems

### Client — `web-client`

A React 19 + TypeScript SPA (Vite). It is the only subsystem with a UI, and it talks to **every** backend service directly over REST through the reverse proxy — there is no backend-for-frontend or API gateway aggregation layer. Each feature area (members, events, feedback, finance, letters, organization, the GenAI helper) has its own typed API client generated from `api/openapi.yaml`.

Auth: `keycloak-js` (PKCE S256) obtains a JWT from Keycloak; an Axios request interceptor attaches it as `Authorization: Bearer <token>` and refreshes it proactively when it's within 30s of expiry.

### Server — six Spring Boot 3 microservices

| Service | Owns | Notes |
|---|---|---|
| Organization | sports, teams, role assignment | Also calls the Keycloak Admin REST API directly (`KeycloakRoleService`) to keep realm role assignments in sync with team/role changes made in-app |
| Member | member profiles | Also calls the Keycloak Admin REST API (`KeycloakService`) for the same reason |
| Event | training sessions, enrollment, attendance | |
| Feedback | trainer feedback, progress notes | Read by the GenAI service (see below) |
| Finance | one-time/recurring billing | |
| Letter | PDF/email generation from templates | The only Spring service with no database — templates and generated artifacts are not persisted as domain rows |

Each service is a stateless OAuth2 resource server: it validates the incoming Bearer JWT against Keycloak's JWK set and maps `realm_access.roles` claims to Spring `ROLE_*` authorities. None of the six call each other directly — the only cross-service traffic on the server side is organization/member → Keycloak (role sync) and GenAI → feedback (below).

Organization-service and member-service both authenticate to the Keycloak Admin REST API as the same confidential client, `org-role-sync` (service-account/client-credentials grant — see [Proxy & Auth](#proxy--auth-traefik--nginx-ingress--keycloak) below). Neither hardcodes its secret; both read it from an env var (`KEYCLOAK_ADMIN_CLIENT_SECRET` / `KEYCLOAK_SERVICE_ACCOUNT_CLIENT_SECRET` respectively) sourced from the same GitHub secret in every deploy target — see [docs/cicd.md](cicd.md).

### GenAI — `py-genai-helper`

A Python 3.12 / Flask service using LangChain. Unlike the Spring services, it is a REST **client** as well as a server:

- It calls **feedback-service** (`GET /feedback`, Bearer-forwarded) to pull the data it summarizes when generating a member/team report.
- It calls **either OpenAI or a local Ollama instance** to run inference, selected per-request via the `uselocal` field on the report-generation endpoints (not a global config flag) — the web client exposes this as the "Use local LLM" toggle on the helper page.
- RAG question-answering persists uploaded documents in a **Chroma** vector store (a PVC-backed directory in Kubernetes, a bind-mounted volume elsewhere) rather than PostgreSQL.

### Database — PostgreSQL

Single instance, schema-per-service, documented in the [README's Database section](../README.md#database). No service reads another service's schema directly; cross-schema foreign keys exist (e.g. `event.events.creator_id → member.members.id`) but are enforced by the database, not queried across services.

### Proxy & Auth — Traefik / nginx ingress + Keycloak

- **Docker Compose / Azure VM**: Traefik terminates TLS (Let's Encrypt on the VM), applies a `forward-auth` middleware backed by its own confidential Keycloak client (session-cookie based, separate from the app-level Bearer tokens below), and strips path prefixes before forwarding to each service.
- **Kubernetes**: the cluster's own nginx ingress does the prefix-stripping and routing instead of Traefik; TLS is handled at the cluster edge.
- **Keycloak** (realm `devops`) is the single OIDC provider in every environment. Four confidential/public clients exist: `devops-client` (public, PKCE — the React app), `traefik-forward-auth` (confidential — gates the browser session at the proxy), `grafana` (confidential — Grafana's own admin-only OAuth login), and `org-role-sync` (confidential, service account only, no browser flow — organization-service and member-service's Admin REST API client, see above). None of the three confidential clients' secrets is hardcoded: each is templated as a `__PLACEHOLDER__` in `infra/keycloak/realm-config.json`, substituted at container start (Compose/VM) or chart render (Helm) from the matching GitHub secret — see [docs/cicd.md](cicd.md).

## Request lifecycle (example: loading the members page)

1. Browser requests `/` → proxy's forward-auth middleware checks for a session cookie; none yet → redirected through Keycloak's login page → cookie set on success.
2. `web-client` (now loaded) separately obtains its own JWT via `keycloak-js`, independent of the forward-auth session cookie above — these are two different auth mechanisms layered on the same Keycloak realm, not one shared session.
3. `web-client` calls `GET /api/v1/members` with `Authorization: Bearer <jwt>`.
4. Proxy strips `/api/v1` (member-service's own routes start at `/members`), forwards to `member-service`.
5. `member-service` validates the JWT against Keycloak's JWK set, maps roles, authorizes, queries its own `member` schema, returns JSON.

The GenAI report-generation flow adds one more hop: `web-client → py-genai-helper → feedback-service` (step 3 becomes two REST calls instead of one, with the same Bearer token forwarded along), plus an out-of-band call from `py-genai-helper` to OpenAI or Ollama that never passes through the proxy.

## Environment differences

The only things that differ between local Docker Compose, the Azure VM, and Kubernetes are: the proxy implementation (Traefik vs. nginx ingress), the JWT issuer URI each service is configured with (must match the `iss` claim of tokens actually issued by that environment's Keycloak — internal Docker hostname locally, public HTTPS URL on the VM, internal ClusterIP DNS on Kubernetes), and TLS termination. The application code and the Prometheus scrape config are identical across all three — see [docs/deployment.md](deployment.md).
