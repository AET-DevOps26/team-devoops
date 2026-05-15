from dotenv import load_dotenv
from langchain.agents import create_agent
from langchain.messages import HumanMessage, SystemMessage

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
