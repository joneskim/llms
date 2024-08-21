# services/gateway/app/api/v1/routes/data_analysis.py

from fastapi import APIRouter, Request
import httpx

router = APIRouter()

@router.post("/echo")
async def proxy_to_data_analysis(request: Request):
    async with httpx.AsyncClient() as client:
        response = await client.post("http://data_analysis:8500/echo", json=await request.json())
        return response.json()
