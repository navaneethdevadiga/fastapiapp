import asyncio
import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parents[1]))

from routers.job import get_all_job


class DummyScalarsResult:
    def __init__(self, values):
        self._values = values

    def all(self):
        return self._values


class DummyResult:
    def __init__(self, values):
        self._values = values

    def scalars(self):
        return DummyScalarsResult(self._values)


class DummyAsyncSession:
    async def execute(self, stmt):
        return DummyResult([type("Job", (), {"title": "Software Engineer"})()])


def test_get_all_job_uses_async_session_execution():
    jobs = asyncio.run(get_all_job(db=DummyAsyncSession()))

    assert len(jobs) == 1
    assert jobs[0].title == "Software Engineer"
