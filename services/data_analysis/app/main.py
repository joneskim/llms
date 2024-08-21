# services/data_analysis/app/main.py

from fastapi import FastAPI, Request

app = FastAPI()

@app.post("/echo")
async def echo_message(request: Request):
    data = await request.json()
    message = data.get("message", "No message received")
    return {"message": message}
