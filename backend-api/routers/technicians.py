from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from database import get_db
from models import Technician
from schemas import TechnicianCreate, TechnicianResponse, TechnicianUpdate

router = APIRouter(prefix="/technicians", tags=["Technicians"])


@router.post(
    "/", response_model=TechnicianResponse, status_code=status.HTTP_201_CREATED
)
def create_technician(payload: TechnicianCreate, db: Session = Depends(get_db)):
    existing = db.query(Technician).filter(Technician.email == payload.email).first()
    if existing:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail=f"Technician with email {payload.email} already exists",
        )
    technician = Technician(**payload.model_dump())
    db.add(technician)
    db.commit()
    db.refresh(technician)
    return technician


@router.get("/", response_model=list[TechnicianResponse])
def list_technicians(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    return db.query(Technician).offset(skip).limit(limit).all()


@router.get("/{technician_id}", response_model=TechnicianResponse)
def get_technician(technician_id: int, db: Session = Depends(get_db)):
    technician = db.query(Technician).filter(Technician.id == technician_id).first()
    if not technician:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Technician {technician_id} not found",
        )
    return technician


@router.patch("/{technician_id}", response_model=TechnicianResponse)
def update_technician(
    technician_id: int, payload: TechnicianUpdate, db: Session = Depends(get_db)
):
    technician = db.query(Technician).filter(Technician.id == technician_id).first()
    if not technician:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Technician {technician_id} not found",
        )
    for field, value in payload.model_dump(exclude_unset=True).items():
        setattr(technician, field, value)
    db.commit()
    db.refresh(technician)
    return technician
