#!/usr/bin/env bash
# Run Gradle checkstyleMain for every services/spring-* service. Slow
# (~20-60s per service due to Gradle startup), so wired to the pre-push
# stage only. Matches the `./gradlew --no-daemon checkstyleMain` step in CI.
set -euo pipefail

ROOT="$(git rev-parse --show-toplevel)"
failed=0

for svc_dir in "$ROOT"/services/spring-*/; do
  svc="$(basename "$svc_dir")"
  echo "--- Checkstyle: $svc ---"
  (
    cd "$svc_dir"
    chmod +x ./gradlew
    ./gradlew --no-daemon checkstyleMain
  ) || failed=1
done

exit "$failed"
