from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from database import get_db
from models import ServiceRequest
from schemas import ServiceRequestCreate, ServiceRequestResponse, ServiceRequestUpdate

router = APIRouter(prefix="/requests", tags=["Service Requests"])


@router.post(
    "/", response_model=ServiceRequestResponse, status_code=status.HTTP_201_CREATED
)
def create_request(payload: ServiceRequestCreate, db: Session = Depends(get_db)):
    service_request = ServiceRequest(**payload.model_dump())
    db.add(service_request)
    db.commit()
    db.refresh(service_request)
    return service_request


@router.get("/", response_model=list[ServiceRequestResponse])
def list_requests(
    skip: int = 0, limit: int = 100, db: Session = Depends(get_db)
):
    return db.query(ServiceRequest).offset(skip).limit(limit).all()


@router.get("/{request_id}", response_model=ServiceRequestResponse)
def get_request(request_id: int, db: Session = Depends(get_db)):
    service_request = db.query(ServiceRequest).filter(ServiceRequest.id == request_id).first()
    if not service_request:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Service request {request_id} not found",
        )
    return service_request


@router.patch("/{request_id}", response_model=ServiceRequestResponse)
def update_request(
    request_id: int, payload: ServiceRequestUpdate, db: Session = Depends(get_db)
):
    service_request = db.query(ServiceRequest).filter(ServiceRequest.id == request_id).first()
    if not service_request:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Service request {request_id} not found",
        )
    for field, value in payload.model_dump(exclude_unset=True).items():
        setattr(service_request, field, value)
    db.commit()
    db.refresh(service_request)
    return service_request
