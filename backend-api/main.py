"""
The Green Resourcerers – FastAPI Backend
Handles homeowner requests, job creation, job listing, and technician updates.
"""

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Optional
import uuid
from datetime import datetime

app = FastAPI(title="Green Resourcerers API", version="0.1.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# ---------------------------------------------------------------------------
# In-memory store (replace with Postgres in production)
# ---------------------------------------------------------------------------
jobs: dict = {}


# ---------------------------------------------------------------------------
# Schemas
# ---------------------------------------------------------------------------
class JobRequest(BaseModel):
    homeowner_name: str
    address: str
    phone: str
    email: Optional[str] = None
    notes: Optional[str] = None


class JobStatusUpdate(BaseModel):
    status: str  # e.g. "pending", "scheduled", "in_progress", "completed"
    technician_notes: Optional[str] = None


class Job(BaseModel):
    id: str
    homeowner_name: str
    address: str
    phone: str
    email: Optional[str]
    notes: Optional[str]
    status: str
    technician_notes: Optional[str]
    created_at: str
    updated_at: str


# ---------------------------------------------------------------------------
# Routes
# ---------------------------------------------------------------------------
@app.get("/", tags=["Health"])
def root():
    return {"message": "Green Resourcerers API is running"}


@app.post("/requests", response_model=Job, status_code=201, tags=["Requests"])
def create_request(request: JobRequest):
    """Submit a new homeowner satellite-dish removal request."""
    job_id = str(uuid.uuid4())
    now = datetime.utcnow().isoformat()
    job = {
        "id": job_id,
        "homeowner_name": request.homeowner_name,
        "address": request.address,
        "phone": request.phone,
        "email": request.email,
        "notes": request.notes,
        "status": "pending",
        "technician_notes": None,
        "created_at": now,
        "updated_at": now,
    }
    jobs[job_id] = job
    return job


@app.get("/jobs", response_model=List[Job], tags=["Jobs"])
def list_jobs():
    """List all jobs (admin / technician view)."""
    return list(jobs.values())


@app.get("/jobs/{job_id}", response_model=Job, tags=["Jobs"])
def get_job(job_id: str):
    """Get details of a single job."""
    job = jobs.get(job_id)
    if not job:
        raise HTTPException(status_code=404, detail="Job not found")
    return job


@app.patch("/jobs/{job_id}/status", response_model=Job, tags=["Jobs"])
def update_job_status(job_id: str, update: JobStatusUpdate):
    """Update the status of a job (technician workflow)."""
    job = jobs.get(job_id)
    if not job:
        raise HTTPException(status_code=404, detail="Job not found")
    job["status"] = update.status
    if update.technician_notes is not None:
        job["technician_notes"] = update.technician_notes
    job["updated_at"] = datetime.utcnow().isoformat()
    return job
