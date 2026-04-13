"""Homeowner request intake routes."""

from typing import List

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from database import get_db
from models import HomeownerRequest, RequestStatus
from schemas import HomeownerRequestCreate, HomeownerRequestOut, HomeownerRequestUpdate

router = APIRouter(prefix="/requests", tags=["requests"])


@router.post("/", response_model=HomeownerRequestOut, status_code=status.HTTP_201_CREATED)
def submit_request(payload: HomeownerRequestCreate, db: Session = Depends(get_db)):
    """Public endpoint — homeowner submits a removal request."""
    req = HomeownerRequest(**payload.model_dump())
    db.add(req)
    db.commit()
    db.refresh(req)
    return req


@router.get("/", response_model=List[HomeownerRequestOut])
def list_requests(
    skip: int = 0,
    limit: int = 50,
    status: RequestStatus | None = None,
    db: Session = Depends(get_db),
):
    """Admin — list all homeowner requests with optional status filter."""
    q = db.query(HomeownerRequest)
    if status:
        q = q.filter(HomeownerRequest.status == status)
    return q.order_by(HomeownerRequest.created_at.desc()).offset(skip).limit(limit).all()


@router.get("/{request_id}", response_model=HomeownerRequestOut)
def get_request(request_id: int, db: Session = Depends(get_db)):
    req = db.get(HomeownerRequest, request_id)
    if not req:
        raise HTTPException(status_code=404, detail="Request not found")
    return req


@router.patch("/{request_id}", response_model=HomeownerRequestOut)
def update_request(
    request_id: int,
    payload: HomeownerRequestUpdate,
    db: Session = Depends(get_db),
):
    """Admin — update status or details of a homeowner request."""
    req = db.get(HomeownerRequest, request_id)
    if not req:
        raise HTTPException(status_code=404, detail="Request not found")
    for field, value in payload.model_dump(exclude_none=True).items():
        setattr(req, field, value)
    db.commit()
    db.refresh(req)
    return req


@router.delete("/{request_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_request(request_id: int, db: Session = Depends(get_db)):
    req = db.get(HomeownerRequest, request_id)
    if not req:
        raise HTTPException(status_code=404, detail="Request not found")
    db.delete(req)
    db.commit()
