import types
from datetime import UTC, datetime

import pytest

import auth
import db
import reports
from app import app

MEMBER_A = "11111111-1111-1111-1111-111111111111"
MEMBER_B = "22222222-2222-2222-2222-222222222222"
TEAM_A = "33333333-3333-3333-3333-333333333333"
REPORT_ID = "44444444-4444-4444-4444-444444444444"
CREATED_AT = datetime(2026, 6, 28, 12, 0, tzinfo=UTC)

AUTH_HEADER = {"Authorization": "Bearer test"}


@pytest.fixture
def client():
    return app.test_client()


def authenticate(monkeypatch, sub, roles=None):
    """Make require_auth accept the request and inject the given identity/roles."""
    monkeypatch.setattr(auth, "_get_signing_key", lambda token: types.SimpleNamespace(key="k"))
    monkeypatch.setattr(
        auth.jwt,
        "decode",
        lambda *a, **k: {"sub": sub, "realm_access": {"roles": roles or []}},
    )


# --------------------------------------------------------------------------- #
# Auth gate
# --------------------------------------------------------------------------- #
def test_unauthenticated_returns_401(client):
    assert client.get(f"/reports/member/{MEMBER_A}").status_code == 401


# --------------------------------------------------------------------------- #
# Generate (trigger) — member
# --------------------------------------------------------------------------- #
def test_generate_member_report_self_returns_202(client, monkeypatch):
    authenticate(monkeypatch, sub=MEMBER_A)
    calls = []
    monkeypatch.setattr(reports, "trigger_member_report", lambda m, t, use_local=None: calls.append((m, t, use_local)))

    resp = client.post(f"/reports/member/{MEMBER_A}", headers=AUTH_HEADER)

    assert resp.status_code == 202
    assert calls == [(MEMBER_A, "test", None)]


def test_generate_member_report_forbidden_for_other(client, monkeypatch):
    authenticate(monkeypatch, sub=MEMBER_B)
    monkeypatch.setattr(reports, "trigger_member_report", lambda m, t, use_local=None: pytest.fail("not allowed"))

    resp = client.post(f"/reports/member/{MEMBER_A}", headers=AUTH_HEADER)

    assert resp.status_code == 403


def test_generate_member_report_admin_allowed(client, monkeypatch):
    authenticate(monkeypatch, sub=MEMBER_B, roles=["admin"])
    calls = []
    monkeypatch.setattr(reports, "trigger_member_report", lambda m, t, use_local=None: calls.append((m, t, use_local)))

    resp = client.post(f"/reports/member/{MEMBER_A}", headers=AUTH_HEADER)

    assert resp.status_code == 202
    assert calls == [(MEMBER_A, "test", None)]


@pytest.mark.parametrize("value", [True, "true", "True"])
def test_generate_member_report_uselocal_true_forces_local(client, monkeypatch, value):
    authenticate(monkeypatch, sub=MEMBER_A)
    calls = []
    monkeypatch.setattr(reports, "trigger_member_report", lambda m, t, use_local=None: calls.append((m, t, use_local)))

    resp = client.post(f"/reports/member/{MEMBER_A}", json={"uselocal": value}, headers=AUTH_HEADER)

    assert resp.status_code == 202
    assert calls == [(MEMBER_A, "test", True)]


def test_generate_member_report_uselocal_invalid_returns_400(client, monkeypatch):
    authenticate(monkeypatch, sub=MEMBER_A)
    monkeypatch.setattr(reports, "trigger_member_report", lambda m, t, use_local=None: pytest.fail("not allowed"))

    resp = client.post(f"/reports/member/{MEMBER_A}", json={"uselocal": "maybe"}, headers=AUTH_HEADER)

    assert resp.status_code == 400


