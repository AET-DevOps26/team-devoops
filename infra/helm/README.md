# team-devoops Helm chart

Umbrella chart that deploys the whole team-devoops platform (6 Spring services,
`py-genai-helper`, `web-client`, `api-docs`, and an in-cluster Postgres) to the
TUM RKE2 cluster. This is the Kubernetes deployment path.

## Layout

```
infra/helm/team-devoops/
  Chart.yaml
  values.yaml                 # global image/ingress/db config + service catalogue
  templates/
    _helpers.tpl              # naming/label/image helpers
    deployment.yaml           # generic Deployment rendered per service
    service.yaml              # generic ClusterIP Service rendered per service
    hpa.yaml                  # generic HorizontalPodAutoscaler, one per service
                               #  with autoscaling.enabled -- see "Autoscaling" below
    ingress.yaml              # nginx ingress (prefix-strip + plain rules)
    configmap-db.yaml         # SPRING_DATASOURCE_URL/USERNAME
    secret-db.yaml            # SPRING_DATASOURCE_PASSWORD / POSTGRES_PASSWORD
    postgres-statefulset.yaml # Postgres + PVC (cluster default StorageClass)
    postgres-service.yaml
    prometheus-deployment.yaml # Prometheus + PVC (scrape config from a ConfigMap
    prometheus-service.yaml    #  created out-of-band, see "Monitoring" below)
    prometheus-pvc.yaml
    grafana-deployment.yaml    # Grafana + PVC (dashboards/datasources/alerting
    grafana-service.yaml       #  from ConfigMaps created out-of-band)
    grafana-pvc.yaml
    loki-deployment.yaml       # Loki + PVC (config from a ConfigMap created
    loki-service.yaml          #  out-of-band, same as prometheus-config)
    loki-pvc.yaml
    alloy-deployment.yaml      # Log shipper -- fetches pod logs via the k8s API
    alloy-configmap.yaml       #  (loki.source.kubernetes), not a DaemonSet/hostPath;
    alloy-rbac.yaml            #  config embedded via .Files.Get (k8s-specific, not
                                #  shared with docker-compose, so no out-of-band step)
    ollama-deployment.yaml     # Local LLM backend for py-genai-helper + PVC (entrypoint
    ollama-service.yaml        #  script from a ConfigMap created out-of-band, same as
    ollama-pvc.yaml            #  prometheus-config -- see "Local LLM" below)
```

The `api-docs` (Swagger UI) image is built from [api/Dockerfile](../../api/Dockerfile),
which bakes `api/openapi.yaml` into the image — no runtime ConfigMap/volume needed.

## Target environment

| Setting        | Value                                              |
| -------------- | -------------------------------------------------- |
| Namespace      | `ge83mom-devops26`                                 |
| Host           | `ge83mom-devops26.stud.k8s.aet.cit.tum.de`         |
| Ingress class  | `nginx` (override `ingress.className` if different)|
| StorageClass   | cluster default `csi-rbd-sc` (leave empty in values)|
| Image registry | `ghcr.io/aet-devops26/team-devoops/<service>`      |

## One-time setup

### 1. py-genai-helper environment Secret

The chart references (but does not create) a Secret named `genai-env` for the
GenAI helper. The `deploy-k8s` pipeline job creates/refreshes it automatically
from the `GENAI_ENV_CONTENT` GitHub secret. For a manual deploy, create it from
the same `.env` used by docker compose:

```bash
kubectl -n ge83mom-devops26 create secret generic genai-env \
  --from-env-file=services/py-genai-helper/.env
```

### 2. spring-letter environment Secret

Same pattern, for the letter service's mail credentials. The chart
references (but does not create) a Secret named `letter-env`. The
`deploy-k8s` pipeline job creates/refreshes it automatically from the
`LETTER_ENV_CONTENT` GitHub secret. For a manual deploy:

```bash
kubectl -n ge83mom-devops26 create secret generic letter-env \
  --from-env-file=services/spring-letter/.env
```

### 3. ghcr image pull secret

