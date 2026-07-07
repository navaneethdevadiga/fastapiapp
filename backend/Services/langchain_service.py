import os
from typing import Dict, List
from dotenv import load_dotenv
from fastapi import HTTPException

from langchain_community.chat_message_histories import ChatMessageHistory
from langchain_core.messages import AIMessage, HumanMessage
from langchain_core.prompts import ChatPromptTemplate
from langchain_core.runnables import RunnableWithMessageHistory
from langchain_groq import ChatGroq

BASE_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", ".."))
load_dotenv(os.path.join(BASE_DIR, ".env"))

LLAMA_MODEL = "llama-3.3-70b-versatile"


def _get_llm() -> ChatGroq:
    api_key = os.getenv("GROQ_API_KEY") or os.getenv("API_KEY")
    if not api_key:
        raise RuntimeError(
            "Missing Groq API key. Set GROQ_API_KEY or API_KEY in .env or environment."
        )
    try:
        return ChatGroq(model=LLAMA_MODEL, api_key=api_key)
    except Exception as exc:
        raise RuntimeError(f"Failed to initialize Groq client: {exc}") from exc


def chat_without_memory(query: str) -> str:
    llm = _get_llm()
    response = llm.invoke(query)
    return response.content


conversation: List[HumanMessage | AIMessage] = []


def chat_with_memory(user_query: str) -> str:
    llm = _get_llm()
    conversation.append(HumanMessage(content=user_query))
    response = llm.invoke(conversation)
    conversation.append(AIMessage(content=response.content))
    return response.content


prompt_with_memory = ChatPromptTemplate.from_messages(
    [
        ("system", "You are a helpful assistant."),
        ("placeholder", "{chat_history}"),
        ("human", "{user_query}"),
    ]
)

store: Dict[str, ChatMessageHistory] = {}


def get_history(session_id: str) -> ChatMessageHistory:
    if session_id not in store:
        store[session_id] = ChatMessageHistory()
    return store[session_id]


def _build_history_chain():
    llm = _get_llm()
    chain_with_memory = prompt_with_memory | llm
    return RunnableWithMessageHistory(
        runnable=chain_with_memory,
        get_session_history=get_history,
        input_messages_key="user_query",
        message_history_key="chat_history",
    )


def get_chat_response(user_query: str, session_id: str = "default") -> str:
    try:
        chain = _build_history_chain()
        response = chain.invoke(
            {"user_query": user_query},
            {"configurable": {"session_id": session_id}},
        )
        return response.content
    except Exception as exc:
        raise HTTPException(
            status_code=503,
            detail=f"Groq chat service is unavailable: {exc}",
        ) from exc