# --------------------------------------------------------------------------- #
# Generate (trigger) — team
# --------------------------------------------------------------------------- #
def test_generate_team_report_trainer_allowed(client, monkeypatch):
    authenticate(monkeypatch, sub=MEMBER_A)
    monkeypatch.setattr(db, "is_trainer_of_team", lambda member_id, team_id: True)
    calls = []
    monkeypatch.setattr(reports, "trigger_team_report", lambda t, tok, use_local=None: calls.append((t, tok, use_local)))

    resp = client.post(f"/reports/team/{TEAM_A}", headers=AUTH_HEADER)

    assert resp.status_code == 202
    assert calls == [(TEAM_A, "test", None)]


def test_generate_team_report_forbidden_non_trainer(client, monkeypatch):
    authenticate(monkeypatch, sub=MEMBER_A)
    monkeypatch.setattr(db, "is_trainer_of_team", lambda member_id, team_id: False)
    monkeypatch.setattr(reports, "trigger_team_report", lambda t, tok, use_local=None: pytest.fail("not allowed"))

    resp = client.post(f"/reports/team/{TEAM_A}", headers=AUTH_HEADER)

    assert resp.status_code == 403


def test_generate_team_report_uselocal_false_forces_remote(client, monkeypatch):
    authenticate(monkeypatch, sub=MEMBER_A)
    monkeypatch.setattr(db, "is_trainer_of_team", lambda member_id, team_id: True)
    calls = []
    monkeypatch.setattr(reports, "trigger_team_report", lambda t, tok, use_local=None: calls.append((t, tok, use_local)))

    resp = client.post(f"/reports/team/{TEAM_A}", json={"uselocal": False}, headers=AUTH_HEADER)

    assert resp.status_code == 202
    assert calls == [(TEAM_A, "test", False)]


# --------------------------------------------------------------------------- #
# List summaries
# --------------------------------------------------------------------------- #
def test_list_member_reports_returns_summaries(client, monkeypatch):
    authenticate(monkeypatch, sub=MEMBER_A)
    monkeypatch.setattr(db, "resolve_member_name", lambda member_id: "Jane Doe")
    monkeypatch.setattr(
        db,
        "list_member_reports",
        lambda member_id: [{"id": REPORT_ID, "member_id": MEMBER_A, "created_at": CREATED_AT}],
    )

    resp = client.get(f"/reports/member/{MEMBER_A}", headers=AUTH_HEADER)

    assert resp.status_code == 200
    body = resp.get_json()
    assert len(body) == 1
    assert body[0]["id"] == REPORT_ID
    assert body[0]["member"] == {"id": MEMBER_A, "name": "Jane Doe"}
    assert "text" not in body[0]


def test_list_member_reports_forbidden_for_other(client, monkeypatch):
    authenticate(monkeypatch, sub=MEMBER_B)
    resp = client.get(f"/reports/member/{MEMBER_A}", headers=AUTH_HEADER)
    assert resp.status_code == 403


def test_list_team_reports_returns_summaries(client, monkeypatch):
    authenticate(monkeypatch, sub=MEMBER_A)
    monkeypatch.setattr(db, "is_trainer_of_team", lambda member_id, team_id: True)
    monkeypatch.setattr(db, "resolve_team_name", lambda team_id: "First Team")
    monkeypatch.setattr(
        db,
        "list_team_reports",
        lambda team_id: [{"id": REPORT_ID, "team_id": TEAM_A, "created_at": CREATED_AT}],
    )

    resp = client.get(f"/reports/team/{TEAM_A}", headers=AUTH_HEADER)

    assert resp.status_code == 200
    body = resp.get_json()
    assert body[0]["team"] == {"id": TEAM_A, "name": "First Team"}
    assert "text" not in body[0]


# --------------------------------------------------------------------------- #
# Detail
# --------------------------------------------------------------------------- #
def test_get_member_report_detail(client, monkeypatch):
    authenticate(monkeypatch, sub=MEMBER_A)
    monkeypatch.setattr(
        db,
        "get_report",
        lambda report_id: {
            "kind": "member",
            "id": REPORT_ID,
            "member_id": MEMBER_A,
            "created_at": CREATED_AT,
            "text": "the report",
        },
    )
    monkeypatch.setattr(db, "resolve_member_name", lambda member_id: "Jane Doe")

    resp = client.get(f"/reports/{REPORT_ID}", headers=AUTH_HEADER)

    assert resp.status_code == 200
    body = resp.get_json()
    assert body["kind"] == "member"
    assert body["member"] == {"id": MEMBER_A, "name": "Jane Doe"}
    assert body["text"] == "the report"
    assert "team" not in body