The service images are pushed to ghcr as private packages, so the chart is
preconfigured to pull them via an `imagePullSecrets` entry named `ghcr-pull`
(see `global.imagePullSecrets` in `values.yaml`). Create that secret once in the
namespace with a GitHub PAT that has the `read:packages` scope:

```bash
kubectl -n ge83mom-devops26 create secret docker-registry ghcr-pull \
  --docker-server=ghcr.io \
  --docker-username=<github-user> \
  --docker-password=<PAT-with-read:packages>
```

If you instead make the org packages public, remove (or empty)
`global.imagePullSecrets` in `values.yaml`.

### 4. Keycloak

The chart creates the `keycloak-credentials` Secret automatically from `values.yaml` — no manual `kubectl create secret` step is needed.

To use non-default passwords, pass them at deploy time:

```bash
helm upgrade --install team-devoops infra/helm/team-devoops \
  --namespace ge83mom-devops26 \
  --set keycloak.adminPassword=<secure-password> \
  --set keycloak.db.password=<secure-db-password>
```

> **First-deploy note:** Keycloak takes ~90 seconds to become ready (readiness probe: HTTP GET `/auth/health/ready`, `initialDelaySeconds: 90`). If `helm upgrade --wait` times out on a cold cluster, re-run once the pod is `Running`.

The realm (`devops`) and all users/clients are auto-imported on first start from `infra/helm/team-devoops/files/realm-config.json` via the `--import-realm` flag.

Validate:

```bash
kubectl -n ge83mom-devops26 get pods | grep keycloak
# keycloak-xxxx        1/1  Running
# keycloak-database-0  1/1  Running

curl https://ge83mom-devops26.stud.k8s.aet.cit.tum.de/auth/realms/devops/.well-known/openid-configuration
```

### 5. Keycloak login theme

The Roost login theme (`infra/keycloak/themes/roost/`) is referenced by the realm config
(`"loginTheme": "roost"`) but, like the ConfigMaps above, has to be loaded into the cluster
out-of-band — Helm can't reach outside its own chart directory via `.Files.Get`, and unlike
the flat directories used for monitoring config, the theme has nested subdirectories
(`login/resources/{css,fonts,img}/`) that a single `kubectl create configmap --from-file=<dir>`
can't hold (it only picks up files directly inside that directory, silently dropping
subdirectories). Each subdirectory gets its own ConfigMap, and the chart's `keycloak`
Deployment stitches them back into the theme's real directory layout via a projected volume.
The `deploy-k8s` pipeline job creates/refreshes these automatically; for a manual deploy:

```bash
kubectl -n ge83mom-devops26 create configmap keycloak-theme-root \
  --from-file=infra/keycloak/themes/roost/login/template.ftl \
  --from-file=infra/keycloak/themes/roost/login/theme.properties
kubectl -n ge83mom-devops26 create configmap keycloak-theme-css \
  --from-file=infra/keycloak/themes/roost/login/resources/css
kubectl -n ge83mom-devops26 create configmap keycloak-theme-fonts \
  --from-file=infra/keycloak/themes/roost/login/resources/fonts
kubectl -n ge83mom-devops26 create configmap keycloak-theme-img \
  --from-file=infra/keycloak/themes/roost/login/resources/img
```

> **Existing realm note:** like all realm-config.json changes, this only takes effect via
> `--import-realm` on a realm that doesn't already exist. If the cluster's `devops` realm
> predates this change, Keycloak silently skips reimporting it — patch the running realm
> directly instead: `kubectl -n ge83mom-devops26 exec deploy/keycloak -- sh -c '/opt/keycloak/bin/kcadm.sh config credentials --server http://localhost:8080/auth --realm master --user admin --password admin && /opt/keycloak/bin/kcadm.sh update realms/devops -s loginTheme=roost'`

### 6. Monitoring (Prometheus + Grafana)

