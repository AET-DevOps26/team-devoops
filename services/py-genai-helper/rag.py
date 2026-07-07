import json
from functools import lru_cache
from pathlib import Path

import chromadb
from dotenv import load_dotenv
from langchain_chroma import Chroma
from langchain_community.document_loaders import PyPDFLoader
from langchain_core.documents import Document
from langchain_core.embeddings import Embeddings
from langchain_text_splitters import RecursiveCharacterTextSplitter
from prometheus_client import Counter, Histogram

from llm import get_embeddings, resolve_provider

load_dotenv()

RAG_QUERIES = Counter("genai_rag_queries_total", "Total RAG queries", ["status", "provider"])
RAG_QUERY_DURATION = Histogram("genai_rag_query_duration_seconds", "RAG query duration in seconds", ["provider"])

_FILE_STORAGE = Path(__file__).parent / "file-storage"
# Persisted Chroma collections, one subdirectory per embedding provider (see _load_pdfs). Embedding
# a PDF corpus costs real API calls/time, so the index is written to disk once and reloaded by every
# later process (e.g. every gunicorn worker) instead of re-embedding on each of them.
_VECTOR_STORE = Path(__file__).parent / "vector-store"
_MANIFEST_NAME = "manifest.json"


def _manifest(pdf_files: list[Path]) -> dict[str, int]:
    """Fingerprint of the PDFs an index was built from, to detect a stale on-disk index."""
    return {path.name: path.stat().st_mtime_ns for path in pdf_files}


def _load_persisted(provider: str, manifest: dict[str, int], embeddings: Embeddings) -> Chroma | None:
    """Load the on-disk collection for `provider`, or None if missing/stale/unreadable."""
    store_dir = _VECTOR_STORE / provider
    manifest_file = store_dir / _MANIFEST_NAME
    if not manifest_file.exists():
        return None
    try:
        if json.loads(manifest_file.read_text()) != manifest:
            return None
        client = chromadb.PersistentClient(path=str(store_dir))
        return Chroma(collection_name=provider, embedding_function=embeddings, client=client)
    except Exception:
        # Corrupt or incompatible on-disk collection (e.g. written by a different Chroma/langchain
        # version) — fall back to rebuilding rather than taking the service down.
        return None


def _persist(provider: str, manifest: dict[str, int], docs: list[Document], embeddings: Embeddings) -> Chroma:
    store_dir = _VECTOR_STORE / provider
    store_dir.mkdir(parents=True, exist_ok=True)
    # chromadb caches one PersistentClient per path in-process, so deleting/recreating store_dir
    # out from under an already-cached client leaves it holding handles to the removed files
    # (surfacing as "attempt to write a readonly database"). Go through the same cached client to
    # drop the old collection instead, so a stale manifest (file-storage/ changed) rebuilds cleanly.
    client = chromadb.PersistentClient(path=str(store_dir))
    try:
        client.delete_collection(provider)
    except Exception:
        pass  # first build for this provider — nothing to delete yet
    vector_store = Chroma.from_documents(docs, embedding=embeddings, collection_name=provider, client=client)
    (store_dir / _MANIFEST_NAME).write_text(json.dumps(manifest))
    return vector_store


def _load_pdfs(use_local: bool) -> Chroma | None:
    pdf_files = list(_FILE_STORAGE.glob("*.pdf"))
    if not pdf_files:
        return None

    provider = "ollama" if use_local else "openai"
    manifest = _manifest(pdf_files)
    embeddings = get_embeddings(use_local)

    vector_store = _load_persisted(provider, manifest, embeddings)
    if vector_store is not None:
        return vector_store

    splitter = RecursiveCharacterTextSplitter(chunk_size=1000, chunk_overlap=200)
    docs = []
    for path in pdf_files:
        loader = PyPDFLoader(str(path))
        docs.extend(loader.load_and_split(splitter))

    return _persist(provider, manifest, docs, embeddings)


@lru_cache(maxsize=2)
def _get_vector_store(use_local: bool) -> Chroma | None:
    """Build (once per provider) and cache the Chroma collection over the PDFs in file-storage/.

    Cached per provider rather than globally: a collection built from OpenAI embeddings isn't valid
    to query with Ollama embeddings (and vice versa) — different model, different vector space.
    Deferred until first use rather than built at import time, so importing this module (directly,
    or transitively via ``reports``) doesn't require API credentials or make network calls.
    """
    return _load_pdfs(use_local)


def retrieve_context(query: str, use_local: bool | None = None, k: int = 5) -> list[str]:
    """Return the text of the k knowledge-base chunks most relevant to the query.

    Returns an empty list if no PDFs are configured in file-storage/. ``use_local`` selects the
    embedding provider for both the query and the underlying index — see ``llm.get_chat_model``
    for its semantics.
    """
    provider = resolve_provider(use_local)
    with RAG_QUERY_DURATION.labels(provider=provider).time():
        try:
            vector_store = _get_vector_store(provider == "ollama")
            if vector_store is None:
                RAG_QUERIES.labels(status="success", provider=provider).inc()
                return []
            chunks = [doc.page_content for doc in vector_store.similarity_search(query, k=k)]
        except Exception:
            RAG_QUERIES.labels(status="failure", provider=provider).inc()
            raise
        RAG_QUERIES.labels(status="success", provider=provider).inc()
        return chunks
