from dotenv import load_dotenv
from langchain.agents import create_agent
from langchain.messages import HumanMessage, SystemMessage
from prometheus_client import Counter, Histogram

from rag import get_rag_agent

load_dotenv()
agent = create_agent("gpt-4.1-mini")

RAG_QUERIES = Counter("genai_rag_queries_total", "Total RAG queries", ["status"])
RAG_QUERY_DURATION = Histogram("genai_rag_query_duration_seconds", "RAG query duration in seconds")


def hello():
    response = agent.invoke(
        {
            "messages": [
                SystemMessage(
                    "You are a helpful but very sarcastic assistant. Do not write any comments, just the answer."
                ),
                HumanMessage("Write a welcome message."),
            ]
        }
    )
    return response["messages"][-1].content


def generate_rag_response(question):
    with RAG_QUERY_DURATION.time():
        try:
            rag_agent = get_rag_agent()
            response = rag_agent.invoke({"messages": [{"role": "user", "content": question}]})
        except Exception:
            RAG_QUERIES.labels(status="failure").inc()
            raise
        RAG_QUERIES.labels(status="success").inc()
        return response["messages"][-1].content
