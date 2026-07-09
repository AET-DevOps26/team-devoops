# Deployment

Detailed companion to the [README's Deployment environments section](../README.md#deployment-environments). Three environments run the system; this page covers the two continuously-live ones. For local Docker Compose, the [README's Running Locally section](../README.md#running-locally) is already the complete reference.

## Azure VM

A single Ubuntu 24.04 VM in Azure's **Poland Central** region runs the exact same `infra/docker-compose.yml` stack as local dev, minus the override file — so it terminates real TLS via Let's Encrypt instead of serving plain HTTP.

**Live URL:** <https://team-devoops.polandcentral.cloudapp.azure.com>

### Provisioning — Terraform (`infra/terraform/`)

| Resource | Purpose |
|---|---|
| `azurerm_resource_group` | `rg-team-devoops` |
| `azurerm_virtual_network` + `azurerm_subnet` | `10.0.0.0/16` / `10.0.1.0/24` |
| `azurerm_network_security_group` | Allows inbound 22 (SSH), 80 (HTTP), 443 (HTTPS) only |
| `azurerm_public_ip` | Static, with a free Azure-assigned FQDN (`domain_name_label`) |
| `azurerm_linux_virtual_machine` | `Standard_D2as_v4`, Ubuntu 24.04 LTS, SSH-key auth only (`disable_password_authentication = true`) |

Remote state lives in Azure Blob Storage (`stdevoops26tfstate/tfstate`), shared and locked between local runs and CI so two applies can't race. Auth is OIDC (`ARM_USE_OIDC=true`) — no long-lived Azure client secret is stored anywhere.

Run it via the **`infra` workflow** (`.github/workflows/infra.yml`, manual `workflow_dispatch` with `plan` / `apply` / `destroy`), or locally:

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

### Configuration — Ansible (`infra/ansible/playbook.yml`)

Runs after Terraform, targeting the VM's public IP:

1. Install Docker (apt repo + `docker-ce`, `docker-compose-plugin`).
2. Clone/update the repo at the deployed commit (`git` module, `force: true` so the working tree always matches `main`).
3. Write `services/py-genai-helper/.env` and `services/spring-letter/.env` from content passed in as extra-vars (sourced from GitHub Secrets — never committed).
4. `docker compose -f infra/docker-compose.yml up -d --build --remove-orphans`.

Triggered automatically by the **`cd` workflow** on every push to `main` — see [docs/cicd.md](cicd.md) for the exact secrets involved.

### Typical workflow

1. Infra change (new resource, VM size, etc.) → push → manually trigger `infra` workflow with `apply`.
2. App code change → merge to `main` → `cd` workflow redeploys automatically (both this VM and Kubernetes, in parallel).
3. Teardown → trigger `infra` workflow with `destroy`.

## Kubernetes (TUM RKE2 / Rancher)

The same services are also deployed via a Helm umbrella chart to the course's RKE2 cluster, with autoscaling and rolling-update self-healing configured per service.

**Live URL:** <https://ge83mom-devops26.stud.k8s.aet.cit.tum.de> · **Namespace:** `ge83mom-devops26` · **Chart:** [`infra/helm/team-devoops`](../infra/helm/team-devoops)

This path has enough moving parts (one-time Secret/ConfigMap bootstrapping, the Keycloak theme's projected-volume workaround, resource-quota tuning to fit Ollama into a fixed namespace quota, autoscaling scope) that it has its own dedicated, actively-maintained reference — **[`infra/helm/README.md`](../infra/helm/README.md)** — rather than being duplicated here. Highlights:

- Images are built and pushed to `ghcr.io/aet-devops26/team-devoops/<service>` by the `cd` workflow's `docker-push` job, then `deploy-k8s` runs `helm upgrade --install --rollback-on-failure`.
- PostgreSQL, Prometheus, Grafana, Loki, and Ollama each run in-cluster with their own PVC on the cluster's default StorageClass (`csi-rbd-sc`, ReadWriteOnce).
- On every pull request, `ci.yml`'s `helm-validate` job lints the chart, renders it, and schema-validates the output with `kubeconform` — a broken chart can't merge.

## Why not Kubernetes on Azure too

The spec's cloud-environment requirement is satisfied by the Azure VM (Docker Compose) rather than a managed Kubernetes service like AKS; the Kubernetes requirement is satisfied by the course's Rancher-managed RKE2 cluster instead. Both requirements are met, just not by the same deployment target — provisioning a second Kubernetes cluster on Azure was judged not to add anything beyond what the VM and the RKE2 cluster already each demonstrate independently.
