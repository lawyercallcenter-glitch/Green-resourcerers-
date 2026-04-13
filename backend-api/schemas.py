from datetime import datetime
from enum import Enum
from typing import Optional

from pydantic import BaseModel, ConfigDict


# --- Enums ---

class RequestStatus(str, Enum):
    pending = "pending"
    approved = "approved"
    in_progress = "in_progress"
    completed = "completed"


class JobStatus(str, Enum):
    assigned = "assigned"
    in_progress = "in_progress"
    completed = "completed"


# --- Service Request Schemas ---

class ServiceRequestCreate(BaseModel):
    homeowner_name: str
    address: str
    phone: str
    email: str
    description: Optional[str] = None


class ServiceRequestUpdate(BaseModel):
    status: Optional[RequestStatus] = None
    description: Optional[str] = None


class ServiceRequestResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    homeowner_name: str
    address: str
    phone: str
    email: str
    description: Optional[str]
    status: str
    created_at: datetime
    updated_at: datetime


# --- Technician Schemas ---

class TechnicianCreate(BaseModel):
    name: str
    phone: str
    email: str


class TechnicianUpdate(BaseModel):
    name: Optional[str] = None
    phone: Optional[str] = None
    email: Optional[str] = None
    is_active: Optional[bool] = None


class TechnicianResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    name: str
    phone: str
    email: str
    is_active: bool
    created_at: datetime


# --- Job Schemas ---

class JobCreate(BaseModel):
    request_id: int
    technician_id: int
    scheduled_date: Optional[datetime] = None
    notes: Optional[str] = None


class JobUpdate(BaseModel):
    status: Optional[JobStatus] = None
    notes: Optional[str] = None
    scheduled_date: Optional[datetime] = None


class JobResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    request_id: int
    technician_id: int
    scheduled_date: Optional[datetime]
    status: str
    notes: Optional[str]
    created_at: datetime
    updated_at: datetime
