#!/usr/bin/env bash
# Generate Spring Boot API interfaces and model classes for a single service.
# Usage: gen-spring.sh <service-dir> <tag> <package-suffix> <colon-separated-models>
# e.g.:  gen-spring.sh spring-member members memberservice "Member:MemberSummary:MemberCreate:MemberPartialUpdate"
set -euo pipefail

REPO_ROOT="$(cd "$(dirname "$0")/../.." && pwd)"
SERVICE="$1"
TAG="$2"
PKG="$3"
MODELS="$4"

# Capitalise first letter so it matches the generator's API class name (e.g. members → Members)
TAG_CAP="$(echo "${TAG:0:1}" | tr '[:lower:]' '[:upper:]')${TAG:1}"

OUT_DIR="$REPO_ROOT/services/$SERVICE/src/generated/java"

echo "  Generating Spring stubs: $SERVICE (tag=$TAG)..."

# Remove previous output so renamed/deleted schemas don't linger
rm -rf "$OUT_DIR"

docker run --rm \
  --user "$(id -u):$(id -g)" \
  -v "$REPO_ROOT:/local" \
  openapitools/openapi-generator-cli:v7.14.0 generate \
  -i /local/api/openapi.yaml \
  -g spring \
  -o /local/services/"$SERVICE"/src/generated/java \
  --skip-validate-spec \
  --global-property "apis=$TAG_CAP,models=$MODELS,supportingFiles=ApiUtil.java" \
  --additional-properties "useSpringBoot3=true,interfaceOnly=true,openApiNullable=false,containerDefaultToNull=true,useTags=true,sourceFolder=,apiPackage=tum.devoops.$PKG.api,modelPackage=tum.devoops.$PKG.model,hideGenerationTimestamp=true"
