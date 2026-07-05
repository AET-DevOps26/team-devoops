"""Tests for the report text generation in reports.py (feedback fetching, prompting, LLM output)."""

import types

import pytest

import db
import reports

MEMBER_A = "11111111-1111-1111-1111-111111111111"
MEMBER_B = "22222222-2222-2222-2222-222222222222"
TEAM_A = "33333333-3333-3333-3333-333333333333"
TOKEN = "test-token"


def _feedback_entry(feedback_id, member_id, member_name, text, rating=7):
    return {
        "id": feedback_id,
        "event": {"id": "e1", "name": "Monday practice"},
        "member": {"id": member_id, "name": member_name},
        "creator": {"id": "c1", "name": "Coach Carter"},
        "created_at": "2026-06-28T12:00:00Z",
        "feedback": text,
        "rating": rating,
    }


class FakeResponse:
    def __init__(self, payload):
        self._payload = payload
        self.raised = False

    def raise_for_status(self):
        pass

    def json(self):
        return self._payload


def stub_feedback_api(monkeypatch, entries):
    """Fake the feedback service: the list endpoint returns summaries, the detail endpoint the entry."""
    by_id = {e["id"]: e for e in entries}
    requested = []

    def fake_get(url, headers=None, timeout=None):
        requested.append((url, headers))
        if url.endswith("/feedback"):
            summaries = [{k: v for k, v in e.items() if k != "feedback"} for e in entries]
            return FakeResponse(summaries)
        feedback_id = url.rsplit("/", 1)[1]
        return FakeResponse(by_id[feedback_id])

    monkeypatch.setattr(reports.requests, "get", fake_get)
    return requested


class _Invocations(list):
    """A list of the message batches the fake LLM was invoked with.

    Also records the ``use_local`` value each ``get_chat_model`` call received, in
    ``use_local_values``, so tests can assert on the provider-selection behaviour too.
    """

    def __init__(self):
        super().__init__()
        self.use_local_values = []


def stub_chat_model(monkeypatch, reply="generated report"):
    """Replace the LLM with a fake that records the messages (and use_local) it was invoked with."""
    invocations = _Invocations()

    def fake_get_chat_model(use_local=None):
        invocations.use_local_values.append(use_local)

        def invoke(messages):
            invocations.append(messages)
            return types.SimpleNamespace(content=reply)

        return types.SimpleNamespace(invoke=invoke)

    monkeypatch.setattr(reports, "get_chat_model", fake_get_chat_model)
    return invocations


def stub_rag_context(monkeypatch, chunks=None):
    """Replace the knowledge-base retrieval with a fake returning the given chunks (default: none)."""
    queries = []

    def fake_retrieve_context(query, use_local=None, k=3):
        queries.append(query)
        return chunks or []

    monkeypatch.setattr(reports, "retrieve_context", fake_retrieve_context)
    return queries


# --------------------------------------------------------------------------- #
# Member report
# --------------------------------------------------------------------------- #
def test_member_report_uses_only_that_members_feedback(monkeypatch):
    entries = [
        _feedback_entry("f1", MEMBER_A, "Jane Doe", "Great footwork"),
        _feedback_entry("f2", MEMBER_B, "John Roe", "Needs more stamina"),
    ]
    requested = stub_feedback_api(monkeypatch, entries)
    invocations = stub_chat_model(monkeypatch)
    stub_rag_context(monkeypatch)
    monkeypatch.setattr(db, "resolve_member_name", lambda member_id: "Jane Doe")

    text = reports.generate_member_report_text(MEMBER_A, TOKEN)

    assert text == "generated report"
    prompt = invocations[0][-1].content
    assert "Jane Doe" in prompt
    assert "Great footwork" in prompt
    assert "Needs more stamina" not in prompt
    # The caller's token is forwarded to the feedback service.
    assert all(h["Authorization"] == f"Bearer {TOKEN}" for _, h in requested)


def test_member_report_without_feedback_skips_llm(monkeypatch):
    stub_feedback_api(monkeypatch, [_feedback_entry("f2", MEMBER_B, "John Roe", "other")])
    invocations = stub_chat_model(monkeypatch)
    monkeypatch.setattr(db, "resolve_member_name", lambda member_id: "Jane Doe")

    text = reports.generate_member_report_text(MEMBER_A, TOKEN)

    assert "No feedback has been recorded for Jane Doe" in text
    assert invocations == []


def test_member_report_prompt_includes_rating_event_and_creator(monkeypatch):
    stub_feedback_api(monkeypatch, [_feedback_entry("f1", MEMBER_A, "Jane Doe", "Great footwork", rating=9)])
    invocations = stub_chat_model(monkeypatch)
    stub_rag_context(monkeypatch)
    monkeypatch.setattr(db, "resolve_member_name", lambda member_id: "Jane Doe")

    reports.generate_member_report_text(MEMBER_A, TOKEN)

    prompt = invocations[0][-1].content
    assert "rating: 9/10" in prompt
    assert "Monday practice" in prompt
    assert "Coach Carter" in prompt
    assert "2026-06-28" in prompt


def test_member_report_forwards_use_local_to_chat_model(monkeypatch):
    stub_feedback_api(monkeypatch, [_feedback_entry("f1", MEMBER_A, "Jane Doe", "Great footwork")])
    invocations = stub_chat_model(monkeypatch)
    stub_rag_context(monkeypatch)
    monkeypatch.setattr(db, "resolve_member_name", lambda member_id: "Jane Doe")

    reports.generate_member_report_text(MEMBER_A, TOKEN, use_local=True)

    assert invocations.use_local_values == [True]


