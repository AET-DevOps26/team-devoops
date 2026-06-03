from dotenv import load_dotenv
from langchain.agents import create_agent
from langchain_community.vectorstores import FAISS
from langchain_core.tools import create_retriever_tool
from langchain_openai import OpenAIEmbeddings

load_dotenv()

# Loads an existing embedding model
embeddings = OpenAIEmbeddings(model="text-embedding-3-large")

texts = [
    "I enjoy oranges.",
    "I love apples.",
    "I think pears taste very good",
    "I hate bananas.",
    "I dislike raspberries",
    "I despise mangos.",
    "I love Linux.",
    "I hate Windows.",
]

# Creates a vector store of our inputs using embeddings
vector_store = FAISS.from_texts(texts, embedding=embeddings)


def get_rag_agent():
    retriever = vector_store.as_retriever(search_kwargs={"k": 3})

    retriever_tool = create_retriever_tool(
        retriever,
        name="kb_search",
        description="Search the knowledge base for information about preferences. Always use this tool before answering.",
    )

    rag_agent = create_agent(
        model="gpt-4.1-mini",
        tools=[retriever_tool],
        system_prompt=(
            "You are a helpful assistant."
            "Always call kb_search first to retrieve relevant context."
            "Base your answer strictly on what the tool returns."
        ),
    )

    return rag_agent
