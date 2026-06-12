from pathlib import Path

from dotenv import load_dotenv
from langchain.agents import create_agent
from langchain_community.document_loaders import PyPDFLoader
from langchain_community.vectorstores import FAISS
from langchain_core.tools import create_retriever_tool
from langchain_ollama import ChatOllama, OllamaEmbeddings
from langchain_openai import OpenAIEmbeddings
from langchain_text_splitters import RecursiveCharacterTextSplitter

load_dotenv()

_FILE_STORAGE = Path(__file__).parent / "file-storage"


def _load_pdfs(embeddings) -> FAISS | None:
    pdf_files = list(_FILE_STORAGE.glob("*.pdf"))
    if not pdf_files:
        return None

    splitter = RecursiveCharacterTextSplitter(chunk_size=1000, chunk_overlap=200)
    docs = []
    for path in pdf_files:
        loader = PyPDFLoader(str(path))
        docs.extend(loader.load_and_split(splitter))

    return FAISS.from_documents(docs, embedding=embeddings)


_local_vector_store = _load_pdfs(OllamaEmbeddings(model="nomic-embed-text", base_url="http://ollama:11434"))
_remote_vector_store = _load_pdfs(OpenAIEmbeddings(model="text-embedding-3-large"))


def get_rag_agent(local: bool):
    global _local_vector_store, _remote_vector_store
    if local:
        vector_store = _local_vector_store
        model = ChatOllama(model="qwen3:8b", base_url="http://ollama:11434", think=False)
    else:
        vector_store = _remote_vector_store
        model = "gpt-4.1-mini"

    if vector_store is None:
        raise RuntimeError("No PDFs found in file-storage/")

    retriever = vector_store.as_retriever(search_kwargs={"k": 3})

    retriever_tool = create_retriever_tool(
        retriever,
        name="kb_search",
        description="Search the knowledge base for information about preferences. Always use this tool before answering.",
    )

    rag_agent = create_agent(
        model=model,
        tools=[retriever_tool],
        system_prompt=(
            "You are a helpful assistant."
            "Always call kb_search first to retrieve relevant context."
            "Base your answer strictly on what the tool returns."
        ),
    )

    return rag_agent
