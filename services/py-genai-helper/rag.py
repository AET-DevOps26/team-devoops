from functools import lru_cache
from pathlib import Path

from dotenv import load_dotenv
from langchain_community.document_loaders import PyPDFLoader
from langchain_community.vectorstores import FAISS
from langchain_text_splitters import RecursiveCharacterTextSplitter
from prometheus_client import Counter, Histogram

from llm import get_embeddings, resolve_provider

load_dotenv()

RAG_QUERIES = Counter("genai_rag_queries_total", "Total RAG queries", ["status"])
RAG_QUERY_DURATION = Histogram("genai_rag_query_duration_seconds", "RAG query duration in seconds")

_FILE_STORAGE = Path(__file__).parent / "file-storage"


def _load_pdfs(use_local: bool) -> FAISS | None:
    pdf_files = list(_FILE_STORAGE.glob("*.pdf"))
    if not pdf_files:
        return None

    splitter = RecursiveCharacterTextSplitter(chunk_size=1000, chunk_overlap=200)
    docs = []
    for path in pdf_files:
        loader = PyPDFLoader(str(path))
        docs.extend(loader.load_and_split(splitter))

    return FAISS.from_documents(docs, embedding=get_embeddings(use_local))


@lru_cache(maxsize=2)
def _get_vector_store(use_local: bool) -> FAISS | None:
    """Build (once per provider) and cache the FAISS index over the PDFs in file-storage/.

    Cached per provider rather than globally: an index built from OpenAI embeddings isn't valid to
    query with Ollama embeddings (and vice versa) — different model, different vector space.
    Deferred until first use rather than built at import time, so importing this module (directly,
    or transitively via ``reports``) doesn't require API credentials or make network calls.
    """
    return _load_pdfs(use_local)


def retrieve_context(query: str, use_local: bool | None = None, k: int = 3) -> list[str]:
    """Return the text of the k knowledge-base chunks most relevant to the query.

    Returns an empty list if no PDFs are configured in file-storage/. ``use_local`` selects the
    embedding provider for both the query and the underlying index — see ``llm.get_chat_model``
    for its semantics.
    """
    with RAG_QUERY_DURATION.time():
        try:
            vector_store = _get_vector_store(resolve_provider(use_local) == "ollama")
            if vector_store is None:
                RAG_QUERIES.labels(status="success").inc()
                return []
            chunks = [doc.page_content for doc in vector_store.similarity_search(query, k=k)]
        except Exception:
            RAG_QUERIES.labels(status="failure").inc()
            raise
        RAG_QUERIES.labels(status="success").inc()
        return chunks
