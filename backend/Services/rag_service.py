import os
from dotenv import load_dotenv
from langchain_groq import ChatGroq
from langchain_core.prompts import ChatPromptTemplate
from Services.qdrant_service import search_jobs

load_dotenv()


def _get_llm() -> ChatGroq:
    api_key = os.getenv("GROQ_API_KEY") or os.getenv("API_KEY")
    if not api_key:
        raise RuntimeError(
            "Missing Groq API key. Set GROQ_API_KEY or API_KEY in .env or environment."
        )
    return ChatGroq(
        model="llama-3.3-70b-versatile",
        api_key=api_key,
        temperature=0.3,
    )


rag_prompt = ChatPromptTemplate.from_messages(
    [
        (
            "system",
            """You are a job search assistant.
Use the following job listings retrieved from the database to answer.
If no relevant jobs are found, say so clearly.

Retrieved Jobs:
{context}""",
        ),
        ("human", "{question}"),
    ]
)


def rag_job_search(question: str) -> str:
    results = search_jobs(question, top_k=5)
    if not results:
        return "No jobs found in the database. Please embed jobs first using the /rag/embed/-jobs endpoint."
    context = "\n".join(
        [
            f"- {r['title']}: {r['description']} (Salary: {r['salary']}, Match: {r['score']})"
            for r in results
        ]
    )

    llm = _get_llm()
    rag_chain = rag_prompt | llm
    response = rag_chain.invoke({"context": context, "question": question})
    return response.content