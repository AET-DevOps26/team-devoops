# Monitoring

Detailed companion to the [README's Monitoring section](../README.md#monitoring). Runs identically in all three environments (local, Azure VM, Kubernetes) from the same config — Docker Compose service names and Kubernetes Service names are the same strings and resolve the same way, so [`infra/prometheus/prometheus.yml`](../infra/prometheus/prometheus.yml) is used unchanged everywhere.

## Metrics — Prometheus

| Job | Path | Exposed via |
|---|---|---|
| `organization-service`, `member-service`, `event-service`, `feedback-service`, `finance-service`, `letter-service` | `/actuator/prometheus` | Micrometer |
| `py-genai-helper` | `/metrics` | `prometheus-flask-exporter` |
| `keycloak` | `/metrics` (management port) | `KC_METRICS_ENABLED=true` |
| `traefik` | `/metrics` | Built-in Traefik metrics (compose/VM only — Kubernetes uses the cluster's nginx ingress instead) |

Every job above yields request count, latency, and status-code histograms for free. Prometheus itself is never exposed outside the internal network/cluster in any environment.

### Business-level custom metrics

Generic per-request metrics tell you the system is *up*; these tell you it's doing its actual job:

| Metric | Service | What it shows |
|---|---|---|
| `letters_sent_total{status}` | letter-service | Actual mail delivery outcomes |
| `letters_generated_total` | letter-service | PDF letters generated |
| `genai_rag_queries_total{status,provider}`, `genai_rag_query_duration_seconds{provider}` | py-genai-helper | RAG question-answering usage/latency, split OpenAI vs. local Ollama |
| `genai_report_generation_total{kind,status,provider}` | py-genai-helper | Member/team AI report generation attempts, split by provider |
| `http_server_requests_seconds_count{job="keycloak", uri=".../protocol/openid-connect/token"}` | Keycloak | Login rate (reused from Keycloak's own Micrometer-style metrics, not a separate mechanism) |

## Dashboards — Grafana

Reachable at `/dashboard` in every environment, admin-only: authentication is exclusively via Keycloak generic-OAuth (client `grafana`), with `GF_AUTH_GENERIC_OAUTH_ROLE_ATTRIBUTE_STRICT=true` rejecting any login whose realm role doesn't map to a non-empty Grafana org role — mapping the non-admin branch to an empty string is what actually rejects the login (mapping it to the literal string `"None"` does not; verified locally). Dashboards and datasources are provisioned as code from [`infra/grafana/`](../infra/grafana/), nothing configured by hand.

| Dashboard | Covers |
|---|---|
| `service-overview.json` | Request rate, p95 latency, error rate per Spring service (dropdown filter), up/down status, Keycloak login rate, letters sent/generated |
| `genai-service.json` | Request rate, p95 latency, error rate for the GenAI service, RAG query rate/latency, report-generation rate by kind/status — each split by LLM provider |
| `logs.json` | Centralized logs from every service (via Loki), filterable by container, plus a log-volume graph |

## Alerts

Provisioned in Grafana's unified alerting ([`infra/grafana/provisioning/alerting/rules.yaml`](../infra/grafana/provisioning/alerting/rules.yaml)), surfaced directly in the Grafana UI — no external notification channel configured, by design:

- **Service down** (`service-down`) — any scraped target matching the core-services job regex reports `up == 0`, for ≥1 minute, severity `critical`.
- **High p95 latency** (`high-latency`) — `histogram_quantile(0.95, ...http_server_requests_seconds_bucket...)` exceeds 1s, for ≥5 minutes, severity `warning`.

## Log aggregation — Loki + Grafana Alloy

Centralizes logs from every container/pod so they're searchable in Grafana instead of `docker logs` / `kubectl logs` one at a time. The shipping mechanism deliberately differs by environment:

- **Local/VM**: Alloy uses `discovery.docker` + `loki.source.docker` ([`infra/alloy/config.alloy`](../infra/alloy/config.alloy)), reading every container's logs via the Docker socket.
- **Kubernetes**: Alloy uses `loki.source.kubernetes` ([`infra/helm/team-devoops/files/alloy-config.alloy`](../infra/helm/team-devoops/files/alloy-config.alloy)), fetching pod logs through the Kubernetes API (`pods/log` subresource) rather than reading node-local log files. This is deliberate, not the more common Promtail-as-DaemonSet pattern: a DaemonSet reading `/var/log/pods` via hostPath needs a `ClusterRole` and would also read every other team's pods on the same shared node — neither is appropriate (the `ClusterRole` part isn't even possible: this identity can create namespaced `Role`/`RoleBinding` but not cluster-scoped equivalents, verified against the actual cluster). Alloy instead runs as a plain namespace-scoped `Deployment` with a `Role` granting only `list pods` / `get pods/log` inside `ge83mom-devops26`.

Both variants need explicit relabeling (`discovery.relabel`) to turn `__meta_docker_container_name` / `__meta_kubernetes_pod_name` into real `container`/`pod` log labels — without it, every container's logs land in one indistinguishable `service_name="unknown_service"` stream, caught by querying Loki's actual label set while testing, not by inspection.
