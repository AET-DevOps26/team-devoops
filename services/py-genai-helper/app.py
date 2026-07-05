from flask import Flask, g, jsonify, request
from prometheus_flask_exporter import PrometheusMetrics

import db
import reports
from auth import is_admin, require_auth
from generated.models import (
    MemberReportSummary,
    Reference,
    Report,
    TeamReportSummary,
)
from service import hello

app = Flask("genai-service")
# Exposes /metrics with request count, latency, and status-code histograms for every
# route below with no per-route instrumentation needed.
metrics = PrometheusMetrics(app)

# Ensure the report tables exist. This intentionally fails loudly: if the database (or the tables it
# references) isn't ready yet, startup aborts and the container restarts and retries — the same
# behaviour the Spring services rely on for cross-schema foreign keys. The test suite stubs init_db
# (see conftest.py), so this does not require a live database in tests.
db.init_db()


@app.route("/hello")
@require_auth
def hello_world():
    hello_message = hello()
    return f"<p>{hello_message}</p>"


@app.route("/health")
def health():
    return {"status": "ok"}, 200


# --------------------------------------------------------------------------- #
# Reports
# --------------------------------------------------------------------------- #
def _member_reference(member_id) -> Reference:
    return Reference(id=member_id, name=db.resolve_member_name(member_id) or "")


def _team_reference(team_id) -> Reference:
    return Reference(id=team_id, name=db.resolve_team_name(team_id) or "")


def _parse_bool(value):
    """Parse a JSON bool or "true"/"false" string; None means unparseable."""
    if isinstance(value, bool):
        return value
    if isinstance(value, str):
        lowered = value.lower()
        if lowered == "true":
            return True
        if lowered == "false":
            return False
    return None


def _parse_use_local():
    """Read the optional `uselocal` flag from the request body.

    Returns (use_local, error_response). error_response is None unless the value couldn't be
    parsed as a bool, in which case use_local is None and error_response is the (body, status)
    tuple to return.
    """
    data = request.get_json(silent=True, force=True) or {}
    value = data.get("uselocal")
    if value is None:
        return None, None
    parsed = _parse_bool(value)
    if parsed is None:
        return None, ({"error": "Invalid value for 'uselocal': expected true or false"}, 400)
    return parsed, None


@app.route("/reports/member/<member_id>", methods=["POST"])
@require_auth
def generate_member_report(member_id):
    if g.user_id != member_id and not is_admin():
        return {"error": "Access denied"}, 403
    use_local, error = _parse_use_local()
    if error:
        return error
    reports.trigger_member_report(member_id, g.token, use_local)
    return "", 202


@app.route("/reports/member/<member_id>", methods=["GET"])
@require_auth
def list_member_reports(member_id):
    if g.user_id != member_id and not is_admin():
        return {"error": "Access denied"}, 403
    reference = _member_reference(member_id)
    summaries = [
        MemberReportSummary(id=row["id"], member=reference, created_at=row["created_at"])
        for row in db.list_member_reports(member_id)
    ]
    return jsonify([s.model_dump(mode="json") for s in summaries]), 200


@app.route("/reports/team/<team_id>", methods=["POST"])
@require_auth
def generate_team_report(team_id):
    if not is_admin() and not db.is_trainer_of_team(g.user_id, team_id):
        return {"error": "Access denied"}, 403
    use_local, error = _parse_use_local()
    if error:
        return error
    reports.trigger_team_report(team_id, g.token, use_local)
    return "", 202


@app.route("/reports/team/<team_id>", methods=["GET"])
@require_auth
def list_team_reports(team_id):
    if not is_admin() and not db.is_trainer_of_team(g.user_id, team_id):
        return {"error": "Access denied"}, 403
    reference = _team_reference(team_id)
    summaries = [
        TeamReportSummary(id=row["id"], team=reference, created_at=row["created_at"])
        for row in db.list_team_reports(team_id)
    ]
    return jsonify([s.model_dump(mode="json") for s in summaries]), 200


def _authorize_report(row) -> bool:
    if is_admin():
        return True
    if row["kind"] == "member":
        return g.user_id == str(row["member_id"])
    return db.is_trainer_of_team(g.user_id, str(row["team_id"]))


@app.route("/reports/<report_id>", methods=["GET"])
@require_auth
def get_report(report_id):
    row = db.get_report(report_id)
    if row is None:
        return {"error": "Report not found"}, 404
    if not _authorize_report(row):
        return {"error": "Access denied"}, 403

    if row["kind"] == "member":
        report = Report(
            id=row["id"],
            kind="member",
            member=_member_reference(row["member_id"]),
            created_at=row["created_at"],
            text=row["text"],
        )
    else:
        report = Report(
            id=row["id"],
            kind="team",
            team=_team_reference(row["team_id"]),
            created_at=row["created_at"],
            text=row["text"],
        )
    return jsonify(report.model_dump(mode="json", exclude_none=True)), 200


@app.route("/reports/<report_id>", methods=["DELETE"])
@require_auth
def delete_report(report_id):
    row = db.get_report(report_id)
    if row is None:
        return {"error": "Report not found"}, 404
    if not _authorize_report(row):
        return {"error": "Access denied"}, 403
    db.delete_report(report_id)
    return "", 204
