#!/usr/bin/env bash
# Lint api/openapi.yaml with Spectral. Mirrors the openapi-lint job in CI:
# skipped if the spec is empty, otherwise enforced via the default ruleset.
set -euo pipefail

if [ ! -s api/openapi.yaml ]; then
  echo "api/openapi.yaml is empty -- skipping (matches CI behavior)."
  exit 0
fi

exec npx --yes @stoplight/spectral-cli lint api/openapi.yaml
