# CI/CD

Detailed companion to the [README's CI/CD section](../README.md#cicd): every job, what gates a merge, and the full secrets/variables inventory.

## CI — `.github/workflows/ci.yml`

Runs on every pull request (plus manual `workflow_dispatch`). All jobs below feed into a single required `ci-success` aggregate job — branch protection only needs to require that one check.

| Job | What it does |
|---|---|
| `organization-service`, `member-service`, `event-service`, `feedback-service`, `finance-service`, `letter-service` | Per Spring service: Checkstyle lint, then `./gradlew build` (compiles + runs JUnit tests); test reports uploaded as artifacts |
| `py-genai-helper` | `ruff check .` then `pytest -q` |
| `web-client` | Only runs if `web-client/**` changed (path filter via `dorny/paths-filter`) — `pnpm typecheck`, `pnpm lint`, `pnpm test:coverage`, `pnpm build`; coverage report uploaded as an artifact |
| `docker-build` | Whole-system `docker compose -f infra/docker-compose.yml build`, then verifies every expected image tag actually exists — catches Dockerfile/compose drift that per-service builds wouldn't |
| `codeql` | CodeQL SAST across `java-kotlin`, `python`, and `javascript-typescript` (matrix), `security-extended` query pack |
| `openapi-lint` | Spectral lint of `api/openapi.yaml` |
| `helm-validate` | `helm lint`, `helm template`, then schema-validates the rendered manifests with `kubeconform -strict` |

## CD — `.github/workflows/cd.yml`

Runs on every push to `main` (plus manual `workflow_dispatch`). Two deploy targets run in parallel:

| Job | What it does |
|---|---|
| `deploy` (Ansible) | Writes the SSH key and three `.env` files from secrets — `infra/.env` (Postgres + Keycloak passwords and client secrets, for `docker-compose.yml`), `services/py-genai-helper/.env`, `services/spring-letter/.env` — builds a one-host inventory from the `VM_HOST` secret, runs `infra/ansible/playbook.yml` against the Azure VM |
| `docker-push` | Matrix build: all 6 Spring services + `py-genai-helper` + `web-client` + `api-docs`, pushed to `ghcr.io/<repo>/<service>:{sha,latest}` with BuildKit's GitHub Actions cache backend (`type=gha`, scoped per service) |
| `deploy-k8s` | Writes the kubeconfig from a secret, refreshes several ConfigMaps/Secrets that the Helm chart references but doesn't own (monitoring config, Keycloak theme, per-service env files — see [`infra/helm/README.md`](../infra/helm/README.md)), clears any stuck Helm release lock, then `helm upgrade --install --rollback-on-failure --timeout 15m` passing every database/Keycloak/client secret individually via `--set` (see table below) |

`deploy-k8s` depends on `docker-push` (Kubernetes pulls prebuilt images from ghcr, unlike the VM which builds locally via Ansible/Compose).

## Required GitHub secrets / variables

| Kind | Name | Used by | Purpose |
|---|---|---|---|
| Variable | `AZURE_CLIENT_ID` | `infra.yml` | OIDC app registration (Service Principal) |
| Variable | `AZURE_TENANT_ID` | `infra.yml` | Azure AD tenant |
| Variable | `AZURE_SUBSCRIPTION_ID` | `infra.yml` | Target subscription |
| Secret | `VM_SSH_PUBLIC_KEY` | `infra.yml` | Public key planted on the VM by Terraform |
| Secret | `SSH_PRIVATE_KEY` | `cd.yml` (`deploy`) | Matching private key for Ansible to SSH in |
| Secret | `VM_HOST` | `cd.yml` (`deploy`) | Ansible inventory host — the VM's FQDN |
| Secret | `GENAI_ENV_CONTENT` | `cd.yml` (`deploy`, `deploy-k8s`) | Contents of `services/py-genai-helper/.env` |
| Secret | `LETTER_ENV_CONTENT` | `cd.yml` (`deploy`, `deploy-k8s`) | Contents of `services/spring-letter/.env` (mail credentials) |
| Secret | `KUBECONFIG` | `cd.yml` (`deploy-k8s`) | Kubeconfig for the RKE2 cluster |
| Secret | `DB_ADMIN_PASSWORD` | `cd.yml` (`deploy`, `deploy-k8s`) | Shared Postgres admin (`app_admin`) password. VM: written into `infra/.env` as `POSTGRES_PASSWORD`. K8s: Helm `--set database.password` |
| Secret | `DB_ORGANIZATION_PASSWORD` | `cd.yml` (`deploy`, `deploy-k8s`) | `organization_user` DB password. VM: `ORGANIZATION_DB_PASSWORD`. K8s: `--set database.users.organization.password` |
| Secret | `DB_MEMBER_PASSWORD` | `cd.yml` (`deploy`, `deploy-k8s`) | `member_user` DB password. VM: `MEMBER_DB_PASSWORD`. K8s: `--set database.users.member.password` |
| Secret | `DB_EVENT_PASSWORD` | `cd.yml` (`deploy`, `deploy-k8s`) | `event_user` DB password. VM: `EVENT_DB_PASSWORD`. K8s: `--set database.users.event.password` |
| Secret | `DB_FEEDBACK_PASSWORD` | `cd.yml` (`deploy`, `deploy-k8s`) | `feedback_user` DB password. VM: `FEEDBACK_DB_PASSWORD`. K8s: `--set database.users.feedback.password` |
| Secret | `DB_FINANCE_PASSWORD` | `cd.yml` (`deploy`, `deploy-k8s`) | `finance_user` DB password. VM: `FINANCE_DB_PASSWORD`. K8s: `--set database.users.finance.password` |
| Secret | `DB_LETTER_PASSWORD` | `cd.yml` (`deploy`, `deploy-k8s`) | `letter_user` DB password. VM: `LETTER_DB_PASSWORD`. K8s: `--set database.users.letter.password` |
| Secret | `DB_REPORTS_PASSWORD` | `cd.yml` (`deploy`, `deploy-k8s`) | `reports_user` DB password. VM: `REPORTS_DB_PASSWORD`. K8s: `--set database.users.reports.password` |
| Secret | `KEYCLOAK_ADMIN_PASSWORD` | `cd.yml` (`deploy`, `deploy-k8s`) | Keycloak's own bootstrap console admin password. VM: `KEYCLOAK_ADMIN_PASSWORD`. K8s: `--set keycloak.adminPassword` |
| Secret | `KEYCLOAK_DB_PASSWORD` | `cd.yml` (`deploy`, `deploy-k8s`) | Keycloak's own Postgres password. VM: `KEYCLOAK_DB_PASSWORD`. K8s: `--set keycloak.db.password` |
| Secret | `KEYCLOAK_REALM_ADMIN_PASSWORD` | `cd.yml` (`deploy`, `deploy-k8s`) | Password for the seeded realm user `admin` (an application-level account, distinct from the Keycloak console admin above). VM: `KEYCLOAK_REALM_ADMIN_PASSWORD`. K8s: `--set keycloak.users.admin.password` |
| Secret | `KEYCLOAK_REALM_USER_PASSWORD` | `cd.yml` (`deploy`, `deploy-k8s`) | Password for the seeded realm user `user`. VM: `KEYCLOAK_REALM_USER_PASSWORD`. K8s: `--set keycloak.users.user.password` |
| Secret | `KEYCLOAK_ADMIN_CLIENT_SECRET` | `cd.yml` (`deploy`, `deploy-k8s`) | Secret for the `org-role-sync` Keycloak service-account client, used by **both** organization-service and member-service to call the Keycloak Admin REST API. VM: `KEYCLOAK_ADMIN_CLIENT_SECRET`. K8s: `--set` on both `services.organization-service.env.KEYCLOAK_ADMIN_CLIENT_SECRET` and `services.member-service.env.KEYCLOAK_SERVICE_ACCOUNT_CLIENT_SECRET` (same value, two consumers) |
| Secret | `FORWARD_AUTH_CLIENT_SECRET` | `cd.yml` (`deploy`, `deploy-k8s`) | Secret for the `traefik-forward-auth` Keycloak client. VM: `FORWARD_AUTH_CLIENT_SECRET`. K8s: `--set forwardAuth.clientSecret` |
| Secret | `FORWARD_AUTH_COOKIE_SECRET` | `cd.yml` (`deploy`, `deploy-k8s`) | Session-cookie signing secret for the forward-auth middleware. VM: `FORWARD_AUTH_COOKIE_SECRET`. K8s: `--set forwardAuth.cookieSecret` |
| Secret | `GRAFANA_OAUTH_CLIENT_SECRET` | `cd.yml` (`deploy`, `deploy-k8s`) | Secret for the `grafana` Keycloak client (Grafana's own generic-OAuth login). VM: `GRAFANA_OAUTH_CLIENT_SECRET`. K8s: `--set monitoring.grafana.oauthClientSecret` |
| Built-in | `GITHUB_TOKEN` | `cd.yml` (`docker-push`) | ghcr push auth (`packages: write` permission) |

Each of the 16 password/secret entries above (`DB_ADMIN_PASSWORD` through `GRAFANA_OAUTH_CLIENT_SECRET`) is the single source of truth for that value across **both** deploy targets — nothing is hardcoded in `docker-compose.yml`, `infra/keycloak/realm-config.json` (templated with `__PLACEHOLDER__` tokens, substituted at container start), or the Helm chart's `values.yaml` (which ships `CHANGE_ME_*` placeholders, meant to be overridden, never deployed as-is). For local development, copy [`infra/.env.example`](../infra/.env.example) to `infra/.env` — it documents which local value maps to which GitHub secret.

The Azure OIDC service principal needs `Contributor` on the subscription and `Storage Blob Data Contributor` on the `stdevoops26tfstate` state account. No long-lived Azure client secret is stored anywhere — auth is federated via OIDC.
