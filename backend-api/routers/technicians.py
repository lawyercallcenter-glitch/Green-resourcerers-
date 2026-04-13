"""Technician management + field update routes."""

from datetime import datetime, timezone
from typing import List

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from database import get_db
from models import Job, JobStatus, Technician
from schemas import JobOut, JobTechnicianUpdate, TechnicianCreate, TechnicianOut

router = APIRouter(prefix="/technicians", tags=["technicians"])


# ── Technician CRUD ────────────────────────────────────────────────────────────

@router.post("/", response_model=TechnicianOut, status_code=status.HTTP_201_CREATED)
def create_technician(payload: TechnicianCreate, db: Session = Depends(get_db)):
    tech = Technician(**payload.model_dump())
    db.add(tech)
    db.commit()
    db.refresh(tech)
    return tech


@router.get("/", response_model=List[TechnicianOut])
def list_technicians(skip: int = 0, limit: int = 50, db: Session = Depends(get_db)):
    return db.query(Technician).offset(skip).limit(limit).all()


@router.get("/{technician_id}", response_model=TechnicianOut)
def get_technician(technician_id: int, db: Session = Depends(get_db)):
    tech = db.get(Technician, technician_id)
    if not tech:
        raise HTTPException(status_code=404, detail="Technician not found")
    return tech


# ── Field Updates (from mobile app) ───────────────────────────────────────────

@router.get("/{technician_id}/jobs", response_model=List[JobOut])
def get_technician_jobs(
    technician_id: int,
    status: JobStatus | None = None,
    db: Session = Depends(get_db),
):
    """Return all jobs assigned to a technician."""
    tech = db.get(Technician, technician_id)
    if not tech:
        raise HTTPException(status_code=404, detail="Technician not found")
    q = db.query(Job).filter(Job.technician_id == technician_id)
    if status:
        q = q.filter(Job.status == status)
    return q.order_by(Job.scheduled_date).all()


@router.patch("/{technician_id}/jobs/{job_id}", response_model=JobOut)
def technician_update_job(
    technician_id: int,
    job_id: int,
    payload: JobTechnicianUpdate,
    db: Session = Depends(get_db),
):
    """Technician field update — called from the mobile app."""
    job = db.get(Job, job_id)
    if not job:
        raise HTTPException(status_code=404, detail="Job not found")
    if job.technician_id != technician_id:
        raise HTTPException(
            status_code=403,
            detail="This job is not assigned to you",
        )
    for field, value in payload.model_dump(exclude_none=True).items():
        setattr(job, field, value)
    if payload.status == JobStatus.completed and not job.completed_at:
        job.completed_at = datetime.now(timezone.utc)
    db.commit()
    db.refresh(job)
    return job
