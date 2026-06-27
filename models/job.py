from sqlalchemy import Column,Integer,String,Enum,ForiegnKey,relationship
from models.company import CompanyBase
from database import Base,engine,SessionLocal

class Job(Base):
    _tablename_="jobs"
    id=Column(Integer,primary_key=True,index=True)
    title=Column(String,nullable=False)
    description=Column(String)
    salary=Column(Integer)
    company_id=Column(Integer,ForiegnKey("companies.id"))
    company=relationship("Company",back_populates="jobs")

