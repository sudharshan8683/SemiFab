from fastapi import APIRouter
router = APIRouter(prefix="/simulation", tags=["simulation"])
@router.post("/start")
def start(): return {}
@router.post("/pause")
def pause(): return {}
@router.post("/reset")
def reset(): return {}
@router.put("/speed")
def speed(): return {}
@router.get("/status")
def status(): return {}
