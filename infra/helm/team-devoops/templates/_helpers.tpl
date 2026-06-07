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
