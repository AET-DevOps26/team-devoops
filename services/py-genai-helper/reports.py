"""Report generation: kicks off generation in the background and persists the result.

Generation is fire-and-forget — the HTTP request returns immediately (202) and a daemon thread
gathers the source data, runs the LLM, then writes the finished report to the database.

The source data is the feedback stored in the feedback service. It is fetched over that service's
REST API with the caller's bearer token, so the feedback service enforces its own visibility rules
(a member sees feedback about themselves, a trainer sees feedback they submitted, an admin sees
everything) and the report can never contain data its requester wasn't allowed to read.

The prompt is additionally augmented (RAG) with excerpts pulled from the PDF knowledge base in
file-storage/ (see rag.py), retrieved by similarity to the feedback text, so reports can draw on
club reference material without it having to be repeated in every prompt verbatim.
"""

import logging
import os
import re
import threading

import requests
from langchain.messages import HumanMessage, SystemMessage
from prometheus_client import Counter

import db
from llm import get_chat_model, resolve_provider
from rag import retrieve_context

logger = logging.getLogger(__name__)

# Internal base URL of the feedback service (docker-compose service name; the API's /api/v1 prefix
# is stripped by the proxy, so the service serves /feedback directly).
FEEDBACK_SERVICE_URL = os.environ.get("FEEDBACK_SERVICE_URL", "http://feedback-service:8080")

REPORT_GENERATION = Counter(
    "genai_report_generation_total", "Total report generation attempts", ["kind", "status", "provider"]
)

_REQUEST_TIMEOUT = 30

_SYSTEM_PROMPT = (
    "You are an assistant for a sports club. You write clear, encouraging progress reports based "
    "on training feedback. Summarise strengths, recurring themes, and areas to improve. Base the "
    "report strictly on the feedback provided and, where relevant, the supplied knowledge-base "
    "excerpts; do not invent facts and ignore excerpts that aren't relevant. Answer with the "
    "report text only, no preamble. Also be critical and mean."
)


def _fetch_feedback(token: str) -> list[dict]:
    """Return all feedback entries (with text) visible to the caller.

    The list endpoint returns summaries without the feedback text, so each entry's detail is
    fetched separately.
    """
    headers = {"Authorization": f"Bearer {token}"}
    response = requests.get(f"{FEEDBACK_SERVICE_URL}/feedback", headers=headers, timeout=_REQUEST_TIMEOUT)
    response.raise_for_status()

    entries = []
    for summary in response.json():
        detail = requests.get(
            f"{FEEDBACK_SERVICE_URL}/feedback/{summary['id']}", headers=headers, timeout=_REQUEST_TIMEOUT
        )
        detail.raise_for_status()
        entries.append(detail.json())
    return entries


def _format_feedback(entry: dict) -> str:
    date = (entry.get("created_at") or "")[:10]
    event = entry.get("event", {}).get("name", "")
    creator = entry.get("creator", {}).get("name", "")
    return f"- {date} | event: {event} | rating: {entry['rating']}/10 | from {creator}: {entry['feedback']}"


def _knowledge_base_context(query: str, use_local: bool | None = None) -> str:
    """Return a prompt section with knowledge-base excerpts relevant to the query, or "" if none."""
    chunks = retrieve_context(query, use_local)
    if not chunks:
        return ""
    excerpts = "\n\n".join(f"[Excerpt {i}]\n{chunk}" for i, chunk in enumerate(chunks, start=1))
    return f"\n\nRelevant excerpts from the knowledge base:\n{excerpts}"


def _strip_reasoning(content) -> str:
    """Drop <think>…</think> blocks some local models inline in their output."""
    if not isinstance(content, str):
        content = str(content)
    return re.sub(r"<think>.*?</think>", "", content, flags=re.DOTALL).strip()


def _run_llm(prompt: str, use_local: bool | None = None) -> str:
    model = get_chat_model(use_local)
    response = model.invoke([SystemMessage(_SYSTEM_PROMPT), HumanMessage(prompt)])
    return _strip_reasoning(response.content)


def generate_member_report_text(member_id: str, token: str, use_local: bool | None = None) -> str:
    member_name = db.resolve_member_name(member_id) or "the member"
    feedback = [f for f in _fetch_feedback(token) if str(f["member"]["id"]) == str(member_id)]
    if not feedback:
        return f"No feedback has been recorded for {member_name} yet, so no report can be generated."

    lines = "\n".join(_format_feedback(f) for f in feedback)
    context = _knowledge_base_context(f"{member_name}\n{lines}", use_local)
    prompt = (
        f"Write a progress report for {member_name} based on the following training feedback "
        f"(newest data may appear in any order):\n\n{lines}{context}"
    )
    return _run_llm(prompt, use_local)


def generate_team_report_text(team_id: str, token: str, use_local: bool | None = None) -> str:
    team_name = db.resolve_team_name(team_id) or "the team"
    trainees = db.list_team_trainees(team_id)
    trainee_ids = {t["id"] for t in trainees}
    feedback = [f for f in _fetch_feedback(token) if str(f["member"]["id"]) in trainee_ids]
    if not feedback:
        return f"No feedback has been recorded for the members of {team_name} yet, so no report can be generated."

    sections = []
    for trainee in trainees:
        entries = [f for f in feedback if str(f["member"]["id"]) == trainee["id"]]
        if entries:
            lines = "\n".join(_format_feedback(f) for f in entries)
            sections.append(f"{trainee['name']}:\n{lines}")

    all_sections = "\n\n".join(sections)
    context = _knowledge_base_context(f"{team_name}\n{all_sections}", use_local)
    prompt = (
        f"Write a team progress report for {team_name}. Summarise the team as a whole, then briefly "
        f"cover each member. The training feedback per member:\n\n{all_sections}{context}"
    )
    return _run_llm(prompt, use_local)


def generate_and_store_member_report(member_id: str, token: str, use_local: bool | None = None) -> None:
    provider = resolve_provider(use_local)
    try:
        report_text = generate_member_report_text(member_id, token, use_local)
        db.insert_member_report(member_id, report_text)
        REPORT_GENERATION.labels(kind="member", status="success", provider=provider).inc()
    except Exception:
        logger.exception("Failed to generate member report for %s", member_id)
        REPORT_GENERATION.labels(kind="member", status="failure", provider=provider).inc()


def generate_and_store_team_report(team_id: str, token: str, use_local: bool | None = None) -> None:
    provider = resolve_provider(use_local)
    try:
        report_text = generate_team_report_text(team_id, token, use_local)
        db.insert_team_report(team_id, report_text)
        REPORT_GENERATION.labels(kind="team", status="success", provider=provider).inc()
    except Exception:
        logger.exception("Failed to generate team report for %s", team_id)
        REPORT_GENERATION.labels(kind="team", status="failure", provider=provider).inc()


def trigger_member_report(member_id: str, token: str, use_local: bool | None = None) -> None:
    threading.Thread(
        target=generate_and_store_member_report,
        args=(member_id, token, use_local),
        daemon=True,
    ).start()


def trigger_team_report(team_id: str, token: str, use_local: bool | None = None) -> None:
    threading.Thread(
        target=generate_and_store_team_report,
        args=(team_id, token, use_local),
        daemon=True,
    ).start()
