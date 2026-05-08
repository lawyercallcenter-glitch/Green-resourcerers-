from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from database import get_db
from models import Job, ServiceRequest, Technician
from schemas import JobCreate, JobResponse, JobUpdate

router = APIRouter(prefix="/jobs", tags=["Jobs"])


@router.post("/", response_model=JobResponse, status_code=status.HTTP_201_CREATED)
async def create_job(payload: JobCreate, db: AsyncSession = Depends(get_db)):
    # Validate that the referenced service request exists
    sr_result = await db.execute(
        select(ServiceRequest).filter(ServiceRequest.id == payload.request_id)
    )
    service_request = sr_result.scalar_one_or_none()
    if not service_request:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Service request {payload.request_id} not found",
        )

    # Validate that the referenced technician exists and is active
    tech_result = await db.execute(
        select(Technician).filter(Technician.id == payload.technician_id)
    )
    technician = tech_result.scalar_one_or_none()
    if not technician:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Technician {payload.technician_id} not found",
        )
    if not technician.is_active:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Technician {payload.technician_id} is not active",
        )

    job = Job(**payload.model_dump())
    db.add(job)
    await db.commit()
    await db.refresh(job)
    return job


@router.get("/", response_model=list[JobResponse])
async def list_jobs(skip: int = 0, limit: int = 100, db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(Job).offset(skip).limit(limit))
    return result.scalars().all()


@router.get("/{job_id}", response_model=JobResponse)
async def get_job(job_id: int, db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(Job).filter(Job.id == job_id))
    job = result.scalar_one_or_none()
    if not job:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Job {job_id} not found",
        )
    return job


@router.patch("/{job_id}", response_model=JobResponse)
async def update_job(job_id: int, payload: JobUpdate, db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(Job).filter(Job.id == job_id))
    job = result.scalar_one_or_none()
    if not job:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Job {job_id} not found",
        )
    for field, value in payload.model_dump(exclude_unset=True).items():
        setattr(job, field, value)
    await db.commit()
    await db.refresh(job)
    return job
