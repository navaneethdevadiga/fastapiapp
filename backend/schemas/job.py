from pydantic import BaseModel
from typing import Optional


class JobBase(BaseModel):
    title: str
    salary: int
    description: Optional[str] = None
    company_id: Optional[int] = None

class JobCreate(JobBase):
    pass

class JobUpdate(JobBase):
    title: Optional[str] = None
    salary: Optional[int] = None
    description: Optional[str] = None
    company_id: Optional[int] = None

class JobResponse(JobBase):
    id: int
    company_id: Optional[int] = None
    
    model_config = {"from_attributes": True}