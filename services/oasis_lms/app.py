from fastapi import FastAPI, Request, HTTPException
from fastapi.responses import PlainTextResponse
from twilio.twiml.messaging_response import MessagingResponse
from .agents import StudentSessionAgent
import os

app = FastAPI(title="Oasis LMS")

session_agent = StudentSessionAgent()

@app.post("/whatsapp")
async def whatsapp_webhook(request: Request):
    form = await request.form()
    incoming_msg = form.get("Body", "").strip()
    from_number = form.get("From", "")

    if not incoming_msg:
        raise HTTPException(status_code=400, detail="Missing message body")

    response_text = session_agent.handle_message(incoming_msg, from_number)
    resp = MessagingResponse()
    resp.message(response_text)
    return PlainTextResponse(str(resp))

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=int(os.getenv("PORT", 8000)))
