# Root developer entrypoint. Wraps the per-service tooling (Gradle, pnpm, pytest, docker
# compose) that already exists in each subdirectory - see docs/cicd.md for what CI itself runs.
#
# Unlike CI, these targets don't pass --no-daemon to Gradle: locally you want the daemon kept
# warm between runs, you just don't want a stale one in an ephemeral CI container.
.DEFAULT_GOAL := help

SPRING_SERVICES := organization member event finance feedback letter

.PHONY: help
help: ## Show this help message
	@echo "Usage: make <target>"
	@echo ""
	@grep -E '^[a-zA-Z0-9_-]+:.*## .*$$' $(MAKEFILE_LIST) | sort | awk 'BEGIN {FS = ":.*?## "}; {printf "  \033[36m%-20s\033[0m %s\n", $$1, $$2}'

## --- Docker Compose lifecycle -----------------------------------------------------------
## Always cd into infra/ first so docker-compose.override.yml auto-merges (matching README's
## "Running Locally" section) - never pass -f infra/docker-compose.yml directly, that skips it.

.PHONY: up
up: ## Start the local stack (docker compose up -d --build)
	cd infra && docker compose up -d --build

.PHONY: down
down: ## Stop the local stack, keep the database volume
	cd infra && docker compose down

.PHONY: down-v
down-v: ## Stop the local stack and delete all volumes (wipes the database)
	cd infra && docker compose down -v

.PHONY: logs
logs: ## Follow logs for all running containers
	cd infra && docker compose logs -f

.PHONY: ps
ps: ## List running containers and their status
	cd infra && docker compose ps

## --- Test / Lint / Build ----------------------------------------------------------------
## No per-service targets on purpose - these always run against everything.

.PHONY: test
test: ## Run every test suite (Spring x6, GenAI, web-client)
	@for s in $(SPRING_SERVICES); do \
		echo "==> test: spring-$$s"; \
		(cd services/spring-$$s && ./gradlew test) || exit 1; \
	done
	@echo "==> test: py-genai-helper"
	cd services/py-genai-helper && pytest -q
	@echo "==> test: web-client"
	cd web-client && pnpm test:coverage

.PHONY: lint
lint: ## Run every linter (Checkstyle, ruff, ESLint + typecheck)
	@for s in $(SPRING_SERVICES); do \
		echo "==> lint: spring-$$s"; \
		(cd services/spring-$$s && ./gradlew checkstyleMain) || exit 1; \
	done
	@echo "==> lint: py-genai-helper"
	cd services/py-genai-helper && ruff check .
	@echo "==> lint: web-client"
	cd web-client && pnpm typecheck && pnpm lint

.PHONY: build
build: ## Build every service (Spring x6 + web-client)
	@for s in $(SPRING_SERVICES); do \
		echo "==> build: spring-$$s"; \
		(cd services/spring-$$s && ./gradlew build) || exit 1; \
	done
	@echo "==> build: web-client"
	cd web-client && pnpm build

.PHONY: verify
verify: lint test build ## Run lint, test, and build for everything - mirrors what CI checks per PR
