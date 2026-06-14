#!/usr/bin/env bash
# init-db.sh — runs once when the Postgres container is first initialised.
# Creates per-service users, all application schemas, and grants:
#   - each service user: WRITE on its own schemas, READ (via reader role) on all
#   - letter_user: READ only (no write schemas)
#
# Passwords are injected via environment variables so nothing is hardcoded.
# Required env vars (all must be set):
#   ORGANIZATION_USER_PASSWORD
#   MEMBER_USER_PASSWORD
#   EVENT_USER_PASSWORD
#   FEEDBACK_USER_PASSWORD
#   FINANCE_USER_PASSWORD
#   LETTER_USER_PASSWORD
set -euo pipefail

DB="${POSTGRES_DB}"
ADMIN="${POSTGRES_USER}"

psql -v ON_ERROR_STOP=1 --username "$ADMIN" --dbname "$DB" <<-EOSQL

-- -------------------------------------------------------------------------
-- Reader role: granted to every service user so each can SELECT anywhere
-- -------------------------------------------------------------------------
CREATE ROLE reader NOLOGIN;

-- -------------------------------------------------------------------------
-- Per-service users
-- -------------------------------------------------------------------------
CREATE USER organization_user WITH PASSWORD '${ORGANIZATION_USER_PASSWORD}';
CREATE USER member_user        WITH PASSWORD '${MEMBER_USER_PASSWORD}';
CREATE USER event_user         WITH PASSWORD '${EVENT_USER_PASSWORD}';
CREATE USER feedback_user      WITH PASSWORD '${FEEDBACK_USER_PASSWORD}';
CREATE USER finance_user       WITH PASSWORD '${FINANCE_USER_PASSWORD}';
CREATE USER letter_user        WITH PASSWORD '${LETTER_USER_PASSWORD}';

-- Allow all users to connect to the application database
GRANT CONNECT ON DATABASE ${DB} TO
    organization_user, member_user, event_user,
    feedback_user, finance_user, letter_user;

-- All users inherit the reader role
GRANT reader TO
    organization_user, member_user, event_user,
    feedback_user, finance_user, letter_user;

-- -------------------------------------------------------------------------
-- Schemas (one per service)
-- -------------------------------------------------------------------------
CREATE SCHEMA organization;
CREATE SCHEMA member;
CREATE SCHEMA event;
CREATE SCHEMA feedback;
CREATE SCHEMA finance;

-- -------------------------------------------------------------------------
-- Ownership: each service user owns its schema
-- -------------------------------------------------------------------------
ALTER SCHEMA organization  OWNER TO organization_user;
ALTER SCHEMA member        OWNER TO member_user;
ALTER SCHEMA event         OWNER TO event_user;
ALTER SCHEMA feedback      OWNER TO feedback_user;
ALTER SCHEMA finance       OWNER TO finance_user;

-- -------------------------------------------------------------------------
-- Reader role: USAGE on all schemas + SELECT on all current tables
-- -------------------------------------------------------------------------
GRANT USAGE ON SCHEMA
    organization, member, event, feedback, finance
TO reader;

-- SELECT on any tables that already exist (none yet, but defensive)
GRANT SELECT ON ALL TABLES IN SCHEMA
    organization, member, event, feedback, finance
TO reader;

-- -------------------------------------------------------------------------
-- Default privileges: future tables created by each service user are
-- automatically SELECT-able by the reader role
-- -------------------------------------------------------------------------
ALTER DEFAULT PRIVILEGES FOR ROLE organization_user
    IN SCHEMA organization
    GRANT SELECT ON TABLES TO reader;

ALTER DEFAULT PRIVILEGES FOR ROLE member_user
    IN SCHEMA member
    GRANT SELECT ON TABLES TO reader;

ALTER DEFAULT PRIVILEGES FOR ROLE event_user
    IN SCHEMA event
    GRANT SELECT ON TABLES TO reader;

ALTER DEFAULT PRIVILEGES FOR ROLE feedback_user
    IN SCHEMA feedback
    GRANT SELECT ON TABLES TO reader;

ALTER DEFAULT PRIVILEGES FOR ROLE finance_user
    IN SCHEMA finance
    GRANT SELECT ON TABLES TO reader;

-- -------------------------------------------------------------------------
-- Cross-schema REFERENCES: required for FK constraints across schemas.
-- Granted per-user on the schemas they reference.
-- -------------------------------------------------------------------------
ALTER DEFAULT PRIVILEGES FOR ROLE member_user
    IN SCHEMA member
    GRANT REFERENCES ON TABLES TO organization_user, event_user, feedback_user, finance_user;

ALTER DEFAULT PRIVILEGES FOR ROLE organization_user
    IN SCHEMA organization
    GRANT REFERENCES ON TABLES TO event_user;

ALTER DEFAULT PRIVILEGES FOR ROLE event_user
    IN SCHEMA event
    GRANT REFERENCES ON TABLES TO feedback_user;

EOSQL
