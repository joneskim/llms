# services/gateway/app/main.py

from fastapi import FastAPI, Request
from app.api.v1.routes import backend, frontend, data_analysis

app = FastAPI()

app.include_router(frontend.router, prefix="/frontend", tags=["frontend"])
app.include_router(backend.router, prefix="/backend", tags=["backend"])
app.include_router(data_analysis.router, prefix="/data_analysis", tags=["data_analysis"])

@app.post("/echo")
async def echo_message(request: Request):
    data = await request.json()
    message = data.get("message", "No message received")
    return {"message": message}
