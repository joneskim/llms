from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

# Allow all origins within the local network
origins = [
    "http://localhost",
    "http://127.0.0.1",
    "http://192.168.*.*",  # This pattern allows all devices on your local network
    "http://10.*.*.*",     # If your network uses the 10.x.x.x range
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],  # Allows all HTTP methods (GET, POST, etc.)
    allow_headers=["*"],  # Allows all headers
)


@app.post("/echo")
async def echo_message(request: Request):
    data = await request.json()
    message = data.get("message", "No message received")
    return {"message": message}

@app.get("/echo")
async def echo_get():
    return {"message": "This is a GET request response"}
