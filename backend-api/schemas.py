"""Pydantic schemas for request/response validation."""

from datetime import datetime
from typing import Optional

from pydantic import BaseModel, EmailStr, Field

from models import JobStatus, RequestStatus


# ── Homeowner Request ──────────────────────────────────────────────────────────

class HomeownerRequestCreate(BaseModel):
    first_name: str = Field(..., max_length=100)
    last_name: str = Field(..., max_length=100)
    email: EmailStr
    phone: str = Field(..., max_length=30)
    address: str = Field(..., max_length=255)
    city: str = Field(..., max_length=100)
    state: str = Field(..., max_length=50)
    zip_code: str = Field(..., max_length=20)
    dish_count: int = Field(default=1, ge=1)
    dish_location: Optional[str] = Field(default=None, max_length=255)
    notes: Optional[str] = None


class HomeownerRequestUpdate(BaseModel):
    status: Optional[RequestStatus] = None
    dish_count: Optional[int] = Field(default=None, ge=1)
    dish_location: Optional[str] = None
    notes: Optional[str] = None


class HomeownerRequestOut(BaseModel):
    id: int
    first_name: str
    last_name: str
    email: str
    phone: str
    address: str
    city: str
    state: str
    zip_code: str
    dish_count: int
    dish_location: Optional[str]
    notes: Optional[str]
    status: RequestStatus
    created_at: Optional[datetime]
    updated_at: Optional[datetime]

    model_config = {"from_attributes": True}


# ── Technician ─────────────────────────────────────────────────────────────────

class TechnicianCreate(BaseModel):
    name: str = Field(..., max_length=200)
    email: EmailStr
    phone: Optional[str] = Field(default=None, max_length=30)
    certification_number: Optional[str] = Field(default=None, max_length=100)


class TechnicianOut(BaseModel):
    id: int
    name: str
    email: str
    phone: Optional[str]
    certification_number: Optional[str]
    is_active: int
    created_at: Optional[datetime]

    model_config = {"from_attributes": True}


# ── Job ────────────────────────────────────────────────────────────────────────

class JobCreate(BaseModel):
    request_id: int
    technician_id: Optional[int] = None
    scheduled_date: Optional[datetime] = None
    admin_notes: Optional[str] = None


class JobTechnicianUpdate(BaseModel):
    """Payload a technician sends when updating a job from the field."""

    status: Optional[JobStatus] = None
    dishes_removed: Optional[int] = Field(default=None, ge=0)
    materials_weight_lbs: Optional[float] = Field(default=None, ge=0)
    technician_notes: Optional[str] = None


class JobAdminUpdate(BaseModel):
    status: Optional[JobStatus] = None
    technician_id: Optional[int] = None
    scheduled_date: Optional[datetime] = None
    admin_notes: Optional[str] = None


class JobOut(BaseModel):
    id: int
    request_id: int
    technician_id: Optional[int]
    status: JobStatus
    scheduled_date: Optional[datetime]
    completed_at: Optional[datetime]
    dishes_removed: int
    materials_weight_lbs: float
    technician_notes: Optional[str]
    admin_notes: Optional[str]
    created_at: Optional[datetime]
    updated_at: Optional[datetime]

    model_config = {"from_attributes": True}
