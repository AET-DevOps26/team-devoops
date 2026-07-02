from dotenv import load_dotenv
from langchain.agents import create_agent
from langchain.messages import HumanMessage, SystemMessage

from llm import get_chat_model
from rag import get_rag_agent

load_dotenv()
agent = create_agent(get_chat_model())


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


def generate_rag_response(question, use_local=None):
    rag_agent = get_rag_agent(use_local)
    response = rag_agent.invoke({"messages": [{"role": "user", "content": question}]})
    return response["messages"][-1].content