def test_get_team_report_detail_trainer(client, monkeypatch):
    authenticate(monkeypatch, sub=MEMBER_A)
    monkeypatch.setattr(
        db,
        "get_report",
        lambda report_id: {
            "kind": "team",
            "id": REPORT_ID,
            "team_id": TEAM_A,
            "created_at": CREATED_AT,
            "text": "team report",
        },
    )
    monkeypatch.setattr(db, "is_trainer_of_team", lambda member_id, team_id: True)
    monkeypatch.setattr(db, "resolve_team_name", lambda team_id: "First Team")

    resp = client.get(f"/reports/{REPORT_ID}", headers=AUTH_HEADER)

    assert resp.status_code == 200
    body = resp.get_json()
    assert body["kind"] == "team"
    assert body["team"] == {"id": TEAM_A, "name": "First Team"}
    assert "member" not in body


def test_get_report_not_found(client, monkeypatch):
    authenticate(monkeypatch, sub=MEMBER_A)
    monkeypatch.setattr(db, "get_report", lambda report_id: None)
    resp = client.get(f"/reports/{REPORT_ID}", headers=AUTH_HEADER)
    assert resp.status_code == 404


def test_get_member_report_forbidden_for_other(client, monkeypatch):
    authenticate(monkeypatch, sub=MEMBER_B)
    monkeypatch.setattr(
        db,
        "get_report",
        lambda report_id: {
            "kind": "member",
            "id": REPORT_ID,
            "member_id": MEMBER_A,
            "created_at": CREATED_AT,
            "text": "the report",
        },
    )
    resp = client.get(f"/reports/{REPORT_ID}", headers=AUTH_HEADER)
    assert resp.status_code == 403


# --------------------------------------------------------------------------- #
# Delete
# --------------------------------------------------------------------------- #
def test_delete_report_success(client, monkeypatch):
    authenticate(monkeypatch, sub=MEMBER_A)
    monkeypatch.setattr(
        db,
        "get_report",
        lambda report_id: {
            "kind": "member",
            "id": REPORT_ID,
            "member_id": MEMBER_A,
            "created_at": CREATED_AT,
            "text": "the report",
        },
    )
    deleted = []
    monkeypatch.setattr(db, "delete_report", lambda report_id: deleted.append(report_id) or "member")

    resp = client.delete(f"/reports/{REPORT_ID}", headers=AUTH_HEADER)

    assert resp.status_code == 204
    assert deleted == [REPORT_ID]


def test_delete_report_not_found(client, monkeypatch):
    authenticate(monkeypatch, sub=MEMBER_A)
    monkeypatch.setattr(db, "get_report", lambda report_id: None)
    resp = client.delete(f"/reports/{REPORT_ID}", headers=AUTH_HEADER)
    assert resp.status_code == 404


# --------------------------------------------------------------------------- #
# Background worker persists the (stubbed) generated text
# --------------------------------------------------------------------------- #
def test_worker_persists_generated_member_text(monkeypatch):
    monkeypatch.setattr(reports, "generate_member_report_text", lambda m, t, use_local=None: "generated text")
    inserted = []
    monkeypatch.setattr(db, "insert_member_report", lambda member_id, text: inserted.append((member_id, text)))

    reports.generate_and_store_member_report(MEMBER_A, "test")

    assert inserted == [(MEMBER_A, "generated text")]


def test_worker_persists_generated_team_text(monkeypatch):
    monkeypatch.setattr(reports, "generate_team_report_text", lambda t, tok, use_local=None: "team text")
    inserted = []
    monkeypatch.setattr(db, "insert_team_report", lambda team_id, text: inserted.append((team_id, text)))

    reports.generate_and_store_team_report(TEAM_A, "test")

    assert inserted == [(TEAM_A, "team text")]
