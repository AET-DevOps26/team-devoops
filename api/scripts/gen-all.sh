#!/usr/bin/env bash
# Run all OpenAPI code generators for every service.
# Called by scripts/hooks/run-codegen.sh (pre-commit) and can be run standalone.
#
# Prerequisites:
#   - Docker running               (Spring generator)
#   - datamodel-code-generator     (pip install datamodel-code-generator)
#   - openapi-typescript           (pnpm devDependency in web-client)
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"

echo "Running OpenAPI code generation..."

# Spring services — each receives only its own tag's API interface + relevant models
"$SCRIPT_DIR/gen-spring.sh" spring-organization  organization  organizationservice  "Reference:Sport:SportCreate:SportPartialUpdate:Team:TeamCreate:TeamPartialUpdate:ErrorResponse:BadRequestResponse"
"$SCRIPT_DIR/gen-spring.sh" spring-member        members       memberservice        "Member:MemberSummary:MemberCreate:MemberPartialUpdate:ErrorResponse:BadRequestResponse:Reference:Dashboard:AdminDashboard:DirectorDashboard:TrainerDashboard:TraineeDashboard:TeamBalanceSummary:FeedbackSummary:EventSummary:MemberReportSummary"
"$SCRIPT_DIR/gen-spring.sh" spring-event         events        eventservice         "Reference:Event:EventSummary:EventCreate:EventPartialUpdate:ErrorResponse:BadRequestResponse"
"$SCRIPT_DIR/gen-spring.sh" spring-feedback      feedback      feedbackservice      "Reference:Feedback:FeedbackSummary:FeedbackCreate:FeedbackPartialUpdate:ErrorResponse:BadRequestResponse"
"$SCRIPT_DIR/gen-spring.sh" spring-finance       finance       financeservice       "Reference:Balance:Transaction:TransactionCreate:TransactionPartialUpdate:ErrorResponse:BadRequestResponse"
"$SCRIPT_DIR/gen-spring.sh" spring-letter        letters       letterservice        "ErrorResponse:BadRequestResponse"

# Pydantic models for py-genai-helper
"$SCRIPT_DIR/gen-python-models.sh"

# TypeScript SDK for web-client
"$SCRIPT_DIR/gen-typescript.sh"

echo "Code generation complete."
