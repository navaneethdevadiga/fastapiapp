import importlib
import sys
from pathlib import Path


BACKEND_ROOT = Path(__file__).resolve().parents[1]
if str(BACKEND_ROOT) not in sys.path:
    sys.path.insert(0, str(BACKEND_ROOT))


def test_resume_service_import_does_not_crash_without_groq_key(monkeypatch):
    monkeypatch.delenv("GROQ_API_KEY", raising=False)
    monkeypatch.delenv("API_KEY", raising=False)

    module = importlib.import_module("Services.resume_service")

    assert hasattr(module, "analyze_resume")
    assert callable(module.analyze_resume)
