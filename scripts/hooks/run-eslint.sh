#!/usr/bin/env bash
# Run eslint with --fix against staged web-client files.
#
# Uses the eslint binary already installed under web-client/node_modules
# (--no-install) so the same version and eslint.config.js drive both
# the hook and CI. Note this differs from CI's `npm run lint`, which
# lints the whole tree without --fix; here we auto-fix only what's
# staged so the hook can be a quick correctness step.
#
# Precondition: developers must have run `npm install` in web-client/
# at least once. If not, npx --no-install will fail with a clear error.
#
# pre-commit passes staged file paths (relative to repo root) as
# positional args. We strip the leading "web-client/" because eslint
# runs with cwd=web-client.
set -euo pipefail

files=()
for f in "$@"; do
  files+=("${f#web-client/}")
done

cd web-client
exec npx --no-install eslint --fix "${files[@]}"
