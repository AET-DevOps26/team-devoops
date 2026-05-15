#!/usr/bin/env bash
# Run Gradle checkstyleMain for member-service. Slow (~20-60s due to
# Gradle startup), so wired to the pre-push stage only. Matches the
# `./gradlew --no-daemon checkstyleMain` step in CI.
set -euo pipefail

cd services/spring-order/member-service
chmod +x ./gradlew
exec ./gradlew --no-daemon checkstyleMain
