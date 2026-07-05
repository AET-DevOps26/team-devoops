"""Tests for the RAG retrieval provider wiring in rag.py."""

import pytest

import rag


@pytest.fixture(autouse=True)
def _clear_vector_store_cache():
    """The vector store is cached per-provider at module scope; isolate tests from each other."""
    rag._get_vector_store.cache_clear()
    yield
    rag._get_vector_store.cache_clear()


def _stub_load_pdfs(monkeypatch, calls):
    def fake_load_pdfs(use_local):
        calls.append(use_local)
        return None

    monkeypatch.setattr(rag, "_load_pdfs", fake_load_pdfs)


def test_retrieve_context_resolves_env_provider_by_default(monkeypatch):
    monkeypatch.setenv("LLM_PROVIDER", "ollama")
    calls = []
    _stub_load_pdfs(monkeypatch, calls)

    rag.retrieve_context("question")

    assert calls == [True]


def test_retrieve_context_use_local_true_forces_ollama(monkeypatch):
    monkeypatch.delenv("LLM_PROVIDER", raising=False)
    calls = []
    _stub_load_pdfs(monkeypatch, calls)

    rag.retrieve_context("question", use_local=True)

    assert calls == [True]


def test_retrieve_context_use_local_false_forces_openai(monkeypatch):
    monkeypatch.setenv("LLM_PROVIDER", "ollama")
    calls = []
    _stub_load_pdfs(monkeypatch, calls)

    rag.retrieve_context("question", use_local=False)

    assert calls == [False]


def test_vector_store_is_cached_per_provider(monkeypatch):
    calls = []
    _stub_load_pdfs(monkeypatch, calls)

    rag.retrieve_context("q1", use_local=True)
    rag.retrieve_context("q2", use_local=True)
    rag.retrieve_context("q3", use_local=False)

    # Two calls for the same provider hit the cache once; the other provider gets its own build.
    assert calls == [True, False]


def test_retrieve_context_returns_empty_list_without_pdfs(monkeypatch):
    monkeypatch.setattr(rag, "_load_pdfs", lambda use_local: None)

    assert rag.retrieve_context("question") == []
