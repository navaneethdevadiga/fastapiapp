from fastapi import APIRouter, HTTPException, Depends, status
from schemas.job import JobCreate, JobUpdate, JobResponse
from models.job import Job
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from database import get_db
from utils.oauth2 import role_required

router = APIRouter(prefix="/job", tags=["job"])


@router.post("/", status_code=status.HTTP_201_CREATED, response_model=JobResponse)
async def create_job(job: JobCreate, db: AsyncSession = Depends(get_db), current_user=Depends(role_required(["admin", "hr"]))):
    try:
        db_job = Job(**job.dict())
        db.add(db_job)
        await db.commit()
        await db.refresh(db_job)
        return db_job
    except Exception as exc:
        await db.rollback()
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=f"Database error creating job: {str(exc)}") from exc


@router.get("/", status_code=status.HTTP_200_OK, response_model=list[JobResponse])
async def get_all_job(db: AsyncSession = Depends(get_db)):
    try:
        result = await db.execute(select(Job))
        return result.scalars().all()
    except Exception as exc:
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=f"Database error retrieving jobs: {str(exc)}") from exc


@router.get("/{job_id}", status_code=status.HTTP_200_OK, response_model=JobResponse)
async def get_job(job_id: int, db: AsyncSession = Depends(get_db)):
    try:
        result = await db.execute(select(Job).filter(Job.id == job_id))
        job = result.scalar_one_or_none()
    except Exception as exc:
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=f"Database error retrieving job: {str(exc)}") from exc

    if not job:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Job not found")
    return job


@router.put("/{job_id}", status_code=status.HTTP_201_CREATED)
async def update_job(job_id: int, job: JobUpdate, db: AsyncSession = Depends(get_db), current_user=Depends(role_required(["admin", "hr"]))):
    try:
        result = await db.execute(select(Job).filter(Job.id == job_id))
        db_job = result.scalar_one_or_none()
    except Exception as exc:
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=f"Database error updating job: {str(exc)}") from exc

    if not db_job:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Job not found")

    for key, value in job.dict().items():
        if value is not None:
            setattr(db_job, key, value)

    await db.commit()
    await db.refresh(db_job)
    return db_job


@router.delete("/{job_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_job(job_id: int, db: AsyncSession = Depends(get_db), current_user=Depends(role_required(["admin", "hr"]))):
    try:
        result = await db.execute(select(Job).filter(Job.id == job_id))
        db_job = result.scalar_one_or_none()
    except Exception as exc:
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=f"Database error deleting job: {str(exc)}") from exc

    if not db_job:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Job not found")

    await db.delete(db_job)
    await db.commit()
    return {"message": "Job deleted successfully"}