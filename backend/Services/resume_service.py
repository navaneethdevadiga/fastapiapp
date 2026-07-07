import os
from dotenv import load_dotenv
from langchain_groq import ChatGroq
from langchain_core.prompts import ChatPromptTemplate

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


resume_prompt = ChatPromptTemplate.from_messages(
    [
        (
            "system",
            """You are a professional resume analyser.
Analyse the given resume text and provide:
1. Key skills found
2. Experience level (junior/Mid/Senior)
3. Strengths
4. Areas to Improve
5. Suggested Job roles
Keep the analysis short and structured.""",
        ),
        ("human", "{resume_text}"),
    ]
)


def analyze_resume(resume_text: str) -> str:
    llm = _get_llm()
    resume_chain = resume_prompt | llm
    response = resume_chain.invoke({"resume_text": resume_text})
    return response.content


def analyse_resume(resume_text: str) -> str:
    return analyze_resume(resume_text)