def test_team_report_forwards_use_local_to_chat_model(monkeypatch):
    stub_feedback_api(monkeypatch, [_feedback_entry("f1", MEMBER_A, "Jane Doe", "Great footwork")])
    invocations = stub_chat_model(monkeypatch, reply="team report")
    stub_rag_context(monkeypatch)
    monkeypatch.setattr(db, "resolve_team_name", lambda team_id: "First Team")
    monkeypatch.setattr(db, "list_team_trainees", lambda team_id: [{"id": MEMBER_A, "name": "Jane Doe"}])

    reports.generate_team_report_text(TEAM_A, TOKEN, use_local=False)

    assert invocations.use_local_values == [False]


# --------------------------------------------------------------------------- #
# RAG: knowledge-base context from the PDFs in file-storage/
# --------------------------------------------------------------------------- #
def test_member_report_includes_retrieved_pdf_context(monkeypatch):
    stub_feedback_api(monkeypatch, [_feedback_entry("f1", MEMBER_A, "Jane Doe", "Great footwork")])
    invocations = stub_chat_model(monkeypatch)
    queries = stub_rag_context(monkeypatch, chunks=["Club policy: praise effort before results."])
    monkeypatch.setattr(db, "resolve_member_name", lambda member_id: "Jane Doe")

    reports.generate_member_report_text(MEMBER_A, TOKEN)

    prompt = invocations[0][-1].content
    assert "Club policy: praise effort before results." in prompt
    # The retrieval query is derived from the member and their feedback, not hardcoded.
    assert "Jane Doe" in queries[0]
    assert "Great footwork" in queries[0]


def test_member_report_omits_context_section_when_no_pdfs_match(monkeypatch):
    stub_feedback_api(monkeypatch, [_feedback_entry("f1", MEMBER_A, "Jane Doe", "Great footwork")])
    invocations = stub_chat_model(monkeypatch)
    stub_rag_context(monkeypatch, chunks=[])
    monkeypatch.setattr(db, "resolve_member_name", lambda member_id: "Jane Doe")

    reports.generate_member_report_text(MEMBER_A, TOKEN)

    prompt = invocations[0][-1].content
    assert "knowledge base" not in prompt.lower()


# --------------------------------------------------------------------------- #
# Team report
# --------------------------------------------------------------------------- #
def test_team_report_groups_by_trainee_and_filters_non_members(monkeypatch):
    entries = [
        _feedback_entry("f1", MEMBER_A, "Jane Doe", "Great footwork"),
        _feedback_entry("f2", MEMBER_B, "John Roe", "Not in this team"),
    ]
    stub_feedback_api(monkeypatch, entries)
    invocations = stub_chat_model(monkeypatch, reply="team report")
    stub_rag_context(monkeypatch)
    monkeypatch.setattr(db, "resolve_team_name", lambda team_id: "First Team")
    monkeypatch.setattr(db, "list_team_trainees", lambda team_id: [{"id": MEMBER_A, "name": "Jane Doe"}])

    text = reports.generate_team_report_text(TEAM_A, TOKEN)

    assert text == "team report"
    prompt = invocations[0][-1].content
    assert "First Team" in prompt
    assert "Jane Doe:" in prompt
    assert "Great footwork" in prompt
    assert "Not in this team" not in prompt


def test_team_report_without_feedback_skips_llm(monkeypatch):
    stub_feedback_api(monkeypatch, [])
    invocations = stub_chat_model(monkeypatch)
    monkeypatch.setattr(db, "resolve_team_name", lambda team_id: "First Team")
    monkeypatch.setattr(db, "list_team_trainees", lambda team_id: [{"id": MEMBER_A, "name": "Jane Doe"}])

    text = reports.generate_team_report_text(TEAM_A, TOKEN)

    assert "No feedback has been recorded for the members of First Team" in text
    assert invocations == []


# --------------------------------------------------------------------------- #
# LLM output handling
# --------------------------------------------------------------------------- #
def test_reasoning_blocks_are_stripped(monkeypatch):
    stub_feedback_api(monkeypatch, [_feedback_entry("f1", MEMBER_A, "Jane Doe", "Great footwork")])
    stub_chat_model(monkeypatch, reply="<think>hmm, let me reason</think>\nThe actual report.")
    stub_rag_context(monkeypatch)
    monkeypatch.setattr(db, "resolve_member_name", lambda member_id: "Jane Doe")

    text = reports.generate_member_report_text(MEMBER_A, TOKEN)

    assert text == "The actual report."


# --------------------------------------------------------------------------- #
# Failure handling in the background worker
# --------------------------------------------------------------------------- #
def test_worker_does_not_persist_when_fetch_fails(monkeypatch):
    def failing_get(url, headers=None, timeout=None):
        raise reports.requests.ConnectionError("feedback service down")

    monkeypatch.setattr(reports.requests, "get", failing_get)
    monkeypatch.setattr(db, "resolve_member_name", lambda member_id: "Jane Doe")
    monkeypatch.setattr(db, "insert_member_report", lambda *a: pytest.fail("must not persist"))

    # Must not raise (it runs on a daemon thread); the failure is logged instead.
    reports.generate_and_store_member_report(MEMBER_A, TOKEN)
