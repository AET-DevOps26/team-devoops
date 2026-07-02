"""LLM provider selection.

The chat model and embeddings are chosen from environment configuration so the service can run
against a local Ollama instance instead of OpenAI without code changes:

    LLM_PROVIDER      "openai" (default) or "ollama"
    LLM_MODEL         chat model name; defaults to a sensible model per provider
    EMBEDDING_MODEL   embedding model name; defaults per provider
    OLLAMA_BASE_URL   Ollama server URL; defaults to http://localhost:11434
"""

import os

from dotenv import load_dotenv
from langchain_core.embeddings import Embeddings
from langchain_core.language_models import BaseChatModel
from langchain_ollama import ChatOllama, OllamaEmbeddings
from langchain_openai import ChatOpenAI, OpenAIEmbeddings

load_dotenv()

# The ollama defaults match the models pulled by infra/ollama/entrypoint_ollama.sh.
_DEFAULT_CHAT_MODELS = {"openai": "gpt-4.1-mini", "ollama": "qwen3:0.6b"}
_DEFAULT_EMBEDDING_MODELS = {"openai": "text-embedding-3-large", "ollama": "nomic-embed-text"}


def _provider() -> str:
    provider = os.getenv("LLM_PROVIDER", "openai").lower()
    if provider not in _DEFAULT_CHAT_MODELS:
        raise ValueError(f"Unsupported LLM_PROVIDER {provider!r}; expected one of {sorted(_DEFAULT_CHAT_MODELS)}")
    return provider


def _ollama_base_url() -> str:
    return os.getenv("OLLAMA_BASE_URL", "http://localhost:11434")


def get_chat_model(use_local: bool | None = None) -> BaseChatModel:
    """Return the configured chat model.

    ``use_local`` overrides the env-configured provider for a single call: True forces Ollama,
    False forces OpenAI, None keeps the LLM_PROVIDER default. The LLM_MODEL override only applies
    when the selected provider matches the env-configured one, so forcing the other provider falls
    back to that provider's default model.
    """
    env_provider = _provider()
    if use_local is None:
        provider = env_provider
    else:
        provider = "ollama" if use_local else "openai"

    model = (os.getenv("LLM_MODEL") if provider == env_provider else None) or _DEFAULT_CHAT_MODELS[provider]
    if provider == "ollama":
        return ChatOllama(model=model, base_url=_ollama_base_url())
    return ChatOpenAI(model=model)


def get_embeddings() -> Embeddings:
    provider = _provider()
    model = os.getenv("EMBEDDING_MODEL") or _DEFAULT_EMBEDDING_MODELS[provider]
    if provider == "ollama":
        return OllamaEmbeddings(model=model, base_url=_ollama_base_url())
    return OpenAIEmbeddings(model=model)
