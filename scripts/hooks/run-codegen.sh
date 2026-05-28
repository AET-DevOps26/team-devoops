#!/usr/bin/env bash
# Pre-commit hook: regenerate all service code whenever api/openapi.yaml changes.
# Mirrors the run-spectral.sh pattern; runs gen-all.sh and stages generated output.
set -euo pipefail

if [ ! -s api/openapi.yaml ]; then
  echo "api/openapi.yaml is empty -- skipping codegen."
  exit 0
fi

./api/scripts/gen-all.sh

# Stage all generated output so it's included in the commit
git add \
  services/spring-*/src/generated/ \
  services/py-genai-helper/generated/ \
  web-client/src/api.ts
