"""Persistence for generated reports.

The genai-helper owns the ``reports`` schema (two tables: member and team reports). The schema and
its user are provisioned out-of-band (infra/postgres/init-db.sh on a fresh DB, or
provision-reports.sql on an existing one); the tables themselves are created here on startup via
idempotent ``CREATE TABLE IF NOT EXISTS`` (Python has no Flyway). Member/team display names and the
trainer-of-team relationship are read from the other services' schemas via the shared reader role.
"""

import os
import time
import uuid
from datetime import UTC, datetime

import psycopg2.errors
from sqlalchemy import create_engine, text
from sqlalchemy.engine import make_url
from sqlalchemy.exc import ProgrammingError

_engine = None


def _build_url():
    # Reuse the SPRING_DATASOURCE_* convention so docker-compose and Helm inject DB config the same
    # way they do for the Spring services. The JDBC URL (jdbc:postgresql://host:port/db) is converted
    # to a SQLAlchemy URL with the psycopg2 driver and the reports_user credentials.
    jdbc = os.environ.get("SPRING_DATASOURCE_URL", "jdbc:postgresql://app-database:5432/app_db")
    url = make_url(jdbc.removeprefix("jdbc:")).set(
        drivername="postgresql+psycopg2",
        username=os.environ.get("SPRING_DATASOURCE_USERNAME", "reports_user"),
        password=os.environ.get("SPRING_DATASOURCE_PASSWORD", "reports_password"),
    )
    return url


def get_engine():
    global _engine
    if _engine is None:
        _engine = create_engine(_build_url(), pool_pre_ping=True)
    return _engine


def _create_report_tables() -> None:
    with get_engine().begin() as conn:
        conn.execute(
            text(
                """
                CREATE TABLE IF NOT EXISTS reports.member_reports (
                    id         UUID        NOT NULL,
                    member_id  UUID        NOT NULL,
                    created_at TIMESTAMPTZ NOT NULL,
                    text       TEXT        NOT NULL,
                    CONSTRAINT pk_member_reports PRIMARY KEY (id),
                    CONSTRAINT fk_member_reports_member
                        FOREIGN KEY (member_id) REFERENCES member.members (id) ON DELETE CASCADE
                )
                """
            )
        )
        conn.execute(
            text(
                """
                CREATE TABLE IF NOT EXISTS reports.team_reports (
                    id         UUID        NOT NULL,
                    team_id    UUID        NOT NULL,
                    created_at TIMESTAMPTZ NOT NULL,
                    text       TEXT        NOT NULL,
                    CONSTRAINT pk_team_reports PRIMARY KEY (id),
                    CONSTRAINT fk_team_reports_team
                        FOREIGN KEY (team_id) REFERENCES organization.teams (id) ON DELETE CASCADE
                )
                """
            )
        )


def init_db() -> None:
    """Create the report tables if they don't exist yet (idempotent).

    The foreign keys into member.members / organization.teams use ON DELETE CASCADE, matching the rest
    of the system: deleting a member/team removes their reports. The referenced tables must already
    exist, so on a cold/fresh database this races against the member and organization services
    creating them, raising UndefinedTable if we lose. Retried here rather than letting the process
    crash: a crash falls back to the container's restart backoff, which is exponential and can push
    the next attempt out far enough to blow past a deploy's overall timeout even though the actual
    dependency only takes a couple of minutes to appear. The retry budget (2 minutes) stays well
    within the startup probe's ~5.3 minute allowance, so losing this race no longer costs a container
    restart at all, just a slower first boot.
    """
    deadline = time.monotonic() + 120
    while True:
        try:
            _create_report_tables()
            return
        except ProgrammingError as e:
            if not isinstance(e.orig, psycopg2.errors.UndefinedTable) or time.monotonic() >= deadline:
                raise
            time.sleep(2)


def insert_member_report(member_id: str, report_text: str) -> str:
    report_id = str(uuid.uuid4())
    with get_engine().begin() as conn:
        conn.execute(
            text(
                "INSERT INTO reports.member_reports (id, member_id, created_at, text) "
                "VALUES (:id, :member_id, :created_at, :text)"
            ),
            {
                "id": report_id,
                "member_id": member_id,
                "created_at": datetime.now(UTC),
                "text": report_text,
            },
        )
    return report_id


