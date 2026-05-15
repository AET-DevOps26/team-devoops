#!/usr/bin/env bash
# Auto-sync web-client/package-lock.json when package.json changes.
# Prevents `npm ci` failures in the Docker build / CI by keeping the
# lockfile in the SAME commit as the manifest.
#
# Behavior:
#   1. Regenerate package-lock.json from package.json (no install, no scripts).
#   2. Stage the (possibly updated) lockfile.
#   3. If the lockfile actually changed, abort the commit so the developer
#      can review and re-commit. If it didn't change, allow the commit.
set -euo pipefail

cd web-client
echo "package.json changed -- regenerating package-lock.json..."
npm install --package-lock-only --ignore-scripts --no-audit --no-fund
cd ..

git add web-client/package-lock.json

if ! git diff --cached --quiet -- web-client/package-lock.json; then
  # The lockfile was either newly staged or its staged contents changed
  # as a result of this regeneration. Force the developer to re-commit
  # so they see the diff that's about to land.
  cat <<'EOF'

package-lock.json was regenerated and staged.
Review the diff with:  git diff --cached web-client/package-lock.json
Then re-run your commit.

EOF
  exit 1
fi

# Lockfile already in sync -- nothing to do.
exit 0
