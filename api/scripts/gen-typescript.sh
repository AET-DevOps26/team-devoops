#!/usr/bin/env bash
# Generate TypeScript types for the web-client SDK using openapi-typescript.
# Requires: openapi-typescript devDependency in web-client/package.json
set -euo pipefail

REPO_ROOT="$(cd "$(dirname "$0")/../.." && pwd)"

echo "  Generating TypeScript types..."

cd "$REPO_ROOT"
pnpm --prefix web-client exec openapi-typescript \
  "$REPO_ROOT/api/openapi.yaml" \
  -o "$REPO_ROOT/web-client/src/api.ts"
