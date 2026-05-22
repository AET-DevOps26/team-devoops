#!/usr/bin/env bash
# Auto-sync web-client/pnpm-lock.yaml when package.json changes.
# Prevents `pnpm install --frozen-lockfile` failures in the Docker build /
# CI by keeping the lockfile in the SAME commit as the manifest.
#
# Behavior:
#   1. Regenerate pnpm-lock.yaml from package.json (no install, no scripts).
#   2. Stage the (possibly updated) lockfile.
#   3. If the lockfile actually changed, abort the commit so the developer
#      can review and re-commit. If it didn't change, allow the commit.
set -euo pipefail

cd web-client
echo "package.json changed -- regenerating pnpm-lock.yaml..."
pnpm install --lockfile-only --ignore-scripts
cd ..

git add web-client/pnpm-lock.yaml

if ! git diff --cached --quiet -- web-client/pnpm-lock.yaml; then
  # The lockfile was either newly staged or its staged contents changed
  # as a result of this regeneration. Force the developer to re-commit
  # so they see the diff that's about to land.
  cat <<'EOF'

pnpm-lock.yaml was regenerated and staged.
Review the diff with:  git diff --cached web-client/pnpm-lock.yaml
Then re-run your commit.

EOF
  exit 1
fi

# Lockfile already in sync -- nothing to do.
exit 0
