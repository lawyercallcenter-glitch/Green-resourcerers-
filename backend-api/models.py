"""SQLAlchemy ORM models for Green Resourcerers backend."""

import enum
from datetime import datetime

from sqlalchemy import (
    Column, DateTime, Enum, Float, ForeignKey, Integer, String, Text
)
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func

from database import Base


class RequestStatus(str, enum.Enum):
    pending = "pending"
    approved = "approved"
    assigned = "assigned"
    completed = "completed"
    cancelled = "cancelled"


class JobStatus(str, enum.Enum):
    open = "open"
    in_progress = "in_progress"
    completed = "completed"
    on_hold = "on_hold"


class HomeownerRequest(Base):
    """A request submitted by a homeowner for satellite dish removal."""

    __tablename__ = "homeowner_requests"

    id = Column(Integer, primary_key=True, index=True)
    first_name = Column(String(100), nullable=False)
    last_name = Column(String(100), nullable=False)
    email = Column(String(255), nullable=False)
    phone = Column(String(30), nullable=False)
    address = Column(String(255), nullable=False)
    city = Column(String(100), nullable=False)
    state = Column(String(50), nullable=False)
    zip_code = Column(String(20), nullable=False)
    dish_count = Column(Integer, default=1, nullable=False)
    dish_location = Column(String(255))
    notes = Column(Text)
    status = Column(Enum(RequestStatus), default=RequestStatus.pending, nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

    job = relationship("Job", back_populates="request", uselist=False)


class Technician(Base):
    """A field technician employed by Green Resourcerers."""

    __tablename__ = "technicians"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(200), nullable=False)
    email = Column(String(255), unique=True, nullable=False)
    phone = Column(String(30))
    certification_number = Column(String(100))
    is_active = Column(Integer, default=1)  # SQLite-compatible boolean
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    jobs = relationship("Job", back_populates="technician")


class Job(Base):
    """A removal job created from an approved homeowner request."""

    __tablename__ = "jobs"

    id = Column(Integer, primary_key=True, index=True)
    request_id = Column(Integer, ForeignKey("homeowner_requests.id"), nullable=False)
    technician_id = Column(Integer, ForeignKey("technicians.id"), nullable=True)
    status = Column(Enum(JobStatus), default=JobStatus.open, nullable=False)
    scheduled_date = Column(DateTime(timezone=True), nullable=True)
    completed_at = Column(DateTime(timezone=True), nullable=True)
    dishes_removed = Column(Integer, default=0)
    materials_weight_lbs = Column(Float, default=0.0)
    technician_notes = Column(Text)
    admin_notes = Column(Text)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

    request = relationship("HomeownerRequest", back_populates="job")
    technician = relationship("Technician", back_populates="jobs")
