# services/gateway/app/api/v1/routes/backend.py

from fastapi import APIRouter, Request
import httpx

router = APIRouter()

@router.post("/echo")
async def proxy_to_backend(request: Request):
    async with httpx.AsyncClient() as client:
        response = await client.post("http://backend:8000/echo", json=await request.json())
        return response.json()
