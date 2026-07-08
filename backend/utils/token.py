from jose import jwt
from datetime import datetime, timedelta
from dotenv import load_dotenv
import os
from models import users
from fastapi import HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select

load_dotenv()
SECRET_KEY=os.getenv("SECRET_KEY", "my_secret_key")
ALGORITHM=os.getenv("ALGORITHM", "HS256").strip().replace("+", "")


def create_access_token(data: dict, expires_delta: timedelta = timedelta(hours=2)):
    to_encode = data.copy()
    expire = datetime.now() + expires_delta
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, key=SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt


async def verify_access_token(token: str, db: AsyncSession):
    try:
        to_decode = jwt.decode(token, key=SECRET_KEY, algorithms=[ALGORITHM])
        user_id = to_decode.get("sub")
        if user_id is None:
            raise HTTPException(status_code=401, detail="Invalid token")

        result = await db.execute(select(users.User).where(users.User.id == int(user_id)))
        current_user = result.scalar_one_or_none()
        if current_user is None:
            raise HTTPException(status_code=401, detail="User not found")
        return current_user
    except HTTPException:
        raise
    except Exception:
        raise HTTPException(status_code=401, detail="Invalid credentials")
