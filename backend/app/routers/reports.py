from fastapi import APIRouter
router = APIRouter(prefix="/reports", tags=["reports"])
@router.get("/model-performance")
def model_performance(): return {}
@router.get("/impact")
def impact(): return {}
@router.get("/export")
def export(): return {}
