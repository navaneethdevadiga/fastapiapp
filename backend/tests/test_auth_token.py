import asyncio

from models.users import User
from utils.token import create_access_token, verify_access_token


class FakeResult:
    def __init__(self, value):
        self._value = value

    def scalar_one_or_none(self):
        return self._value


class FakeAsyncDB:
    def __init__(self, user):
        self.user = user

    async def execute(self, _statement):
        return FakeResult(self.user)


def test_verify_access_token_returns_user_for_async_session():
    user = User(id=1, name="alice", email="alice@example.com", hashed_password="hash", role="Candidate")
    db = FakeAsyncDB(user)
    token = create_access_token({"sub": "1"})

    current_user = asyncio.run(verify_access_token(token, db))

    assert current_user is user
