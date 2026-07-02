"""Tests for the /rag-response endpoint, in particular the optional "uselocal" body flag."""

import types

import pytest

import app as app_module
import auth
from app import app

MEMBER_A = "11111111-1111-1111-1111-111111111111"
AUTH_HEADER = {"Authorization": "Bearer test"}


@pytest.fixture
def client():
    return app.test_client()


def authenticate(monkeypatch, sub=MEMBER_A, roles=None):
    """Make require_auth accept the request and inject the given identity/roles."""
    monkeypatch.setattr(auth, "_get_signing_key", lambda token: types.SimpleNamespace(key="k"))
    monkeypatch.setattr(
        auth.jwt,
        "decode",
        lambda *a, **k: {"sub": sub, "realm_access": {"roles": roles or []}},
    )


def capture_rag_calls(monkeypatch):
    calls = []

    def fake(question, use_local=None):
        calls.append((question, use_local))
        return "stub answer"

    monkeypatch.setattr(app_module, "generate_rag_response", fake)
    return calls


def test_missing_question_returns_400(client, monkeypatch):
    authenticate(monkeypatch)

    resp = client.post("/rag-response", json={}, headers=AUTH_HEADER)

    assert resp.status_code == 400


def test_uselocal_absent_defaults_to_env_provider(client, monkeypatch):
    authenticate(monkeypatch)
    calls = capture_rag_calls(monkeypatch)

    resp = client.post("/rag-response", json={"question": "q"}, headers=AUTH_HEADER)

    assert resp.status_code == 200
    assert calls == [("q", None)]


@pytest.mark.parametrize("value", [True, "true", "True"])
def test_uselocal_true_forces_local(client, monkeypatch, value):
    authenticate(monkeypatch)
    calls = capture_rag_calls(monkeypatch)

    resp = client.post("/rag-response", json={"question": "q", "uselocal": value}, headers=AUTH_HEADER)

    assert resp.status_code == 200
    assert calls == [("q", True)]


@pytest.mark.parametrize("value", [False, "false", "False"])
def test_uselocal_false_forces_remote(client, monkeypatch, value):
    authenticate(monkeypatch)
    calls = capture_rag_calls(monkeypatch)

    resp = client.post("/rag-response", json={"question": "q", "uselocal": value}, headers=AUTH_HEADER)

    assert resp.status_code == 200
    assert calls == [("q", False)]


def test_uselocal_invalid_returns_400(client, monkeypatch):
    authenticate(monkeypatch)
    calls = capture_rag_calls(monkeypatch)

    resp = client.post("/rag-response", json={"question": "q", "uselocal": "maybe"}, headers=AUTH_HEADER)

    assert resp.status_code == 400
    assert calls == []
