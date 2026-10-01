from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.database import get_db
from app.models import Equipment
from app.schemas import EquipmentResponse, PaginatedResponse

router = APIRouter(prefix="/equipment", tags=["equipment"])

@router.get("", response_model=PaginatedResponse)
def list_equipment(db: Session = Depends(get_db)):
    equipments = db.query(Equipment).all()
    return {"items": equipments, "total": len(equipments), "page": 1, "page_size": 100}

@router.get("/summary")
def get_summary(db: Session = Depends(get_db)):
    total = db.query(Equipment).count()
    return {
        "total": total,
        "running": 0,
        "idle": total,
        "warning": 0,
        "critical": 0,
        "maintenance": 0,
        "offline": 0,
        "avg_utilization": 0.0,
        "avg_health_score": 100.0
    }

@router.get("/{machine_id}", response_model=EquipmentResponse)
def get_equipment(machine_id: str, db: Session = Depends(get_db)):
    return db.query(Equipment).filter(Equipment.machine_id == machine_id).first()
