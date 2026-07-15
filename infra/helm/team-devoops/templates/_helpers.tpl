{{/*
Common labels applied to every object.
*/}}
{{- define "team-devoops.labels" -}}
app.kubernetes.io/name: {{ .name }}
app.kubernetes.io/part-of: team-devoops
app.kubernetes.io/managed-by: {{ .root.Release.Service }}
helm.sh/chart: {{ .root.Chart.Name }}-{{ .root.Chart.Version }}
{{- end -}}

{{/*
Selector labels (stable subset used by Services and Deployment selectors).
*/}}
{{- define "team-devoops.selectorLabels" -}}
app.kubernetes.io/name: {{ .name }}
app.kubernetes.io/part-of: team-devoops
{{- end -}}

{{/*
Baseline hardened container securityContext (KICS: privilege escalation, unrestricted
capabilities, NET_RAW not dropped). Pass "runAsNonRoot": true only for images confirmed
(via Dockerfile USER or a `docker run --entrypoint id` check against the real image) to
default to a non-root user -- forcing it on images that start as root breaks them (e.g.
the official postgres entrypoint's chown/gosu dance needs CAP_CHOWN/CAP_SETUID at startup).
Pass "runAsUser" only when the image needs an explicit non-root UID pinned (e.g. an
initContainer with no non-root user of its own).
*/}}
{{- define "team-devoops.containerSecurityContext" -}}
allowPrivilegeEscalation: false
capabilities:
  drop: ["NET_RAW"]
{{- if .runAsNonRoot }}
runAsNonRoot: true
{{- end }}
{{- if .runAsUser }}
runAsUser: {{ .runAsUser }}
{{- end }}
{{- end -}}

{{/*
Resolve the container image for a service.
Uses an explicit per-service image (external images such as swagger-ui) when set,
otherwise builds <registry>/<repository>/<service> from the global image config.
*/}}
{{- define "team-devoops.image" -}}
{{- $svc := .svc -}}
{{- $g := .root.Values.global.image -}}
{{- $repo := $svc.image | default (printf "%s/%s/%s" $g.registry $g.repository .name) -}}
{{- $tag := $svc.tag | default $g.tag -}}
{{- printf "%s:%s" $repo $tag -}}
{{- end -}}
