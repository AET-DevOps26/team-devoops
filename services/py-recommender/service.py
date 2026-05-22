from dotenv import load_dotenv
from langchain.agents import create_agent
from langchain.messages import HumanMessage, SystemMessage
from rag import get_rag_agent

load_dotenv()
agent = create_agent("gpt-4.1-mini")


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
    rag_agent = get_rag_agent()
    response = rag_agent.invoke({
        "messages": [{"role": "user", "content": question}]
    })
    return response["messages"][-1].content
