"""Tests for the RAG retrieval provider wiring in rag.py."""

import pytest
from langchain_core.documents import Document
from langchain_core.embeddings import Embeddings

import rag


class _FakeEmbeddings(Embeddings):
    """Dependency-free stand-in for a real embedding model: fixed vector for every input."""

    def __init__(self, model="fake-model"):
        self.model = model

    def embed_documents(self, texts):
        return [[1.0, 0.0] for _ in texts]

    def embed_query(self, text):
        return [1.0, 0.0]


def _stub_pdf_loader(monkeypatch, calls):
    """Replace PyPDFLoader with one that records the paths it was asked to load."""

    class _FakeLoader:
        def __init__(self, path):
            self.path = path

        def load_and_split(self, splitter):
            calls.append(self.path)
            return [Document(page_content=f"content of {self.path}")]

    monkeypatch.setattr(rag, "PyPDFLoader", _FakeLoader)


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


def _set_up_file_storage(monkeypatch, tmp_path):
    file_storage = tmp_path / "file-storage"
    file_storage.mkdir()
    (file_storage / "a.pdf").write_bytes(b"content")
    monkeypatch.setattr(rag, "_FILE_STORAGE", file_storage)
    monkeypatch.setattr(rag, "_VECTOR_STORE", tmp_path / "vector-store")
    monkeypatch.setattr(rag, "get_embeddings", lambda use_local: _FakeEmbeddings())
    return file_storage


def test_load_pdfs_persists_index_to_disk(monkeypatch, tmp_path):
    _set_up_file_storage(monkeypatch, tmp_path)
    calls = []
    _stub_pdf_loader(monkeypatch, calls)

    vector_store = rag._load_pdfs(use_local=False)

    assert vector_store is not None
    assert len(calls) == 1
    store_dir = tmp_path / "vector-store" / "openai"
    assert (store_dir / "manifest.json").exists()
    assert (store_dir / "chroma.sqlite3").exists()


def test_load_pdfs_reuses_persisted_index_without_reloading_pdfs(monkeypatch, tmp_path):
    _set_up_file_storage(monkeypatch, tmp_path)
    calls = []
    _stub_pdf_loader(monkeypatch, calls)
    rag._load_pdfs(use_local=False)
    calls.clear()

    vector_store = rag._load_pdfs(use_local=False)

    assert vector_store is not None
    assert calls == []


def test_load_pdfs_rebuilds_when_file_storage_changes(monkeypatch, tmp_path):
    file_storage = _set_up_file_storage(monkeypatch, tmp_path)
    calls = []
    _stub_pdf_loader(monkeypatch, calls)
    rag._load_pdfs(use_local=False)
    calls.clear()

    (file_storage / "b.pdf").write_bytes(b"more content")
    rag._load_pdfs(use_local=False)

    assert sorted(calls) == sorted(str(file_storage / name) for name in ("a.pdf", "b.pdf"))


def test_load_pdfs_rebuilds_when_embedding_model_changes(monkeypatch, tmp_path):
    file_storage = _set_up_file_storage(monkeypatch, tmp_path)
    calls = []
    _stub_pdf_loader(monkeypatch, calls)
    rag._load_pdfs(use_local=False)
    calls.clear()

    monkeypatch.setattr(rag, "get_embeddings", lambda use_local: _FakeEmbeddings(model="other-model"))
    rag._load_pdfs(use_local=False)

    assert calls == [str(file_storage / "a.pdf")]


def test_load_pdfs_indexes_are_kept_separate_per_provider(monkeypatch, tmp_path):
    _set_up_file_storage(monkeypatch, tmp_path)
    calls = []
    _stub_pdf_loader(monkeypatch, calls)

    rag._load_pdfs(use_local=False)
    rag._load_pdfs(use_local=True)

    assert (tmp_path / "vector-store" / "openai" / "manifest.json").exists()
    assert (tmp_path / "vector-store" / "ollama" / "manifest.json").exists()
    # Neither provider's build reused the other's on-disk index.
    assert len(calls) == 2


def test_load_persisted_returns_none_without_manifest(tmp_path, monkeypatch):
    monkeypatch.setattr(rag, "_VECTOR_STORE", tmp_path / "vector-store")

    assert rag._load_persisted("openai", manifest={}, embeddings=_FakeEmbeddings()) is None


def test_load_persisted_returns_none_on_manifest_mismatch(tmp_path, monkeypatch):
    monkeypatch.setattr(rag, "_VECTOR_STORE", tmp_path / "vector-store")
    store_dir = tmp_path / "vector-store" / "openai"
    store_dir.mkdir(parents=True)
    (store_dir / rag._MANIFEST_NAME).write_text('{"a.pdf": 1}')

    assert rag._load_persisted("openai", manifest={"a.pdf": 2}, embeddings=_FakeEmbeddings()) is None
