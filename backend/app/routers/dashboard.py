from fastapi import APIRouter
router = APIRouter(prefix="/dashboard", tags=["dashboard"])
@router.get("/kpis")
def kpis(): return {}
@router.get("/events")
def events(): return []
