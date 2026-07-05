from functools import lru_cache
from pathlib import Path

from dotenv import load_dotenv
from langchain_community.document_loaders import PyPDFLoader
from langchain_community.vectorstores import FAISS
from langchain_text_splitters import RecursiveCharacterTextSplitter
from prometheus_client import Counter, Histogram

from llm import get_embeddings

load_dotenv()

RAG_QUERIES = Counter("genai_rag_queries_total", "Total RAG queries", ["status"])
RAG_QUERY_DURATION = Histogram("genai_rag_query_duration_seconds", "RAG query duration in seconds")

_FILE_STORAGE = Path(__file__).parent / "file-storage"


def _load_pdfs() -> FAISS | None:
    pdf_files = list(_FILE_STORAGE.glob("*.pdf"))
    if not pdf_files:
        return None

    splitter = RecursiveCharacterTextSplitter(chunk_size=1000, chunk_overlap=200)
    docs = []
    for path in pdf_files:
        loader = PyPDFLoader(str(path))
        docs.extend(loader.load_and_split(splitter))

    return FAISS.from_documents(docs, embedding=get_embeddings())


@lru_cache(maxsize=1)
def _get_vector_store() -> FAISS | None:
    """Build (once) and cache the FAISS index over the PDFs in file-storage/.

    Deferred until first use rather than built at import time, so importing this module (directly,
    or transitively via ``reports``) doesn't require API credentials or make network calls.
    """
    return _load_pdfs()


def retrieve_context(query: str, k: int = 3) -> list[str]:
    """Return the text of the k knowledge-base chunks most relevant to the query.

    Returns an empty list if no PDFs are configured in file-storage/.
    """
    with RAG_QUERY_DURATION.time():
        try:
            vector_store = _get_vector_store()
            if vector_store is None:
                RAG_QUERIES.labels(status="success").inc()
                return []
            chunks = [doc.page_content for doc in vector_store.similarity_search(query, k=k)]
        except Exception:
            RAG_QUERIES.labels(status="failure").inc()
            raise
        RAG_QUERIES.labels(status="success").inc()
        return chunks
