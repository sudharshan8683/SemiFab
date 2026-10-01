from fastapi import APIRouter
router = APIRouter(prefix="/maintenance", tags=["maintenance"])
@router.get("/schedule")
def schedule(): return []
@router.get("/history")
def history(): return []
@router.post("/schedule")
def create_schedule(): return {}