Same pattern as `genai-env`: the chart only references these ConfigMaps by
name (Helm can't reach outside its own chart directory via `.Files.Get`), so
the `deploy-k8s` pipeline job creates/refreshes them automatically from the
canonical files in `infra/prometheus/` and `infra/grafana/` — the same ones
docker-compose bind-mounts. For a manual deploy, create them the same way:

```bash
kubectl -n ge83mom-devops26 create configmap prometheus-config \
  --from-file=infra/prometheus/prometheus.yml
kubectl -n ge83mom-devops26 create configmap loki-config \
  --from-file=infra/loki/loki-config.yaml
kubectl -n ge83mom-devops26 create configmap grafana-datasources \
  --from-file=infra/grafana/provisioning/datasources
kubectl -n ge83mom-devops26 create configmap grafana-dashboard-providers \
  --from-file=infra/grafana/provisioning/dashboards
kubectl -n ge83mom-devops26 create configmap grafana-alerting \
  --from-file=infra/grafana/provisioning/alerting
kubectl -n ge83mom-devops26 create configmap grafana-dashboards \
  --from-file=infra/grafana/dashboards
```

Grafana is admin-only: it authenticates through its own Keycloak client
(`grafana`, auto-imported with the realm above), not through `oauth2-proxy`.
Only the realm `admin` role maps to Grafana's `Admin` org role
(`GF_AUTH_GENERIC_OAUTH_ROLE_ATTRIBUTE_STRICT=true` rejects login for
anyone else). Prometheus and Loki are never routed through the ingress at all.

**Alloy** (log shipper) needs no manual setup — unlike Prometheus/Loki's
config, `files/alloy-config.alloy` is Kubernetes-specific (not shared with
docker-compose), so it's embedded straight into a ConfigMap via `.Files.Get`
in `alloy-configmap.yaml`, the same way the Keycloak realm config is. It
authenticates to the Kubernetes API as its own `alloy` ServiceAccount, bound
to a namespaced `Role` (`list pods` / `get pods/log` only, scoped to
`ge83mom-devops26`) rather than a `ClusterRole` + DaemonSet + hostPath — this
identity cannot create `ClusterRole`/`ClusterRoleBinding` on this cluster
(verified directly), and a hostPath-based DaemonSet would also be able to
read every other team's pod logs sharing the same node regardless.

Validate:

```bash
kubectl -n ge83mom-devops26 get pods | grep -E "prometheus|grafana"
curl https://ge83mom-devops26.stud.k8s.aet.cit.tum.de/dashboard/login
```

### 6. Local LLM (Ollama)

Same out-of-band ConfigMap pattern as monitoring above: `infra/ollama/entrypoint_ollama.sh`
is shared with docker-compose, so it's loaded into a `ollama-entrypoint` ConfigMap by the
`deploy-k8s` pipeline job rather than embedded via `.Files.Get`. For a manual deploy:

```bash
kubectl -n ge83mom-devops26 create configmap ollama-entrypoint \
  --from-file=infra/ollama/entrypoint_ollama.sh
```

`py-genai-helper` reaches it via `OLLAMA_BASE_URL=http://ollama:11434` (set in `values.yaml`,
same as docker-compose) — but `LLM_PROVIDER` itself stays at its `openai` default in every
environment, so Ollama is only used per-request via the `uselocal` field on the report
generation endpoints (see `services/py-genai-helper/README.md`). Ollama is never routed
through the ingress; it's reachable in-cluster only.

Resource limits for a handful of otherwise-idle services (Prometheus, Loki, Grafana, Alloy,
the Keycloak database, `py-genai-helper`, `web-client`, `api-docs`) were trimmed down closer
to their actual measured usage to make room for Ollama's ~1Gi memory footprint within the
namespace's fixed `limits.memory: 6Gi` quota — see the comments next to each in `values.yaml`.

Validate:

```bash
kubectl -n ge83mom-devops26 get pods | grep ollama
kubectl -n ge83mom-devops26 exec deploy/ollama -- ollama list
```

## Autoscaling & self-healing

Every app service (the 6 Spring services, `py-genai-helper`, `web-client`,
`api-docs`) gets a `HorizontalPodAutoscaler` (`templates/hpa.yaml`), driven by
CPU utilization against each service's `resources.requests.cpu` — the
in-cluster metrics-server (`v1beta1.metrics.k8s.io`) is already installed and
working on this cluster. Config lives per-service under `autoscaling:` in
`values.yaml` (`enabled`, `minReplicas`, `maxReplicas`,
`targetCPUUtilizationPercentage`); Postgres, Keycloak, Ollama and the
monitoring stack are rendered from their own templates and intentionally have
no HPA — they're stateful or singleton and shouldn't scale out.

When a service has `autoscaling.enabled: true`, `templates/deployment.yaml`
omits `spec.replicas` entirely instead of pinning it to `1` — pinning it would
make every `helm upgrade` (which runs on every push to `main`) reset the
replica count and fight the HPA's own scaling decisions.

**Quota caveat:** the namespace's `ResourceQuota` (`limits.cpu: 4`,
`limits.memory: 6Gi`) is committed almost in full just running one replica of
everything (`kubectl get resourcequota -n ge83mom-devops26` typically shows
~90%+ used on both). An HPA scale-up that the quota can't fit simply leaves
the extra pod `Pending` — it does not affect the already-running replica or
any other service. `kubectl get hpa -n ge83mom-devops26` shows current
`TARGETS`/replica counts; `<unknown>` in the `TARGETS` column means
metrics-server isn't being reached for that resource, not that it's idle.

