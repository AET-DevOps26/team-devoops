"""Report generation: kicks off generation in the background and persists the result.

Generation is fire-and-forget — the HTTP request returns immediately (202) and a daemon thread runs
the (currently stubbed) generator, then writes the finished report to the database.

NOTE: the actual generation logic (aggregating member/team data and calling the LLM) is not
implemented yet. ``generate_member_report_text`` / ``generate_team_report_text`` are stubs and are
the single seam to fill in later; the async + persistence scaffold around them is real.
"""

import logging
import threading

from prometheus_client import Counter

import db

logger = logging.getLogger(__name__)

REPORT_GENERATION = Counter("genai_report_generation_total", "Total report generation attempts", ["kind", "status"])


def generate_member_report_text(member_id: str, token: str) -> str:
    # TODO: real generation — fetch the member's feedback and run the LLM. Deferred.
    return f"Report generation is not yet implemented for member {member_id}."


def generate_team_report_text(team_id: str, token: str) -> str:
    # TODO: real generation — aggregate the team's trainees' data and run the LLM. Deferred.
    return f"Report generation is not yet implemented for team {team_id}."


def generate_and_store_member_report(member_id: str, token: str) -> None:
    try:
        report_text = generate_member_report_text(member_id, token)
        db.insert_member_report(member_id, report_text)
        REPORT_GENERATION.labels(kind="member", status="success").inc()
    except Exception:
        logger.exception("Failed to generate member report for %s", member_id)
        REPORT_GENERATION.labels(kind="member", status="failure").inc()


def generate_and_store_team_report(team_id: str, token: str) -> None:
    try:
        report_text = generate_team_report_text(team_id, token)
        db.insert_team_report(team_id, report_text)
        REPORT_GENERATION.labels(kind="team", status="success").inc()
    except Exception:
        logger.exception("Failed to generate team report for %s", team_id)
        REPORT_GENERATION.labels(kind="team", status="failure").inc()


def trigger_member_report(member_id: str, token: str) -> None:
    threading.Thread(
        target=generate_and_store_member_report,
        args=(member_id, token),
        daemon=True,
    ).start()


def trigger_team_report(team_id: str, token: str) -> None:
    threading.Thread(
        target=generate_and_store_team_report,
        args=(team_id, token),
        daemon=True,
    ).start()
