from typing import Optional
from fastapi import APIRouter, HTTPException, Query, status

from app.schemas.core import DefectPredictionRequest, DefectPredictionResponse
from app.ml.secom_service import get_secom_pipeline, predict_secom_rows

router = APIRouter(prefix="/predictions", tags=["predictions"])

@router.get("/failure")
def failure():
    return []

@router.post("/defect", response_model=DefectPredictionResponse)
@router.post("/secom", response_model=DefectPredictionResponse)
def predict_defect(
    request: DefectPredictionRequest,
    threshold: Optional[float] = Query(
        None,
        ge=0.0,
        le=1.0,
        description="Optional probability cutoff for flagging defects. Defaults to 0.5."
    )
):
    """
    Predict defect risk for raw semiconductor sensor readings (SECOM format).
    Each row must contain exactly 590 raw feature columns matching the original
    secom.data layout.
    
    Threshold behavior:
    - Default cutoff: 0.5
    - NOTE: Lower thresholds (e.g. 0.2 - 0.3) catch significantly more real defects/failures
      at the cost of more false alarms, per the offline model evaluation in Step 11.
    """
    if not request.rows:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Expected at least one row of sensor readings."
        )

    # Validate row lengths before processing
    for idx, row in enumerate(request.rows):
        if len(row) != 590:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=(
                    f"Row {idx}: Expected 590 raw feature columns, got {len(row)}. "
                    f"Each row must have the same number and order of sensor readings "
                    f"as the original secom.data file."
                )
            )

    # Determine threshold (request body takes precedence over query param)
    active_threshold = 0.5
    if request.threshold is not None:
        active_threshold = request.threshold
    elif threshold is not None:
        active_threshold = threshold

    # Retrieve pre-loaded pipeline singleton
    try:
        pipeline = get_secom_pipeline()
    except (FileNotFoundError, RuntimeError) as e:
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail=f"Defect prediction model is not available: {str(e)}"
        )

    # Execute inference
    try:
        predictions = predict_secom_rows(pipeline, request.rows, threshold=active_threshold)
    except ValueError as ve:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(ve)
        )
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Inference error: {str(e)}"
        )

    flagged_count = sum(1 for p in predictions if p["flagged"])

    return DefectPredictionResponse(
        threshold=active_threshold,
        flagged_count=flagged_count,
        total_rows=len(predictions),
        predictions=predictions
    )

@router.get("/yield-forecast")
def yield_forecast():
    return {}

@router.get("/sample-rows")
def get_sample_rows():
    """
    Returns sample raw sensor reading rows from ml/sample_rows.data
    for testing defect prediction in the UI.
    """
    from app.ml.secom_service import PROJECT_ROOT
    sample_file = PROJECT_ROOT / "ml" / "sample_rows.data"
    if not sample_file.exists():
        raise HTTPException(status_code=404, detail="sample_rows.data file not found.")

    samples = []
    with open(sample_file, "r") as f:
        for idx, line in enumerate(f):
            parts = line.strip().split()
            if not parts:
                continue
            values = [None if p in ("NaN", "nan", "NAN") else float(p) for p in parts]
            if len(values) == 590:
                is_risky = (idx == 2)
                samples.append({
                    "row_index": idx,
                    "label": f"Wafer #{idx + 1}" + (" (High Risk Sample)" if is_risky else " (Nominal Sample)"),
                    "description": "Historical failure profile" if is_risky else "Nominal run sensor readings",
                    "row": values
                })
    return {"samples": samples}

