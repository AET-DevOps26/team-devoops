-- provision-reports.sql — one-time provisioning of the reports user + schema for an EXISTING
-- database (where init-db.sh has already run and will not run again on the persistent volume).
--
-- Idempotent: safe to run more than once. Run as the database admin against the application DB, e.g.
--   docker exec -i app-database psql -U app_admin -d app_db < infra/postgres/provision-reports.sql
--   kubectl exec -i <postgres-pod> -- psql -U app_admin -d app_db < infra/postgres/provision-reports.sql
--
-- The report TABLES themselves are created by the genai-helper on startup (CREATE TABLE IF NOT
-- EXISTS); this script only sets up the role, schema, and grants. The password below is the dev
-- default used in docker-compose/Helm — change it for a real secret before running in production.

DO $$
BEGIN
    IF NOT EXISTS (SELECT FROM pg_roles WHERE rolname = 'reports_user') THEN
        CREATE USER reports_user WITH PASSWORD 'reports_password';
    END IF;
    EXECUTE format('GRANT CONNECT ON DATABASE %I TO reports_user', current_database());
END
$$;

GRANT reader TO reports_user;

CREATE SCHEMA IF NOT EXISTS reports AUTHORIZATION reports_user;

GRANT USAGE ON SCHEMA reports TO reader;
GRANT SELECT ON ALL TABLES IN SCHEMA reports TO reader;

ALTER DEFAULT PRIVILEGES FOR ROLE reports_user
    IN SCHEMA reports
    GRANT SELECT ON TABLES TO reader;

-- REFERENCES on the existing member/organization tables so the report tables (created by the
-- genai-helper at startup) can declare foreign keys into them. On a fresh DB this is covered by the
-- ALTER DEFAULT PRIVILEGES in init-db.sh; here we grant it explicitly on the already-existing tables.
DO $$
BEGIN
    IF to_regclass('member.members') IS NOT NULL THEN
        GRANT REFERENCES ON member.members TO reports_user;
    END IF;
    IF to_regclass('organization.teams') IS NOT NULL THEN
        GRANT REFERENCES ON organization.teams TO reports_user;
    END IF;
END
$$;