def insert_team_report(team_id: str, report_text: str) -> str:
    report_id = str(uuid.uuid4())
    with get_engine().begin() as conn:
        conn.execute(
            text(
                "INSERT INTO reports.team_reports (id, team_id, created_at, text) "
                "VALUES (:id, :team_id, :created_at, :text)"
            ),
            {
                "id": report_id,
                "team_id": team_id,
                "created_at": datetime.now(UTC),
                "text": report_text,
            },
        )
    return report_id


def list_member_reports(member_id: str) -> list[dict]:
    with get_engine().connect() as conn:
        rows = conn.execute(
            text(
                "SELECT id, member_id, created_at FROM reports.member_reports "
                "WHERE member_id = :member_id ORDER BY created_at DESC"
            ),
            {"member_id": member_id},
        ).mappings()
        return [dict(row) for row in rows]


def list_team_reports(team_id: str) -> list[dict]:
    with get_engine().connect() as conn:
        rows = conn.execute(
            text(
                "SELECT id, team_id, created_at FROM reports.team_reports "
                "WHERE team_id = :team_id ORDER BY created_at DESC"
            ),
            {"team_id": team_id},
        ).mappings()
        return [dict(row) for row in rows]


def get_report(report_id: str) -> dict | None:
    """Return the report (member or team) with the given id, including its text, or None."""
    with get_engine().connect() as conn:
        member = (
            conn.execute(
                text("SELECT id, member_id, created_at, text FROM reports.member_reports WHERE id = :id"),
                {"id": report_id},
            )
            .mappings()
            .first()
        )
        if member is not None:
            return {"kind": "member", **dict(member)}

        team = (
            conn.execute(
                text("SELECT id, team_id, created_at, text FROM reports.team_reports WHERE id = :id"),
                {"id": report_id},
            )
            .mappings()
            .first()
        )
        if team is not None:
            return {"kind": "team", **dict(team)}

    return None


def delete_report(report_id: str) -> str | None:
    """Delete the member or team report with the given id; return its kind, or None if missing."""
    with get_engine().begin() as conn:
        deleted = conn.execute(text("DELETE FROM reports.member_reports WHERE id = :id"), {"id": report_id}).rowcount
        if deleted:
            return "member"
        deleted = conn.execute(text("DELETE FROM reports.team_reports WHERE id = :id"), {"id": report_id}).rowcount
        if deleted:
            return "team"
    return None


def resolve_member_name(member_id: str) -> str | None:
    with get_engine().connect() as conn:
        row = conn.execute(
            text("SELECT first_name, last_name FROM member.members WHERE id = :id"),
            {"id": member_id},
        ).first()
    return f"{row[0]} {row[1]}" if row is not None else None


def resolve_team_name(team_id: str) -> str | None:
    with get_engine().connect() as conn:
        row = conn.execute(
            text("SELECT name FROM organization.teams WHERE id = :id"),
            {"id": team_id},
        ).first()
    return row[0] if row is not None else None


def list_team_trainees(team_id: str) -> list[dict]:
    """Return the team's trainees as {id, name} dicts, ordered by name."""
    with get_engine().connect() as conn:
        rows = conn.execute(
            text(
                "SELECT m.id, m.first_name, m.last_name "
                "FROM organization.trainees t JOIN member.members m ON m.id = t.member_id "
                "WHERE t.team_id = :team_id ORDER BY m.first_name, m.last_name"
            ),
            {"team_id": team_id},
        ).all()
    return [{"id": str(row[0]), "name": f"{row[1]} {row[2]}"} for row in rows]


def is_trainer_of_team(member_id: str, team_id: str) -> bool:
    with get_engine().connect() as conn:
        row = conn.execute(
            text("SELECT 1 FROM organization.trainers " "WHERE member_id = :member_id AND team_id = :team_id"),
            {"member_id": member_id, "team_id": team_id},
        ).first()
    return row is not None
