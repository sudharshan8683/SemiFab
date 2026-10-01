from fastapi import APIRouter
router = APIRouter(prefix="/alerts", tags=["alerts"])
@router.get("")
def list_alerts(): return {"items": [], "total": 0, "page": 1, "page_size": 100}
@router.patch("/{id}/acknowledge")
def ack(): return {}
