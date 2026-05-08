from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from database import get_db
from models import ServiceRequest
from schemas import ServiceRequestCreate, ServiceRequestResponse, ServiceRequestUpdate

router = APIRouter(prefix="/requests", tags=["Service Requests"])


@router.post(
    "/", response_model=ServiceRequestResponse, status_code=status.HTTP_201_CREATED
)
async def create_request(payload: ServiceRequestCreate, db: AsyncSession = Depends(get_db)):
    service_request = ServiceRequest(**payload.model_dump())
    db.add(service_request)
    await db.commit()
    await db.refresh(service_request)
    return service_request


@router.get("/", response_model=list[ServiceRequestResponse])
async def list_requests(
    skip: int = 0, limit: int = 100, db: AsyncSession = Depends(get_db)
):
    result = await db.execute(select(ServiceRequest).offset(skip).limit(limit))
    return result.scalars().all()


@router.get("/{request_id}", response_model=ServiceRequestResponse)
async def get_request(request_id: int, db: AsyncSession = Depends(get_db)):
    result = await db.execute(
        select(ServiceRequest).filter(ServiceRequest.id == request_id)
    )
    service_request = result.scalar_one_or_none()
    if not service_request:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Service request {request_id} not found",
        )
    return service_request


@router.patch("/{request_id}", response_model=ServiceRequestResponse)
async def update_request(
    request_id: int, payload: ServiceRequestUpdate, db: AsyncSession = Depends(get_db)
):
    result = await db.execute(
        select(ServiceRequest).filter(ServiceRequest.id == request_id)
    )
    service_request = result.scalar_one_or_none()
    if not service_request:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Service request {request_id} not found",
        )
    for field, value in payload.model_dump(exclude_unset=True).items():
        setattr(service_request, field, value)
    await db.commit()
    await db.refresh(service_request)
    return service_request
