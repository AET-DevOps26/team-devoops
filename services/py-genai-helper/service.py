from dotenv import load_dotenv
from langchain.agents import create_agent
from langchain.messages import HumanMessage, SystemMessage

from rag import get_rag_agent

load_dotenv()
_agent = None


def _get_agent():
    global _agent
    if _agent is None:
        _agent = create_agent("gpt-4.1-mini")
    return _agent


def hello():
    response = _get_agent().invoke(
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


def generate_rag_response(question, local=False):
    rag_agent = get_rag_agent(local)
    response = rag_agent.invoke({"messages": [{"role": "user", "content": question}]})
    return response["messages"][-1].content
