"""Job management routes (admin)."""

from datetime import datetime, timezone
from typing import List

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from database import get_db
from models import HomeownerRequest, Job, JobStatus, RequestStatus
from schemas import JobAdminUpdate, JobCreate, JobOut

router = APIRouter(prefix="/jobs", tags=["jobs"])


@router.post("/", response_model=JobOut, status_code=status.HTTP_201_CREATED)
def create_job(payload: JobCreate, db: Session = Depends(get_db)):
    """Admin — create a job from an approved homeowner request."""
    req = db.get(HomeownerRequest, payload.request_id)
    if not req:
        raise HTTPException(status_code=404, detail="Homeowner request not found")
    if req.status not in (RequestStatus.pending, RequestStatus.approved):
        raise HTTPException(
            status_code=400,
            detail=f"Cannot create job for request with status '{req.status}'",
        )

    job = Job(**payload.model_dump())
    req.status = RequestStatus.assigned
    db.add(job)
    db.commit()
    db.refresh(job)
    return job


@router.get("/", response_model=List[JobOut])
def list_jobs(
    skip: int = 0,
    limit: int = 50,
    status: JobStatus | None = None,
    technician_id: int | None = None,
    db: Session = Depends(get_db),
):
    q = db.query(Job)
    if status:
        q = q.filter(Job.status == status)
    if technician_id:
        q = q.filter(Job.technician_id == technician_id)
    return q.order_by(Job.created_at.desc()).offset(skip).limit(limit).all()


@router.get("/{job_id}", response_model=JobOut)
def get_job(job_id: int, db: Session = Depends(get_db)):
    job = db.get(Job, job_id)
    if not job:
        raise HTTPException(status_code=404, detail="Job not found")
    return job


@router.patch("/{job_id}", response_model=JobOut)
def admin_update_job(
    job_id: int,
    payload: JobAdminUpdate,
    db: Session = Depends(get_db),
):
    """Admin — reassign technician, reschedule, or change status."""
    job = db.get(Job, job_id)
    if not job:
        raise HTTPException(status_code=404, detail="Job not found")
    for field, value in payload.model_dump(exclude_none=True).items():
        setattr(job, field, value)
    if payload.status == JobStatus.completed and not job.completed_at:
        job.completed_at = datetime.now(timezone.utc)
    db.commit()
    db.refresh(job)
    return job


@router.delete("/{job_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_job(job_id: int, db: Session = Depends(get_db)):
    job = db.get(Job, job_id)
    if not job:
        raise HTTPException(status_code=404, detail="Job not found")
    db.delete(job)
    db.commit()
