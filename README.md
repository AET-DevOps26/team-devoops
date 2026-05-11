# team-devoops: Hierarchical Club Management System

A centralized sports club management platform that combines member administration, event scheduling, payment tracking, and AI-powered personalized feedback into a single application.

Club organizers get an all-in-one tool for managing members, automating billing, and overseeing events. Members and trainers benefit from structured training overviews and AI-generated progress reports based on attendance records, trainer notes, and member profiles.

## Features

- **Member management** — CRUD for members, roles, and profiles
- **Event service** — training scheduling, attendance tracking, trainer notes
- **Payment service** — one-time and recurring billing linked to members
- **Letter service** — PDF/email generation from templates with dynamic member data
- **GenAI helper** — analyzes member data and trainer notes to generate personalized feedback and progress reports (supports OpenAI and local LLMs)

## Repository Structure

```
repo/
├── api/                        # Single source of truth for API contracts
│   ├── openapi.yaml            # Versioned OpenAPI spec
│   └── scripts/                # Code-gen helper scripts
├── docs/                       # Project documentation
├── services/
│   ├── spring-*/               # Java 21, Spring Boot 3 microservices
│   └── py-*/                   # Python 3.12, Flask + LangChain GenAI service
├── web-client/                 # React single-page application
├── infra/                      # docker-compose, Traefik config, Helm/Terraform
└── .github/workflows/          # CI/CD pipelines
```

## Architecture

All services sit behind a **Traefik** reverse proxy that handles routing and authentication (OAuth2). The Spring Boot services and the GenAI service share **PostgreSQL** databases. The web client communicates with the backend services via REST APIs defined in the OpenAPI spec. The GenAI service can call external LLM APIs (like OpenAI) or use local models to generate personalized feedback based on member data and trainer notes.

| Service | Port | Stack |
|---|---|---|
| Member Service | 8001 | Java 21, Spring Boot 3 |
| Event Service | 8002 | Java 21, Spring Boot 3 |
| Payment Service | 8003 | Java 21, Spring Boot 3 |
| Letter Service | 8004 | Java 21, Spring Boot 3 |
| GenAI Service | 5000 | Python 3.12, Flask, LangChain |
| Web Client | 3000 | React, Vite |
| PostgreSQL | 5432 | — |
| Traefik | 80/443 | — |

## Docs

- [Problem Statement](docs/problem-statement.md)
- [System Architecture](docs/system-architecture.md)
- [Backlog](docs/backlog.md)

