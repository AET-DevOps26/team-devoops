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
| `deploy` (Ansible) | Writes the SSH key and both `.env` files from secrets, builds a one-host inventory from the `VM_HOST` secret, runs `infra/ansible/playbook.yml` against the Azure VM |
| `docker-push` | Matrix build: all 6 Spring services + `py-genai-helper` + `web-client` + `api-docs`, pushed to `ghcr.io/<repo>/<service>:{sha,latest}` with BuildKit's GitHub Actions cache backend (`type=gha`, scoped per service) |
| `deploy-k8s` | Writes the kubeconfig from a secret, refreshes several ConfigMaps/Secrets that the Helm chart references but doesn't own (monitoring config, Keycloak theme, per-service env files — see [`infra/helm/README.md`](../infra/helm/README.md)), clears any stuck Helm release lock, then `helm upgrade --install --rollback-on-failure --timeout 15m` |

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
| Secret | `FORWARD_AUTH_COOKIE_SECRET` | `cd.yml` (`deploy-k8s`) | Session-cookie signing secret for the forward-auth middleware, passed via `--set` at deploy time |
| Built-in | `GITHUB_TOKEN` | `cd.yml` (`docker-push`) | ghcr push auth (`packages: write` permission) |

The Azure OIDC service principal needs `Contributor` on the subscription and `Storage Blob Data Contributor` on the `stdevoops26tfstate` state account. No long-lived Azure client secret is stored anywhere — auth is federated via OIDC.
