from fastapi import FastAPI, Request, HTTPException
from fastapi.responses import PlainTextResponse
from twilio.twiml.messaging_response import MessagingResponse
from .agents import StudentSessionAgent, TeacherSessionAgent
import os

app = FastAPI(title="Oasis LMS")

student_agent = StudentSessionAgent()
teacher_agent = TeacherSessionAgent(student_agent)
teacher_numbers = {
    num.strip() for num in os.getenv("TEACHER_NUMBERS", "").split(",") if num.strip()
}

@app.post("/whatsapp")
async def whatsapp_webhook(request: Request):
    form = await request.form()
    incoming_msg = form.get("Body", "").strip()
    from_number = form.get("From", "")

    if not incoming_msg:
        raise HTTPException(status_code=400, detail="Missing message body")

    if from_number in teacher_numbers:
        response_text = teacher_agent.handle_message(incoming_msg, from_number)
    else:
        response_text = student_agent.handle_message(incoming_msg, from_number)
    resp = MessagingResponse()
    resp.message(response_text)
    return PlainTextResponse(str(resp))

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=int(os.getenv("PORT", 8000)))
