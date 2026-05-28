#!/usr/bin/env bash
# Generate Pydantic v2 models for py-genai-helper from the OpenAPI spec.
# Mirrors what the Spring generator produces for Java services: typed
# request/response models derived directly from the spec.
# Requires: datamodel-code-generator (pip install datamodel-code-generator)
set -euo pipefail

REPO_ROOT="$(cd "$(dirname "$0")/../.." && pwd)"
OUT_FILE="$REPO_ROOT/services/py-genai-helper/generated/models.py"

echo "  Generating Python models (py-genai-helper)..."

mkdir -p "$(dirname "$OUT_FILE")"

cd "$REPO_ROOT"
python -m datamodel_code_generator \
  --input api/openapi.yaml \
  --input-file-type openapi \
  --output "$OUT_FILE" \
  --output-model-type pydantic_v2.BaseModel \
  --target-python-version 3.12 \
  --use-annotated \
  --field-constraints \
  --formatters black
