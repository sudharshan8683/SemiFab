from fastapi import APIRouter
router = APIRouter(prefix="/yield", tags=["yield"])
@router.get("/summary")
def summary(): return {}
@router.get("/by-machine")
def by_machine(): return []
@router.get("/loss-pareto")
def loss_pareto(): return []
