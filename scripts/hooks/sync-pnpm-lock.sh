#!/usr/bin/env bash
# Auto-sync web-client/pnpm-lock.yaml when package.json changes.
# Prevents `pnpm install --frozen-lockfile` failures in the Docker build /
# CI by keeping the lockfile in the SAME commit as the manifest.
#
# Behavior:
#   1. Capture the currently-staged lockfile content.
#   2. Regenerate pnpm-lock.yaml from package.json (no install, no scripts).
#   3. If the lockfile changed from what was staged, stage the new version
#      and abort so the developer can review and re-commit.
#      If it didn't change, the lockfile is already correct -- allow the commit.
set -euo pipefail

LOCK_FILE="web-client/pnpm-lock.yaml"

# Snapshot the staged (or committed) lockfile before we touch anything.
before="$(git show ":$LOCK_FILE" 2>/dev/null || cat "$LOCK_FILE" 2>/dev/null || true)"

echo "package.json changed -- regenerating pnpm-lock.yaml..."
cd web-client
pnpm install --lockfile-only --ignore-scripts
cd ..

after="$(cat "$LOCK_FILE")"

if [ "$before" != "$after" ]; then
  git add "$LOCK_FILE"
  cat <<'EOF'

pnpm-lock.yaml was regenerated and staged.
Review the diff with:  git diff --cached web-client/pnpm-lock.yaml
Then re-run your commit.

EOF
  exit 1
fi

# Lockfile already in sync -- nothing to do.
exit 0
