from fastapi import APIRouter, HTTPException
from services.analysis import analyze_student_performance

router = APIRouter()

@router.post("/analyze/")
def analyze_data(data: list):
    try:
        analysis_result = analyze_student_performance(data)
        return analysis_result
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))
