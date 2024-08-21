# services/gateway/app/api/v1/routes/frontend.py

from fastapi import APIRouter, Request
import httpx
from app.core.config import settings

router = APIRouter()

@router.get("/{path:path}")
async def proxy_frontend(request: Request, path: str):
    async with httpx.AsyncClient() as client:
        response = await client.get(f"{settings.FRONTEND_SERVICE_URL}/{path}")
        return response.text