Self-healing beyond autoscaling is native to Kubernetes and needs no extra
component here: every service with a `health:` path gets startup, readiness,
and liveness probes (`templates/deployment.yaml`), so the kubelet restarts a
container that stops responding, and the ReplicaSet controller replaces any
pod that's deleted or evicted. `helm upgrade --rollback-on-failure` (used by
the `deploy-k8s` pipeline job) adds deployment-level self-healing on top —
a rollout that never becomes healthy is rolled back automatically.

## Manual deploy

```bash
# 1. Point kubectl/helm at the cluster
export KUBECONFIG=~/.kube/config   # the Rancher token kubeconfig

# 2. Deploy / upgrade
helm upgrade --install team-devoops infra/helm/team-devoops \
  --namespace ge83mom-devops26 \
  --set global.image.tag=<git-sha> \
  --wait --timeout 5m
```

## Validate

```bash
helm lint infra/helm/team-devoops
helm template team-devoops infra/helm/team-devoops | less

kubectl -n ge83mom-devops26 get pods
kubectl -n ge83mom-devops26 get ingress -o wide   # ADDRESS should populate

curl https://ge83mom-devops26.stud.k8s.aet.cit.tum.de/api/v1/members
# open https://ge83mom-devops26.stud.k8s.aet.cit.tum.de/docs and /
```

## Pipeline integration

On pull requests, `.github/workflows/ci.yml` runs a `helm-validate` job that
lints the chart, renders the templates, and validates the rendered manifests
against the Kubernetes schemas with `kubeconform`.

`.github/workflows/cd.yml` runs on push to `main`:

- **deploy** — existing Azure VM deploy via Ansible (unchanged).
- **docker-push** then **deploy-k8s** — builds & pushes all images to ghcr, then
  runs the `helm upgrade` above with `global.image.tag=<git-sha>`.

Required GitHub secrets: `KUBECONFIG` (the Rancher kubeconfig), `GENAI_ENV_CONTENT`
and `LETTER_ENV_CONTENT` (both reused from the VM deploy). ghcr auth uses the
built-in `GITHUB_TOKEN`.

## Adding a service

Add an entry under `services:` in `values.yaml`:

```yaml
services:
  my-service:
    path: /api/v1/mine
    port: 8080
    db: true            # inject SPRING_DATASOURCE_* (ConfigMap + Secret)
    health: /actuator/health
    stripPrefix: true   # strip the path prefix before forwarding
```

`stripPrefix: true` strips only the shared `/api/v1` prefix, forwarding the rest
as-is — this is what every OpenAPI-generated Spring controller expects, since
they keep their own service name in the mapped path (e.g. `MembersApi` maps
`/members`, `OrganizationApi` maps `/organization/teams`). Only add
`fullStrip: true` alongside it if your service's own routes carry no name
segment at all (like `py-genai-helper`'s bare Flask routes, e.g. `/reports/...`) —
that strips the whole `/api/v1/<name>` prefix instead. Getting this wrong means
every request 404s once it reaches the backend, since the path arriving at the
app won't match any of its routes.

No template changes are needed.
