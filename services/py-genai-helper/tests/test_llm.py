"""Tests for the env-driven LLM provider selection in llm.py."""

import pytest
from langchain_ollama import ChatOllama, OllamaEmbeddings
from langchain_openai import ChatOpenAI, OpenAIEmbeddings

import llm


def test_defaults_to_openai(monkeypatch):
    monkeypatch.delenv("LLM_PROVIDER", raising=False)
    monkeypatch.delenv("LLM_MODEL", raising=False)
    monkeypatch.setenv("OPENAI_API_KEY", "test-key")

    model = llm.get_chat_model()

    assert isinstance(model, ChatOpenAI)
    assert model.model_name == "gpt-4.1-mini"


def test_ollama_chat_model(monkeypatch):
    monkeypatch.setenv("LLM_PROVIDER", "ollama")
    monkeypatch.delenv("LLM_MODEL", raising=False)
    monkeypatch.setenv("OLLAMA_BASE_URL", "http://ollama:11434")

    model = llm.get_chat_model()

    assert isinstance(model, ChatOllama)
    assert model.model == "qwen3:0.6b"
    assert model.base_url == "http://ollama:11434"


def test_model_override(monkeypatch):
    monkeypatch.setenv("LLM_PROVIDER", "ollama")
    monkeypatch.setenv("LLM_MODEL", "mistral")

    model = llm.get_chat_model()

    assert isinstance(model, ChatOllama)
    assert model.model == "mistral"


def test_openai_embeddings(monkeypatch):
    monkeypatch.delenv("LLM_PROVIDER", raising=False)
    monkeypatch.delenv("EMBEDDING_MODEL", raising=False)
    monkeypatch.setenv("OPENAI_API_KEY", "test-key")

    embeddings = llm.get_embeddings()

    assert isinstance(embeddings, OpenAIEmbeddings)
    assert embeddings.model == "text-embedding-3-large"


def test_ollama_embeddings(monkeypatch):
    monkeypatch.setenv("LLM_PROVIDER", "ollama")
    monkeypatch.delenv("EMBEDDING_MODEL", raising=False)

    embeddings = llm.get_embeddings()

    assert isinstance(embeddings, OllamaEmbeddings)
    assert embeddings.model == "nomic-embed-text"


def test_use_local_true_overrides_env_provider(monkeypatch):
    monkeypatch.delenv("LLM_PROVIDER", raising=False)
    monkeypatch.setenv("OPENAI_API_KEY", "test-key")

    model = llm.get_chat_model(use_local=True)

    assert isinstance(model, ChatOllama)
    assert model.model == "qwen3:0.6b"


def test_use_local_false_overrides_env_provider(monkeypatch):
    monkeypatch.setenv("LLM_PROVIDER", "ollama")
    monkeypatch.setenv("OPENAI_API_KEY", "test-key")

    model = llm.get_chat_model(use_local=False)

    assert isinstance(model, ChatOpenAI)
    assert model.model_name == "gpt-4.1-mini"


def test_llm_model_override_ignored_for_forced_provider(monkeypatch):
    # LLM_MODEL names a model of the env provider; forcing the other provider must not reuse it.
    monkeypatch.setenv("LLM_PROVIDER", "ollama")
    monkeypatch.setenv("LLM_MODEL", "qwen3:8b")
    monkeypatch.setenv("OPENAI_API_KEY", "test-key")

    model = llm.get_chat_model(use_local=False)

    assert isinstance(model, ChatOpenAI)
    assert model.model_name == "gpt-4.1-mini"


def test_unknown_provider_raises(monkeypatch):
    monkeypatch.setenv("LLM_PROVIDER", "azure")

    with pytest.raises(ValueError, match="Unsupported LLM_PROVIDER"):
        llm.get_chat_model()


def test_embeddings_use_local_true_overrides_env_provider(monkeypatch):
    monkeypatch.delenv("LLM_PROVIDER", raising=False)
    monkeypatch.setenv("OPENAI_API_KEY", "test-key")

    embeddings = llm.get_embeddings(use_local=True)

    assert isinstance(embeddings, OllamaEmbeddings)
    assert embeddings.model == "nomic-embed-text"


def test_embeddings_use_local_false_overrides_env_provider(monkeypatch):
    monkeypatch.setenv("LLM_PROVIDER", "ollama")
    monkeypatch.setenv("OPENAI_API_KEY", "test-key")

    embeddings = llm.get_embeddings(use_local=False)

    assert isinstance(embeddings, OpenAIEmbeddings)
    assert embeddings.model == "text-embedding-3-large"


def test_embeddings_model_override_ignored_for_forced_provider(monkeypatch):
    monkeypatch.setenv("LLM_PROVIDER", "ollama")
    monkeypatch.setenv("EMBEDDING_MODEL", "nomic-embed-text-v2")
    monkeypatch.setenv("OPENAI_API_KEY", "test-key")

    embeddings = llm.get_embeddings(use_local=False)

    assert isinstance(embeddings, OpenAIEmbeddings)
    assert embeddings.model == "text-embedding-3-large"


def test_resolve_provider_defaults_to_env(monkeypatch):
    monkeypatch.setenv("LLM_PROVIDER", "ollama")

    assert llm.resolve_provider() == "ollama"
    assert llm.resolve_provider(use_local=False) == "openai"
    assert llm.resolve_provider(use_local=True) == "ollama"
