from pydantic import BaseModel

class UserBase(BaseModel):
    name: str
    email: str
    password: str
    role: str

class UserCreate(UserBase):
    pass

class UserResponse(BaseModel):
    id: int
    name: str
    email: str
    role: str
    model_config = {"from_attributes": True}

class Login_User(BaseModel):
    username: str  # OAuth2 standard uses 'username' field
    password: str

class LoginEmail(BaseModel):
    email: str
    password: str