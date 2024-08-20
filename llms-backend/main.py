from fastapi import FastAPI
from routers import analysis

app = FastAPI()

app.include_router(analysis.router)

@app.get("/")
def read_root():
    return {"message": "Welcome to the LLMS API"}
