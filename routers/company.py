from fastapi import APIRouter

router = APIRouter(prefix="/company",tags=["conpany"])

@router.get("/")
def read_company():
    return {"company":"Company root"}